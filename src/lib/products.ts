import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

export type Category = "Women" | "Men" | "Kids" | "Shoes" | "House Wears" | "Suits" | "Accessories";

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