import Link from "next/link";
import { formatTaka, unitLabel } from "@/lib/bn";
import type { Product } from "@/lib/types";
import PriceBadge from "./PriceBadge";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_6px_20px_-12px_rgba(5,137,62,0.45)] focus-visible:outline-2 focus-visible:outline-brand"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-page text-2xl" aria-hidden>
          {product.image || product.categoryIcon}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold leading-6 group-hover:text-brand">{product.nameBn}</h3>
          <p className="text-xs leading-4 text-ink/60">{unitLabel(product.unit)}</p>
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs leading-4 text-ink/70">আজকের দাম</p>
          <p className="text-xl font-bold leading-7">{formatTaka(product.today)}</p>
        </div>
        <PriceBadge dir={product.change.dir} pct={product.change.pct} />
      </div>
    </Link>
  );
}
