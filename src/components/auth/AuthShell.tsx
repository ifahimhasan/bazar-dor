import Link from "next/link";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-4 sm:py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-ink/70">{subtitle}</p>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">{children}</div>
      <Link href="/" className="text-sm text-ink/60 hover:text-brand">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-4 text-xs">
      <span className="h-0.5 flex-1 bg-ink/10" />
      অথবা
      <span className="h-0.5 flex-1 bg-ink/10" />
    </div>
  );
}
