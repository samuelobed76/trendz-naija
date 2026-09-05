import { createServerFn } from "@tanstack/react-start";

type InitInput = {
  email: string;
  amount: number; // naira
  jobId: string;
  jobTitle: string;
  clientName: string;
  callbackUrl: string;
};

export const initPaystackPayment = createServerFn({ method: "POST" })
  .inputValidator((input: InitInput) => {
    if (!input || typeof input.email !== "string" || !input.email.includes("@")) {
      throw new Error("A valid client email is required");
    }
    const amount = Number(input.amount);
    if (!Number.isFinite(amount) || amount < 100) {
      throw new Error("Amount must be at least ₦100");
    }
    return { ...input, amount: Math.round(amount) };
  })
  .handler(async ({ data }) => {
    const key = process.env["PAYSTACK_SECRET_KEY"];
    if (!key) return { ok: false as const, error: "Paystack key is not configured" };

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        amount: data.amount * 100,
        currency: "NGN",
        callback_url: data.callbackUrl,
        metadata: {
          job_id: data.jobId,
          job_title: data.jobTitle,
          client_name: data.clientName,
        },
      }),
    });

    const json = (await res.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; reference?: string };
    };

    if (!res.ok || !json.status || !json.data?.authorization_url) {
      console.error("paystack init failed", res.status, json.message);
      return { ok: false as const, error: json.message ?? "Could not start the payment" };
    }

    return {
      ok: true as const,
      authorizationUrl: json.data.authorization_url,
      reference: json.data.reference ?? "",
    };
  });

export const verifyPaystackPayment = createServerFn({ method: "POST" })
  .inputValidator((input: { reference: string }) => {
    if (!input?.reference) throw new Error("Reference is required");
    return { reference: String(input.reference) };
  })
  .handler(async ({ data }) => {
    const key = process.env["PAYSTACK_SECRET_KEY"];
    if (!key) return { status: "error" as const, error: "Paystack key is not configured" };

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${key}` } },
    );
    const json = (await res.json()) as {
      status?: boolean;
      message?: string;
      data?: {
        status?: string;
        amount?: number;
        channel?: string;
        paid_at?: string;
        reference?: string;
        metadata?: { job_id?: string };
      };
    };

    if (!res.ok || !json.status || !json.data) {
      return { status: "error" as const, error: json.message ?? "Could not verify payment" };
    }

    if (json.data.status !== "success") {
      return { status: (json.data.status ?? "pending") as "pending" | "failed" };
    }

    return {
      status: "success" as const,
      amount: Math.round((json.data.amount ?? 0) / 100), // naira
      channel: json.data.channel ?? "paystack",
      paidAt: json.data.paid_at ?? new Date().toISOString(),
      reference: json.data.reference ?? data.reference,
      jobId: json.data.metadata?.job_id ?? "",
    };
  });
