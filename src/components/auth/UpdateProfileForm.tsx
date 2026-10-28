"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authErrorMessage, updateUser } from "@/lib/auth-client";
import FormField from "./FormField";

export default function UpdateProfileForm({ defaultName, defaultImage }: { defaultName: string; defaultImage: string }) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [image, setImage] = useState(defaultImage);
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "নাম কমপক্ষে ২ অক্ষরের হতে হবে।";
    if (image.trim() && !/^https?:\/\/\S+$/.test(image.trim())) next.image = "সঠিক ছবির লিংক (https://…) দিন।";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error(Object.values(next)[0]!);
      return;
    }

    setLoading(true);
    const { error } = await updateUser({ name: name.trim(), image: image.trim() || null });
    setLoading(false);
    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে।");
    router.push("/profile");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        label="নাম"
        name="name"
        autoComplete="name"
        placeholder="যেমন: রহিম উদ্দিন"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <FormField
        label="ছবির লিংক (ঐচ্ছিক)"
        name="image"
        type="url"
        placeholder="https://example.com/photo.jpg"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        error={errors.image}
      />
      <button type="submit" disabled={loading} className="btn btn-primary h-10">
        {loading && <span className="loading loading-spinner loading-xs" />}
        তথ্য আপডেট করুন
      </button>
      <Link href="/profile" className="text-center text-sm text-ink/60 hover:text-brand">
        ← প্রোফাইলে ফিরে যান
      </Link>
    </form>
  );
}
