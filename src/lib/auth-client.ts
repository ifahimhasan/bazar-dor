import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession, updateUser } = authClient;

/** Translate common Better Auth error codes into Bangla toast messages */
export function authErrorMessage(error: { code?: string; message?: string } | null | undefined) {
  const map: Record<string, string> = {
    INVALID_EMAIL_OR_PASSWORD: "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।",
    USER_ALREADY_EXISTS: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।",
    PASSWORD_TOO_SHORT: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
    INVALID_EMAIL: "সঠিক ইমেইল ঠিকানা দিন।",
    PROVIDER_NOT_FOUND: "এই সোশ্যাল লগইন এখনো চালু করা হয়নি।",
  };
  if (error?.code && map[error.code]) return map[error.code];
  return error?.message || "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।";
}
