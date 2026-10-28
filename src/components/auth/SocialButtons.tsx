"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authErrorMessage, signIn } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0124 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 01-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

export default function SocialButtons({ callbackURL = "/" }: { callbackURL?: string }) {
  const [busy, setBusy] = useState<"google" | "github" | null>(null);

  const go = async (provider: "google" | "github") => {
    setBusy(provider);
    const sep = callbackURL.includes("?") ? "&" : "?";
    const { error } = await signIn.social({
      provider,
      callbackURL: `${callbackURL}${sep}auth=social`,
      errorCallbackURL: "/signin?auth=social-error",
    });
    if (error) {
      toast.error(authErrorMessage(error));
      setBusy(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => go("google")}
        disabled={!!busy}
        className="btn btn-outline h-10 border-line font-semibold hover:border-[#ccd0cc] hover:bg-[#dadeda] hover:text-ink"
      >
        {busy === "google" ? <span className="loading loading-spinner loading-xs" /> : <GoogleIcon />}
        Google দিয়ে চালিয়ে যান
      </button>
      <button
        type="button"
        onClick={() => go("github")}
        disabled={!!busy}
        className="btn btn-outline h-10 border-line font-semibold hover:border-[#ccd0cc] hover:bg-[#dadeda] hover:text-ink"
      >
        {busy === "github" ? <span className="loading loading-spinner loading-xs" /> : <GitHubIcon />}
        GitHub দিয়ে চালিয়ে যান
      </button>
    </div>
  );
}
