import Link from "next/link";

export default function ExpiredPage() {
  return (
    <main className="w-full max-w-sm px-4 py-16 text-center">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-12 flex flex-col items-center gap-4">
        <div className="text-6xl">⏰</div>
        <h1 className="text-2xl font-bold text-red-400">Payment Expired</h1>
        <p className="text-sm text-white/60">
          The payment window has closed. No funds were captured. You can safely
          start a new order.
        </p>
        <div className="mt-4 w-full rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-xs text-red-400/80 font-mono">Status: EXPIRED</p>
        </div>
        <Link
          href="/"
          className="mt-4 w-full rounded-xl bg-violet-600 hover:bg-violet-500 transition-colors px-6 py-3 text-sm font-semibold text-center block"
        >
          Try again
        </Link>
      </div>
    </main>
  );
}
