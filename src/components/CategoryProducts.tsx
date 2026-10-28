"use client";

import { useState } from "react";
import { sortProducts, toBnNumber } from "@/lib/bn";
import type { Product, SortKey } from "@/lib/types";
import ProductGrid from "./ProductGrid";
import SortSelect from "./SortSelect";

export default function CategoryProducts({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("default");
  const sorted = sortProducts(products, sort);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end rounded-2xl border border-line bg-surface p-4">
        <SortSelect value={sort} onChange={setSort} />
      </div>
      <p className="text-sm text-ink/70">মোট {toBnNumber(sorted.length)}টি পণ্য দেখানো হচ্ছে</p>
      <ProductGrid products={sorted} />
    </div>
  );
}
