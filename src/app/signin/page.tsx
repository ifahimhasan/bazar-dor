import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import SignInForm from "@/components/auth/SignInForm";
import { getSession } from "@/lib/session";

export const metadata = { title: "সাইন ইন" };

export default async function SignInPage() {
  if (await getSession()) redirect("/");
  return (
    <AuthShell title="সাইন ইন" subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।">
      <Suspense fallback={<div className="skeleton h-80 bg-page" />}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
