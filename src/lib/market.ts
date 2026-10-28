import type { MarketPrice, Product } from "./types";

export interface MarketRow extends MarketPrice {
  avg: number;
}

export function marketRows(product: Product): MarketRow[] {
  return (product.markets ?? [])
    .map((m) => ({ ...m, avg: (m.min + m.max) / 2 }))
    .sort((a, b) => a.avg - b.avg);
}

export function priceSummary(product: Product) {
  const rows = marketRows(product);
  if (!rows.length) {
    return { min: product.today, max: product.today, avg: product.today, minMarket: null, maxMarket: null };
  }
  const minRow = rows.reduce((a, b) => (b.min < a.min ? b : a));
  const maxRow = rows.reduce((a, b) => (b.max > a.max ? b : a));
  const avg = Math.round(rows.reduce((s, r) => s + r.avg, 0) / rows.length);
  return { min: minRow.min, max: maxRow.max, avg, minMarket: minRow, maxMarket: maxRow };
}

/** % change from an older price to today's price */
export function pctFrom(old: number, today: number) {
  if (!old) return 0;
  return Math.round(((today - old) / old) * 1000) / 10;
}
