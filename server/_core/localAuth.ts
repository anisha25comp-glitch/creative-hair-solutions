import { jwtVerify, SignJWT } from "jose";
import type { Request, Response } from "express";
import { parse as parseCookieHeader } from "cookie";
import { getSessionCookieOptions } from "./cookies";

export const LOCAL_AUTH_COOKIE = "chs-local-session";
const secret = () => new TextEncoder().encode(process.env.LOCAL_AUTH_SECRET || "change-this-local-auth-secret");

export type LocalRole = "admin" | "staff";

export function verifyLocalCredentials(username: string, password: string): LocalRole | null {
  if (username === process.env.ADMIN_LOGIN_ID && password === process.env.ADMIN_LOGIN_PASSWORD) return "admin";
  if (username === process.env.STAFF_LOGIN_ID && password === process.env.STAFF_LOGIN_PASSWORD) return "staff";
  return null;
}

export async function createLocalSession(role: LocalRole) {
  return new SignJWT({ role, name: role === "admin" ? "Admin" : "Superadmin", local: true })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(`local-${role}`)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function getLocalSession(req: Request) {
  const token = parseCookieHeader(req.headers.cookie ?? "")[LOCAL_AUTH_COOKIE];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.local !== true || (payload.role !== "admin" && payload.role !== "staff")) return null;
    return { role: payload.role as LocalRole, name: String(payload.name || "Team member") };
  } catch {
    return null;
  }
}

export function setLocalSession(res: Response, req: Request, token: string) {
  res.cookie(LOCAL_AUTH_COOKIE, token, { ...getSessionCookieOptions(req), maxAge: 8 * 60 * 60 * 1000 });
}

export function clearLocalSession(res: Response, req: Request) {
  res.clearCookie(LOCAL_AUTH_COOKIE, { ...getSessionCookieOptions(req), maxAge: -1 });
}
