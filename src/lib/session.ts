import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Server-side guard for protected pages */
export async function requireSession(returnTo: string) {
  const session = await getSession();
  if (!session) {
    redirect(`/signin?redirect=${encodeURIComponent(returnTo)}&reason=protected`);
  }
  return session;
}
