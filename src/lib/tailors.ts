export type Tailor = {
  id: string;
  name: string;
  specialty: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  priceFrom: number;
  turnaround: string;
  whatsapp: string;
  image: string;
  tags: string[];
};

// Curated mock designers/tailors across major Nigerian cities.
export const TAILORS: Tailor[] = [
  {
    id: "t1",
    name: "Amaka Couture Atelier",
    specialty: "Aso-ebi & bridal",
    city: "Lagos",
    address: "14 Awolowo Rd, Ikoyi, Lagos",
    lat: 6.4531, lng: 3.4319,
    rating: 4.9, reviews: 312, priceFrom: 35000, turnaround: "10–14 days",
    whatsapp: "2348012345671",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=70",
    tags: ["Bridal", "Aso-ebi", "Beadwork"],
  },
  {
    id: "t2",
    name: "Tunde Bespoke Suits",
    specialty: "Men's suits & agbada",
    city: "Lagos",
    address: "22 Adeola Odeku, Victoria Island",
    lat: 6.4281, lng: 3.4219,
    rating: 4.8, reviews: 187, priceFrom: 60000, turnaround: "14 days",
    whatsapp: "2348012345672",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=70",
    tags: ["Suits", "Agbada", "Bespoke"],
  },
  {
    id: "t3",
    name: "Chika Prints Studio",
    specialty: "Ankara ready-to-wear",
    city: "Lagos",
    address: "5 Allen Ave, Ikeja",
    lat: 6.6018, lng: 3.3515,
    rating: 4.7, reviews: 231, priceFrom: 18000, turnaround: "7 days",
    whatsapp: "2348012345673",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=70",
    tags: ["Ankara", "Casual", "Fast turnaround"],
  },
  {
    id: "t4",
    name: "Zara Adire House",
    specialty: "Adire & kaftans",
    city: "Abeokuta",
    address: "Itoku Market, Abeokuta",
    lat: 7.1557, lng: 3.3451,
    rating: 4.8, reviews: 142, priceFrom: 22000, turnaround: "10 days",
    whatsapp: "2348012345674",
    image: "https://images.unsplash.com/photo-1583391733956-6c78d4e2b7dd?w=600&q=70",
    tags: ["Adire", "Handmade", "Kaftan"],
  },
  {
    id: "t5",
    name: "Halima Northern Threads",
    specialty: "Kaftans & embroidery",
    city: "Abuja",
    address: "Wuse 2, Abuja",
    lat: 9.0765, lng: 7.4653,
    rating: 4.9, reviews: 205, priceFrom: 30000, turnaround: "12 days",
    whatsapp: "2348012345675",
    image: "https://images.unsplash.com/photo-1618436917352-cd3d11ea94bc?w=600&q=70",
    tags: ["Kaftan", "Embroidery", "Groom"],
  },
  {
    id: "t6",
    name: "Ngozi Loungewear Co.",
    specialty: "Loungewear & robes",
    city: "Enugu",
    address: "Independence Layout, Enugu",
    lat: 6.4413, lng: 7.4988,
    rating: 4.6, reviews: 98, priceFrom: 12000, turnaround: "5 days",
    whatsapp: "2348012345676",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&q=70",
    tags: ["Loungewear", "Silk", "Homewear"],
  },
  {
    id: "t7",
    name: "Efe Tailors PH",
    specialty: "Corporate & office wear",
    city: "Port Harcourt",
    address: "GRA Phase 2, Port Harcourt",
    lat: 4.8156, lng: 7.0498,
    rating: 4.7, reviews: 121, priceFrom: 20000, turnaround: "8 days",
    whatsapp: "2348012345677",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=70",
    tags: ["Corporate", "Skirts", "Blouses"],
  },
  {
    id: "t8",
    name: "Bola Shoe & Leather",
    specialty: "Custom shoes & bags",
    city: "Lagos",
    address: "Mushin Leather Row, Lagos",
    lat: 6.5347, lng: 3.3547,
    rating: 4.5, reviews: 76, priceFrom: 25000, turnaround: "14 days",
    whatsapp: "2348012345678",
    image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=600&q=70",
    tags: ["Shoes", "Leather", "Custom"],
  },
];

export const NIGERIAN_CITIES = Array.from(new Set(TAILORS.map((t) => t.city)));

// Haversine — km between two lat/lng points
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Lagos: { lat: 6.5244, lng: 3.3792 },
  Abuja: { lat: 9.0765, lng: 7.4653 },
  "Port Harcourt": { lat: 4.8156, lng: 7.0498 },
  Enugu: { lat: 6.4413, lng: 7.4988 },
  Abeokuta: { lat: 7.1557, lng: 3.3451 },
  Ibadan: { lat: 7.3775, lng: 3.9470 },
  Kano: { lat: 12.0022, lng: 8.5920 },
};