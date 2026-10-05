import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { getLocalSession } from "./localAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const localSession = await getLocalSession(opts.req);
    if (localSession) {
      const now = new Date();
      user = { id: localSession.role === "admin" ? -1 : -2, openId: `local-${localSession.role}`, name: localSession.name, email: null, loginMethod: "local", role: localSession.role, createdAt: now, updatedAt: now, lastSignedIn: now } as User;
    } else {
      user = await sdk.authenticateRequest(opts.req);
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
