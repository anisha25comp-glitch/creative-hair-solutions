import { FormEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Heart,
  ChevronDown,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Scissors,
  Sparkles,
  Star,
  UserRound,
  X,
} from "lucide-react";

const phone = "092226 31384";
const appointmentTimes = [
  "Anytime works",
  "10:30 am", "11:00 am", "11:30 am", "12:00 pm", "12:30 pm",
  "1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm", "3:00 pm", "3:30 pm",
  "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm", "6:00 pm", "6:30 pm",
  "7:00 pm", "7:30 pm", "8:00 pm", "8:30 pm",
];
const providers = ["Any available stylist", "Senior stylist", "Beauty specialist", "Creative team — choose for me"];
const storeCategories = ["All products", "Hair care", "Skin care"];
const whatsappHref = "https://wa.me/919222631384";
const mapsHref = "https://www.google.com/maps/search/?api=1&query=The+Creative+Hair+Solutions+Unisex+Salon+Ulhasnagar";

const images = {
  hero: "/manus-storage/creative-hero_a74c00da.jpg",
  detail: "/manus-storage/creative-detail_c5c422ac.jpg",
  styling: "/manus-storage/creative-styling_a4cabbe1.jpg",
  interior: "/manus-storage/creative-interior_920f61c1.jpg",
};

const services = [
  { name: "Hair wash & haircut", description: "A considered cut, wash and signature finish shaped around you.", price: "from ₹300", tag: "Most loved", category: "Hair" },
  { name: "Advance colour & balayage", description: "Dimensional L’Oréal or Schwarzkopf colour with soft grow-out and a luminous, natural feel.", price: "from ₹3,000", tag: "Colour", category: "Colour" },
  { name: "Blowdry & hair styling", description: "Glossy volume, movement and a finish that holds its shape.", price: "from ₹300", tag: "45 min", category: "Hair" },
  { name: "Keratin, smoothening & rebonding", description: "Smoother, more manageable hair with a treatment plan built around length and texture.", price: "from ₹1,800", tag: "By consult", category: "Occasion" },
  { name: "Manicure, pedicure & nail art", description: "A calm, careful reset from a regular mani-pedi to gel polish and extensions.", price: "from ₹500", tag: "Care", category: "Care" },
  { name: "Threading, waxing & makeup", description: "Finishing touches, occasion-ready makeup and bridal beauty under one roof.", price: "from ₹30", tag: "Beauty", category: "Care" },
];

const reviews = [
  { quote: "The whole setup is very hygienic and has a relaxing vibe.", name: "Riya M.", meta: "Google review" },
  { quote: "The staff is friendly, making the whole thing a great experience.", name: "Sonal K.", meta: "Google review" },
  { quote: "This place really knows how to give a good haircut.", name: "Amol P.", meta: "Google review" },
];

const categories = ["All", "Hair", "Colour", "Occasion", "Care"];

const menuCategories = [
  { name: "Hair & styling", description: "Cuts, wash, finish and everyday styling", icon: Scissors, items: [
    { name: "Women’s hair wash & haircut", detail: "Consultation, wash, cut and finish", price: "₹700", duration: "60 min" },
    { name: "Men’s hair wash & haircut", detail: "Clean cut, wash and styled finish", price: "₹300", duration: "45 min" },
    { name: "Hair wash regular", detail: "A clean refresh before your cut or styling", price: "₹100", duration: "20 min" },
    { name: "Hair trimming", detail: "A clean refresh without changing your length", price: "₹300–₹500", duration: "30 min" },
    { name: "Hair blowdry", detail: "Smooth, glossy volume and movement", price: "₹300", duration: "30 min" },
    { name: "Hair wash with blowdry", detail: "Wash, dry and polished finish", price: "₹400", duration: "45 min" },
    { name: "Hair style", detail: "Everyday and occasion styling by length", price: "₹500–₹900", duration: "45–90 min" },
    { name: "Haircut for boys under 10", detail: "A comfortable cut for younger guests", price: "₹200", duration: "30 min" },
  ]},
  { name: "Men’s grooming", description: "Hair, beard, massage and everyday polish", icon: UserRound, items: [
    { name: "Beard clean shave", detail: "A close, comfortable finish", price: "₹120", duration: "20 min" },
    { name: "Beard style", detail: "Defined shape and considered lines", price: "₹150", duration: "30 min" },
    { name: "Moustache colour", detail: "Natural coverage and a sharper finish", price: "₹100", duration: "30 min" },
    { name: "Beard colour", detail: "Natural coverage and a sharper finish", price: "₹300", duration: "45 min" },
    { name: "Men’s hair colour", detail: "Natural coverage or a new direction", price: "₹800", duration: "90 min" },
    { name: "Head massage with oil", detail: "Relaxing oil massage, no steam", price: "₹250–₹300", duration: "30 min" },
    { name: "Head massage with oil & steam", detail: "Oil massage with a warm steam finish", price: "₹350–₹600", duration: "30 min" },
    { name: "Aroma oil & steam", detail: "A longer restorative scalp ritual", price: "₹450–₹700", duration: "60 min" },
  ]},
  { name: "Hair colour", description: "Global colour, highlights, roots and balayage", icon: Sparkles, items: [
    { name: "Root touch-up 1 inch", detail: "L’Oréal / Schwarzkopf", price: "₹1,200", duration: "90 min" },
    { name: "Root touch-up 2 inch", detail: "L’Oréal / Schwarzkopf", price: "₹1,500", duration: "90 min" },
    { name: "Root touch-up Inoa 1 inch", detail: "Ammonia-free root colour", price: "₹1,500", duration: "90 min" },
    { name: "Root touch-up Inoa 2 inch", detail: "Ammonia-free root colour", price: "₹1,700", duration: "90 min" },
    { name: "Global colour by length", detail: "Basic L’Oréal / Schwarzkopf", price: "₹2,000–₹4,500", duration: "120–180 min" },
    { name: "Global ammonia-free colour", detail: "Ammonia-free colour by length", price: "₹2,500–₹6,000", duration: "120–180 min" },
    { name: "Highlights by length", detail: "Light-catching accents placed for you", price: "₹3,000–₹6,000", duration: "150–240 min" },
    { name: "Balayage by length", detail: "Dimensional colour with soft grow-out", price: "₹3,500–₹7,000", duration: "180–240 min" },
    { name: "Fashion streak", detail: "A statement accent or softer pop of colour", price: "₹200", duration: "60 min" },
  ]},
  { name: "Hair treatments", description: "Keratin, smoothening, spa and scalp care", icon: Sparkles, items: [
    { name: "Loreal hair spa", detail: "Nourishing care for dry or stressed hair", price: "₹500", duration: "60 min" },
    { name: "Olaplex hair treatment", detail: "Bond-building care for fragile hair", price: "₹1,600", duration: "90 min" },
    { name: "Smoothening by length", detail: "Extra charges apply for long and thick hair", price: "₹1,500–₹7,000", duration: "180–300 min" },
    { name: "Straightening by length", detail: "A sleek polished finish", price: "₹2,000–₹8,000", duration: "180–300 min" },
    { name: "Rebonding by length", detail: "Straightening with structured finish", price: "₹2,500–₹9,000", duration: "180–300 min" },
    { name: "Keratin / Botox treatment", detail: "Fringe to below-waist price range", price: "₹1,000–₹10,500", duration: "180–360 min" },
    { name: "Dandruff treatment", detail: "Targeted scalp and hair-care ritual", price: "₹1,000–₹2,000", duration: "75 min" },
    { name: "Hair fall treatment", detail: "Scalp-focused care for weakened hair", price: "₹1,500", duration: "75 min" },
    { name: "Metal DX treatment", detail: "Professional colour-protection care", price: "₹2,200", duration: "90 min" },
    { name: "Luxury hair spa", detail: "Deep restorative nourishment", price: "₹2,500", duration: "90 min" },
    { name: "Absolut Repair Molecular", detail: "Advanced repair for damaged lengths", price: "₹3,000", duration: "90 min" },
  ]},
  { name: "Skin & beauty", description: "Threading, waxing, facials, clean-ups and bleach", icon: Star, items: [
    { name: "Threading", detail: "Forehead, chin, lips, side locks, brows or full face", price: "₹30–₹200", duration: "15–30 min" },
    { name: "Rica wax", detail: "Under arms, arms, legs, back, front or full body", price: "₹150–₹2,800", duration: "30–90 min" },
    { name: "Brazilian wax", detail: "Chin, upper lip, side lock, bikini and full bikini", price: "₹150–₹2,000", duration: "30–90 min" },
    { name: "Facials", detail: "Regular through Shahnaz Gold", price: "₹1,500–₹5,000", duration: "60–120 min" },
    { name: "Hydra facial", detail: "Hydration-focused professional facial", price: "₹2,500", duration: "75 min" },
    { name: "Korean Hydra facial", detail: "Advanced glass-skin inspired treatment", price: "₹3,500", duration: "90 min" },
    { name: "Clean up", detail: "Regular, Nature, Ozone, Hydra, Richfeel or D-Tan", price: "₹700–₹1,000", duration: "45–60 min" },
    { name: "D-Tan mask", detail: "Face, arms, legs, back, front or full body", price: "₹250–₹2,800", duration: "30–75 min" },
    { name: "Bleach", detail: "Face, neck, arms, legs, back, front or full body", price: "₹500–₹2,500", duration: "30–75 min" },
    { name: "Body polishing", detail: "Full arms, front/back, legs or full body", price: "₹1,500–₹3,500", duration: "60–120 min" },
  ]},
  { name: "Manicure, pedicure & nails", description: "Hands, feet and polished finishing details", icon: Star, items: [
    { name: "Nail cut & file", detail: "A clean, neat finish", price: "₹100", duration: "15 min" },
    { name: "Foot massage", detail: "Relaxing foot reset", price: "₹300", duration: "30 min" },
    { name: "Pedicure", detail: "Regular, Aroma, D-Tan, Crystal or Spa", price: "₹600–₹1,400", duration: "45–75 min" },
    { name: "Manicure", detail: "Regular, Aroma, D-Tan, Crystal or Spa", price: "₹500–₹1,200", duration: "45–75 min" },
    { name: "Toe polish", detail: "Polished colour finish", price: "₹400", duration: "30 min" },
    { name: "Gel polish", detail: "Long-wear gel colour", price: "₹500", duration: "45 min" },
    { name: "Temporary extension", detail: "Instant length and shape", price: "₹700", duration: "60 min" },
    { name: "Gel overlays", detail: "Strength and shine over natural nails", price: "₹800", duration: "60 min" },
  ]},
  { name: "Massage & relaxation", description: "Body massage and restorative rituals", icon: CalendarDays, items: [
    { name: "Body massage 40 minutes", detail: "Coconut oil or cream", price: "₹1,600–₹1,700", duration: "40 min" },
    { name: "Body massage 60 minutes", detail: "Coconut oil or cream", price: "₹2,200–₹2,300", duration: "60 min" },
    { name: "Body massage 90 minutes", detail: "Coconut oil or cream", price: "₹2,800–₹2,900", duration: "90 min" },
  ]},
  { name: "Makeup & packages", description: "Party, bridal, groom and complete occasion packages", icon: CalendarDays, items: [
    { name: "Party makeup", detail: "Polished beauty for your big plans", price: "₹1,500–₹2,000", duration: "90 min" },
    { name: "Bridal makeup", detail: "A complete bridal look, planned around you", price: "₹10,000", duration: "180 min" },
    { name: "Pre-groom package", detail: "Hair, keratin spa, colour, shave, bleach, facial, polishing, mani-pedi and makeup", price: "₹300–₹6,000 per service", duration: "By plan" },
    { name: "Pre-bridal package", detail: "Hair, keratin spa, bleach, facial, waxing, polishing, mani-pedi, highlights, makeup and nail art", price: "₹600–₹17,000 per service", duration: "By plan" },
    { name: "Shahnaz Gold facial", detail: "Premium occasion facial", price: "₹5,000", duration: "120 min" },
    { name: "Nail art", detail: "Toe polish, removal, gel, extensions and overlays", price: "₹400–₹800", duration: "30–90 min" },
  ]},
];

const storeItems = [
  { name: "Absolut Repair Shampoo", brand: "L’Oréal Professionnel", description: "Repair-focused cleansing for dry, damaged hair.", price: 1250, tag: "Repair", category: "Hair care" },
  { name: "Vitamino Color Conditioner", brand: "L’Oréal Professionnel", description: "Colour care that keeps hair soft, glossy and vibrant.", price: 1350, tag: "Colour care", category: "Hair care" },
  { name: "Fibre Clinix Hair Mask", brand: "Schwarzkopf Professional", description: "A deep weekly ritual for stronger-looking hair.", price: 1650, tag: "Best seller", category: "Hair care" },
  { name: "Professional Smoothening Serum", brand: "The Creative edit", description: "A lightweight finishing serum for shine and frizz control.", price: 899, tag: "Finishing", category: "Hair care" },
  { name: "Hair Spa Repair Kit", brand: "The Creative edit", description: "A complete at-home care ritual between salon visits.", price: 1499, tag: "Ritual", category: "Hair care" },
  { name: "Texture & Volume Mist", brand: "Schwarzkopf Professional", description: "Soft hold, touchable texture and effortless volume.", price: 799, tag: "Styling", category: "Hair care" },
  { name: "Hydrating Facial Care Kit", brand: "The Creative edit", description: "A gentle at-home reset for a calm, fresh-looking glow.", price: 950, tag: "Skin care", category: "Skin care" },
];

function LogoMark() {
  return (
    <div className="logo-mark" aria-hidden="true">
      <Scissors size={19} strokeWidth={1.6} />
    </div>
  );
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`eyebrow ${light ? "eyebrow-light" : ""}`}>
      <span className="eyebrow-line" />
      <span>{children}</span>
    </div>
  );
}

export default function Home() {
  const bookingRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenuCategory, setOpenMenuCategory] = useState<string | null>(null);
  const [menuGender, setMenuGender] = useState<"women" | "men">("women");
  const [activeCategory, setActiveCategory] = useState("All");
  const [submitted, setSubmitted] = useState(false);
  const [submittedWhatsAppHref, setSubmittedWhatsAppHref] = useState(whatsappHref);
  const [selectedService, setSelectedService] = useState("Precision cut & finish");
  const [selectedServices, setSelectedServices] = useState(["Precision cut & finish"]);
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [bookingBranch, setBookingBranch] = useState<"ulhasnagar" | "badlapur">("ulhasnagar");
  const [cartCount, setCartCount] = useState(0);
  const [storeFilter, setStoreFilter] = useState("All products");
  const [storeQuery, setStoreQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const createPublicAppointment = trpc.publicBooking.create.useMutation();

  const filteredStoreItems = useMemo(() => storeItems.filter((product) => {
    const matchesFilter = storeFilter === "All products" || product.category === storeFilter;
    const query = storeQuery.trim().toLowerCase();
    return matchesFilter && (!query || `${product.name} ${product.brand}`.toLowerCase().includes(query));
  }), [storeFilter, storeQuery]);

  const filteredServices = useMemo(
    () => activeCategory === "All" ? services : services.filter((service) => service.category === activeCategory),
    [activeCategory],
  );

  const visibleMenuCategories = useMemo(() => {
    const menCategories = new Set(["Hair & styling", "Men’s grooming", "Hair colour", "Hair treatments", "Manicure, pedicure & nails", "Massage & relaxation"]);
    return menuCategories.filter((category) => menuGender === "men" ? menCategories.has(category.name) : category.name !== "Men’s grooming");
  }, [menuGender]);

  const scrollToBooking = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const openFullMenu = () => {
    setMenuOpen(true);
    setMobileOpen(false);
    window.setTimeout(() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  const openGenderMenu = (gender: "women" | "men") => {
    setMenuGender(gender);
    setMenuOpen(true);
    setOpenMenuCategory(null);
    window.setTimeout(() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  const selectBookingService = (serviceName: string) => {
    setSelectedService(serviceName);
    setSelectedServices((current) => current.includes(serviceName) ? current : [...current, serviceName]);
    scrollToBooking(serviceName);
  };

  const openMenuForService = (serviceName: string) => {
    const category = menuCategories.find((item) => item.items.some((service) => service.name === serviceName));
    setMenuOpen(true);
    setOpenMenuCategory(category?.name ?? null);
    setSelectedService(serviceName);
    setSelectedServices((current) => current.includes(serviceName) ? current : [...current, serviceName]);
    window.setTimeout(() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  const toggleWishlist = (productName: string) => {
    setWishlist((current) => current.includes(productName) ? current.filter((name) => name !== productName) : [...current, productName]);
  };

  const addToBag = (productName: string) => {
    setCartCount((count) => count + 1);
    toast.success("Added to your salon bag", { description: productName });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const customerName = String(form.get("name") || "");
    const customerPhone = String(form.get("phone") || "");
    const service = String(form.get("service") || selectedService);
    const date = String(form.get("date") || "");
    const time = String(form.get("time") || "Anytime works");
    const note = String(form.get("note") || "");
    createPublicAppointment.mutate({ customerName, phone: customerPhone, branch: bookingBranch, service: `${service} · ${selectedProvider}`, appointmentAt: new Date(`${date} ${time === "Anytime works" ? "10:30 am" : time}`), notes: note });
    const message = `Hello The Creative Hair Solutions, I would like to book an appointment.%0A%0AName: ${encodeURIComponent(customerName)}%0APhone: ${encodeURIComponent(customerPhone)}%0AService: ${encodeURIComponent(service)}%0ADate: ${encodeURIComponent(date)}%0ATime: ${encodeURIComponent(time)}%0ANote: ${encodeURIComponent(note || "None")}`;
    const nextWhatsAppHref = `${whatsappHref}?text=${message}`;
    setSubmittedWhatsAppHref(nextWhatsAppHref);
    setSubmitted(true);
    window.open(nextWhatsAppHref, "_blank", "noopener,noreferrer");
    toast.success("Your request is ready to send", {
      description: "We’ll confirm your preferred slot over WhatsApp shortly.",
    });
  };

  return (
    <div className="salon-site">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="The Creative Hair Solutions home">
          <span className="logo-monogram" aria-hidden="true">CHS</span>
          <span className="brand-copy">
            <strong>THE CREATIVE</strong>
            <span>Hair Solutions · Family Salon</span>
          </span>
        </a>
        <nav className={`main-nav ${mobileOpen ? "main-nav-open" : ""}`} aria-label="Main navigation">
          <a href="#services" onClick={() => setMobileOpen(false)}>Services</a>
          <button className="nav-text-button" onClick={openFullMenu}>Full menu</button>
          <a href="#reviews" onClick={() => setMobileOpen(false)}>Reviews</a>
          <a href="#visit" onClick={() => setMobileOpen(false)}>Visit us</a>
          <a href="/store"><ShoppingBag size={14} /> Store</a>
          <a href="https://www.instagram.com/thecreativesalondombivli/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={15} /></a>
        </nav>
        <details className="more-menu"><summary aria-label="More options"><MoreHorizontal size={22} /></summary><div className="more-menu-popover"><a href="/staff">Staff login</a><a href="/admin">Admin login</a><a href="#reviews">Reviews</a><a href="#visit">Contact & location</a></div></details>
        <button className="mobile-toggle" onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        <section className="luxury-hero">
          <div className="luxury-hero-image"><img src={images.hero} alt="Luxury hair styling at The Creative Hair Solutions" /><div className="luxury-hero-shade" /></div>
          <div className="luxury-hero-content section-shell">
            <div className="luxury-hero-topline"><span>THE CREATIVE</span><span>HAIR SOLUTIONS · FAMILY SALON</span></div>
            <div className="luxury-hero-copy"><SectionLabel light>Salon & beauty</SectionLabel><h1>Where beauty<br /><em>meets craft.</em></h1><p>Premium hair, beauty and grooming experiences, crafted around you.</p></div>
          <section className="first-page-actions hero-action-dock" aria-label="Quick salon actions"><div className="section-shell action-grid"><button onClick={() => scrollToBooking()}><span className="action-icon"><CalendarDays size={20} /></span><span><b>Appointment</b><small>Reserve your time</small></span><ArrowRight size={16} /></button><button onClick={openFullMenu}><span className="action-icon"><Scissors size={20} /></span><span><b>See the menu</b><small>Browse every service</small></span><ArrowRight size={16} /></button><a href={`tel:${phone.replace(/\s/g, "")}`}><span className="action-icon"><Phone size={20} /></span><span><b>Call the salon</b><small>{phone}</small></span><ArrowRight size={16} /></a><a href="#visit"><span className="action-icon"><MapPin size={20} /></span><span><b>Locate us</b><small>Ulhasnagar, Maharashtra</small></span><ArrowRight size={16} /></a><button onClick={openFullMenu}><span className="action-icon"><Sparkles size={20} /></span><span><b>Full packages</b><small>Hair · beauty · care</small></span><ArrowRight size={16} /></button></div></section>
          </div>
        </section>

        <section className="ticker" aria-label="Salon services">
          <div className="ticker-track"><span>Cut · Colour · Care</span><i>✳</i><span>Modern beauty, made personal</span><i>✳</i><span>Cut · Colour · Care</span><i>✳</i><span>Modern beauty, made personal</span></div>
        </section>

        <section className="services-section section-shell" id="services">
          <div className="section-topline"><div><SectionLabel>Signature services</SectionLabel><h2>Come for the<br /><em>feeling.</em> Stay for the hair.</h2><div className="gender-menu-switch" aria-label="Choose a menu"><span>View menu for</span><button className={menuGender === "women" ? "gender-active" : ""} onClick={() => openGenderMenu("women")}>Women</button><button className={menuGender === "men" ? "gender-active" : ""} onClick={() => openGenderMenu("men")}>Men</button></div></div><p className="section-aside">Choose Women or Men to see the right menu headings. Open any heading to reveal every service, price range and duration.</p></div>
          <div className="service-filters" role="tablist" aria-label="Filter services">{categories.map((category) => <button key={category} className={activeCategory === category ? "filter-active" : ""} onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category}>{category}</button>)}</div>
          <div className="service-grid">{filteredServices.map((service) => <article className="service-card" key={service.name} onClick={() => openMenuForService(service.name)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openMenuForService(service.name); }} role="button" tabIndex={0}><div className="service-card-top"><span className="service-tag">{service.tag}</span><span className="service-price">{service.price}</span></div><h3>{service.name}</h3><p>{service.description}</p><button className="service-arrow" onClick={(event) => { event.stopPropagation(); openMenuForService(service.name); }} aria-label={`View ${service.name} in the full menu`}><ArrowRight size={18} /></button></article>)}</div>
          <div className="service-footer"><span>Not sure what you need?</span><button className="outline-button" onClick={() => scrollToBooking()}> <ArrowRight size={16} /></button></div>
        </section>

        {menuOpen && <section className="menu-timeline" id="menu"><div className="section-shell menu-heading"><div><SectionLabel>Our complete menu</SectionLabel><h2>Choose your<br /><em>experience.</em></h2></div><div className="menu-heading-side"><p>Choose a category to see every service, exact starting price, estimated duration, and add it to your appointment request.</p><button className="menu-close" onClick={() => { setMenuOpen(false); setOpenMenuCategory(null); }}>Close menu <X size={15} /></button></div></div><div className="menu-category-grid">{visibleMenuCategories.map((category) => { const Icon = category.icon; const isOpen = openMenuCategory === category.name; return <div className={`menu-category ${isOpen ? "menu-category-open" : ""}`} key={category.name}><button className="menu-category-trigger" onClick={() => setOpenMenuCategory(isOpen ? null : category.name)} aria-expanded={isOpen}><span className="menu-category-icon"><Icon size={20} /></span><span><b>{category.name}</b><small>{category.description} · {category.items.length} services</small></span><ChevronDown size={18} /></button>{isOpen && <div className="menu-subtypes">{category.items.map((item) => <div className="menu-subtype" key={item.name}><div><b>{item.name}</b><small>{item.detail}</small><span className="menu-duration"><Clock3 size={12} /> {item.duration}</span></div><strong>{item.price}</strong><button onClick={() => selectBookingService(item.name)} aria-label={`Select ${item.name}`}><span>Select</span><ArrowRight size={14} /></button></div>)}</div>}</div>; })}</div></section>}

        <section className="booking-section section-shell" ref={bookingRef} id="booking">
          <div className="booking-intro"><SectionLabel>Make it yours</SectionLabel><h2>Ready when<br /><em>you are.</em></h2><p>Tell us what you’re thinking and we’ll help shape the rest. Requests are confirmed personally over WhatsApp.</p><div className="booking-contact"><a href={`tel:${phone.replace(/\s/g, "")}`}><Phone size={16} /> {phone}</a><a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat on WhatsApp</a></div></div>
          <div className="booking-card">{submitted ? <div className="booking-success"><div className="success-icon"><Check size={24} /></div><SectionLabel>Request received</SectionLabel><h3>We’ll take it from here.</h3><p>Your preferred appointment details are ready. WhatsApp opened with your booking details. Tap below if you need to reopen it.</p><a className="button button-dark" href={submittedWhatsAppHref} target="_blank" rel="noreferrer">Continue on WhatsApp <ArrowRight size={17} /></a><button className="reset-link" onClick={() => setSubmitted(false)}>Edit request</button></div> : <form onSubmit={handleSubmit}><div className="form-heading"><span>01</span><div><h3>Build your appointment.</h3><p>Choose your service, stylist, date and time. We’ll confirm on WhatsApp.</p></div></div><div className="selected-services-panel"><span>Selected services</span><div>{selectedServices.map((serviceName) => <button type="button" key={serviceName} onClick={() => setSelectedService(serviceName)}>{serviceName} <X size={12} /></button>)}</div></div><label>Your name<input required name="name" placeholder="e.g. Ananya" /></label><div className="form-row"><label>Phone number<input required name="phone" type="tel" placeholder="98765 43210" /></label><label>Service<select name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)}>{["Precision cut & finish", ...menuCategories.flatMap((category) => category.items.map((item) => item.name))].map((serviceName) => <option key={serviceName}>{serviceName}</option>)}</select></label></div><div className="form-row"><label>Preferred stylist<select name="provider" value={selectedProvider} onChange={(event) => setSelectedProvider(event.target.value)}>{providers.map((provider) => <option key={provider}>{provider}</option>)}</select></label><label>Preferred date<input required name="date" type="date" /></label></div><label>Preferred branch<select value={bookingBranch} onChange={(event) => setBookingBranch(event.target.value as "ulhasnagar" | "badlapur")}><option value="ulhasnagar">Ulhasnagar</option><option value="badlapur">Badlapur</option></select></label><label>Preferred time<select name="time" defaultValue="Anytime works">{appointmentTimes.map((time) => <option key={time}>{time}</option>)}</select></label><label>Anything we should know? <span className="optional">Optional</span><textarea name="note" placeholder="Tell us about your hair, an event, or a look you love…" rows={3} /></label><button className="button button-copper form-submit" type="submit">Request an appointment <ArrowRight size={17} /></button><p className="form-note"><Clock3 size={14} /> Usually replies within 30 minutes during open hours.</p></form>}</div>
        </section>

        <section className="review-section" id="reviews">
          <div className="section-shell review-inner"><div className="review-heading"><SectionLabel light>Kind words</SectionLabel><h2>Feels good.<br /><em>Looks good.</em></h2><div className="review-score"><strong>4.6</strong><div><div className="stars"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div><span>148 Google reviews</span></div></div></div><div className="review-list">{reviews.map((review) => <blockquote key={review.name}><div className="quote-mark">“</div><p>{review.quote}</p><footer><span className="review-avatar">{review.name.charAt(0)}</span><span><b>{review.name}</b><small>{review.meta}</small></span><Check size={16} /></footer></blockquote>)}</div></div>
        </section>



        <section className="visit-section" id="visit"><div className="section-shell visit-grid"><div className="map-panel"><div className="clean-map" aria-label="Stylized map showing the salon location"><div className="map-block map-block-a" /><div className="map-block map-block-b" /><div className="map-block map-block-c" /><svg className="map-roads" viewBox="0 0 800 640" aria-hidden="true"><path d="M-40 170 C150 130 230 255 382 208 S620 98 840 142" /><path d="M-60 435 C130 382 210 505 350 445 S610 320 860 375" /><path d="M260 -30 C295 145 228 250 332 380 S438 560 458 690" /><path d="M622 -40 C558 110 626 228 530 340 S525 530 620 680" /><path className="map-road-major" d="M-45 304 C120 270 270 318 416 300 S665 270 845 292" /></svg><div className="map-label map-label-1">Ulhasnagar</div><div className="map-label map-label-2">Sai Mannat</div><div className="map-label map-label-3">Jai Baba Dham</div><div className="map-label map-label-4">near Talwalkars</div><div className="map-location"><span className="map-location-pulse" /><span className="map-pin"><MapPin size={18} fill="currentColor" /></span><div><strong>The Creative</strong><small>Hair Solutions</small></div></div><div className="map-scale"><span /> 200 m</div></div><div className="map-overlay"><span><MapPin size={15} /> You’re close</span><a href={mapsHref} target="_blank" rel="noreferrer">Get directions <ArrowRight size={15} /></a></div></div><div className="visit-copy"><SectionLabel>Find us</SectionLabel><h2>Drop in for<br /><em>good hair.</em></h2><p>Shop No. 1, Bismillah Juice Center, Sai Mannat, Gym, besides, opposite Jai Baba Dham, near Talwalkars, Ulhasnagar, Maharashtra 421002</p><div className="hours"><div><span>Monday — Sunday</span><strong>10:30 am — 8:30 pm</strong></div><div><span>Walk-ins</span><strong>Welcome when available</strong></div></div><a className="button button-dark" href={mapsHref} target="_blank" rel="noreferrer">Open in Google Maps <MapPin size={16} /></a></div></div></section>
      </main>

      <footer className="site-footer"><div className="section-shell footer-top"><a className="brand footer-brand" href="#top"><LogoMark /><span className="brand-copy"><strong>THE CREATIVE</strong><span>Hair Solutions · Family Salon</span></span></a><p>Modern beauty, made personal.<br />Ulhasnagar, Maharashtra.</p><div className="footer-links"><a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><Instagram size={16} /> Instagram</a><a href={`tel:${phone.replace(/\s/g, "")}`}><Phone size={16} /> Call us</a></div></div><div className="section-shell footer-bottom"><span>© 2025 The Creative Hair Solutions</span><span>Made for your everyday wow <Sparkles size={13} /></span></div></footer>
      <a className="floating-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle size={22} /></a>
    </div>
  );
}
