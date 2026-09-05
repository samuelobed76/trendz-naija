import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { Field, inputCls } from "@/components/studio/Bits";
import { initPaystackPayment, verifyPaystackPayment } from "@/lib/paystack.functions";
import { addPayment, balanceOf, formatNaira, type Job } from "@/lib/studio";

const PENDING_KEY = "stitchnaija.paystack.pending";

type Pending = { reference: string; jobId: string };

function readPending(): Pending[] {
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as Pending[]) : [];
  } catch {
    return [];
  }
}
function writePending(list: Pending[]) {
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(list));
}

export function PaystackPay({ job, clientName }: { job: Job; clientName: string }) {
  const init = useServerFn(initPaystackPayment);
  const verify = useServerFn(verifyPaystackPayment);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(() => String(balanceOf(job) || job.price));
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const settle = useCallback(
    async (reference: string, jobId: string) => {
      const res = await verify({ data: { reference } });
      if (res.status === "success") {
        addPayment(jobId, res.amount, `Paystack · ${res.channel}`, {
          reference: res.reference,
          at: res.paidAt,
        });
        writePending(readPending().filter((p) => p.reference !== reference));
        setStatus(`Payment of ${formatNaira(res.amount)} confirmed and added to this job.`);
        return true;
      }
      if (res.status === "failed" || res.status === "error") {
        writePending(readPending().filter((p) => p.reference !== reference));
        setStatus("That payment did not go through. Nothing was recorded.");
        return true;
      }
      return false;
    },
    [verify],
  );

  // Settle anything left over: a return from Paystack, or a window closed mid-flow.
  useEffect(() => {
    const url = new URL(window.location.href);
    const returned = url.searchParams.get("reference") ?? url.searchParams.get("trxref");
    const refs = new Set(readPending().filter((p) => p.jobId === job.id).map((p) => p.reference));
    if (returned) refs.add(returned);
    if (refs.size === 0) return;
    setStatus("Confirming payment with Paystack…");
    void (async () => {
      for (const ref of refs) await settle(ref, job.id);
      if (returned) {
        url.searchParams.delete("reference");
        url.searchParams.delete("trxref");
        window.history.replaceState({}, "", url.pathname + (url.search || "") + url.hash);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.id]);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await init({
        data: {
          email: email.trim(),
          amount: Number(amount),
          jobId: job.id,
          jobTitle: job.title,
          clientName,
          callbackUrl: `${window.location.origin}/jobs/${job.id}`,
        },
      });
      if (!res.ok) {
        setStatus(res.error);
        return;
      }
      writePending([...readPending(), { reference: res.reference, jobId: job.id }]);
      window.open(res.authorizationUrl, "_blank", "noopener,noreferrer");
      setStatus("Checkout opened. This job updates the moment the payment clears.");

      let ticks = 0;
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        ticks += 1;
        const done = await settle(res.reference, job.id);
        if (done || ticks > 60) {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }, 5000);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong starting the payment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <CreditCard className="size-4 text-emerald" />
        <h3 className="font-display text-lg font-black">Collect with Paystack</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Send a secure card, transfer or USSD checkout. Confirmed money is recorded against this job
        automatically, so the balance, revenue and charts stay accurate.
      </p>
      <form onSubmit={start} className="mt-4 grid gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
        <Field label="Client email (receipt)">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@email.com"
            className={inputCls}
          />
        </Field>
        <Field label="Amount (₦)">
          <input
            required
            type="number"
            min={100}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputCls}
          />
        </Field>
        <button
          disabled={busy}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
          Request payment
        </button>
      </form>
      {status ? <p className="mt-3 text-sm font-medium text-emerald">{status}</p> : null}
    </section>
  );
}
