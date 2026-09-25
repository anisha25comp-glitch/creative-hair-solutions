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
  hero: "/creative-hero.jpg",
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
  { name: "Styling", gender: "men", description: "Wash, grooming and cuts", icon: Scissors, items: [
    { name: "Hair Wash (Regular)", detail: "Men’s styling menu", price: "₹100", duration: "20 min" },
    { name: "Beard Clean Shave", detail: "Clean, comfortable shave", price: "₹120", duration: "20 min" },
    { name: "Beard Style", detail: "Defined beard shape and finish", price: "₹150", duration: "30 min" },
    { name: "Haircut For Boys (10 yrs.)", detail: "For boys up to 10 years", price: "₹200", duration: "30 min" },
    { name: "Hair Wash & Haircut", detail: "Wash and finished haircut", price: "₹300", duration: "45 min" },
  ]},
  { name: "Head Massage", gender: "men", description: "Oil, steam and aroma rituals", icon: UserRound, items: [
    { name: "Head Massage with Oil (30 min. No Steam)", detail: "Relaxing oil massage", price: "₹250", duration: "30 min" },
    { name: "Head Massage with Oil & Steam", detail: "Oil massage with steam", price: "₹350", duration: "30 min" },
    { name: "Head Massage with Aroma Oil & Steam 60 min.", detail: "Aroma oil and steam ritual", price: "₹450", duration: "60 min" },
  ]},
  { name: "Hair Color", gender: "men", description: "Colour, streaks and highlights", icon: Sparkles, items: [
    { name: "Moustache Color", detail: "Natural moustache coverage", price: "₹100", duration: "30 min" },
    { name: "Fashion Streak", detail: "A statement colour accent", price: "₹200", duration: "60 min" },
    { name: "Beard Colour", detail: "Natural beard coverage", price: "₹300", duration: "45 min" },
    { name: "Hair Color", detail: "Professional hair colour", price: "₹800", duration: "90 min" },
    { name: "Hair Colour (Inoa without Ammonia)", detail: "Ammonia-free colour", price: "₹900", duration: "90 min" },
    { name: "Highlights", detail: "Light-catching highlights", price: "₹1,500", duration: "150 min" },
  ]},
  { name: "Hair Treatments", gender: "men", description: "Straightening, smoothning and keratin", icon: Sparkles, items: [
    { name: "Straightening", detail: "Extra charges for long and thick hair", price: "₹2,000", duration: "By consultation" },
    { name: "Smoothning", detail: "Extra charges for long and thick hair", price: "₹1,800", duration: "By consultation" },
    { name: "Keratin Pro Advance", detail: "Extra charges for long and thick hair", price: "₹2,500", duration: "By consultation" },
  ]},
  { name: "Hair Spa", gender: "men", description: "Spa and scalp care", icon: Sparkles, items: [
    { name: "Loreal Spa", detail: "Nourishing professional spa", price: "₹500", duration: "60 min" },
    { name: "Dandruff", detail: "Targeted dandruff care", price: "₹1,000", duration: "By consultation" },
    { name: "Hair Fall", detail: "Scalp-focused hair fall care", price: "₹1,500", duration: "By consultation" },
  ]},
  { name: "Manicure", gender: "both", description: "Hand care for women and men", icon: Star, items: [
    { name: "Regular Manicure", detail: "Classic manicure", price: "₹500", duration: "45 min" },
    { name: "Aroma Manicure", detail: "Aroma manicure ritual", price: "₹600", duration: "45 min" },
    { name: "D Tan Manicure", detail: "D-tan manicure ritual", price: "₹700", duration: "60 min" },
    { name: "Spa Manicure", detail: "Deep care and relaxation", price: "₹1,000", duration: "60 min" },
  ]},
  { name: "Pedicure", gender: "both", description: "Foot care for women and men", icon: Star, items: [
    { name: "Regular Pedicure", detail: "Classic pedicure", price: "₹700", duration: "45 min" },
    { name: "Aroma Pedicure", detail: "Aroma pedicure ritual", price: "₹800", duration: "60 min" },
    { name: "D Tan Pedicure", detail: "D-tan pedicure ritual", price: "₹900", duration: "60 min" },
    { name: "Spa Pedicure", detail: "Deep care and relaxation", price: "₹1,200", duration: "75 min" },
  ]},
  { name: "Hair Cutting Style", gender: "women", description: "Women’s cuts, wash and finish", icon: Scissors, items: [
    { name: "Hair Wash & Haircut", detail: "Women’s hair cut and wash", price: "₹700", duration: "60 min" },
    { name: "Hair Trimming", detail: "Trim and refresh", price: "₹500", duration: "45 min" },
    { name: "Hair Wash & Haircut (10 yrs. above Girls)", detail: "For girls above 10 years", price: "₹400", duration: "45 min" },
    { name: "Hair Trimming (3 yrs. above Girls)", detail: "For girls above 3 years", price: "₹300", duration: "30 min" },
    { name: "Haircut & Hair Wash (3 yrs. above Girls)", detail: "For girls above 3 years", price: "₹300", duration: "45 min" },
    { name: "Haircut Trimming", detail: "Shape and trim", price: "₹300", duration: "30 min" },
    { name: "Hair Wash (Regular)", detail: "Regular hair wash", price: "₹300", duration: "30 min" },
    { name: "Hair Blowdry", detail: "Smooth blowdry finish", price: "₹300", duration: "30 min" },
    { name: "Hair Wash with Blowdry", detail: "Wash and blowdry finish", price: "₹400", duration: "45 min" },
  ]},
  { name: "Hair Style", gender: "women", description: "Ironing and tongs by length", icon: Scissors, items: [
    { name: "Up to Shoulder", detail: "Ironing ₹500 · Tongs ₹600", price: "₹500 / ₹600", duration: "By length" },
    { name: "Below Shoulder", detail: "Ironing ₹600 · Tongs ₹700", price: "₹600 / ₹700", duration: "By length" },
    { name: "Mid Waist", detail: "Ironing ₹700 · Tongs ₹800", price: "₹700 / ₹800", duration: "By length" },
    { name: "Below Waist", detail: "Ironing ₹800 · Tongs ₹900", price: "₹800 / ₹900", duration: "By length" },
  ]},
  { name: "Head Massages", gender: "women", description: "Women’s oil and steam rituals", icon: UserRound, items: [
    { name: "Head Massage with Oil (30 min.)", detail: "Relaxing oil massage", price: "₹300", duration: "30 min" },
    { name: "Head Wash with Oil & Steam (30 min.)", detail: "Oil, wash and steam", price: "₹600", duration: "30 min" },
    { name: "Head Massage with Aroma Oil & Steam (30 min.)", detail: "Aroma oil and steam", price: "₹700", duration: "30 min" },
  ]},
  { name: "Hair Spa", gender: "women", description: "Hair spa by length", icon: Sparkles, items: [
    { name: "Up to Shoulder", detail: "Hair spa by length", price: "₹800", duration: "By length" },
    { name: "Below Shoulder", detail: "Hair spa by length", price: "₹900", duration: "By length" },
    { name: "Mid Waist", detail: "Hair spa by length", price: "₹1,300", duration: "By length" },
    { name: "Below Waist", detail: "Hair spa by length", price: "₹1,600", duration: "By length" },
  ]},
  { name: "Olaplex Hair Treatment", gender: "women", description: "Repair treatment by length", icon: Sparkles, items: [
    { name: "Up to Neck", detail: "Olaplex treatment", price: "₹600", duration: "By length" },
    { name: "Up to Shoulder", detail: "Olaplex treatment", price: "₹700", duration: "By length" },
    { name: "Below Shoulder", detail: "Olaplex treatment", price: "₹900", duration: "By length" },
    { name: "Mid Waist", detail: "Olaplex treatment", price: "₹1,200", duration: "By length" },
    { name: "Below Waist", detail: "Olaplex treatment", price: "₹1,500", duration: "By length" },
  ]},
  { name: "Scalp & Hair Care Treatments", gender: "women", description: "Professional scalp and hair care", icon: Sparkles, items: [
    { name: "Hair Scalp Oily Treatment", detail: "Targeted scalp treatment", price: "₹1,800", duration: "By consultation" },
    { name: "Hair Smooth Treatment", detail: "Smooth hair treatment", price: "₹2,000", duration: "By consultation" },
    { name: "Anti-Dandruff Treatment", detail: "Targeted anti-dandruff care", price: "₹2,000", duration: "By consultation" },
    { name: "Deep-Nourishing Treatment", detail: "Deep nourishing care", price: "₹1,500", duration: "By consultation" },
    { name: "Metal DX Treatment", detail: "Colour-protection treatment", price: "₹2,200", duration: "By consultation" },
    { name: "Luxury Hair Spa", detail: "Deep restorative nourishment", price: "₹2,500", duration: "90 min" },
    { name: "Absolut Repair Molecular Treatment", detail: "Advanced repair care", price: "₹3,000", duration: "90 min" },
  ]},
  { name: "Scalp Treatment", gender: "women", description: "Scalp-focused care", icon: Sparkles, items: [
    { name: "Dandruff treatment", detail: "Scalp treatment", price: "₹1,600", duration: "By consultation" },
    { name: "Hair fall treatment", detail: "Scalp treatment", price: "₹1,600", duration: "By consultation" },
  ]},
  { name: "Advance Keratin Treatment", gender: "women", description: "Keratin, Nano, Tano/Beauto and Advanced Pro by length", icon: Sparkles, items: [
    { name: "Fringe", detail: "Keratin/Botox ₹1,000 · Nano Plastia ₹1,500 · Tano/Beauto Plastia ₹1,700 · Advanced Pro ₹1,900", price: "₹1,000–₹1,900", duration: "By length" },
    { name: "Crown", detail: "Keratin/Botox ₹2,000 · Nano Plastia ₹2,500 · Tano/Beauto Plastia ₹2,700 · Advanced Pro ₹2,900", price: "₹2,000–₹2,900", duration: "By length" },
    { name: "Up to Neck", detail: "Keratin/Botox ₹2,500 · Nano Plastia ₹3,000 · Tano/Beauto Plastia ₹3,000 · Advanced Pro ₹3,400", price: "₹2,500–₹3,400", duration: "By length" },
    { name: "Up to Shoulder", detail: "Keratin/Botox ₹3,000 · Nano Plastia ₹4,500 · Tano/Beauto Plastia ₹5,500 · Advanced Pro ₹6,500", price: "₹3,000–₹6,500", duration: "By length" },
    { name: "Below Shoulder", detail: "Keratin/Botox ₹5,500 · Nano Plastia ₹6,500 · Tano/Beauto Plastia ₹7,500 · Advanced Pro ₹8,500", price: "₹5,500–₹8,500", duration: "By length" },
    { name: "Mid Waist", detail: "Keratin/Botox ₹6,500 · Nano Plastia ₹7,500 · Tano/Beauto Plastia ₹8,500 · Advanced Pro ₹9,500", price: "₹6,500–₹9,500", duration: "By length" },
    { name: "Below Waist", detail: "Keratin/Botox ₹7,500 · Nano Plastia ₹8,500 · Tano/Beauto Plastia ₹9,500 · Advanced Pro ₹10,500", price: "₹7,500–₹10,500", duration: "By length" },
  ]},
  { name: "Straightening", gender: "women", description: "Smoothning, straightening and rebonding by length", icon: Sparkles, items: [
    { name: "Fringe", detail: "Smoothning ₹1,500 · Straightening ₹2,000 · Rebonding ₹2,500", price: "₹1,500–₹2,500", duration: "By length" },
    { name: "Crown", detail: "Smoothning ₹2,000 · Straightening ₹2,500 · Rebonding ₹3,000", price: "₹2,000–₹3,000", duration: "By length" },
    { name: "Up to Neck", detail: "Smoothning ₹3,000 · Straightening ₹3,500 · Rebonding ₹4,000", price: "₹3,000–₹4,000", duration: "By length" },
    { name: "Up to Shoulder", detail: "Smoothning ₹3,500 · Straightening ₹4,500 · Rebonding ₹5,000", price: "₹3,500–₹5,000", duration: "By length" },
    { name: "Below Shoulder", detail: "Smoothning ₹4,000 · Straightening ₹5,500 · Rebonding ₹6,000", price: "₹4,000–₹6,000", duration: "By length" },
    { name: "Mid Waist", detail: "Smoothning ₹5,500 · Straightening ₹6,500 · Rebonding ₹7,500", price: "₹5,500–₹7,500", duration: "By length" },
    { name: "Below Waist", detail: "Smoothning ₹7,000 · Straightening ₹8,000 · Rebonding ₹9,000", price: "₹7,000–₹9,000", duration: "By length" },
  ]},
  { name: "Hair Color", gender: "women", description: "L’Oreal / Schwarzkopf colour", icon: Sparkles, items: [
    { name: "Root Touch Up (1 inch)", detail: "L’Oreal / Schwarzkopf", price: "₹1,200", duration: "90 min" },
    { name: "Root Touch Up (2 inch)", detail: "L’Oreal / Schwarzkopf", price: "₹1,500", duration: "90 min" },
    { name: "Root Touch Up (Inoa 1 inch)", detail: "Ammonia-free Inoa colour", price: "₹1,500", duration: "90 min" },
    { name: "Root Touch Up (Inoa 2 inch)", detail: "Ammonia-free Inoa colour", price: "₹1,700", duration: "90 min" },
  ]},
  { name: "Global Hair Color", gender: "women", description: "Basic and ammonia-free by length", icon: Sparkles, items: [
    { name: "Up to neck", detail: "Basic ₹2,000 · Ammonia Free ₹2,500", price: "₹2,000 / ₹2,500", duration: "By length" },
    { name: "Up to shoulder", detail: "Basic ₹2,500 · Ammonia Free ₹3,000", price: "₹2,500 / ₹3,000", duration: "By length" },
    { name: "Below shoulder", detail: "Basic ₹3,000 · Ammonia Free ₹4,000", price: "₹3,000 / ₹4,000", duration: "By length" },
    { name: "Mid waist", detail: "Basic ₹4,000 · Ammonia Free ₹5,000", price: "₹4,000 / ₹5,000", duration: "By length" },
    { name: "Below waist", detail: "Basic ₹4,500 · Ammonia Free ₹6,000", price: "₹4,500 / ₹6,000", duration: "By length" },
  ]},
  { name: "Advance Hair Color", gender: "women", description: "Highlights and balayage by length", icon: Sparkles, items: [
    { name: "Up to neck", detail: "Highlights ₹3,000 · Balayage ₹3,500", price: "₹3,000 / ₹3,500", duration: "By length" },
    { name: "Up to shoulder", detail: "Highlights ₹3,500 · Balayage ₹4,000", price: "₹3,500 / ₹4,000", duration: "By length" },
    { name: "Below shoulder", detail: "Highlights ₹4,000 · Balayage ₹5,000", price: "₹4,000 / ₹5,000", duration: "By length" },
    { name: "Mid waist", detail: "Highlights ₹5,500 · Balayage ₹6,000", price: "₹5,500 / ₹6,000", duration: "By length" },
    { name: "Below waist", detail: "Highlights ₹6,000 · Balayage ₹7,000", price: "₹6,000 / ₹7,000", duration: "By length" },
  ]},
  { name: "Threading", gender: "women", description: "Face threading services", icon: Star, items: [
    { name: "Forehead", detail: "Threading", price: "₹30", duration: "15 min" },
    { name: "Chin", detail: "Threading", price: "₹30", duration: "15 min" },
    { name: "Upper Lips", detail: "Threading", price: "₹30", duration: "15 min" },
    { name: "Lower Lips", detail: "Threading", price: "₹30", duration: "15 min" },
    { name: "Side Locks", detail: "Threading", price: "₹60", duration: "15 min" },
    { name: "Eye Brows", detail: "Threading", price: "₹60", duration: "15 min" },
    { name: "Full Face", detail: "Threading", price: "₹200", duration: "30 min" },
  ]},
  { name: "Rica Wax", gender: "women", description: "Body waxing services", icon: Star, items: [
    { name: "Under Arms", detail: "Rica wax", price: "₹150", duration: "30 min" },
    { name: "Half Back / Front", detail: "Rica wax", price: "₹400", duration: "45 min" },
    { name: "Full Arms", detail: "Rica wax", price: "₹500", duration: "45 min" },
    { name: "Half Legs", detail: "Rica wax", price: "₹500", duration: "45 min" },
    { name: "Stomach", detail: "Rica wax", price: "₹500", duration: "45 min" },
    { name: "Full Legs", detail: "Rica wax", price: "₹700", duration: "60 min" },
    { name: "Full Back / Front", detail: "Rica wax", price: "₹800", duration: "60 min" },
    { name: "Full Body Wax", detail: "Rica wax", price: "₹2,800", duration: "90 min" },
  ]},
  { name: "Brazilian Wax", gender: "women", description: "Bikini and body waxing", icon: Star, items: [
    { name: "Chin / Upper lip", detail: "Brazilian wax", price: "₹150", duration: "30 min" },
    { name: "Side lock", detail: "Brazilian wax", price: "₹220", duration: "30 min" },
    { name: "Under Arms", detail: "Brazilian wax", price: "₹250", duration: "30 min" },
    { name: "Full Face", detail: "Brazilian wax", price: "₹600", duration: "45 min" },
    { name: "Bikini Line", detail: "Brazilian wax", price: "₹900", duration: "45 min" },
    { name: "Full Bikini", detail: "Brazilian wax", price: "₹2,000", duration: "60 min" },
  ]},
  { name: "Nail Art", gender: "women", description: "Polish, extensions and overlays", icon: Star, items: [
    { name: "Toe Polish", detail: "Nail art", price: "₹400", duration: "30 min" },
    { name: "Removals", detail: "Nail art", price: "₹400", duration: "30 min" },
    { name: "Gel Polish", detail: "Nail art", price: "₹500", duration: "45 min" },
    { name: "Temporary Extension", detail: "Nail art", price: "₹700", duration: "60 min" },
    { name: "Gel Overlays", detail: "Nail art", price: "₹800", duration: "60 min" },
  ]},
  { name: "Body Massage", gender: "women", description: "Coconut oil or cream massage", icon: CalendarDays, items: [
    { name: "Body Massage 40 Mins.", detail: "Coconut oil ₹1,600 · Cream ₹1,700", price: "₹1,600 / ₹1,700", duration: "40 min" },
    { name: "Body Massage 60 Min.", detail: "Coconut oil ₹2,200 · Cream ₹2,300", price: "₹2,200 / ₹2,300", duration: "60 min" },
    { name: "Boday Massage 90 Min.", detail: "Coconut oil ₹2,800 · Cream ₹2,900", price: "₹2,800 / ₹2,900", duration: "90 min" },
  ]},
  { name: "D-Tan Mask", gender: "women", description: "D-tan mask treatments", icon: Star, items: [
    { name: "Under Arms", detail: "D-tan mask", price: "₹250", duration: "30 min" },
    { name: "D-Tan (Face)", detail: "D-tan mask", price: "₹500", duration: "30 min" },
    { name: "O3 D-Tan", detail: "D-tan mask", price: "₹700", duration: "45 min" },
    { name: "Full Arms", detail: "D-tan mask", price: "₹800", duration: "45 min" },
    { name: "Half Legs / Back / Front", detail: "D-tan mask", price: "₹800", duration: "60 min" },
    { name: "Full Legs / Back / Front", detail: "D-tan mask", price: "₹1,000", duration: "75 min" },
    { name: "Full Body", detail: "D-tan mask", price: "₹2,800", duration: "90 min" },
  ]},
  { name: "Bleach", gender: "women", description: "Face and body bleach", icon: Star, items: [
    { name: "Face & Neck", detail: "Bleach", price: "₹500", duration: "30 min" },
    { name: "Neck & Blouse Line", detail: "Bleach", price: "₹600", duration: "30 min" },
    { name: "O3 Bleach", detail: "Bleach", price: "₹600", duration: "45 min" },
    { name: "Cherly's Bleach", detail: "Bleach", price: "₹600", duration: "45 min" },
    { name: "Full Arms / Half Legs", detail: "Bleach", price: "₹800", duration: "60 min" },
    { name: "Full Legs / Back / Front", detail: "Bleach", price: "₹1,000", duration: "75 min" },
    { name: "Full Body", detail: "Bleach", price: "₹2,500", duration: "90 min" },
  ]},
  { name: "Facial’s", gender: "women", description: "Facials for female and male guests", icon: Star, items: [
    { name: "Regular Facial", detail: "Female / Male", price: "₹1,500", duration: "60 min" },
    { name: "Natural Facial", detail: "Female / Male", price: "₹1,700", duration: "60 min" },
    { name: "Ozone Facial", detail: "Female / Male", price: "₹1,900", duration: "60 min" },
    { name: "Korean Glass", detail: "Female / Male", price: "₹1,900", duration: "75 min" },
    { name: "Oxyblast Facial", detail: "Female / Male", price: "₹2,200", duration: "75 min" },
    { name: "Hydra Facial", detail: "Female / Male", price: "₹2,500", duration: "75 min" },
    { name: "O.W. Orange Wood Facial", detail: "Female / Male", price: "₹3,000", duration: "90 min" },
    { name: "O.3 Advance Facial", detail: "Female / Male", price: "₹3,500", duration: "90 min" },
    { name: "Korean Hydra", detail: "Female / Male", price: "₹3,500", duration: "90 min" },
    { name: "O.2 C2 Cheryls", detail: "Female / Male", price: "₹4,000", duration: "90 min" },
    { name: "Derma Cheryls", detail: "Female / Male", price: "₹4,500", duration: "90 min" },
    { name: "Shahnaz Gold Facial", detail: "Female / Male", price: "₹5,000", duration: "120 min" },
  ]},
  { name: "Body Polishing", gender: "women", description: "Body polishing for female and male guests", icon: Star, items: [
    { name: "Full Arms with Under Arms", detail: "Female / Male", price: "₹1,500", duration: "60 min" },
    { name: "Full Front / Back", detail: "Female / Male", price: "₹1,600", duration: "60 min" },
    { name: "Full Legs", detail: "Female / Male", price: "₹1,800", duration: "75 min" },
    { name: "Full Body", detail: "Female / Male", price: "₹3,500", duration: "120 min" },
  ]},
  { name: "Clean Up", gender: "women", description: "Clean-up treatments for female and male guests", icon: Star, items: [
    { name: "Regular Clean Up", detail: "Female / Male", price: "₹700", duration: "45 min" },
    { name: "Nature Clean UP", detail: "Female / Male", price: "₹800", duration: "45 min" },
    { name: "Ozone Clean Up", detail: "Female / Male", price: "₹850", duration: "60 min" },
    { name: "Hydra Clean Up", detail: "Female / Male", price: "₹900", duration: "60 min" },
    { name: "Richfeel Clean Up", detail: "Female / Male", price: "₹1,000", duration: "60 min" },
    { name: "D-Tan Clean Up", detail: "Female / Male", price: "₹1,000", duration: "60 min" },
  ]},
  { name: "Pre-Groom Package", gender: "women", description: "Groom package services", icon: CalendarDays, items: [
    { name: "Hair Wash & Cut", detail: "Pre-groom package", price: "₹300", duration: "By plan" },
    { name: "Keratin Hair SPA", detail: "Pre-groom package", price: "₹1,000", duration: "By plan" },
    { name: "Hair Colour", detail: "Pre-groom package", price: "₹800", duration: "By plan" },
    { name: "Shaving", detail: "Two price options", price: "₹120 / ₹150", duration: "By plan" },
    { name: "Bleach", detail: "Pre-groom package", price: "₹500", duration: "By plan" },
    { name: "Shahnaz Gold Facial", detail: "Pre-groom package", price: "₹5,000", duration: "By plan" },
    { name: "Body Polishing", detail: "Pre-groom package", price: "₹3,500", duration: "By plan" },
    { name: "SPA Manicure", detail: "Pre-groom package", price: "₹1,200", duration: "By plan" },
    { name: "SPA Pedicure", detail: "Pre-groom package", price: "₹1,400", duration: "By plan" },
    { name: "2 Time make up & hair set", detail: "Pre-groom package", price: "₹6,000", duration: "By plan" },
  ]},
  { name: "Pre-Bridal Package", gender: "women", description: "Bridal package services", icon: CalendarDays, items: [
    { name: "Hair Wash & Cut", detail: "Pre-bridal package", price: "₹700", duration: "By plan" },
    { name: "Keratin Hair SPA", detail: "Pre-bridal package", price: "₹1,700", duration: "By plan" },
    { name: "Bleach", detail: "Pre-bridal package", price: "₹600", duration: "By plan" },
    { name: "Shahnaz Gold Facial", detail: "Pre-bridal package", price: "₹5,000", duration: "By plan" },
    { name: "Full Body bleach", detail: "Pre-bridal package", price: "₹2,500", duration: "By plan" },
    { name: "Full Body Wax (Rica)", detail: "Pre-bridal package", price: "₹2,700", duration: "By plan" },
    { name: "Full Body Polishing", detail: "Pre-bridal package", price: "₹3,500", duration: "By plan" },
    { name: "SPA Manicure", detail: "Pre-bridal package", price: "₹1,200", duration: "By plan" },
    { name: "SPA Pedicure", detail: "Pre-bridal package", price: "₹1,400", duration: "By plan" },
    { name: "Advanced Highlights", detail: "Pre-bridal package", price: "₹5,000", duration: "By plan" },
    { name: "2 Time make up & hair set", detail: "Pre-bridal package", price: "₹17,000", duration: "By plan" },
    { name: "Nail Art", detail: "Pre-bridal package", price: "₹2,000", duration: "By plan" },
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

  const visibleMenuCategories = useMemo(
    () => menuCategories.filter((category) => category.gender === menuGender || category.gender === "both"),
    [menuGender],
  );

  const scrollToBooking = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openFullMenu = () => {
    setMenuOpen(true);
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
          <img className="site-logo-image site-header-logo" src="/chs-logo.png" alt="The Creative Hair Solutions logo" />
          <span className="brand-copy">
            <strong>THE CREATIVE</strong>
            <span>Hair Solutions · Family Salon</span>
          </span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#services">Services</a>
          <button className="nav-text-button" onClick={openFullMenu}>Full menu</button>
          <a href="#reviews">Reviews</a>
          <a href="#visit">Visit us</a>
          <a href="/staff">Staff</a>
          <a href="/admin">Admin</a>
          <a className="header-icon-link" href="https://www.instagram.com/thecreativesalondombivli/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
          <a className="header-icon-link" href="/store" aria-label="Our store"><ShoppingBag size={16} /></a>
        </nav>
        <details className="more-menu"><summary aria-label="Open navigation menu"><MoreHorizontal size={22} /></summary><div className="more-menu-popover"><a href="#services">Services</a><button type="button" onClick={openFullMenu}>Full menu</button><a href="#reviews">Reviews</a><a href="#visit">Visit us</a><a href="/store">Our store</a><a href="/staff">Staff sign in</a><a href="/admin">Admin sign in</a><a href="https://www.instagram.com/thecreativesalondombivli/" target="_blank" rel="noreferrer">Instagram</a></div></details>
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
          <div className="section-topline"><div><SectionLabel>Signature services</SectionLabel><h2>Come for the<br /><em>feeling.</em> Stay for the hair.</h2><div className="gender-menu-switch" aria-label="Choose a menu"><span>View menu for</span><button type="button" className={menuGender === "women" ? "gender-active" : ""} onClick={() => openGenderMenu("women")} aria-pressed={menuGender === "women"}>Women</button><button type="button" className={menuGender === "men" ? "gender-active" : ""} onClick={() => openGenderMenu("men")} aria-pressed={menuGender === "men"}>Man</button></div></div><p className="section-aside">Choose Women or Man to see the right menu. Click any bold heading below to reveal every service, price and duration.</p></div>
          <div className="service-filters" role="tablist" aria-label="Filter services">{categories.map((category) => <button key={category} className={activeCategory === category ? "filter-active" : ""} onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category}>{category}</button>)}</div>
          <div className="service-grid">{filteredServices.map((service) => <article className="service-card" key={service.name} onClick={() => openMenuForService(service.name)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openMenuForService(service.name); }} role="button" tabIndex={0}><div className="service-card-top"><span className="service-tag">{service.tag}</span><span className="service-price">{service.price}</span></div><h3>{service.name}</h3><p>{service.description}</p><button className="service-arrow" onClick={(event) => { event.stopPropagation(); openMenuForService(service.name); }} aria-label={`View ${service.name} in the full menu`}><ArrowRight size={18} /></button></article>)}</div>
          <div className="service-footer"><span>Not sure what you need?</span><button className="outline-button" onClick={() => scrollToBooking()}> <ArrowRight size={16} /></button></div>
        </section>

        {menuOpen && <section className="menu-timeline" id="menu"><div className="section-shell menu-heading"><div><SectionLabel>{menuGender === "men" ? "Man’s complete menu" : "Women’s complete menu"}</SectionLabel><h2>{menuGender === "men" ? <>Man’s<br /><em>menu.</em></> : <>Women’s<br /><em>menu.</em></>}</h2></div><div className="menu-heading-side"><div className="menu-inline-switch" aria-label="Switch full menu"><span>View menu for</span><button type="button" className={menuGender === "women" ? "gender-active" : ""} onClick={() => openGenderMenu("women")} aria-pressed={menuGender === "women"}>Women</button><button type="button" className={menuGender === "men" ? "gender-active" : ""} onClick={() => openGenderMenu("men")} aria-pressed={menuGender === "men"}>Men</button></div><p>Click a bold heading to see every {menuGender === "men" ? "men’s" : "women’s"} service, price range and duration, then add it to your appointment request.</p><button type="button" className="menu-close" onClick={() => { setMenuOpen(false); setOpenMenuCategory(null); }}>Close menu <X size={15} /></button></div></div><div className="menu-category-grid">{visibleMenuCategories.map((category) => { const Icon = category.icon; const isOpen = openMenuCategory === category.name; return <div className={`menu-category ${isOpen ? "menu-category-open" : ""}`} key={category.name}><button type="button" className="menu-category-trigger" onClick={() => setOpenMenuCategory(isOpen ? null : category.name)} aria-expanded={isOpen}><span className="menu-category-icon"><Icon size={20} /></span><span><b>{category.name}</b><small>{category.description} · {category.items.length} services</small></span><ChevronDown size={18} /></button>{isOpen && <div className="menu-subtypes">{category.items.map((item) => <div className="menu-subtype" key={item.name}><div><b>{item.name}</b><small>{item.detail}</small><span className="menu-duration"><Clock3 size={12} /> {item.duration}</span></div><strong>{item.price}</strong><button type="button" onClick={() => selectBookingService(item.name)} aria-label={`Select ${item.name}`}><span>Select</span><ArrowRight size={14} /></button></div>)}</div>}</div>; })}</div></section>}

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
