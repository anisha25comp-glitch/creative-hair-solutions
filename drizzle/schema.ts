import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "staff"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  branch: mysqlEnum("branch", ["ulhasnagar", "badlapur"]).default("ulhasnagar").notNull(),
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
  branch: mysqlEnum("branch", ["ulhasnagar", "badlapur"]).default("ulhasnagar").notNull(),
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
  branch: mysqlEnum("branch", ["ulhasnagar", "badlapur"]).default("ulhasnagar").notNull(),
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

export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("clientName", { length: 160 }).notNull(),
  contactNumber: varchar("contactNumber", { length: 32 }).notNull(),
  email: varchar("email", { length: 320 }),
  branch: mysqlEnum("branch", ["ulhasnagar", "badlapur"]).default("ulhasnagar").notNull(),
  source: varchar("source", { length: 80 }),
  assignedTo: varchar("assignedTo", { length: 120 }),
  service: varchar("service", { length: 160 }),
  gender: mysqlEnum("gender", ["female", "male", "other"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const feedback = mysqlTable("feedback", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("clientName", { length: 160 }).notNull(),
  contactNumber: varchar("contactNumber", { length: 32 }),
  branch: mysqlEnum("branch", ["ulhasnagar", "badlapur"]).default("ulhasnagar").notNull(),
  rating: int("rating").notNull(),
  comments: text("comments").notNull(),
  status: mysqlEnum("status", ["new", "reviewed", "resolved"]).default("new").notNull(),
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
export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;
