"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authErrorMessage, signIn } from "@/lib/auth-client";
import { Divider } from "./AuthShell";
import FormField from "./FormField";
import SocialButtons from "./SocialButtons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** only allow same-site relative paths as redirect targets */
function safeRedirect(target: string | null) {
  return target && target.startsWith("/") && !target.startsWith("//") ? target : "/";
}

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = safeRedirect(params.get("redirect"));

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.get("reason") === "protected") {
      toast("বিস্তারিত দেখতে আগে সাইন ইন করুন।", { icon: "🔒", id: "protected-route" });
    }
    if (params.get("auth") === "social-error") {
      toast.error("সোশ্যাল লগইন সম্পন্ন হয়নি, আবার চেষ্টা করুন।", { id: "social-error" });
    }
  }, [params]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) next.email = "সঠিক ইমেইল ঠিকানা দিন।";
    if (!password) next.password = "পাসওয়ার্ড লিখুন।";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("ফর্মের তথ্য ঠিকমতো পূরণ করুন।");
      return;
    }

    setLoading(true);
    const { error } = await signIn.email({ email: email.trim(), password });
    setLoading(false);

    if (error) {
      const msg = authErrorMessage(error);
      setErrors({ form: msg });
      toast.error(msg);
      return;
    }
    toast.success("স্বাগতম! সফলভাবে সাইন ইন হয়েছে।");
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        label="ইমেইল"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <FormField
        label="পাসওয়ার্ড"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="কমপক্ষে ৮ অক্ষর"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      {errors.form && (
        <p role="alert" className="rounded-lg bg-rise/10 px-3 py-2 text-sm text-rise">
          {errors.form}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn btn-primary h-10">
        {loading && <span className="loading loading-spinner loading-xs" />}
        সাইন ইন
      </button>
      <Divider />
      <SocialButtons callbackURL={redirectTo} />
      <p className="text-center text-sm text-ink/70">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/signup" className="text-brand hover:text-[#02642b]">
          সাইন আপ করুন
        </Link>
      </p>
    </form>
  );
}
