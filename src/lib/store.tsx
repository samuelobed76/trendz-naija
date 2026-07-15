import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  size: string;
  qty: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (productId: string, size: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWished: (productId: string) => boolean;
  cartCount: number;
}

const StoreCtx = createContext<StoreState | null>(null);

const CART_KEY = "stylenaija.cart.v1";
const WISH_KEY = "stylenaija.wish.v1";

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(readLS<CartItem[]>(CART_KEY, []));
    setWishlist(readLS<string[]>(WISH_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback((productId: string, size: string, qty = 1) => {
    setCart((c) => {
      const idx = c.findIndex((i) => i.productId === productId && i.size === size);
      if (idx >= 0) {
        const next = [...c];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...c, { productId, size, qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart((c) => c.filter((i) => !(i.productId === productId && i.size === size)));
  }, []);

  const updateQty = useCallback((productId: string, size: string, qty: number) => {
    setCart((c) =>
      c
        .map((i) => (i.productId === productId && i.size === size ? { ...i, qty } : i))
        .filter((i) => i.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((w) => (w.includes(productId) ? w.filter((x) => x !== productId) : [...w, productId]));
  }, []);

  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);

  const value: StoreState = {
    cart,
    wishlist,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    toggleWishlist,
    isWished,
    cartCount,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}