"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authErrorMessage, signUp } from "@/lib/auth-client";
import { Divider } from "./AuthShell";
import FormField from "./FormField";
import SocialButtons from "./SocialButtons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Errors = Partial<Record<"name" | "email" | "password" | "confirm" | "form", string>>;

export default function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "আপনার নাম লিখুন (কমপক্ষে ২ অক্ষর)।";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "সঠিক ইমেইল ঠিকানা দিন।";
    if (form.password.length < 8) next.password = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
    if (form.confirm !== form.password) next.confirm = "দুটি পাসওয়ার্ড মিলছে না।";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error(Object.values(next)[0]!);
      return;
    }

    setLoading(true);
    const { error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    });
    setLoading(false);

    if (error) {
      const msg = authErrorMessage(error);
      setErrors({ form: msg });
      toast.error(msg);
      return;
    }
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এবার সাইন ইন করুন।");
    router.push(`/signin?email=${encodeURIComponent(form.email.trim())}`);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        label="নাম"
        name="name"
        autoComplete="name"
        placeholder="যেমন: রহিম উদ্দিন"
        value={form.name}
        onChange={set("name")}
        error={errors.name}
      />
      <FormField
        label="ইমেইল"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
      />
      <FormField
        label="পাসওয়ার্ড"
        type="password"
        name="password"
        autoComplete="new-password"
        placeholder="কমপক্ষে ৮ অক্ষর"
        value={form.password}
        onChange={set("password")}
        error={errors.password}
      />
      <FormField
        label="পাসওয়ার্ড নিশ্চিত করুন"
        type="password"
        name="confirm"
        autoComplete="new-password"
        placeholder="আবার লিখুন"
        value={form.confirm}
        onChange={set("confirm")}
        error={errors.confirm}
      />
      {errors.form && (
        <p role="alert" className="rounded-lg bg-rise/10 px-3 py-2 text-sm text-rise">
          {errors.form}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn btn-primary h-10">
        {loading && <span className="loading loading-spinner loading-xs" />}
        অ্যাকাউন্ট তৈরি করুন
      </button>
      <Divider />
      <SocialButtons />
      <p className="text-center text-sm text-ink/70">
        অ্যাকাউন্ট আছে?{" "}
        <Link href="/signin" className="text-brand hover:text-[#02642b]">
          সাইন ইন করুন
        </Link>
      </p>
    </form>
  );
}
