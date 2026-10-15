import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { parse as parseCookieHeader } from "cookie";
import { getSessionCookieOptions } from "./_core/cookies";
import { clearLocalSession, createLocalSession, LOCAL_AUTH_COOKIE, setLocalSession, verifyLocalCredentials } from "./_core/localAuth";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router, staffProcedure } from "./_core/trpc";
import { createAppointment, createBill, createClient, createEnquiry, createExpense, createFeedback, createProduct, createProvider, createService, listAppointments, listBills, listClients, listEnquiries, listExpenses, listFeedback, listProducts, listProviders, listServices, listStockMovements, receiveStock, updateAppointmentStatus, updateEnquiryStatus, updateFeedbackStatus, updateProvider, updateService } from "./db";

const appointmentStatus = z.enum(["booked", "confirmed", "completed", "cancelled"]);
const paymentMethod = z.enum(["cash", "upi", "card", "pending"]);
const enquiryStatus = z.enum(["pending", "contacted", "converted", "lost"]);
const branch = z.enum(["ulhasnagar", "badlapur"]);
const gender = z.enum(["female", "male", "other"]);
const feedbackStatus = z.enum(["new", "reviewed", "resolved"]);
const serviceInput = z.object({ name: z.string().trim().min(2), category: z.string().trim().min(2), description: z.string().trim().max(2000).optional(), price: z.number().int().nonnegative(), durationMinutes: z.number().int().positive(), taxPercent: z.number().int().min(0).max(100).default(18), active: z.number().int().min(0).max(1).default(1) });
const providerInput = z.object({ fullName: z.string().trim().min(2), phone: z.string().trim().min(7), email: z.string().email().optional().or(z.literal("")), role: z.string().trim().min(2), specialization: z.string().trim().max(160).optional(), joiningDate: z.coerce.date().optional(), commissionType: z.enum(["percentage", "fixed"]).default("percentage"), commissionValue: z.number().int().nonnegative().default(0), workingHours: z.string().trim().max(120).optional(), active: z.number().int().min(0).max(1).default(1) });
const productInput = z.object({ name: z.string().trim().min(2), sku: z.string().trim().max(80).optional(), category: z.string().trim().min(2), supplier: z.string().trim().max(160).optional(), purchaseCost: z.number().int().nonnegative().default(0), sellingPrice: z.number().int().nonnegative().default(0), quantity: z.number().int().nonnegative().default(0), minimumStock: z.number().int().nonnegative().default(0), expiryDate: z.coerce.date().optional(), active: z.number().int().min(0).max(1).default(1) });
const expenseInput = z.object({ category: z.enum(["product", "salary", "rent", "utilities", "marketing", "other"]), description: z.string().trim().min(2).max(240), amount: z.number().int().positive(), expenseDate: z.coerce.date(), paymentMethod: z.enum(["cash", "upi", "card", "bank"]).default("cash"), providerId: z.number().int().positive().optional() });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    localLogin: publicProcedure.input(z.object({ username: z.string().min(1), password: z.string().min(1) })).mutation(async ({ input, ctx }) => { const role = verifyLocalCredentials(input.username, input.password); if (!role) throw new Error("Invalid sign-in details"); const token = await createLocalSession(role); setLocalSession(ctx.res, ctx.req, token); return { role } as const; }),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); const cookies = parseCookieHeader(ctx.req.headers.cookie ?? ""); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); if (cookies[LOCAL_AUTH_COOKIE]) clearLocalSession(ctx.res, ctx.req); return { success: true } as const; }),
  }),
  publicBooking: router({
    create: publicProcedure.input(z.object({ customerName: z.string().min(2), phone: z.string().min(7), branch, service: z.string().min(2), appointmentAt: z.coerce.date(), notes: z.string().optional() })).mutation(({ input }) => createAppointment({ ...input, status: "booked" })),
  }),
  staff: router({
    appointments: staffProcedure.input(z.object({ from: z.coerce.date(), to: z.coerce.date(), branch: branch.optional() })).query(({ input }) => listAppointments(input.from, input.to, input.branch)),
    createAppointment: staffProcedure.input(z.object({ customerName: z.string().min(2), phone: z.string().min(7), branch, service: z.string().min(2), appointmentAt: z.coerce.date(), notes: z.string().optional(), status: appointmentStatus.default("booked") })).mutation(({ input, ctx }) => createAppointment({ ...input, createdBy: ctx.user.id })),
    updateAppointmentStatus: staffProcedure.input(z.object({ id: z.number().int().positive(), status: appointmentStatus })).mutation(({ input }) => updateAppointmentStatus(input.id, input.status)),
    bills: staffProcedure.query(() => listBills()),
    createBill: staffProcedure.input(z.object({ appointmentId: z.number().int().positive().optional(), customerName: z.string().min(2), phone: z.string().optional(), gender: gender.optional(), providerName: z.string().optional(), providerWorkAmount: z.number().int().nonnegative().optional(), branch, itemSummary: z.string().min(2), amount: z.number().int().nonnegative(), paymentMethod: paymentMethod.default("pending") })).mutation(({ input, ctx }) => createBill({ ...input, createdBy: ctx.user.id })),
    enquiries: staffProcedure.query(() => listEnquiries()),
    createEnquiry: staffProcedure.input(z.object({ contactNumber: z.string().min(7), clientName: z.string().min(2), email: z.string().email().optional().or(z.literal("")), address: z.string().optional(), branch, enquiryFor: z.string().min(2), enquiryType: z.string().min(2), response: z.string().optional(), followUpDate: z.coerce.date(), source: z.string().min(2), leadRepresentative: z.string().optional(), leadStatus: enquiryStatus.default("pending"), sendChannel: z.enum(["sms", "whatsapp"]).default("whatsapp") })).mutation(({ input, ctx }) => createEnquiry({ ...input, createdBy: ctx.user.id, email: input.email || null })),
    updateEnquiryStatus: staffProcedure.input(z.object({ id: z.number().int().positive(), leadStatus: enquiryStatus })).mutation(({ input }) => updateEnquiryStatus(input.id, input.leadStatus)),
    clients: staffProcedure.query(() => listClients()),
    createClient: staffProcedure.input(z.object({ clientName: z.string().min(2), contactNumber: z.string().min(7), email: z.string().email().optional().or(z.literal("")), branch, source: z.string().optional(), assignedTo: z.string().optional(), service: z.string().optional(), gender: gender.optional() })).mutation(({ input }) => createClient({ ...input, email: input.email || null })),
    feedback: staffProcedure.query(() => listFeedback()),
    createFeedback: staffProcedure.input(z.object({ clientName: z.string().min(2), contactNumber: z.string().optional(), branch, rating: z.number().int().min(1).max(5), comments: z.string().min(2), status: feedbackStatus.default("new") })).mutation(({ input, ctx }) => createFeedback({ ...input, createdBy: ctx.user.id })),
    updateFeedbackStatus: staffProcedure.input(z.object({ id: z.number().int().positive(), status: feedbackStatus })).mutation(({ input }) => updateFeedbackStatus(input.id, input.status)),
    services: staffProcedure.input(z.object({ includeInactive: z.boolean().optional() }).default({})).query(({ input }) => listServices(input.includeInactive ?? false)),
    createService: adminProcedure.input(serviceInput).mutation(({ input, ctx }) => createService({ ...input, createdBy: ctx.user.id, description: input.description || null })),
    updateService: adminProcedure.input(z.object({ id: z.number().int().positive(), data: serviceInput.partial() })).mutation(({ input }) => updateService(input.id, input.data)),
    providers: staffProcedure.input(z.object({ includeInactive: z.boolean().optional() }).default({})).query(({ input }) => listProviders(input.includeInactive ?? false)),
    createProvider: adminProcedure.input(providerInput).mutation(({ input, ctx }) => createProvider({ ...input, createdBy: ctx.user.id, email: input.email || null, specialization: input.specialization || null, workingHours: input.workingHours || null })),
    updateProvider: adminProcedure.input(z.object({ id: z.number().int().positive(), data: providerInput.partial() })).mutation(({ input }) => updateProvider(input.id, input.data)),
    products: staffProcedure.input(z.object({ includeInactive: z.boolean().optional() }).default({})).query(({ input }) => listProducts(input.includeInactive ?? false)),
    createProduct: adminProcedure.input(productInput).mutation(({ input, ctx }) => createProduct({ ...input, sku: input.sku || `AUTO-${Date.now()}`, createdBy: ctx.user.id, supplier: input.supplier || null })),
    receiveStock: adminProcedure.input(z.object({ productId: z.number().int().positive(), quantity: z.number().int().positive(), reason: z.string().trim().max(240).optional() })).mutation(({ input, ctx }) => receiveStock(input.productId, input.quantity, input.reason, ctx.user.id)),
    stockMovements: staffProcedure.input(z.object({ productId: z.number().int().positive().optional() }).default({})).query(({ input }) => listStockMovements(input.productId)),
    expenses: staffProcedure.query(() => listExpenses()),
    createExpense: adminProcedure.input(expenseInput).mutation(({ input, ctx }) => createExpense({ ...input, createdBy: ctx.user.id })),
    reports: staffProcedure.input(z.object({ from: z.coerce.date(), to: z.coerce.date() })).query(async ({ input }) => {
      const [bills, appointments, expenses] = await Promise.all([listBills(), listAppointments(input.from, input.to), listExpenses()]);
      const rangeBills = bills.filter(bill => new Date(bill.createdAt) >= input.from && new Date(bill.createdAt) <= input.to);
      const rangeExpenses = expenses.filter(expense => new Date(expense.expenseDate) >= input.from && new Date(expense.expenseDate) <= input.to);
      return { sales: rangeBills.reduce((sum, bill) => sum + bill.amount, 0), collections: rangeBills.filter(bill => bill.paymentMethod !== "pending").reduce((sum, bill) => sum + bill.amount, 0), bills: rangeBills.length, appointments: appointments.length, expenses: rangeExpenses.reduce((sum, expense) => sum + expense.amount, 0), expenseByCategory: rangeExpenses.reduce<Record<string, number>>((out, expense) => { out[expense.category] = (out[expense.category] || 0) + expense.amount; return out; }, {}) };
    }),
  }),
  admin: router({
    promoteStaff: adminProcedure.input(z.object({ openId: z.string().min(1) })).mutation(() => ({ success: true })),
  }),
});

export type AppRouter = typeof appRouter;
