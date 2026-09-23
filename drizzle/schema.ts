import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  service: varchar("service", { length: 160 }).notNull(),
  appointmentAt: timestamp("appointmentAt").notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["booked", "confirmed", "completed", "cancelled"]).default("booked").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const bills = mysqlTable("bills", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId"),
  customerName: varchar("customerName", { length: 160 }).notNull(),
  itemSummary: text("itemSummary").notNull(),
  amount: int("amount").notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "upi", "card", "pending"]).default("pending").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const enquiries = mysqlTable("enquiries", {
  id: int("id").autoincrement().primaryKey(),
  contactNumber: varchar("contactNumber", { length: 32 }).notNull(),
  clientName: varchar("clientName", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  enquiryFor: varchar("enquiryFor", { length: 160 }).notNull(),
  enquiryType: varchar("enquiryType", { length: 80 }).notNull(),
  response: text("response"),
  followUpDate: timestamp("followUpDate").notNull(),
  source: varchar("source", { length: 80 }).notNull(),
  leadRepresentative: varchar("leadRepresentative", { length: 120 }),
  leadStatus: mysqlEnum("leadStatus", ["pending", "contacted", "converted", "lost"]).default("pending").notNull(),
  sendChannel: mysqlEnum("sendChannel", ["sms", "whatsapp"]).default("whatsapp").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;
export type Bill = typeof bills.$inferSelect;
export type InsertBill = typeof bills.$inferInsert;
export type Enquiry = typeof enquiries.$inferSelect;
export type InsertEnquiry = typeof enquiries.$inferInsert;
