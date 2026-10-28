import "server-only";
import snapshot from "@/data/snapshot.json";
import type { Category, Product } from "./types";

/**
 * Data source: the BazarDor API. The main URL is tried first, then the two
 * mirrors. If every source is unreachable the bundled snapshot is used so the
 * site never breaks during a demo or review.
 */
const API_BASES = [
  process.env.NEXT_PUBLIC_API_URL,
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
].filter(Boolean) as string[];

const FALLBACK = snapshot as { categories: Category[]; products: Product[] };

/** Accepts a bare array or common wrappers like { data: [...] }. */
function unwrap<T>(json: unknown): T | null {
  if (json == null) return null;
  if (Array.isArray(json)) return json as T;
  if (typeof json === "object") {
    const obj = json as Record<string, unknown>;
    for (const key of ["data", "products", "categories", "product", "category", "result"]) {
      if (obj[key] != null) return obj[key] as T;
    }
    return json as T;
  }
  return null;
}

async function request<T>(path: string): Promise<T | null> {
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) continue;
      const data = unwrap<T>(await res.json());
      if (data != null) return data;
    } catch {
      // try the next mirror
    }
  }
  return null;
}

export async function getProducts(): Promise<Product[]> {
  const data = await request<Product[]>("/products");
  return Array.isArray(data) && data.length ? data : FALLBACK.products;
}

export async function getCategories(): Promise<Category[]> {
  const data = await request<Category[]>("/categories");
  return Array.isArray(data) && data.length ? data : FALLBACK.categories;
}

export async function getCategory(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const data = await request<Product[]>(`/products?category=${encodeURIComponent(slug)}`);
  if (Array.isArray(data) && data.every((p) => p.category === slug)) return data;
  const all = await getProducts();
  return all.filter((p) => p.category === slug);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug || String(p.id) === slug) ?? null;
}

export function topMovers(products: Product[], dir: "up" | "down", count = 6): Product[] {
  return products
    .filter((p) => p.change?.dir === dir)
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, count);
}
