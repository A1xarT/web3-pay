import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="w-full max-w-sm px-4 py-16 text-center">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-8 py-12 flex flex-col items-center gap-4">
        <div className="text-6xl">🎉</div>
        <h1 className="text-2xl font-bold text-emerald-400">Payment Confirmed</h1>
        <p className="text-sm text-white/60">
          Your transaction has been confirmed on-chain. Check your email for
          course access details.
        </p>
        <div className="mt-4 w-full rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
          <p className="text-xs text-emerald-400/80 font-mono">Status: CONFIRMED</p>
        </div>
        <Link
          href="/"
          className="mt-2 text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
        >
          Back to store
        </Link>
      </div>
    </main>
  );
}
