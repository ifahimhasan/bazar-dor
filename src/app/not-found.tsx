import EmptyState from "@/components/EmptyState";

export const metadata = { title: "পেজ পাওয়া যায়নি" };

export default function NotFound() {
  return (
    <div className="py-6">
      <EmptyState
        icon="🧺"
        code="৪০৪"
        title="দুঃখিত, পেজটি খুঁজে পাওয়া যায়নি"
        message="আপনি যে পণ্য বা ক্যাটাগরি খুঁজছেন সেটি আমাদের বাজারের তালিকায় নেই অথবা ঠিকানাটি ভুল।"
      />
    </div>
  );
}
