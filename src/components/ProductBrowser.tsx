"use client";

import { useMemo, useState } from "react";
import { sortProducts, toBnNumber } from "@/lib/bn";
import type { Category, Product, SortKey } from "@/lib/types";
import ProductGrid from "./ProductGrid";
import SortSelect from "./SortSelect";

/** "সব পণ্য" section: search, category filter chips and price sort, all client-side */
export default function ProductBrowser({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("default");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        (!q || p.nameBn.toLowerCase().includes(q) || p.slug.includes(q) || p.categoryNameBn.includes(q)),
    );
    return sortProducts(filtered, sort);
  }, [products, query, cat, sort]);

  const chip = (active: boolean) =>
    `inline-flex h-7 shrink-0 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold transition ${
      active
        ? "border-brand-dark bg-brand text-primary-content"
        : "border-transparent hover:border-[#ccd0cc] hover:bg-[#dadeda]"
    }`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 lg:flex-row lg:items-center">
        <label className="flex h-10 items-center gap-2 rounded-lg border border-ink/20 bg-surface px-3 focus-within:border-brand lg:w-56">
          <span aria-hidden>🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="পণ্যের নাম লিখুন…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/50"
            aria-label="পণ্য খুঁজুন"
          />
        </label>
        <div className="-mx-1 flex flex-1 gap-1 overflow-x-auto px-1 [scrollbar-width:none]">
          <button type="button" className={chip(cat === "all")} onClick={() => setCat("all")}>
            সব
          </button>
          {categories.map((c) => (
            <button key={c.slug} type="button" className={chip(cat === c.slug)} onClick={() => setCat(c.slug)}>
              <span aria-hidden>{c.icon}</span>
              {c.nameBn}
            </button>
          ))}
        </div>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      <p className="text-sm text-ink/70">মোট {toBnNumber(visible.length)}টি পণ্য দেখানো হচ্ছে</p>

      {visible.length ? (
        <ProductGrid products={visible} />
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-sm text-ink/70">
          “{query}” নামে কোনো পণ্য পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
}
