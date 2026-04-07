"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRODUCT = {
  name: "Pro Course",
  description: "Lifetime access to the full Web3 development course",
  price: 49.99,
  currency: "USD",
  image: "🎓",
  features: [
    "50+ video lessons",
    "Solidity & smart contracts",
    "DeFi & NFT projects",
    "Certificate of completion",
  ],
};

export default function ProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-payment", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const qs = new URLSearchParams({
        address: data.address,
        amount: data.amount,
        currency: data.currency,
        expiresAt: data.expiresAt,
      });
      router.push(`/pay/${data.id}?${qs}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="w-full max-w-md px-4 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {/* Hero */}
        <div className="bg-gradient-to-br from-violet-600/30 to-indigo-600/20 px-8 py-10 text-center">
          <div className="text-7xl mb-4">{PRODUCT.image}</div>
          <h1 className="text-2xl font-bold tracking-tight">{PRODUCT.name}</h1>
          <p className="mt-1 text-sm text-white/60">{PRODUCT.description}</p>
        </div>

        {/* Features */}
        <div className="px-8 py-6 border-t border-white/10">
          <ul className="space-y-2">
            {PRODUCT.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-emerald-400">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Price + CTA */}
        <div className="px-8 pb-8 pt-2 border-t border-white/10">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-3xl font-bold">
              ${PRODUCT.price.toFixed(2)}
            </span>
            <span className="text-sm text-white/40">{PRODUCT.currency} · one-time</span>
          </div>

          {error && (
            <p className="mb-3 rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-6 py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner />
                Creating payment…
              </>
            ) : (
              <>
                <EthIcon />
                Pay with ETH
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-white/30">
            Powered by Web3Pay · Non-custodial
          </p>
        </div>
      </div>
    </main>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function EthIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 417" fill="currentColor" aria-hidden="true">
      <path opacity=".6" d="M127.9 0L125 9.5v275.7l2.9 2.9 127.9-75.6z" />
      <path d="M127.9 0L0 212.5l127.9 75.6V0z" />
      <path opacity=".6" d="M127.9 312.2l-1.6 1.9v99.4l1.6 4.6 128-180.3z" />
      <path d="M127.9 418.1v-106L0 237.8z" />
      <path opacity=".2" d="M127.9 288.1l127.9-75.6-127.9-58.2z" />
      <path opacity=".6" d="M0 212.5l127.9 75.6V154.3z" />
    </svg>
  );
}
