import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { BarChart3, CalendarDays, ClipboardList, FileBarChart, FileText, LayoutDashboard, LogOut, Package, PanelLeft, ReceiptIndianRupee, Settings, ShoppingBag, Sparkles, UserRound, Users, WalletCards } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";

const menuGroups = [
  { title: "Workspace", items: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: ClipboardList, label: "Enquiries", path: "/admin/enquiries" },
    { icon: CalendarDays, label: "Appointments", path: "/admin/appointments" },
    { icon: ReceiptIndianRupee, label: "Billing", path: "/admin/billing" },
    { icon: Users, label: "Clients", path: "/admin/clients" },
    { icon: Sparkles, label: "Feedback", path: "/admin/feedback" },
    { icon: ShoppingBag, label: "Products", path: "/admin/products" },
    { icon: FileBarChart, label: "Reports", path: "/admin/reports" },
  ]},
  { title: "Products", items: [
    { icon: Package, label: "Current stock", path: "/admin/stock" },
    { icon: ClipboardList, label: "Product list", path: "/admin/product-list" },
    { icon: PlusIcon, label: "Add stock", path: "/admin/add-stock" },
    { icon: Users, label: "Product vendors", path: "/admin/vendors" },
  ]},
  { title: "Add & manage", items: [
    { icon: WalletCards, label: "Expenses", path: "/admin/expenses" },
    { icon: ScissorsIcon, label: "Services & packages", path: "/admin/services" },
    { icon: Sparkles, label: "Coupons & offers", path: "/admin/coupons" },
    { icon: UserRound, label: "Service providers", path: "/admin/providers" },
    { icon: Settings, label: "Staff & settings", path: "/admin/settings" },
  ]},
];
function PlusIcon(props: { className?: string }) { return <span className={props.className}>＋</span>; }
function ScissorsIcon(props: { className?: string }) { return <span className={props.className}>✂</span>; }
const allMenuItems = menuGroups.flatMap(group => group.items);
const SIDEBAR_WIDTH_KEY = "sidebar-width";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => { const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY); return saved ? parseInt(saved, 10) : 280; });
  const { loading, user } = useAuth();
  useEffect(() => { localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString()); }, [sidebarWidth]);
  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) { const isStaffPortal = window.location.pathname.startsWith("/staff"); return <div className="staff-login-shell"><div className="staff-login-card"><div className="staff-login-mark">TC</div><span className="admin-kicker">The Creative · {isStaffPortal ? "Staff portal" : "Admin portal"}</span><h1>{isStaffPortal ? "Staff login" : "Admin login"}</h1><p>{isStaffPortal ? "Sign in to manage appointments, billing, clients and daily salon operations." : "Sign in to manage branches, staff, reports, services and all salon settings."}</p><Button onClick={() => startLogin()} size="lg" className="staff-login-button">Sign in as {isStaffPortal ? "staff" : "admin"}</Button><a className="staff-login-back" href="/">Return to salon website</a></div></div>; }
  return <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}><DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent></SidebarProvider>;
}
function DashboardLayoutContent({ children, setSidebarWidth }: { children: React.ReactNode; setSidebarWidth: (width: number) => void }) {
  const { user, logout } = useAuth(); const [location, setLocation] = useLocation(); const { state, toggleSidebar } = useSidebar(); const isCollapsed = state === "collapsed"; const [isResizing, setIsResizing] = useState(false); const sidebarRef = useRef<HTMLDivElement>(null); const isMobile = useIsMobile();
  useEffect(() => { const move = (e: MouseEvent) => { if (!isResizing) return; const left = sidebarRef.current?.getBoundingClientRect().left ?? 0; const width = e.clientX - left; if (width >= 200 && width <= 480) setSidebarWidth(width); }; const up = () => setIsResizing(false); if (isResizing) { document.addEventListener("mousemove", move); document.addEventListener("mouseup", up); document.body.style.cursor = "col-resize"; } return () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); document.body.style.cursor = ""; }; }, [isResizing, setSidebarWidth]);
  const visibleGroups = menuGroups.map(group => ({ ...group, items: (user?.role === "staff" ? group.items.filter(item => ["/admin", "/admin/appointments", "/admin/billing", "/admin/clients"].includes(item.path)) : group.items).map(item => ({ ...item, path: user?.role === "staff" ? item.path.replace("/admin", "/staff") : item.path })) })).filter(group => group.items.length > 0);
  const active = visibleGroups.flatMap(group => group.items).find(item => item.path === location);
  return <><div className="relative" ref={sidebarRef}><Sidebar collapsible="icon" className="border-r-0"><SidebarHeader className="h-16 justify-center"><div className="flex items-center gap-3 px-2 w-full"><button onClick={toggleSidebar} className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg"><PanelLeft className="h-4 w-4 text-muted-foreground" /></button>{!isCollapsed && <div><span className="font-semibold tracking-tight">The Creative</span><p className="text-xs text-muted-foreground">{user?.role === "staff" ? "Staff workspace" : "Admin workspace"}</p></div>}</div></SidebarHeader><SidebarContent className="gap-0">{visibleGroups.map(group => <div key={group.title}><p className="px-4 pt-4 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground group-data-[collapsible=icon]:hidden">{group.title}</p><SidebarMenu className="px-2 py-1">{group.items.map(item => <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={location === item.path} onClick={() => setLocation(item.path)} tooltip={item.label} className="h-9"><item.icon className="h-4 w-4" /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></div>)}</SidebarContent><SidebarFooter className="p-3"><DropdownMenu><DropdownMenuTrigger asChild><button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 w-full text-left"><Avatar className="h-9 w-9 border"><AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback></Avatar><div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden"><p className="text-sm font-medium truncate">{user?.name || "Team member"}</p><p className="text-xs text-muted-foreground truncate">{user?.role === "staff" ? "Staff" : "Super admin"}</p></div></button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem></DropdownMenuContent></DropdownMenu></SidebarFooter></Sidebar><div className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 ${isCollapsed ? "hidden" : ""}`} onMouseDown={() => setIsResizing(true)} /></div><SidebarInset>{isMobile && <div className="flex border-b h-14 items-center gap-2 bg-background/95 px-2 sticky top-0 z-40"><SidebarTrigger className="h-9 w-9" /><span>{active?.label ?? "Dashboard"}</span></div>}<main className="flex-1 p-4 md:p-6">{children}</main></SidebarInset></>;
}
