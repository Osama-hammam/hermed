export const categories = [
  {
    id: "handpieces",
    name: "Handpieces",
    icon: "🔧",
    description: "High & low speed handpieces",
  },
  {
    id: "instruments",
    name: "Instruments",
    icon: "🪛",
    description: "Diagnostic & surgical tools",
  },
  {
    id: "materials",
    name: "Materials",
    icon: "🧪",
    description: "Composites, cements & more",
  },
  {
    id: "imaging",
    name: "Imaging",
    icon: "📡",
    description: "X-ray & digital sensors",
  },
  {
    id: "hygiene",
    name: "Hygiene & PPE",
    icon: "🧤",
    description: "Gloves, masks & sterilization",
  },
  {
    id: "chairs",
    name: "Dental Chairs",
    icon: "🪑",
    description: "Premium dental units",
  },
  {
    id: "orthodontics",
    name: "Orthodontics",
    icon: "🦷",
    description: "Brackets, wires & aligners",
  },
  {
    id: "endodontics",
    name: "Endodontics",
    icon: "⚕️",
    description: "Files, motors & apex locators",
  },
];

const baseProducts = [
  {
    id: 1,
    slug: "kavo-multiflex-coupler",
    name: "KaVo Multiflex LED Coupler",
    category: "handpieces",
    price: 245.0,
    originalPrice: 290.0,
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80",
      "https://images.unsplash.com/photo-1588776814546-1ffbb9f2f42c?w=800&q=80",
    ],
    description:
      "The KaVo Multiflex LED Coupler provides brilliant LED illumination directly in the treatment field. Compatible with all KaVo handpieces, this coupler features a quick-connect system for fast instrument changes.",
    features: [
      "360° rotation",
      "LED illumination",
      "Quick-connect system",
      "Autoclavable",
    ],
    inStock: true,
    sku: "KV-MFC-LED",
    stockCount: 10,
  },
  {
    id: 2,
    slug: "nsk-ti-max-z95l",
    name: "NSK Ti-Max Z95L Air Turbine",
    category: "handpieces",
    price: 389.0,
    originalPrice: null,
    rating: 4.9,
    reviews: 87,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
    ],
    description:
      "NSK's flagship air turbine handpiece with titanium body construction. Features the Optic TiMax LED system for superior illumination and anti-retraction valve for infection control.",
    features: [
      "Titanium body",
      "Anti-retraction valve",
      "LED optic",
      "High torque",
    ],
    inStock: true,
    sku: "NSK-Z95L",
    stockCount: 10,
  },
  {
    id: 3,
    slug: "xcp-film-holders",
    name: "Dentsply XCP Film Holder Kit",
    category: "imaging",
    price: 68.5,
    originalPrice: 82.0,
    rating: 4.7,
    reviews: 203,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
    ],
    description:
      "Complete XCP film holder kit for accurate parallel technique radiography. Includes all components for anterior and posterior bitewing and periapical exposures.",
    features: [
      "Complete kit",
      "Color-coded rings",
      "Autoclavable",
      "Bite blocks included",
    ],
    inStock: true,
    sku: "DENT-XCP-KIT",
    stockCount: 10,
  },
  {
    id: 4,
    slug: "3m-filtek-supreme",
    name: "3M Filtek Supreme Ultra Composite",
    category: "materials",
    price: 112.0,
    originalPrice: null,
    rating: 4.9,
    reviews: 341,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
    ],
    description:
      "3M Filtek Supreme Ultra is a nanofilled composite resin offering exceptional esthetics and strength. The nanoparticle technology delivers a high polish that lasts.",
    features: [
      "Nanofilled technology",
      "High polishability",
      "Multiple shades",
      "Low shrinkage",
    ],
    inStock: true,
    sku: "3M-FSU-A2",
    stockCount: 10,
  },
  {
    id: 5,
    slug: "nitrile-exam-gloves",
    name: "Medicom SafeSkin Nitrile Gloves (200pk)",
    category: "hygiene",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.6,
    reviews: 512,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    ],
    description:
      "Powder-free nitrile examination gloves with textured fingertips for enhanced grip. FDA-cleared, AQL 1.5, ideal for dental procedures requiring tactile sensitivity.",
    features: ["Powder-free", "Textured fingertips", "AQL 1.5", "FDA cleared"],
    inStock: true,
    sku: "MED-NITRILE-M",
    stockCount: 10,
  },
  {
    id: 6,
    slug: "hu-friedy-gracey-curettes",
    name: "Hu-Friedy Gracey Curette Set",
    category: "instruments",
    price: 178.0,
    originalPrice: null,
    rating: 4.9,
    reviews: 96,
    badge: "Professional",
    image:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80",
    ],
    description:
      "The Hu-Friedy Gracey Curette set is the gold standard in periodontal instrumentation. Crafted from German surgical steel with precision-ground blades for effortless scaling.",
    features: [
      "German surgical steel",
      "Ergonomic handle",
      "Full set 1-18",
      "Autoclavable",
    ],
    inStock: true,
    sku: "HF-GCY-SET",
    stockCount: 10,
  },
  {
    id: 7,
    slug: "dentsply-protaper-gold",
    name: "Dentsply ProTaper Gold Files (6pk)",
    category: "endodontics",
    price: 89.0,
    originalPrice: 99.0,
    rating: 4.8,
    reviews: 178,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80",
    images: ["https://images.unsplash.com/photo-25mm-files?w=800&q=80"],
    description:
      "ProTaper Gold rotary files feature a proprietary gold thermal treatment that increases flexibility and cyclic fatigue resistance. Ideal for calcified and curved canals.",
    features: [
      "Gold thermal treatment",
      "Improved flexibility",
      "25mm working length",
      "NiTi alloy",
    ],
    inStock: true,
    sku: "DENT-PTG-F1",
    stockCount: 10,
  },
  {
    id: 8,
    slug: "ormco-damon-clear-brackets",
    name: "Ormco Damon Clear Bracket Kit",
    category: "orthodontics",
    price: 298.0,
    originalPrice: 350.0,
    rating: 4.7,
    reviews: 64,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80",
    ],
    description:
      "Damon Clear self-ligating brackets combine esthetics with the biological and clinical advantages of the Damon System. The slide mechanism reduces friction for faster treatment.",
    features: [
      "Self-ligating",
      "Ceramic construction",
      "Passive slide mechanism",
      "Complete upper & lower",
    ],
    inStock: true,
    sku: "ORM-DC-KIT",
    stockCount: 10,
  },
  {
    id: 9,
    slug: "ritter-m9-autoclave",
    name: "Midmark M9 UltraClave Autoclave",
    category: "hygiene",
    price: 2150.0,
    originalPrice: null,
    rating: 4.9,
    reviews: 43,
    badge: "Premium",
    image:
      "https://images.unsplash.com/photo-1583912267550-d6fef34e3e97?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1583912267550-d6fef34e3e97?w=800&q=80",
    ],
    description:
      "The Midmark M9 UltraClave is the most trusted autoclave in dentistry. Fully automatic gravity and vacuum cycles with advanced safety controls and digital display.",
    features: [
      "Fully automatic",
      "Gravity & vacuum cycles",
      "Digital display",
      "FDA cleared",
    ],
    inStock: true,
    sku: "MDM-M9-AUTO",
    stockCount: 10,
  },
  {
    id: 10,
    slug: "planmeca-romexis-sensor",
    name: "Planmeca ProSensor HD Digital X-Ray",
    category: "imaging",
    price: 1890.0,
    originalPrice: 2100.0,
    rating: 4.8,
    reviews: 29,
    badge: "Premium",
    image:
      "https://images.unsplash.com/photo-1516069677018-378515003435?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1516069677018-378515003435?w=800&q=80",
    ],
    description:
      "Planmeca ProSensor HD delivers the highest resolution intraoral images with minimal radiation. The thin, rounded sensor profile ensures maximum patient comfort.",
    features: [
      "Ultra-high resolution",
      "Low radiation",
      "Rounded edges",
      "USB connection",
    ],
    inStock: true,
    sku: "PLM-PS-HD",
    stockCount: 10,
  },
  {
    id: 11,
    slug: "ivoclar-tetric-evoflow",
    name: "Ivoclar Tetric EvoFlow Flowable",
    category: "materials",
    price: 94.0,
    originalPrice: null,
    rating: 4.7,
    reviews: 156,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80",
    ],
    description:
      "Tetric EvoFlow is a nanohybrid flowable composite with Ivocerin photoinitiator for rapid and thorough polymerization. Ideal for small cavities and liner applications.",
    features: [
      "Nanohybrid filler",
      "Ivocerin technology",
      "Thixotropic consistency",
      "12 shades",
    ],
    inStock: true,
    sku: "IVO-TEF-A2",
    stockCount: 10,
  },
  {
    id: 12,
    slug: "henry-schein-explorer",
    name: "Henry Schein Explorer & Mirror Set",
    category: "instruments",
    price: 42.0,
    originalPrice: null,
    rating: 4.5,
    reviews: 289,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80",
    ],
    description:
      "Professional diagnostic set featuring a No. 23 shepherd's hook explorer and front-surface rhodium mirror. Stainless steel construction with comfortable hex handle.",
    features: [
      "Stainless steel",
      "Hex handle",
      "Front-surface mirror",
      "Autoclavable",
    ],
    inStock: true,
    sku: "HS-EXP-SET",
    stockCount: 10,
  },
];

export const products = Array.from({ length: 100 }, (_, i) => {
  const base = baseProducts[i % baseProducts.length];
  const name = `${base.name} #${i + 1}`;
  return {
    ...base,
    id: i + 1,
    name: name,
    slug: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    sku: `${base.sku}-${1000 + i}`,
    stockCount: 10,
    inStock: true,
  };
});

export const orders = [
  {
    id: "ORD-2024-001",
    customer: "Dr. Ahmed Hassan",
    date: "2024-01-15",
    status: "Delivered",
    total: 634.0,
    items: 3,
  },
  {
    id: "ORD-2024-002",
    customer: "Dr. Sara Al-Rashid",
    date: "2024-01-18",
    status: "Processing",
    total: 298.0,
    items: 1,
  },
  {
    id: "ORD-2024-003",
    customer: "Nile Dental Clinic",
    date: "2024-01-20",
    status: "Shipped",
    total: 1456.5,
    items: 5,
  },
  {
    id: "ORD-2024-004",
    customer: "Dr. Khaled Ibrahim",
    date: "2024-01-22",
    status: "Pending",
    total: 89.0,
    items: 1,
  },
  {
    id: "ORD-2024-005",
    customer: "Cairo Dental Center",
    date: "2024-01-25",
    status: "Delivered",
    total: 2387.0,
    items: 7,
  },
];
