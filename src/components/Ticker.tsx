import Link from "next/link";
import { formatPct, toBnNumber, unitShort } from "@/lib/bn";
import type { Product } from "@/lib/types";

function TickerItem({ p }: { p: Product }) {
  const dir = p.change.dir;
  const color = dir === "up" ? "text-rise" : dir === "down" ? "text-fall" : "text-ink/50";
  const sign = dir === "up" ? "▲" : dir === "down" ? "▼" : "—";
  return (
    <Link
      href={`/product/${p.slug}`}
      className="flex shrink-0 items-center gap-1.5 px-4 py-2 text-sm whitespace-nowrap hover:bg-page"
    >
      <span aria-hidden>{p.image}</span>
      <span className="font-medium">{p.nameBn}</span>
      <span className="text-ink/70">
        {toBnNumber(p.today)} টাকা/{unitShort(p.unit)}
      </span>
      <span className={`font-semibold ${color}`}>
        {sign} {formatPct(dir === "flat" ? 0 : p.change.pct)}
      </span>
    </Link>
  );
}

export default function Ticker({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <div className="overflow-hidden border-b border-line bg-surface" aria-label="আজকের দামের টিকার">
      <div className="ticker-track flex w-max animate-ticker">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1}>
            {products.map((p) => (
              <TickerItem key={`${copy}-${p.id}`} p={p} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
