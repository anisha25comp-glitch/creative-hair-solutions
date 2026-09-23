import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router, staffProcedure } from "./_core/trpc";
import { createAppointment, createBill, createClient, createEnquiry, listAppointments, listBills, listClients, listEnquiries, updateAppointmentStatus, updateEnquiryStatus } from "./db";

const appointmentStatus = z.enum(["booked", "confirmed", "completed", "cancelled"]);
const paymentMethod = z.enum(["cash", "upi", "card", "pending"]);
const enquiryStatus = z.enum(["pending", "contacted", "converted", "lost"]);
const branch = z.enum(["ulhasnagar", "badlapur"]);
const gender = z.enum(["female", "male", "other"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  staff: router({
    appointments: staffProcedure.input(z.object({ from: z.coerce.date(), to: z.coerce.date(), branch: branch.optional() })).query(({ input }) => listAppointments(input.from, input.to)),
    createAppointment: staffProcedure.input(z.object({ customerName: z.string().min(2), phone: z.string().min(7), branch, service: z.string().min(2), appointmentAt: z.coerce.date(), notes: z.string().optional(), status: appointmentStatus.default("booked") })).mutation(({ input, ctx }) => createAppointment({ ...input, createdBy: ctx.user.id })),
    updateAppointmentStatus: staffProcedure.input(z.object({ id: z.number().int().positive(), status: appointmentStatus })).mutation(({ input }) => updateAppointmentStatus(input.id, input.status)),
    bills: staffProcedure.query(() => listBills()),
    createBill: staffProcedure.input(z.object({ appointmentId: z.number().int().positive().optional(), customerName: z.string().min(2), phone: z.string().optional(), branch, itemSummary: z.string().min(2), amount: z.number().int().nonnegative(), paymentMethod: paymentMethod.default("pending") })).mutation(({ input, ctx }) => createBill({ ...input, createdBy: ctx.user.id })),
    enquiries: staffProcedure.query(() => listEnquiries()),
    createEnquiry: staffProcedure.input(z.object({ contactNumber: z.string().min(7), clientName: z.string().min(2), email: z.string().email().optional().or(z.literal("")), address: z.string().optional(), branch, enquiryFor: z.string().min(2), enquiryType: z.string().min(2), response: z.string().optional(), followUpDate: z.coerce.date(), source: z.string().min(2), leadRepresentative: z.string().optional(), leadStatus: enquiryStatus.default("pending"), sendChannel: z.enum(["sms", "whatsapp"]).default("whatsapp") })).mutation(({ input, ctx }) => createEnquiry({ ...input, createdBy: ctx.user.id, email: input.email || null })),
    updateEnquiryStatus: staffProcedure.input(z.object({ id: z.number().int().positive(), leadStatus: enquiryStatus })).mutation(({ input }) => updateEnquiryStatus(input.id, input.leadStatus)),
    clients: staffProcedure.query(() => listClients()),
    createClient: staffProcedure.input(z.object({ clientName: z.string().min(2), contactNumber: z.string().min(7), email: z.string().email().optional().or(z.literal("")), branch, source: z.string().optional(), assignedTo: z.string().optional(), service: z.string().optional(), gender: gender.optional() })).mutation(({ input }) => createClient({ ...input, email: input.email || null })),
  }),
  admin: router({
    promoteStaff: adminProcedure.input(z.object({ openId: z.string().min(1) })).mutation(() => ({ success: true })),
  }),
});

export type AppRouter = typeof appRouter;
