import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createAppointment, createBill, listAppointments, listBills, updateAppointmentStatus } from "./db";

const appointmentStatus = z.enum(["booked", "confirmed", "completed", "cancelled"]);
const paymentMethod = z.enum(["cash", "upi", "card", "pending"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  staff: router({
    appointments: adminProcedure.input(z.object({ from: z.coerce.date(), to: z.coerce.date() })).query(({ input }) => listAppointments(input.from, input.to)),
    createAppointment: adminProcedure.input(z.object({ customerName: z.string().min(2), phone: z.string().min(7), service: z.string().min(2), appointmentAt: z.coerce.date(), notes: z.string().optional(), status: appointmentStatus.default("booked") })).mutation(({ input, ctx }) => createAppointment({ ...input, createdBy: ctx.user.id })),
    updateAppointmentStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: appointmentStatus })).mutation(({ input }) => updateAppointmentStatus(input.id, input.status)),
    bills: adminProcedure.query(() => listBills()),
    createBill: adminProcedure.input(z.object({ appointmentId: z.number().int().positive().optional(), customerName: z.string().min(2), itemSummary: z.string().min(2), amount: z.number().int().nonnegative(), paymentMethod: paymentMethod.default("pending") })).mutation(({ input, ctx }) => createBill({ ...input, createdBy: ctx.user.id })),
  }),
});

export type AppRouter = typeof appRouter;
