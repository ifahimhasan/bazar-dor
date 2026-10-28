import { formatPct } from "@/lib/bn";
import type { ChangeDir } from "@/lib/types";

const STYLE: Record<ChangeDir, { sign: string; color: string; label: string }> = {
  up: { sign: "▲", color: "text-rise", label: "দাম বেড়েছে" },
  down: { sign: "▼", color: "text-fall", label: "দাম কমেছে" },
  flat: { sign: "—", color: "text-ink/50", label: "দাম অপরিবর্তিত" },
};

export default function PriceBadge({
  dir,
  pct,
  size = "sm",
  plain = false,
}: {
  dir: ChangeDir;
  pct: number;
  size?: "sm" | "md";
  plain?: boolean;
}) {
  const s = STYLE[dir] ?? STYLE.flat;
  return (
    <span
      title={s.label}
      className={`inline-flex shrink-0 items-center gap-1 font-semibold leading-none whitespace-nowrap ${s.color} ${
        size === "md" ? "text-sm" : "text-xs"
      } ${plain ? "" : "rounded-full bg-page px-2 py-1"}`}
    >
      <span aria-hidden>{s.sign}</span>
      <span>{formatPct(dir === "flat" ? 0 : pct)}</span>
    </span>
  );
}
