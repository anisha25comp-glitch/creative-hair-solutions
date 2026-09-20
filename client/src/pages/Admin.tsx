import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CalendarDays, Check, ChevronRight, Clock3, FileText, LogIn, Plus, ReceiptIndianRupee, Scissors, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link } from "wouter";

const services = ["Hair wash & haircut", "Advance colour & balayage", "Blowdry & hair styling", "Keratin, smoothening & rebonding", "Manicure, pedicure & nail art", "Threading, waxing & makeup"];
const todayInput = new Date().toISOString().slice(0, 10);

export default function Admin() {
  return <DashboardLayout><StaffGate /></DashboardLayout>;
}

function StaffGate() {
  const { user, loading } = useAuth();
  if (loading) return <div className="admin-loading"><Clock3 size={18} /> Checking staff access…</div>;
  if (!user) return null;
  if (user.role !== "admin") return <div className="admin-access-denied"><div className="admin-denied-icon"><ShieldCheck size={28} /></div><span className="admin-kicker">Staff access only</span><h1>This workspace is for salon staff.</h1><p>Your account is signed in, but it has not been assigned the admin role yet. Ask the salon owner to promote this account in the staff settings.</p><Link href="/" className="admin-view-site">Back to website <ChevronRight size={15} /></Link></div>;
  return <AdminWorkspace />;
}

function AdminWorkspace() {
  const utils = trpc.useUtils();
  const [appointmentDate, setAppointmentDate] = useState(todayInput);
  const [appointmentTime, setAppointmentTime] = useState("10:30");
  const [appointmentName, setAppointmentName] = useState("");
  const [appointmentPhone, setAppointmentPhone] = useState("");
  const [appointmentService, setAppointmentService] = useState(services[0]);
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [billName, setBillName] = useState("");
  const [billItems, setBillItems] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billPayment, setBillPayment] = useState("pending");
  const dateRange = useMemo(() => ({ from: new Date(`${todayInput}T00:00:00`), to: new Date(`${todayInput}T23:59:59`) }), []);
  const appointments = trpc.staff.appointments.useQuery(dateRange);
  const bills = trpc.staff.bills.useQuery();
  const createAppointment = trpc.staff.createAppointment.useMutation({ onSuccess: async () => { toast.success("Appointment booked"); setAppointmentName(""); setAppointmentPhone(""); setAppointmentNotes(""); await utils.staff.appointments.invalidate(); } });
  const updateStatus = trpc.staff.updateAppointmentStatus.useMutation({ onSuccess: async () => { toast.success("Appointment updated"); await utils.staff.appointments.invalidate(); } });
  const createBill = trpc.staff.createBill.useMutation({ onSuccess: async () => { toast.success("Bill created"); setBillName(""); setBillItems(""); setBillAmount(""); setBillPayment("pending"); await utils.staff.bills.invalidate(); } });
  const appointmentRows = appointments.data ?? [];
  const billRows = bills.data ?? [];
  const totalBilled = billRows.reduce((sum, bill) => sum + bill.amount, 0);

  const submitAppointment = (event: FormEvent) => { event.preventDefault(); createAppointment.mutate({ customerName: appointmentName, phone: appointmentPhone, service: appointmentService, appointmentAt: new Date(`${appointmentDate}T${appointmentTime}:00`), notes: appointmentNotes, status: "booked" }); };
  const submitBill = (event: FormEvent) => { event.preventDefault(); createBill.mutate({ customerName: billName, itemSummary: billItems, amount: Number(billAmount), paymentMethod: billPayment as "cash" | "upi" | "card" | "pending" }); };

  return <div className="staff-workspace"><header className="staff-topbar"><div><span className="admin-kicker">The Creative Hair Solutions · Staff</span><h1>Today’s desk.</h1></div><div className="staff-top-actions"><Link href="/" className="admin-view-site">View site <ChevronRight size={15} /></Link><span className="staff-role"><ShieldCheck size={14} /> Admin</span></div></header><section className="staff-stats"><article><span><CalendarDays size={16} /> Today’s appointments</span><strong>{appointmentRows.length}</strong><small>Live from the booking desk</small></article><article><span><ReceiptIndianRupee size={16} /> Bills created</span><strong>{billRows.length}</strong><small>₹{totalBilled.toLocaleString("en-IN")} recorded</small></article><article><span><Clock3 size={16} /> Next visit</span><strong>{appointmentRows[0] ? new Date(appointmentRows[0].appointmentAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : "—"}</strong><small>{appointmentRows[0]?.customerName ?? "No appointments yet"}</small></article></section><section className="staff-grid"><div className="staff-panel"><div className="staff-panel-heading"><div><span className="admin-kicker">Appointment booking</span><h2>Book a client</h2></div><CalendarDays size={19} /></div><form className="staff-form" onSubmit={submitAppointment}><div className="staff-form-row"><label><Label>Client name</Label><Input required value={appointmentName} onChange={(event) => setAppointmentName(event.target.value)} placeholder="e.g. Ananya Sharma" /></label><label><Label>Phone number</Label><Input required value={appointmentPhone} onChange={(event) => setAppointmentPhone(event.target.value)} placeholder="98765 43210" /></label></div><label><Label>Service</Label><select value={appointmentService} onChange={(event) => setAppointmentService(event.target.value)}>{services.map((service) => <option key={service}>{service}</option>)}</select></label><div className="staff-form-row"><label><Label>Date</Label><Input required type="date" value={appointmentDate} onChange={(event) => setAppointmentDate(event.target.value)} /></label><label><Label>Time</Label><Input required type="time" value={appointmentTime} onChange={(event) => setAppointmentTime(event.target.value)} /></label></div><label><Label>Notes <span>Optional</span></Label><textarea value={appointmentNotes} onChange={(event) => setAppointmentNotes(event.target.value)} placeholder="Hair notes, event, preferred stylist…" rows={3} /></label><Button type="submit" className="staff-submit" disabled={createAppointment.isPending}><Plus size={16} /> {createAppointment.isPending ? "Booking…" : "Book appointment"}</Button></form></div><div className="staff-panel"><div className="staff-panel-heading"><div><span className="admin-kicker">Bill creation</span><h2>Create a bill</h2></div><FileText size={19} /></div><form className="staff-form" onSubmit={submitBill}><label><Label>Client name</Label><Input required value={billName} onChange={(event) => setBillName(event.target.value)} placeholder="e.g. Riya Mehta" /></label><label><Label>Items / services</Label><textarea required value={billItems} onChange={(event) => setBillItems(event.target.value)} placeholder="Hair wash & haircut · ₹700\nBlowdry · ₹300" rows={4} /></label><div className="staff-form-row"><label><Label>Total amount (₹)</Label><Input required min="0" type="number" value={billAmount} onChange={(event) => setBillAmount(event.target.value)} placeholder="1000" /></label><label><Label>Payment</Label><select value={billPayment} onChange={(event) => setBillPayment(event.target.value)}><option value="pending">Pending</option><option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option></select></label></div><Button type="submit" className="staff-submit staff-submit-copper" disabled={createBill.isPending}><ReceiptIndianRupee size={16} /> {createBill.isPending ? "Creating…" : "Create bill"}</Button></form></div></section><section className="staff-panel staff-queue"><div className="staff-panel-heading"><div><span className="admin-kicker">Today · {todayInput}</span><h2>Appointment queue</h2></div><span className="queue-live"><span /> Live</span></div>{appointments.isLoading ? <div className="staff-empty">Loading appointments…</div> : appointmentRows.length === 0 ? <div className="staff-empty"><CalendarDays size={23} /><p>No appointments yet today.</p><small>Book your first client above.</small></div> : <div className="staff-table"><div className="staff-table-head"><span>Time</span><span>Client</span><span>Service</span><span>Status</span></div>{appointmentRows.map((appointment) => <div className="staff-table-row" key={appointment.id}><b>{new Date(appointment.appointmentAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</b><span><UserRound size={14} /> {appointment.customerName}<small>{appointment.phone}</small></span><span><Scissors size={14} /> {appointment.service}</span><select value={appointment.status} onChange={(event) => updateStatus.mutate({ id: appointment.id, status: event.target.value as "booked" | "confirmed" | "completed" | "cancelled" })}><option value="booked">Booked</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>)}</div>}</section><div className="staff-note"><Check size={15} /> Staff tools are limited to appointment booking, status updates, and bill creation. Owner/admin access is required.</div></div>;
}
