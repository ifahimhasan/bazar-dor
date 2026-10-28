import Link from "next/link";
import Avatar from "@/components/Avatar";
import SignOutButton from "@/components/auth/SignOutButton";
import { banglaDateTime } from "@/lib/bn";
import { requireSession } from "@/lib/session";

export const metadata = { title: "আমার প্রোফাইল" };

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-page px-3 py-3">
      <p className="text-xs text-ink/70">{label}</p>
      <p className="break-words font-medium">{value}</p>
    </div>
  );
}

export default async function ProfilePage() {
  const { user, session } = await requireSession("/profile");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
        <p className="text-sm text-ink/70">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
        <Avatar name={user.name} image={user.image} className="size-20 shrink-0 rounded-2xl text-3xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-semibold">{user.name}</p>
          <p className="truncate text-ink/70">{user.email}</p>
        </div>
        <SignOutButton />
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">তথ্য</h2>
          <Link href="/profile/update" className="btn btn-primary btn-sm sm:btn-md">
            ✏️ তথ্য আপডেট করুন
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoItem label="নাম" value={user.name} />
          <InfoItem label="ইমেইল" value={user.email} />
          <InfoItem label="অ্যাকাউন্ট তৈরি" value={banglaDateTime(new Date(user.createdAt))} />
          <InfoItem label="সেশন শুরু" value={banglaDateTime(new Date(session.createdAt))} />
        </div>
      </section>
    </div>
  );
}
