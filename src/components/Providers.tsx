"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

/** Social login returns with ?auth=social — greet the user once and clean the URL */
function SocialLoginToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (params.get("auth") === "social") {
      toast.success("স্বাগতম! সফলভাবে সাইন ইন হয়েছে।", { id: "social-ok" });
      const rest = new URLSearchParams(params);
      rest.delete("auth");
      router.replace(rest.size ? `${pathname}?${rest}` : pathname, { scroll: false });
    }
  }, [params, pathname, router]);
  return null;
}

export default function Providers() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "var(--font-sans)",
            background: "#fafcfa",
            color: "#1d271f",
            border: "1px solid #e1e8e1",
            borderRadius: "12px",
          },
          success: { iconTheme: { primary: "#05893e", secondary: "#fafcfa" } },
          error: { iconTheme: { primary: "#d03739", secondary: "#fafcfa" } },
        }}
      />
      <Suspense fallback={null}>
        <SocialLoginToast />
      </Suspense>
    </>
  );
}
