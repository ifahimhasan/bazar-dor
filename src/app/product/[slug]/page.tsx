import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PriceBadge from "@/components/PriceBadge";
import { getProduct } from "@/lib/api";
import { formatTaka, toBnNumber, unitLabel, unitShort } from "@/lib/bn";
import { marketRows, pctFrom, priceSummary } from "@/lib/market";
import { requireSession } from "@/lib/session";
import type { ChangeDir } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product ? `${product.nameBn}-এর আজকের দাম` : "পণ্য পাওয়া যায়নি" };
}

const dirOf = (diff: number): ChangeDir => (diff > 0 ? "up" : diff < 0 ? "down" : "flat");

function Stat({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-6 py-4">
      <p className="text-xs text-ink/60">{label}</p>
      <p className={`text-2xl font-bold leading-8 ${tone}`}>{value}</p>
      <p className="truncate text-xs text-ink/60">{note}</p>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  await requireSession(`/product/${slug}`);

  const product = await getProduct(slug);
  if (!product) notFound();

  const rows = marketRows(product);
  const summary = priceSummary(product);
  const unit = unitShort(product.unit);
  const diff = product.today - product.yesterday;
  const trendText =
    diff > 0
      ? `গতকালের তুলনায় আজ দাম বেড়েছে · ${toBnNumber(diff)} টাকা`
      : diff < 0
        ? `গতকালের তুলনায় আজ দাম কমেছে · ${toBnNumber(Math.abs(diff))} টাকা`
        : "গতকালের তুলনায় আজ দাম অপরিবর্তিত";

  const history = [
    { label: "গতকাল", price: product.yesterday },
    { label: "গত সপ্তাহ", price: product.lastWeek },
    { label: "গত মাস", price: product.lastMonth },
  ];

  return (
    <div className="flex flex-col gap-6">
      <nav className="breadcrumbs py-2 text-sm" aria-label="ব্রেডক্রাম্ব">
        <ul>
          <li>
            <Link href="/">হোম</Link>
          </li>
          <li>
            <Link href={`/category/${product.category}`}>{product.categoryNameBn}</Link>
          </li>
          <li aria-current="page">{product.nameBn}</li>
        </ul>
      </nav>

      {/* Summary header */}
      <header className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-start gap-4 sm:items-center">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-page text-4xl sm:size-20" aria-hidden>
            {product.image}
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-9 sm:text-3xl">{product.nameBn}</h1>
            <p className="text-sm text-ink/70">
              {unitLabel(product.unit)} · {product.categoryNameBn}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Link
                href={`/category/${product.category}`}
                className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand hover:bg-brand/20"
              >
                <span aria-hidden>{product.categoryIcon}</span>
                {product.categoryNameBn}
              </Link>
              <span className="inline-flex items-center rounded-full bg-page px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                {unitLabel(product.unit)}
              </span>
            </div>
            <p className="mt-2 text-sm">{trendText}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-4 rounded-2xl bg-page px-5 py-4 sm:flex-col sm:items-start sm:gap-0">
          <div>
            <p className="text-sm text-ink/70">আজকের দাম</p>
            <p className="text-3xl font-bold leading-9">{toBnNumber(product.today)}</p>
            <p className="text-sm text-ink/70">টাকা / {unit}</p>
          </div>
          <PriceBadge dir={product.change.dir} pct={product.change.pct} size="md" plain />
        </div>
      </header>

      <div className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        {/* Price summary */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Stat
              label="সর্বনিম্ন দাম"
              value={formatTaka(summary.min)}
              note={summary.minMarket ? `সবচেয়ে কম: ${summary.minMarket.market}` : "সবচেয়ে কম দামের বাজার"}
              tone="text-fall"
            />
            <Stat
              label="সর্বাধিক দাম"
              value={formatTaka(summary.max)}
              note={summary.maxMarket ? `সবচেয়ে বেশি: ${summary.maxMarket.market}` : "সবচেয়ে বেশি দামের বাজার"}
              tone="text-rise"
            />
            <Stat
              label="গড় দাম"
              value={formatTaka(summary.avg)}
              note={`${unitLabel(product.unit)}-এর হিসাবে`}
              tone="text-brand"
            />
          </div>
        </section>

        {/* Time comparison */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">সময়ের সাথে দামের তুলনা</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {history.map((h) => {
              const pct = pctFrom(h.price, product.today);
              return (
                <div key={h.label} className="rounded-2xl border border-line bg-surface p-4">
                  <p className="text-sm text-ink/70">{h.label}</p>
                  <p className="text-xl font-bold leading-7">{formatTaka(h.price)}</p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/60">
                    <PriceBadge dir={dirOf(product.today - h.price)} pct={pct} plain />
                    <span>আজকের দামের তুলনায়</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Market table */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">বাজারভিত্তিক আজকের দাম</h2>
          {rows.length ? (
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="text-ink/60">
                    <th className="px-4 py-3 text-left font-bold">বাজার</th>
                    <th className="px-4 py-3 text-left font-bold">বিভাগ</th>
                    <th className="px-4 py-3 text-right font-bold">সর্বনিম্ন</th>
                    <th className="px-4 py-3 text-right font-bold">সর্বাধিক</th>
                    <th className="px-4 py-3 text-right font-bold">গড়</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={`${r.market}-${i}`} className={i % 2 ? "bg-page" : ""}>
                      <td className="px-4 py-3 font-medium">
                        {r.market}
                        {i === 0 && (
                          <span className="ml-2 rounded-full bg-fall/10 px-2 py-0.5 text-[11px] font-semibold text-fall">
                            সবচেয়ে সস্তা
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink/70">{r.division}</td>
                      <td className="px-4 py-3 text-right">{formatTaka(r.min)}</td>
                      <td className="px-4 py-3 text-right">{formatTaka(r.max)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatTaka(r.avg)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-2xl bg-page p-6 text-center text-sm text-ink/70">
              এই পণ্যের বাজারভিত্তিক দাম এখনো পাওয়া যায়নি।
            </p>
          )}
        </section>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={`/category/${product.category}`} className="btn btn-outline btn-sm sm:btn-md">
          {product.categoryIcon} সব {product.categoryNameBn}
        </Link>
        <Link href="/" className="btn btn-ghost btn-sm sm:btn-md">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
