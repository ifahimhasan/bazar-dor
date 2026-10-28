import Image from "next/image";
import BanglaDate from "@/components/BanglaDate";
import ProductBrowser from "@/components/ProductBrowser";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getProducts, topMovers } from "@/lib/api";

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const risers = topMovers(products, "up");
  const fallers = topMovers(products, "down");

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="flex flex-col items-center gap-6 px-5 py-8 sm:px-10 md:flex-row md:justify-between">
          <div className="flex max-w-xl flex-col items-start gap-2 text-left">
            <BanglaDate className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand" />
            <h1 className="mt-1 text-3xl font-bold leading-tight sm:text-4xl">আজকের বাজারের দাম এক নজরে</h1>
            <p className="mt-1 text-base leading-7 text-ink/70">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
              দামের পরিবর্তন এক জায়গায়।
            </p>
            <a href="#সব-পণ্য" className="btn btn-primary btn-sm mt-3 sm:btn-md">
              সব পণ্য দেখুন
            </a>
          </div>
          <Image
            src="/bazar-hero.png"
            alt="ফল ও সবজিতে ভরা বাজারের ঝুড়ি"
            width={315}
            height={263}
            priority
            className="w-56 shrink-0 sm:w-72 md:mr-6 md:w-[315px]"
          />
        </div>
      </section>

      {/* Section A */}
      <section aria-labelledby="risers" className="flex flex-col gap-3">
        <h2 id="risers" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-base text-rise" aria-hidden>
            ▲
          </span>
          আজ দাম বেড়েছে
        </h2>
        <ProductGrid products={risers} />
      </section>

      {/* Section B */}
      <section aria-labelledby="fallers" className="flex flex-col gap-3">
        <h2 id="fallers" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-base text-fall" aria-hidden>
            ▼
          </span>
          আজ দাম কমেছে
        </h2>
        <ProductGrid products={fallers} />
      </section>

      {/* Section C */}
      <section id="সব-পণ্য" aria-labelledby="all-products" className="flex flex-col gap-3">
        <div>
          <h2 id="all-products" className="text-xl font-bold">
            সব পণ্য
          </h2>
          <p className="text-sm text-ink/70">নিত্যপ্রয়োজনীয় সব পণ্যের আজকের দাম — খুঁজুন, ক্যাটাগরি বাছুন বা দাম অনুযায়ী সাজান।</p>
        </div>
        <ProductBrowser products={products} categories={categories} />
      </section>
    </div>
  );
}
