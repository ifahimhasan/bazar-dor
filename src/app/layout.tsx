import type { Metadata, Viewport } from "next";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/hind-siliguri/700.css";
import "./globals.css";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { getCategories, getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: {
    default: "বাজার দর — আজকের বাজারের দাম এক নজরে",
    template: "%s | বাজার দর",
  },
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#05893e",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <html lang="bn" data-theme="bazar">
      <body className="flex min-h-dvh flex-col">
        <Providers />
        <Header categories={categories} />
        <Ticker products={products} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
