"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signOut } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const { error } = await signOut();
        setLoading(false);
        if (error) {
          toast.error("সাইন আউট করা যায়নি, আবার চেষ্টা করুন।");
          return;
        }
        toast.success("সফলভাবে সাইন আউট হয়েছে।");
        router.push("/");
        router.refresh();
      }}
      className="btn btn-outline btn-error btn-sm sm:btn-md"
    >
      {loading && <span className="loading loading-spinner loading-xs" />}↩ সাইন আউট
    </button>
  );
}
