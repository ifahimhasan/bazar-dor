import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getSession() {
  // read headers outside try/catch so Next.js can mark the route as dynamic
  const requestHeaders = await headers();
  try {
    return await auth.api.getSession({ headers: requestHeaders });
  } catch (err) {
    console.error("[session] could not read session:", err);
    return null;
  }
}

/** Server-side guard for protected pages */
export async function requireSession(returnTo: string) {
  const session = await getSession();
  if (!session) {
    redirect(`/signin?redirect=${encodeURIComponent(returnTo)}&reason=protected`);
  }
  return session;
}
