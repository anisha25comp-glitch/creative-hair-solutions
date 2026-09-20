import { FormEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Phone,
  ShoppingBag,
  Scissors,
  Sparkles,
  Star,
  X,
} from "lucide-react";

const phone = "092226 31384";
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

const menuPages = [
  { src: "/manus-storage/menu-01_17ccbaef.jpg", label: "Welcome" },
  { src: "/manus-storage/menu-02_58d46b39.jpg", label: "Men · Styling" },
  { src: "/manus-storage/menu-03_4f021fd6.jpg", label: "Men · Care" },
  { src: "/manus-storage/menu-04_dbdc2c71.jpg", label: "Women · Hair" },
  { src: "/manus-storage/menu-05_fab615a2.jpg", label: "Women · Hair Care" },
  { src: "/manus-storage/menu-06_e91bd6b2.jpg", label: "Keratin · Smoothening" },
  { src: "/manus-storage/menu-07_0e2fa29a.jpg", label: "Colour" },
  { src: "/manus-storage/menu-08_0cca8ad2.jpg", label: "Threading · Waxing" },
  { src: "/manus-storage/menu-09_77e0427d.jpg", label: "Pedicure · Manicure" },
  { src: "/manus-storage/menu-10_83323e7c.jpg", label: "Body Care" },
  { src: "/manus-storage/menu-11_614723f2.jpg", label: "Advanced Services" },
  { src: "/manus-storage/menu-12_7155a378.jpg", label: "Finishing Touches" },
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [submitted, setSubmitted] = useState(false);

  const filteredServices = useMemo(
    () => activeCategory === "All" ? services : services.filter((service) => service.category === activeCategory),
    [activeCategory],
  );

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
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
          <a href="#services" onClick={() => setMobileOpen(false)}><ShoppingBag size={14} /> Store</a>
          <a href="https://www.instagram.com/thecreativesalondombivli/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={15} /></a>
          <button className="nav-book-mobile" onClick={scrollToBooking}>Book a visit <ArrowRight size={15} /></button>
        </nav>
        <details className="more-menu"><summary aria-label="More options"><MoreHorizontal size={22} /></summary><div className="more-menu-popover"><a href="/admin">Staff login / Admin</a><a href="#reviews">Reviews</a><a href="#visit">Contact & location</a></div></details>
        <button className="header-book" onClick={scrollToBooking}>Book a visit <ArrowRight size={15} /></button>
        <button className="mobile-toggle" onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        <section className="luxury-hero">
          <div className="luxury-hero-image"><img src={images.hero} alt="Luxury hair styling at The Creative Hair Solutions" /><div className="luxury-hero-shade" /></div>
          <div className="luxury-hero-content section-shell">
            <div className="luxury-hero-topline"><span>THE CREATIVE</span><span>HAIR SOLUTIONS · FAMILY SALON</span></div>
            <div className="luxury-hero-copy"><SectionLabel light>Salon & beauty</SectionLabel><h1>Where beauty<br /><em>meets craft.</em></h1><p>Premium hair, beauty and grooming experiences, crafted around you.</p><div className="hero-actions"><button className="button button-copper" onClick={scrollToBooking}>Book appointment <ArrowRight size={17} /></button><button className="luxury-outline-button" onClick={() => setMenuOpen(true)}>Explore services <ArrowRight size={17} /></button></div></div>
            <div className="luxury-slide-number"><strong>01</strong><span>/ 03</span><i /></div>
          </div>
        </section>

        <section className="first-page-actions" aria-label="Quick salon actions"><div className="section-shell action-grid"><button onClick={scrollToBooking}><span className="action-icon"><CalendarDays size={20} /></span><span><b>Appointment</b><small>Reserve your time</small></span><ArrowRight size={16} /></button><button onClick={() => setMenuOpen(true)}><span className="action-icon"><Scissors size={20} /></span><span><b>See the menu</b><small>Browse every service</small></span><ArrowRight size={16} /></button><a href={`tel:${phone.replace(/\s/g, "")}`}><span className="action-icon"><Phone size={20} /></span><span><b>Call the salon</b><small>{phone}</small></span><ArrowRight size={16} /></a><a href="#visit"><span className="action-icon"><MapPin size={20} /></span><span><b>Locate us</b><small>Ulhasnagar, Maharashtra</small></span><ArrowRight size={16} /></a><a href="#services"><span className="action-icon"><Sparkles size={20} /></span><span><b>Full packages</b><small>Hair · beauty · care</small></span><ArrowRight size={16} /></a></div></section>

        <section className="ticker" aria-label="Salon services">
          <div className="ticker-track"><span>Cut · Colour · Care</span><i>✳</i><span>Modern beauty, made personal</span><i>✳</i><span>Cut · Colour · Care</span><i>✳</i><span>Modern beauty, made personal</span></div>
        </section>

        <section className="intro-section section-shell" id="story">
          <div className="intro-heading"><SectionLabel>The Creative way</SectionLabel><h2>A little more<br /><em>you.</em></h2></div>
          <div className="intro-body"><p className="large-copy">We believe the best salon experience is the one that feels like it was made for you — never rushed, never one-size-fits-all.</p><p>From the first consultation to the final mirror check, our team takes the time to understand your hair, your routine and the version of yourself you want to meet today.</p><a href="#services" className="arrow-link">Explore our services <ArrowRight size={18} /></a></div>
        </section>

        <section className="services-section section-shell" id="services">
          <div className="section-topline"><div><SectionLabel>Signature services</SectionLabel><h2>Come for the<br /><em>feeling.</em> Stay for the hair.</h2></div><p className="section-aside">A considered edit of the things we do best, with room for a little magic in between.</p></div>
          <div className="service-filters" role="tablist" aria-label="Filter services">{categories.map((category) => <button key={category} className={activeCategory === category ? "filter-active" : ""} onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category}>{category}</button>)}</div>
          <div className="service-grid">{filteredServices.map((service) => <article className="service-card" key={service.name}><div className="service-card-top"><span className="service-tag">{service.tag}</span><span className="service-price">{service.price}</span></div><h3>{service.name}</h3><p>{service.description}</p><button className="service-arrow" onClick={scrollToBooking} aria-label={`Book ${service.name}`}><ArrowRight size={18} /></button></article>)}</div>
          <div className="service-footer"><span>Not sure what you need?</span><button className="outline-button" onClick={scrollToBooking}>Let’s talk it through <ArrowRight size={16} /></button></div>
        </section>

        {menuOpen && <section className="menu-timeline" id="menu"><div className="section-shell menu-heading"><div><SectionLabel>Our complete menu</SectionLabel><h2>The original<br /><em>salon menu.</em></h2></div><p>Every service, every starting price and every detail — kept exactly as shared by The Creative Hair Solutions team, with a cleaner way to browse it.</p></div><div className="menu-rail">{menuPages.map((page, index) => <a href={`#menu-page-${index + 1}`} key={page.src}><span>0{index + 1}</span>{page.label}</a>)}</div><div className="menu-pages">{menuPages.map((page, index) => <figure className="menu-page" id={`menu-page-${index + 1}`} key={page.src}><img src={page.src} alt={`${page.label} from The Creative Hair Solutions salon menu`} /><figcaption><span>Page {String(index + 1).padStart(2, "0")}</span><b>{page.label}</b></figcaption></figure>)}</div></section>}

        <section className="visual-story section-shell">
          <div className="visual-story-copy"><SectionLabel>In our chair</SectionLabel><h2>The details<br />make the <em>difference.</em></h2><p>Fresh colour. Clean lines. A little time to exhale. This is your sign to make the appointment.</p><button className="button button-dark" onClick={scrollToBooking}>Book your reset <ArrowRight size={17} /></button></div>
          <div className="visual-grid"><div className="visual-card visual-card-tall"><img src={images.detail} alt="Luminous dimensional hair colour" /><span>Colour stories</span></div><div className="visual-card"><img src={images.styling} alt="Stylist shaping a polished blowout" /><span>Everyday polish</span></div><div className="visual-card visual-card-dark"><img src={images.interior} alt="Warm, intimate salon interior" /><span>Your new favourite room</span></div></div>
        </section>

        <section className="review-section" id="reviews">
          <div className="section-shell review-inner"><div className="review-heading"><SectionLabel light>Kind words</SectionLabel><h2>Feels good.<br /><em>Looks good.</em></h2><div className="review-score"><strong>4.6</strong><div><div className="stars"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div><span>148 Google reviews</span></div></div></div><div className="review-list">{reviews.map((review) => <blockquote key={review.name}><div className="quote-mark">“</div><p>{review.quote}</p><footer><span className="review-avatar">{review.name.charAt(0)}</span><span><b>{review.name}</b><small>{review.meta}</small></span><Check size={16} /></footer></blockquote>)}</div></div>
        </section>

        <section className="booking-section section-shell" ref={bookingRef} id="booking">
          <div className="booking-intro"><SectionLabel>Make it yours</SectionLabel><h2>Ready when<br /><em>you are.</em></h2><p>Tell us what you’re thinking and we’ll help shape the rest. Requests are confirmed personally over WhatsApp.</p><div className="booking-contact"><a href={`tel:${phone.replace(/\s/g, "")}`}><Phone size={16} /> {phone}</a><a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat on WhatsApp</a></div></div>
          <div className="booking-card">{submitted ? <div className="booking-success"><div className="success-icon"><Check size={24} /></div><SectionLabel>Request received</SectionLabel><h3>We’ll take it from here.</h3><p>Your preferred appointment details are ready. Tap below to send them directly to our team on WhatsApp.</p><a className="button button-dark" href={whatsappHref} target="_blank" rel="noreferrer">Continue on WhatsApp <ArrowRight size={17} /></a><button className="reset-link" onClick={() => setSubmitted(false)}>Edit request</button></div> : <form onSubmit={handleSubmit}><div className="form-heading"><span>01</span><div><h3>Let’s find your time.</h3><p>We’ll reply with availability and a little guidance.</p></div></div><label>Your name<input required name="name" placeholder="e.g. Ananya" /></label><div className="form-row"><label>Phone number<input required name="phone" type="tel" placeholder="98765 43210" /></label><label>Service<select name="service" defaultValue="Precision cut & finish"><option>Precision cut & finish</option><option>Balayage & colour</option><option>Blow dry ritual</option><option>Bridal & occasion</option><option>Body waxing</option><option>Acne care facial</option></select></label></div><div className="form-row"><label>Preferred date<input required name="date" type="date" /></label><label>Preferred time<select name="time" defaultValue="Anytime works"><option>Anytime works</option><option>Morning · 10:30–1:00</option><option>Afternoon · 1:00–4:00</option><option>Evening · 4:00–7:30</option></select></label></div><label>Anything we should know? <span className="optional">Optional</span><textarea name="note" placeholder="Tell us about your hair, an event, or a look you love…" rows={3} /></label><button className="button button-copper form-submit" type="submit">Request an appointment <ArrowRight size={17} /></button><p className="form-note"><Clock3 size={14} /> Usually replies within 30 minutes during open hours.</p></form>}</div>
        </section>

        <section className="visit-section" id="visit"><div className="section-shell visit-grid"><div className="map-panel"><div className="clean-map" aria-label="Stylized map showing the salon location"><div className="map-block map-block-a" /><div className="map-block map-block-b" /><div className="map-block map-block-c" /><svg className="map-roads" viewBox="0 0 800 640" aria-hidden="true"><path d="M-40 170 C150 130 230 255 382 208 S620 98 840 142" /><path d="M-60 435 C130 382 210 505 350 445 S610 320 860 375" /><path d="M260 -30 C295 145 228 250 332 380 S438 560 458 690" /><path d="M622 -40 C558 110 626 228 530 340 S525 530 620 680" /><path className="map-road-major" d="M-45 304 C120 270 270 318 416 300 S665 270 845 292" /></svg><div className="map-label map-label-1">Ulhasnagar</div><div className="map-label map-label-2">Sai Mannat</div><div className="map-label map-label-3">Jai Baba Dham</div><div className="map-label map-label-4">near Talwalkars</div><div className="map-location"><span className="map-location-pulse" /><span className="map-pin"><MapPin size={18} fill="currentColor" /></span><div><strong>The Creative</strong><small>Hair Solutions</small></div></div><div className="map-scale"><span /> 200 m</div></div><div className="map-overlay"><span><MapPin size={15} /> You’re close</span><a href={mapsHref} target="_blank" rel="noreferrer">Get directions <ArrowRight size={15} /></a></div></div><div className="visit-copy"><SectionLabel>Find us</SectionLabel><h2>Drop in for<br /><em>good hair.</em></h2><p>Shop No. 1, Bismillah Juice Center, Sai Mannat, Gym, besides, opposite Jai Baba Dham, near Talwalkars, Ulhasnagar, Maharashtra 421002</p><div className="hours"><div><span>Monday — Sunday</span><strong>10:30 am — 8:30 pm</strong></div><div><span>Walk-ins</span><strong>Welcome when available</strong></div></div><a className="button button-dark" href={mapsHref} target="_blank" rel="noreferrer">Open in Google Maps <MapPin size={16} /></a></div></div></section>
      </main>

      <footer className="site-footer"><div className="section-shell footer-top"><a className="brand footer-brand" href="#top"><LogoMark /><span className="brand-copy"><strong>THE CREATIVE</strong><span>Hair Solutions · Family Salon</span></span></a><p>Modern beauty, made personal.<br />Ulhasnagar, Maharashtra.</p><div className="footer-links"><a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><Instagram size={16} /> Instagram</a><a href={`tel:${phone.replace(/\s/g, "")}`}><Phone size={16} /> Call us</a></div></div><div className="section-shell footer-bottom"><span>© 2025 The Creative Hair Solutions</span><span>Made for your everyday wow <Sparkles size={13} /></span></div></footer>
      <a className="floating-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle size={22} /></a>
    </div>
  );
}
