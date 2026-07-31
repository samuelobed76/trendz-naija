import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";
import p9 from "@/assets/p9.jpg";
import p10 from "@/assets/p10.jpg";
import p11 from "@/assets/p11.jpg";
import p12 from "@/assets/p12.jpg";

export type Category =
  | "Women"
  | "Men"
  | "Kids"
  | "Shoes"
  | "House Wears"
  | "Suits"
  | "Natives"
  | "Streetwear"
  | "Accessories";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number; // NGN
  compareAt?: number;
  category: Category;
  image: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  material: string;
  occasion: string[];
  rating: number;
  reviews: number;
  stock: number;
  tags: string[];
  description: string;
  new?: boolean;
  trending?: boolean;
  onSale?: boolean;
}

export const CATEGORIES: Category[] = [
  "Women",
  "Men",
  "Kids",
  "Shoes",
  "House Wears",
  "Suits",
  "Natives",
  "Streetwear",
  "Accessories",
];

export const PRODUCTS: Product[] = [
  {
    id: "ada-print-shirt",
    name: "Ada Ankara Print Shirt",
    brand: "Lagos Atelier",
    price: 24500,
    compareAt: 32000,
    category: "Men",
    image: p1,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Sunburst", hex: "#c85a1a" },
      { name: "Ivory", hex: "#f4ecdc" },
    ],
    material: "100% Cotton",
    occasion: ["Casual", "Weekend", "Owambe"],
    rating: 4.7,
    reviews: 142,
    stock: 24,
    tags: ["ankara", "shirt", "cotton"],
    description:
      "Short-sleeve camp collar shirt cut from breathable cotton with a hand-drawn Sunburst print. Relaxed fit — size down for a slimmer look.",
    trending: true,
    onSale: true,
  },
  {
    id: "amara-kaftan",
    name: "Amara Emerald Kaftan",
    brand: "House of Nne",
    price: 68000,
    category: "Women",
    image: p2,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Emerald", hex: "#0e6b4a" },
      { name: "Onyx", hex: "#1c1c1c" },
    ],
    material: "Silk blend",
    occasion: ["Owambe", "Wedding", "Evening"],
    rating: 4.9,
    reviews: 88,
    stock: 12,
    tags: ["kaftan", "silk", "evening"],
    description:
      "Floor-length silk-blend kaftan with gold thread embroidery down the placket. Made in Lagos, cut for movement.",
    new: true,
  },
  {
    id: "chidi-sandals",
    name: "Chidi Beaded Leather Sandals",
    brand: "Kano Made",
    price: 18500,
    category: "Shoes",
    image: p3,
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: [{ name: "Cognac", hex: "#a05a2c" }],
    material: "Full-grain leather",
    occasion: ["Casual", "Vacation"],
    rating: 4.6,
    reviews: 210,
    stock: 40,
    tags: ["sandals", "leather", "beaded"],
    description:
      "Hand-cut leather sandals with brass and coral beading on the strap. Broken-in comfort from day one.",
    trending: true,
  },
  {
    id: "zainab-lounge",
    name: "Zainab Silk Lounge Set",
    brand: "Nne Home",
    price: 42000,
    compareAt: 55000,
    category: "House Wears",
    image: p4,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Ivory", hex: "#f5eddb" },
      { name: "Burgundy", hex: "#7a1e2b" },
    ],
    material: "Washable silk",
    occasion: ["Loungewear", "Sleep"],
    rating: 4.8,
    reviews: 63,
    stock: 30,
    tags: ["lounge", "silk", "set"],
    description:
      "Piped silk short-robe with matching shorts. Cool against the skin — designed for Lagos evenings.",
    onSale: true,
  },
  {
    id: "obi-suit",
    name: "Obi Charcoal Tailored Suit",
    brand: "Broad Street Bespoke",
    price: 165000,
    category: "Suits",
    image: p5,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Charcoal", hex: "#2a2a2a" }],
    material: "Wool blend",
    occasion: ["Business", "Wedding", "Formal"],
    rating: 4.9,
    reviews: 34,
    stock: 8,
    tags: ["suit", "wool", "tailored"],
    description:
      "Two-piece charcoal suit with subtle windowpane and printed lining. Half-canvas construction for a clean drape.",
    new: true,
  },
  {
    id: "ify-gele",
    name: "Ify Silk Gele Headwrap",
    brand: "House of Nne",
    price: 9500,
    category: "Accessories",
    image: p6,
    sizes: ["One Size"],
    colors: [
      { name: "Marigold", hex: "#e59a2b" },
      { name: "Ruby", hex: "#a41a2a" },
    ],
    material: "Silk satin",
    occasion: ["Owambe", "Wedding"],
    rating: 4.8,
    reviews: 178,
    stock: 60,
    tags: ["gele", "silk", "accessory"],
    description:
      "Long-length silk satin gele that holds a crisp fold. Perfect base for your favorite owambe look.",
    trending: true,
  },
  {
    id: "kemi-print-dress",
    name: "Kemi Wrap Print Dress",
    brand: "Lagos Atelier",
    price: 38500,
    category: "Women",
    image: p1,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Sunburst", hex: "#c85a1a" }],
    material: "Cotton poplin",
    occasion: ["Work", "Brunch"],
    rating: 4.5,
    reviews: 96,
    stock: 22,
    tags: ["dress", "wrap", "print"],
    description:
      "Wrap dress with adjustable tie and hidden pocket. Cut for a flattering shape across body types.",
    new: true,
  },
  {
    id: "tunde-agbada",
    name: "Tunde Ceremonial Agbada",
    brand: "Broad Street Bespoke",
    price: 145000,
    compareAt: 180000,
    category: "Men",
    image: p2,
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Emerald", hex: "#0e6b4a" },
      { name: "Royal", hex: "#1a3a7a" },
    ],
    material: "Cashmere blend",
    occasion: ["Wedding", "Owambe"],
    rating: 5.0,
    reviews: 22,
    stock: 6,
    tags: ["agbada", "ceremonial"],
    description:
      "Full ceremonial agbada set — flowing outer robe, inner tunic and trousers. Hand-embroidered chest panel.",
    onSale: true,
    trending: true,
  },
  {
    id: "nia-kids-set",
    name: "Nia Little Ones Ankara Set",
    brand: "Lagos Atelier",
    price: 14500,
    category: "Kids",
    image: p4,
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
    colors: [{ name: "Emerald", hex: "#0e6b4a" }],
    material: "Cotton",
    occasion: ["Family", "Weekend"],
    rating: 4.7,
    reviews: 51,
    stock: 35,
    tags: ["kids", "ankara", "set"],
    description:
      "Matching top and bottoms for the little ones. Soft cotton, easy pull-on waistband, machine washable.",
  },
  {
    id: "bola-loafers",
    name: "Bola Suede Loafers",
    brand: "Kano Made",
    price: 32000,
    category: "Shoes",
    image: p3,
    sizes: ["40", "41", "42", "43", "44"],
    colors: [{ name: "Espresso", hex: "#3a1f14" }],
    material: "Suede",
    occasion: ["Business", "Smart Casual"],
    rating: 4.4,
    reviews: 74,
    stock: 18,
    tags: ["loafers", "suede"],
    description:
      "Hand-lasted suede penny loafers on a leather sole. Wear with a suit or with jeans.",
  },
  {
    id: "aisha-caftan-lounge",
    name: "Aisha Cotton Boubou",
    brand: "Nne Home",
    price: 27500,
    category: "House Wears",
    image: p2,
    sizes: ["One Size"],
    colors: [
      { name: "Ivory", hex: "#f5eddb" },
      { name: "Sky", hex: "#8fb6c9" },
    ],
    material: "Cotton voile",
    occasion: ["Loungewear"],
    rating: 4.6,
    reviews: 41,
    stock: 26,
    tags: ["boubou", "lounge", "cotton"],
    description:
      "Lightweight cotton voile boubou with side pockets. Impossible to overheat in.",
    new: true,
  },
  {
    id: "yemi-navy-suit",
    name: "Yemi Navy Two-Piece",
    brand: "Broad Street Bespoke",
    price: 148000,
    category: "Suits",
    image: p5,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Navy", hex: "#1a2540" }],
    material: "Wool",
    occasion: ["Business", "Wedding"],
    rating: 4.8,
    reviews: 29,
    stock: 10,
    tags: ["suit", "navy"],
    description:
      "A modern-cut navy two-piece with soft shoulders and a mid-rise trouser.",
  },
  {
    id: "sanni-white-agbada",
    name: "Sanni White Lace Agbada Set",
    brand: "Ilorin Native House",
    price: 128000,
    compareAt: 155000,
    category: "Natives",
    image: p7,
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "Ivory", hex: "#f6f2ea" },
      { name: "Sky", hex: "#9dbfd4" },
    ],
    material: "Swiss lace",
    occasion: ["Wedding", "Owambe", "Friday Jumat"],
    rating: 4.9,
    reviews: 64,
    stock: 15,
    tags: ["agbada", "native", "lace", "kaftan"],
    description:
      "Three-piece Swiss lace native set — agbada, kaftan and trousers — with a matching embroidered fila cap.",
    trending: true,
    onSale: true,
  },
  {
    id: "ade-senator-native",
    name: "Ade Senator Native Wear",
    brand: "Ilorin Native House",
    price: 46000,
    category: "Natives",
    image: p5,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Wine", hex: "#5d1a2a" },
      { name: "Charcoal", hex: "#2a2a2a" },
      { name: "Royal", hex: "#1a3a7a" },
    ],
    material: "Cashmere cotton",
    occasion: ["Work", "Church", "Owambe"],
    rating: 4.7,
    reviews: 187,
    stock: 48,
    tags: ["senator", "native", "two-piece"],
    description:
      "The everyday senator — clean placket embroidery, breathable cashmere cotton, tailored slim through the body.",
    trending: true,
  },
  {
    id: "folake-asooke-gown",
    name: "Folake Aso-Oke Gown & Gele",
    brand: "House of Nne",
    price: 96000,
    category: "Natives",
    image: p10,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Amethyst", hex: "#6b2b6e" },
      { name: "Gold", hex: "#c99a2e" },
    ],
    material: "Aso-oke with gold thread",
    occasion: ["Wedding", "Owambe", "Engagement"],
    rating: 5.0,
    reviews: 41,
    stock: 9,
    tags: ["aso-oke", "native", "gown", "gele"],
    description:
      "Hand-woven aso-oke fitted gown with a one-shoulder drape, satin obi belt and matching gele.",
    new: true,
    trending: true,
  },
  {
    id: "ngozi-george-wrapper",
    name: "Ngozi George Wrapper Set",
    brand: "Aba Weaves",
    price: 74000,
    category: "Natives",
    image: p2,
    sizes: ["One Size"],
    colors: [
      { name: "Coral", hex: "#d4573c" },
      { name: "Teal", hex: "#0f5d63" },
    ],
    material: "Indian George",
    occasion: ["Wedding", "Traditional"],
    rating: 4.8,
    reviews: 33,
    stock: 14,
    tags: ["george", "wrapper", "native", "igbo"],
    description:
      "Two-piece George wrapper with beaded blouse — the classic Eastern traditional look, tailored to your measurements.",
    new: true,
  },
  {
    id: "dayo-oxford-shoes",
    name: "Dayo Patent Oxford Shoes",
    brand: "Kano Made",
    price: 54000,
    category: "Shoes",
    image: p8,
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "Black", hex: "#141414" },
      { name: "Oxblood", hex: "#4a1a1e" },
    ],
    material: "Patent leather",
    occasion: ["Formal", "Wedding", "Business"],
    rating: 4.7,
    reviews: 118,
    stock: 22,
    tags: ["oxford", "shoes", "formal", "leather"],
    description:
      "Cap-toe patent oxfords on a stacked leather heel. The shoe that finishes a suit or an agbada.",
  },
  {
    id: "tosin-chunky-sneakers",
    name: "Tosin Chunky Court Sneakers",
    brand: "Lekki Kicks",
    price: 39500,
    compareAt: 49000,
    category: "Shoes",
    image: p9,
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Off White", hex: "#f1ece2" },
      { name: "Sand", hex: "#d8c3a5" },
    ],
    material: "Leather & mesh",
    occasion: ["Casual", "Street", "Weekend"],
    rating: 4.6,
    reviews: 264,
    stock: 55,
    tags: ["sneakers", "chunky", "trending", "street"],
    description:
      "Chunky-sole court sneakers with a padded collar. Unisex sizing — the most-worn shoe on the timeline right now.",
    trending: true,
    onSale: true,
  },
  {
    id: "hauwa-gold-heels",
    name: "Hauwa Gold Block Heels",
    brand: "Kano Made",
    price: 34500,
    category: "Shoes",
    image: p12,
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: [
      { name: "Gold", hex: "#c9a227" },
      { name: "Silver", hex: "#c8ccd0" },
    ],
    material: "Metallic leather",
    occasion: ["Owambe", "Wedding", "Evening"],
    rating: 4.8,
    reviews: 92,
    stock: 27,
    tags: ["heels", "sandals", "gold", "party"],
    description:
      "Strappy metallic sandals on a 3-inch stacked block heel — party height you can actually dance in.",
    new: true,
  },
  {
    id: "seyi-denim-cargo-set",
    name: "Seyi Denim & Cargo Street Set",
    brand: "Lekki Kicks",
    price: 45500,
    compareAt: 58000,
    category: "Streetwear",
    image: p11,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Mid Blue", hex: "#4a7397" },
      { name: "Khaki", hex: "#b08d5b" },
    ],
    material: "Rigid denim & cotton twill",
    occasion: ["Casual", "Street", "Weekend"],
    rating: 4.5,
    reviews: 149,
    stock: 38,
    tags: ["denim", "cargo", "streetwear", "trending"],
    description:
      "Boxy cropped denim trucker over utility cargos. Layer it with a plain tee and the chunky sneakers.",
    trending: true,
    onSale: true,
  },
  {
    id: "chuka-oversized-tee",
    name: "Chuka Oversized Graphic Tee",
    brand: "Lagos Atelier",
    price: 12500,
    category: "Streetwear",
    image: p1,
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "Bone", hex: "#eae4d8" },
      { name: "Onyx", hex: "#1c1c1c" },
      { name: "Sunburst", hex: "#c85a1a" },
    ],
    material: "260gsm cotton",
    occasion: ["Casual", "Street"],
    rating: 4.4,
    reviews: 312,
    stock: 120,
    tags: ["tee", "oversized", "streetwear", "trending"],
    description:
      "Heavyweight boxy tee with a screen-printed Lagos motif and drop shoulders that keep their shape.",
    trending: true,
  },
  {
    id: "zara-satin-slip-dress",
    name: "Zara Satin Slip Dress",
    brand: "House of Nne",
    price: 32500,
    category: "Women",
    image: p2,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Champagne", hex: "#dcc7a1" },
      { name: "Emerald", hex: "#0e6b4a" },
      { name: "Onyx", hex: "#1c1c1c" },
    ],
    material: "Heavy satin",
    occasion: ["Evening", "Date Night", "Birthday"],
    rating: 4.6,
    reviews: 121,
    stock: 31,
    tags: ["dress", "satin", "slip", "trending"],
    description:
      "Bias-cut satin slip with adjustable straps and a soft cowl neck. Falls beautifully on every shape.",
    trending: true,
  },
  {
    id: "temi-two-piece-set",
    name: "Temi Linen Short Set",
    brand: "Lagos Atelier",
    price: 28500,
    category: "Women",
    image: p4,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Ivory", hex: "#f5eddb" },
      { name: "Sage", hex: "#9aa87f" },
    ],
    material: "Washed linen",
    occasion: ["Brunch", "Vacation", "Weekend"],
    rating: 4.7,
    reviews: 78,
    stock: 42,
    tags: ["linen", "set", "shorts"],
    description:
      "Cropped linen shirt with matching tailored shorts. Breathes through Lagos heat and still looks put together.",
    new: true,
  },
  {
    id: "musa-kaftan-men",
    name: "Musa Embroidered Kaftan",
    brand: "Ilorin Native House",
    price: 34000,
    category: "Men",
    image: p7,
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "White", hex: "#f7f4ee" },
      { name: "Olive", hex: "#5e6b3a" },
    ],
    material: "Cotton poplin",
    occasion: ["Casual", "Church", "Mosque"],
    rating: 4.6,
    reviews: 156,
    stock: 64,
    tags: ["kaftan", "native", "men"],
    description:
      "Mid-length kaftan with tonal chest embroidery and side vents. Wear loose with sandals or sneakers.",
  },
  {
    id: "ifeanyi-blazer-suit",
    name: "Ifeanyi Double-Breasted Suit",
    brand: "Broad Street Bespoke",
    price: 189000,
    compareAt: 215000,
    category: "Suits",
    image: p5,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Ink", hex: "#1b2330" },
      { name: "Beige", hex: "#c8b28c" },
    ],
    material: "Italian wool",
    occasion: ["Wedding", "Formal", "Business"],
    rating: 4.9,
    reviews: 26,
    stock: 7,
    tags: ["suit", "double-breasted", "wool"],
    description:
      "Six-button double-breasted jacket with peak lapels and a tapered trouser. Fully lined, half-canvas build.",
    trending: true,
    onSale: true,
  },
  {
    id: "grace-three-piece-suit",
    name: "Grace Women's Three-Piece Suit",
    brand: "Broad Street Bespoke",
    price: 132000,
    category: "Suits",
    image: p5,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Cream", hex: "#efe6d3" },
      { name: "Terracotta", hex: "#b4573a" },
    ],
    material: "Wool crepe",
    occasion: ["Business", "Work", "Formal"],
    rating: 4.8,
    reviews: 19,
    stock: 11,
    tags: ["suit", "women", "three-piece"],
    description:
      "Longline blazer, waistcoat and wide-leg trouser in wool crepe. Boardroom power, tailored in Lagos.",
    new: true,
  },
  {
    id: "kunle-kids-native",
    name: "Kunle Kids Native Senator",
    brand: "Ilorin Native House",
    price: 18500,
    category: "Kids",
    image: p7,
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"],
    colors: [
      { name: "White", hex: "#f7f4ee" },
      { name: "Royal", hex: "#1a3a7a" },
    ],
    material: "Cotton blend",
    occasion: ["Wedding", "Family", "Church"],
    rating: 4.8,
    reviews: 44,
    stock: 33,
    tags: ["kids", "native", "senator"],
    description:
      "Little-man senator set with cap — same tailoring as the adult version, softened for play.",
    new: true,
  },
  {
    id: "zuri-kids-sneakers",
    name: "Zuri Kids Street Sneakers",
    brand: "Lekki Kicks",
    price: 15500,
    compareAt: 19500,
    category: "Kids",
    image: p9,
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Off White", hex: "#f1ece2" },
      { name: "Coral", hex: "#e2705a" },
    ],
    material: "Canvas & rubber",
    occasion: ["School", "Weekend", "Play"],
    rating: 4.5,
    reviews: 87,
    stock: 70,
    tags: ["kids", "sneakers", "shoes"],
    description:
      "Velcro-strap sneakers with a cushioned sole. Wipe-clean canvas that survives the school run.",
    onSale: true,
  },
  {
    id: "dele-adire-robe",
    name: "Dele Adire Lounge Robe",
    brand: "Nne Home",
    price: 31500,
    category: "House Wears",
    image: p4,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Indigo", hex: "#2c3f6b" },
      { name: "Ivory", hex: "#f5eddb" },
    ],
    material: "Hand-dyed adire cotton",
    occasion: ["Loungewear", "Sleep"],
    rating: 4.7,
    reviews: 58,
    stock: 25,
    tags: ["adire", "robe", "lounge", "native"],
    description:
      "Hand-dyed adire robe with a tie belt and deep pockets. Every piece dyes slightly differently.",
    new: true,
  },
  {
    id: "ola-beaded-necklace",
    name: "Ola Coral Beaded Necklace",
    brand: "Aba Weaves",
    price: 22500,
    category: "Accessories",
    image: p6,
    sizes: ["One Size"],
    colors: [
      { name: "Coral", hex: "#c0392b" },
      { name: "Gold", hex: "#c9a227" },
    ],
    material: "Coral & brass",
    occasion: ["Wedding", "Traditional", "Owambe"],
    rating: 4.9,
    reviews: 66,
    stock: 20,
    tags: ["beads", "coral", "jewellery", "native"],
    description:
      "Layered coral bead necklace with brass spacers — the finishing piece for traditional looks.",
    trending: true,
  },
  {
    id: "bimpe-raffia-bag",
    name: "Bimpe Raffia Shoulder Bag",
    brand: "Aba Weaves",
    price: 16500,
    category: "Accessories",
    image: p3,
    sizes: ["One Size"],
    colors: [
      { name: "Natural", hex: "#d9c49a" },
      { name: "Cognac", hex: "#a05a2c" },
    ],
    material: "Woven raffia & leather",
    occasion: ["Casual", "Vacation", "Brunch"],
    rating: 4.6,
    reviews: 103,
    stock: 44,
    tags: ["bag", "raffia", "accessory", "trending"],
    description:
      "Hand-woven raffia bag with a leather strap and lined interior. Roomy enough for the day.",
    trending: true,
  },
];

export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function relatedProducts(id: string, limit = 4): Product[] {
  const p = getProduct(id);
  if (!p) return PRODUCTS.slice(0, limit);
  return PRODUCTS.filter((x) => x.id !== id && x.category === p.category).slice(0, limit);
}