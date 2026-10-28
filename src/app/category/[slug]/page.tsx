import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";
import EmptyState from "@/components/EmptyState";
import { getCategory, getProductsByCategory } from "@/lib/api";
import { toBnNumber } from "@/lib/bn";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  return { title: category ? `${category.nameBn}-এর দাম` : "ক্যাটাগরি পাওয়া যায়নি" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(slug);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-5">
        <span className="text-4xl" aria-hidden>
          {category.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold leading-8">{category.nameBn}</h1>
          <p className="text-sm text-ink/70">{toBnNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </header>

      {products.length ? (
        <CategoryProducts products={products} />
      ) : (
        <EmptyState
          icon={category.icon}
          title="এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই"
          message="শীঘ্রই এই ক্যাটাগরির দাম যোগ করা হবে। আপাতত অন্য ক্যাটাগরি দেখুন।"
        />
      )}
    </div>
  );
}
