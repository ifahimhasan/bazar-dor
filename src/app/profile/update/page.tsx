import UpdateProfileForm from "@/components/auth/UpdateProfileForm";
import { requireSession } from "@/lib/session";

export const metadata = { title: "তথ্য আপডেট" };

export default async function UpdateProfilePage() {
  const { user } = await requireSession("/profile/update");
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl font-bold">তথ্য আপডেট করুন</h1>
        <p className="text-sm text-ink/70">আপনার নাম ও প্রোফাইল ছবি পরিবর্তন করুন।</p>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <UpdateProfileForm defaultName={user.name} defaultImage={user.image ?? ""} />
      </div>
    </div>
  );
}
