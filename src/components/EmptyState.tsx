import Link from "next/link";

export default function EmptyState({
  icon = "🧺",
  code,
  title,
  message,
}: {
  icon?: string;
  code?: string;
  title: string;
  message: string;
}) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-3xl border border-line bg-surface px-6 py-12 text-center">
      <span className="text-5xl" aria-hidden>
        {icon}
      </span>
      {code && <p className="text-5xl font-bold text-brand">{code}</p>}
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-ink/70">{message}</p>
      <Link href="/" className="btn btn-primary btn-sm mt-2 sm:btn-md">
        হোম পেজে ফিরে যান
      </Link>
    </section>
  );
}
