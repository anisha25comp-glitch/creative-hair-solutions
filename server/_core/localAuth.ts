import { jwtVerify, SignJWT } from "jose";
import type { Request, Response } from "express";
import { parse as parseCookieHeader } from "cookie";
import { getSessionCookieOptions } from "./cookies";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const LOCAL_AUTH_COOKIE = "chs-local-session";
const secret = () => new TextEncoder().encode(process.env.LOCAL_AUTH_SECRET || "change-this-local-auth-secret");
export type LocalRole = "admin" | "staff";
type LocalAccount = { username: string; password: string; name: string; role: LocalRole };
const accountsPath = path.resolve(process.cwd(), "server/data/staff-accounts.json");
async function readAccounts(): Promise<LocalAccount[]> { try { return JSON.parse(await readFile(accountsPath, "utf8")) as LocalAccount[]; } catch { return []; } }

export async function verifyLocalCredentials(username: string, password: string): Promise<{ role: LocalRole; name: string; username: string } | null> {
  if (username === process.env.ADMIN_LOGIN_ID && password === process.env.ADMIN_LOGIN_PASSWORD) return { role: "admin", name: "Admin", username };
  if (username === process.env.STAFF_LOGIN_ID && password === process.env.STAFF_LOGIN_PASSWORD) return { role: "staff", name: "Staff", username };
  const account = (await readAccounts()).find(row => row.username === username && row.password === password);
  return account ? { role: account.role, name: account.name, username: account.username } : null;
}

export async function createLocalSession(account: { role: LocalRole; name: string; username?: string }) {
  return new SignJWT({ role: account.role, name: account.name, username: account.username, local: true })
    .setProtectedHeader({ alg: "HS256" }).setSubject(`local-${account.username || account.role}`).setIssuedAt().setExpirationTime("8h").sign(secret());
}

export async function createStaffAccount(account: { username: string; password: string; name: string }) { const rows = await readAccounts(); if (rows.some(row => row.username === account.username)) throw new Error("That username already exists"); rows.push({ ...account, role: "staff" }); await mkdir(path.dirname(accountsPath), { recursive: true }); await writeFile(accountsPath, JSON.stringify(rows, null, 2)); return { username: account.username, name: account.name, role: "staff" as const }; }

export async function getLocalSession(req: Request) { const token = parseCookieHeader(req.headers.cookie ?? "")[LOCAL_AUTH_COOKIE]; if (!token) return null; try { const { payload } = await jwtVerify(token, secret()); if (payload.local !== true || (payload.role !== "admin" && payload.role !== "staff")) return null; return { role: payload.role as LocalRole, name: String(payload.name || "Team member"), username: String(payload.username || "") }; } catch { return null; } }
export function setLocalSession(res: Response, req: Request, token: string) { res.cookie(LOCAL_AUTH_COOKIE, token, { ...getSessionCookieOptions(req), maxAge: 8 * 60 * 60 * 1000 }); }
export function clearLocalSession(res: Response, req: Request) { res.clearCookie(LOCAL_AUTH_COOKIE, { ...getSessionCookieOptions(req), maxAge: -1 }); }
