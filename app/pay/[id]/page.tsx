"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Suspense } from "react";

type PaymentStatus = "PENDING" | "PROCESSING" | "CONFIRMED" | "EXPIRED" | "FAILED";

function PaymentScreen({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const address = searchParams.get("address") ?? "";
  const amount = searchParams.get("amount") ?? "";
  const currency = searchParams.get("currency") ?? "ETH";
  const expiresAt = searchParams.get("expiresAt") ?? "";

  const [status, setStatus] = useState<PaymentStatus>("PENDING");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
      setSecondsLeft(Math.max(0, diff));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  // Poll status every 5s
  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/${id}/status`
      );
      if (!res.ok) return;
      const json = await res.json();
      const newStatus: PaymentStatus = json.data?.status ?? json.status;
      setStatus(newStatus);
      if (newStatus === "CONFIRMED") router.replace(`/pay/${id}/success`);
      if (newStatus === "EXPIRED" || newStatus === "FAILED") router.replace(`/pay/${id}/expired`);
    } catch {
      // ignore transient errors
    }
  }, [id, router]);

  useEffect(() => {
    if (status !== "PENDING" && status !== "PROCESSING") return;
    const t = setInterval(pollStatus, 5000);
    return () => clearInterval(t);
  }, [status, pollStatus]);

  // Timer expiry
  useEffect(() => {
    if (secondsLeft === 0) router.replace(`/pay/${id}/expired`);
  }, [secondsLeft, id, router]);

  // Missing query params — shouldn't normally happen
  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-red-400 text-sm">Payment data missing. Please start over.</p>
        <button onClick={() => router.push("/")} className="text-sm text-white/50 underline">
          Go back
        </button>
      </div>
    );
  }

  const mins = secondsLeft !== null ? Math.floor(secondsLeft / 60) : "--";
  const secs = secondsLeft !== null ? String(secondsLeft % 60).padStart(2, "0") : "--";
  const urgent = typeof secondsLeft === "number" && secondsLeft < 120;

  async function copyAddress() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="w-full max-w-md px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-white/10">
          <p className="text-sm text-white/40 uppercase tracking-widest mb-1">
            Awaiting payment
          </p>
          <p className="text-3xl font-bold">
            {amount} {currency}
          </p>
          <p className="text-sm text-white/40 mt-1">Pro Course — lifetime access</p>
        </div>

        {/* QR */}
        <div className="flex justify-center py-8 border-b border-white/10">
          <div className="p-3 bg-white rounded-xl">
            <QRCodeSVG
              value={address}
              size={180}
              bgColor="#ffffff"
              fgColor="#0f0f0f"
            />
          </div>
        </div>

        {/* Address */}
        <div className="px-8 py-6 border-b border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">
            ETH Deposit Address
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono bg-white/5 rounded-lg px-3 py-2 truncate">
              {address}
            </code>
            <button
              onClick={copyAddress}
              className="shrink-0 rounded-lg bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 text-xs"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Timer */}
        <div className="px-8 py-5 flex items-center justify-between border-b border-white/10">
          <span className="text-sm text-white/40">Expires in</span>
          <span
            className={`font-mono text-lg font-semibold tabular-nums ${
              urgent ? "text-red-400 animate-pulse" : "text-white"
            }`}
          >
            {mins}:{secs}
          </span>
        </div>

        <div className="px-8 py-6">
          <p className="text-center text-xs text-white/30">
            Send exactly {amount} {currency} to confirm your order. This page polls automatically every 5 s.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <svg className="animate-spin h-8 w-8 text-violet-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      }
    >
      <PaymentScreen id={id} />
    </Suspense>
  );
}
