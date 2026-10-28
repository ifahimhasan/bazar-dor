import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { memoryAdapter } from "better-auth/adapters/memory";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

/**
 * Database: MongoDB when MONGODB_URI is set (production / Vercel).
 * Without it, an in-memory store is used so the app still runs locally
 * for a quick try-out (accounts are lost on restart).
 */
function createDatabase() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    const g = globalThis as unknown as { __mongo?: MongoClient };
    g.__mongo ??= new MongoClient(uri);
    return mongodbAdapter(g.__mongo.db(process.env.MONGODB_DB ?? "bazardor"), {
      client: g.__mongo,
    });
  }
  const g = globalThis as unknown as { __memDb?: Record<string, unknown[]> };
  g.__memDb ??= { user: [], session: [], account: [], verification: [] };
  return memoryAdapter(g.__memDb as Parameters<typeof memoryAdapter>[0]);
}

const socialProviders: Parameters<typeof betterAuth>[0]["socialProviders"] = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: createDatabase(),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // after sign up the user is sent to the sign-in page
    autoSignIn: false,
  },
  socialProviders,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
  ].filter(Boolean) as string[],
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
