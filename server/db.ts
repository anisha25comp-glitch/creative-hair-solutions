import { and, desc, eq, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { appointments, bills, InsertAppointment, InsertBill, InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      const normalized = user[field] ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listAppointments(from: Date, to: Date) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(appointments).where(and(gte(appointments.appointmentAt, from), lte(appointments.appointmentAt, to))).orderBy(appointments.appointmentAt);
}

export async function createAppointment(data: InsertAppointment) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(appointments).values(data);
  return result[0].insertId;
}

export async function updateAppointmentStatus(id: number, status: "booked" | "confirmed" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(appointments).set({ status, updatedAt: new Date() }).where(eq(appointments.id, id));
  return { success: true } as const;
}

export async function listBills() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bills).orderBy(desc(bills.createdAt)).limit(50);
}

export async function createBill(data: InsertBill) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(bills).values(data);
  return result[0].insertId;
}
