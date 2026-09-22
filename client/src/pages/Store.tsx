import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Search, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const categories = ["All products", "Hair care", "Skin care"];
const products = [
  { name: "Absolut Repair Shampoo", brand: "L’Oréal Professionnel", category: "Hair care", price: 1250, tag: "Repair", image: "/manus-storage/hair-care-01_9cc2c342.jpg", description: "Repair-focused cleansing for dry, damaged hair." },
  { name: "Vitamino Color Conditioner", brand: "L’Oréal Professionnel", category: "Hair care", price: 1350, tag: "Colour care", image: "/manus-storage/hair-care-02_8cf9da41.webp", description: "Colour care that keeps hair soft, glossy and vibrant." },
  { name: "Fibre Clinix Hair Mask", brand: "Schwarzkopf Professional", category: "Hair care", price: 1650, tag: "Best seller", image: "/manus-storage/hair-care-03_b846e434.jpg", description: "A deep weekly ritual for stronger-looking hair." },
  { name: "Professional Smoothening Serum", brand: "The Creative edit", category: "Hair care", price: 899, tag: "Finishing", image: "/manus-storage/hair-care-04_633ed816.jpg", description: "A lightweight finishing serum for shine and frizz control." },
  { name: "Hair Spa Repair Kit", brand: "The Creative edit", category: "Hair care", price: 1499, tag: "Ritual", image: "/manus-storage/hair-care-01_9cc2c342.jpg", description: "A complete at-home care ritual between salon visits." },
  { name: "Hydrating Facial Care Kit", brand: "The Creative edit", category: "Skin care", price: 950, tag: "Skin care", image: "/manus-storage/hair-care-02_8cf9da41.webp", description: "A gentle at-home reset for a calm, fresh-looking glow." },
];

export default function Store() {
  const [category, setCategory] = useState("All products");
  const [query, setQuery] = useState("");
  const [bag, setBag] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const visible = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "All products" || product.category === category;
    const term = query.toLowerCase().trim();
    return matchesCategory && (!term || `${product.name} ${product.brand}`.toLowerCase().includes(term));
  }), [category, query]);

  const addToBag = (name: string) => {
    setBag((current) => [...current, name]);
    toast.success("Added to your bag", { description: name });
  };
  const toggleSaved = (name: string) => setSaved((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);

  return <div className="store-page">
    <header className="store-page-header">
      <a className="store-back" href="/"><ArrowLeft size={16} /> Back to salon</a>
      <a className="store-page-brand" href="/">THE CREATIVE <span>HAIR SOLUTIONS</span></a>
      <button className="store-page-cart" onClick={() => toast.info("Your bag is ready", { description: `${bag.length} product${bag.length === 1 ? "" : "s"} selected` })}><ShoppingBag size={17} /> Bag <b>{bag.length}</b></button>
    </header>
    <main>
      <section className="store-hero-page"><div><p className="store-kicker">THE CREATIVE EDIT</p><h1>Bring the<br /><em>ritual home.</em></h1><p className="store-hero-copy">Professional hair and beauty essentials chosen by our team to keep your salon finish looking fresh between visits.</p><a href="#products" className="store-gold-button">Shop the edit <ArrowRight size={16} /></a></div><div className="store-hero-image"><img src="/manus-storage/hair-care-03_b846e434.jpg" alt="Curated salon hair-care products" /></div></section>
      <section className="store-products-page section-shell" id="products"><div className="store-page-title"><div><p className="store-kicker">SHOP BY RITUAL</p><h2>Products for your<br /><em>best hair days.</em></h2></div><p>Every product is selected with the same care as our salon services. Ask our team which ritual is right for you.</p></div>
        <div className="store-page-toolbar"><div className="store-page-filters">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the store" /></label></div>
        <div className="store-page-grid">{visible.map((product) => <article className="store-product-card" key={product.name}><div className="store-product-image"><img src={product.image} alt={product.name} /><span>{product.tag}</span><button onClick={() => toggleSaved(product.name)} aria-label={`Save ${product.name}`} className={saved.includes(product.name) ? "saved" : ""}><Heart size={17} fill={saved.includes(product.name) ? "currentColor" : "none"} /></button></div><div className="store-product-content"><small>{product.category} · {product.brand}</small><h3>{product.name}</h3><p>{product.description}</p><div><strong>₹{product.price.toLocaleString("en-IN")}</strong><button onClick={() => addToBag(product.name)}>Add to bag <ArrowRight size={15} /></button></div></div></article>)}</div>
        {visible.length === 0 && <div className="store-no-results">No products found. Try another search.</div>}
      </section>
    </main>
    <footer className="store-page-footer"><span>THE CREATIVE · HAIR SOLUTIONS · FAMILY SALON</span><a href="/">Return to salon <ArrowRight size={14} /></a></footer>
  </div>;
}
