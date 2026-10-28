"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-3xl border border-line bg-surface px-6 py-12 text-center">
      <span className="text-5xl" aria-hidden>
        ⚠️
      </span>
      <h1 className="text-2xl font-bold">কিছু একটা সমস্যা হয়েছে</h1>
      <p className="text-sm text-ink/70">দামের তথ্য লোড করা যায়নি। একটু পরে আবার চেষ্টা করুন।</p>
      <div className="flex gap-2">
        <button type="button" onClick={reset} className="btn btn-primary btn-sm sm:btn-md">
          আবার চেষ্টা করুন
        </button>
        <Link href="/" className="btn btn-ghost btn-sm sm:btn-md">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}
