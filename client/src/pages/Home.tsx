import { FormEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
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
  { name: "Hair", description: "Cuts, styling and treatments", icon: Scissors, items: [
    { name: "Hair wash & haircut", detail: "Consultation, wash, cut and finish", price: "from ₹300" },
    { name: "Blowdry & hair styling", detail: "Volume, movement and polished finish", price: "from ₹300" },
    { name: "Keratin, smoothening & rebonding", detail: "Smoother, more manageable hair", price: "from ₹1,800" },
    { name: "Hair spa & repair", detail: "Nourishing care for dry or stressed hair", price: "from ₹700" },
  ]},
  { name: "Colour", description: "Balayage, highlights and shine", icon: Sparkles, items: [
    { name: "Advance colour & balayage", detail: "Dimensional colour with soft grow-out", price: "from ₹3,000" },
    { name: "Global hair colour", detail: "A rich, even colour refresh", price: "from ₹1,500" },
    { name: "Highlights & fashion colour", detail: "Light-catching accents made for you", price: "by consultation" },
  ]},
  { name: "Beauty", description: "Skin, nails, waxing and care", icon: Star, items: [
    { name: "Threading & face cleanup", detail: "Brows, upper lip and finishing care", price: "from ₹30" },
    { name: "Body waxing", detail: "Comfortable, careful hair removal", price: "from ₹250" },
    { name: "Acne treatments & facials", detail: "Skin-focused care for a clearer glow", price: "from ₹600" },
    { name: "Manicure, pedicure & nail art", detail: "Hands and feet finished with care", price: "from ₹500" },
  ]},
  { name: "Occasion", description: "Makeup, bridal and special looks", icon: CalendarDays, items: [
    { name: "Bridal makeup", detail: "A complete, camera-ready bridal look", price: "by consultation" },
    { name: "Party & occasion makeup", detail: "Polished beauty for your big plans", price: "from ₹2,000" },
    { name: "Occasion hair styling", detail: "Updos, waves and statement finishes", price: "from ₹800" },
  ]},
  { name: "Men's grooming", description: "Hair, beard and everyday polish", icon: UserRound, items: [
    { name: "Men's haircut & styling", detail: "A clean cut shaped around your routine", price: "from ₹250" },
    { name: "Beard trim & styling", detail: "Defined lines and a considered finish", price: "from ₹150" },
    { name: "Men's hair colour", detail: "Natural coverage or a new direction", price: "from ₹800" },
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState("Precision cut & finish");
  const [selectedServices, setSelectedServices] = useState(["Precision cut & finish"]);
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [cartCount, setCartCount] = useState(0);
  const [storeFilter, setStoreFilter] = useState("All products");
  const [storeQuery, setStoreQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const filteredStoreItems = useMemo(() => storeItems.filter((product) => {
    const matchesFilter = storeFilter === "All products" || product.category === storeFilter;
    const query = storeQuery.trim().toLowerCase();
    return matchesFilter && (!query || `${product.name} ${product.brand}`.toLowerCase().includes(query));
  }), [storeFilter, storeQuery]);

  const filteredServices = useMemo(
    () => activeCategory === "All" ? services : services.filter((service) => service.category === activeCategory),
    [activeCategory],
  );

  const scrollToBooking = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const selectBookingService = (serviceName: string) => {
    setSelectedService(serviceName);
    setSelectedServices((current) => current.includes(serviceName) ? current : [...current, serviceName]);
    scrollToBooking(serviceName);
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
    setSubmitted(true);
    toast.success("Your request is ready to send", {
      description: "We’ll confirm your preferred slot over WhatsApp shortly.",
    });
  };

  return (
    <div className="salon-site">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="The Creative Hair Solutions home">
          <LogoMark />
          <span className="brand-copy">
            <strong>THE CREATIVE</strong>
            <span>Hair Solutions · Family Salon</span>
          </span>
        </a>
        <nav className={`main-nav ${mobileOpen ? "main-nav-open" : ""}`} aria-label="Main navigation">
          <a href="#services" onClick={() => setMobileOpen(false)}>Services</a>
          <button className="nav-text-button" onClick={() => { setMenuOpen(true); setMobileOpen(false); }}>Full menu</button>
          <a href="#reviews" onClick={() => setMobileOpen(false)}>Reviews</a>
          <a href="#visit" onClick={() => setMobileOpen(false)}>Visit us</a>
          <a href="/store"><ShoppingBag size={14} /> Store</a>
          <a href="https://www.instagram.com/thecreativesalondombivli/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={15} /></a>
          <button className="nav-book-mobile" onClick={() => scrollToBooking()}>Book a visit <ArrowRight size={15} /></button>
        </nav>
        <details className="more-menu"><summary aria-label="More options"><MoreHorizontal size={22} /></summary><div className="more-menu-popover"><a href="/admin">Staff login / Admin</a><a href="#reviews">Reviews</a><a href="#visit">Contact & location</a></div></details>
        <button className="header-book" onClick={() => scrollToBooking()}>Book a visit <ArrowRight size={15} /></button>
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
          </div>
        </section>

        <section className="first-page-actions" aria-label="Quick salon actions"><div className="section-shell action-grid"><button onClick={() => scrollToBooking()}><span className="action-icon"><CalendarDays size={20} /></span><span><b>Appointment</b><small>Reserve your time</small></span><ArrowRight size={16} /></button><button onClick={() => setMenuOpen(true)}><span className="action-icon"><Scissors size={20} /></span><span><b>See the menu</b><small>Browse every service</small></span><ArrowRight size={16} /></button><a href={`tel:${phone.replace(/\s/g, "")}`}><span className="action-icon"><Phone size={20} /></span><span><b>Call the salon</b><small>{phone}</small></span><ArrowRight size={16} /></a><a href="#visit"><span className="action-icon"><MapPin size={20} /></span><span><b>Locate us</b><small>Ulhasnagar, Maharashtra</small></span><ArrowRight size={16} /></a><a href="#services"><span className="action-icon"><Sparkles size={20} /></span><span><b>Full packages</b><small>Hair · beauty · care</small></span><ArrowRight size={16} /></a></div></section>

        <section className="ticker" aria-label="Salon services">
          <div className="ticker-track"><span>Cut · Colour · Care</span><i>✳</i><span>Modern beauty, made personal</span><i>✳</i><span>Cut · Colour · Care</span><i>✳</i><span>Modern beauty, made personal</span></div>
        </section>

        <section className="services-section section-shell" id="services">
          <div className="section-topline"><div><SectionLabel>Signature services</SectionLabel><h2>Come for the<br /><em>feeling.</em> Stay for the hair.</h2></div><p className="section-aside">A considered edit of the things we do best, with room for a little magic in between.</p></div>
          <div className="service-filters" role="tablist" aria-label="Filter services">{categories.map((category) => <button key={category} className={activeCategory === category ? "filter-active" : ""} onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category}>{category}</button>)}</div>
          <div className="service-grid">{filteredServices.map((service) => <article className="service-card" key={service.name}><div className="service-card-top"><span className="service-tag">{service.tag}</span><span className="service-price">{service.price}</span></div><h3>{service.name}</h3><p>{service.description}</p><button className="service-arrow" onClick={() => selectBookingService(service.name)} aria-label={`Book ${service.name}`}><ArrowRight size={18} /></button></article>)}</div>
          <div className="service-footer"><span>Not sure what you need?</span><button className="outline-button" onClick={() => scrollToBooking()}> <ArrowRight size={16} /></button></div>
        </section>

        {menuOpen && <section className="menu-timeline" id="menu"><div className="section-shell menu-heading"><div><SectionLabel>Our complete menu</SectionLabel><h2>Choose your<br /><em>experience.</em></h2></div><div className="menu-heading-side"><p>Start with a main service type. Click any category to reveal its subtypes, details and starting prices.</p><button className="menu-close" onClick={() => { setMenuOpen(false); setOpenMenuCategory(null); }}>Close menu <X size={15} /></button></div></div><div className="menu-category-grid">{menuCategories.map((category) => { const Icon = category.icon; const isOpen = openMenuCategory === category.name; return <div className={`menu-category ${isOpen ? "menu-category-open" : ""}`} key={category.name}><button className="menu-category-trigger" onClick={() => setOpenMenuCategory(isOpen ? null : category.name)} aria-expanded={isOpen}><span className="menu-category-icon"><Icon size={20} /></span><span><b>{category.name}</b><small>{category.description}</small></span><ChevronDown size={18} /></button>{isOpen && <div className="menu-subtypes">{category.items.map((item) => <div className="menu-subtype" key={item.name}><div><b>{item.name}</b><small>{item.detail}</small></div><span>{item.price}</span><button onClick={() => selectBookingService(item.name)} aria-label={`Book ${item.name}`}><ArrowRight size={16} /></button></div>)}</div>}</div>; })}</div></section>}

        <section className="booking-section section-shell" ref={bookingRef} id="booking">
          <div className="booking-intro"><SectionLabel>Make it yours</SectionLabel><h2>Ready when<br /><em>you are.</em></h2><p>Tell us what you’re thinking and we’ll help shape the rest. Requests are confirmed personally over WhatsApp.</p><div className="booking-contact"><a href={`tel:${phone.replace(/\s/g, "")}`}><Phone size={16} /> {phone}</a><a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat on WhatsApp</a></div></div>
          <div className="booking-card">{submitted ? <div className="booking-success"><div className="success-icon"><Check size={24} /></div><SectionLabel>Request received</SectionLabel><h3>We’ll take it from here.</h3><p>Your preferred appointment details are ready. Tap below to send them directly to our team on WhatsApp.</p><a className="button button-dark" href={whatsappHref} target="_blank" rel="noreferrer">Continue on WhatsApp <ArrowRight size={17} /></a><button className="reset-link" onClick={() => setSubmitted(false)}>Edit request</button></div> : <form onSubmit={handleSubmit}><div className="form-heading"><span>01</span><div><h3>Build your appointment.</h3><p>Choose your service, stylist, date and time. We’ll confirm on WhatsApp.</p></div></div><div className="selected-services-panel"><span>Selected services</span><div>{selectedServices.map((serviceName) => <button type="button" key={serviceName} onClick={() => setSelectedService(serviceName)}>{serviceName} <X size={12} /></button>)}</div></div><label>Your name<input required name="name" placeholder="e.g. Ananya" /></label><div className="form-row"><label>Phone number<input required name="phone" type="tel" placeholder="98765 43210" /></label><label>Service<select name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)}>{["Precision cut & finish", ...menuCategories.flatMap((category) => category.items.map((item) => item.name))].map((serviceName) => <option key={serviceName}>{serviceName}</option>)}</select></label></div><div className="form-row"><label>Preferred stylist<select name="provider" value={selectedProvider} onChange={(event) => setSelectedProvider(event.target.value)}>{providers.map((provider) => <option key={provider}>{provider}</option>)}</select></label><label>Preferred date<input required name="date" type="date" /></label></div><label>Preferred time<select name="time" defaultValue="Anytime works">{appointmentTimes.map((time) => <option key={time}>{time}</option>)}</select></label><label>Anything we should know? <span className="optional">Optional</span><textarea name="note" placeholder="Tell us about your hair, an event, or a look you love…" rows={3} /></label><button className="button button-copper form-submit" type="submit">Request an appointment <ArrowRight size={17} /></button><p className="form-note"><Clock3 size={14} /> Usually replies within 30 minutes during open hours.</p></form>}</div>
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
