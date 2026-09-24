// Country Delight inspired B2B Dairy Catalog for THEMOINMALIK DAIRY

export const CATEGORY_IMAGE_MAP = {
  "milk-full-cream": "/images/fresh_full_cream_milk.jpg",
  "milk-cow": "/images/fresh_pure_cow_milk.jpg",
  "milk-buffalo": "/images/fresh_buffalo_milk.jpg",
  "milk-toned": "/images/fresh_toned_milk.jpg",
  "paneer-fresh": "/images/fresh_malai_paneer.jpg",
  "dahi-fresh": "/images/fresh_dahi_curd.jpg",
  "ghee-pure": "/images/pure_desi_ghee.jpg",
  "butter-fresh": "/images/fresh_butter_block.jpg"
};

export const CATEGORY_FALLBACK_IMAGES = {
  "Milk": "/images/fresh_full_cream_milk.jpg",
  "Paneer": "/images/fresh_malai_paneer.jpg",
  "Dahi": "/images/fresh_dahi_curd.jpg",
  "Ghee": "/images/pure_desi_ghee.jpg",
  "Butter": "/images/fresh_butter_block.jpg"
};

export const CATEGORY_ICONS = {
  "Milk": "🥛",
  "Paneer": "🧀",
  "Dahi": "🥣",
  "Ghee": "🛢️",
  "Butter": "🧈"
};

/**
 * Enriches a raw product row from Google Sheet into a full UI product object
 */
export function enrichSheetProduct(sheetItem) {
  const category = sheetItem.category || "Milk";
  const image = CATEGORY_IMAGE_MAP[sheetItem.id] ||
                CATEGORY_FALLBACK_IMAGES[category] ||
                "/images/fresh_full_cream_milk.jpg";
  const categoryIcon = CATEGORY_ICONS[category] || "🥛";

  return {
    id: sheetItem.id || `prod-${Math.random().toString(36).substr(2, 9)}`,
    name: sheetItem.name || "Dairy Product",
    category: category,
    packaging: sheetItem.packaging || "Standard Commercial Pack",
    pricePerUnit: Number(sheetItem.pricePerUnit) || 0,
    mrp: Number(sheetItem.mrp) || Math.round((Number(sheetItem.pricePerUnit) || 0) * 1.15),
    available: Boolean(sheetItem.available),
    image: image,
    categoryIcon: categoryIcon,
    description: sheetItem.description || `100% pure commercial grade ${category.toLowerCase()} directly sourced for professional kitchens.`,
    moq: 1,
    badge: sheetItem.badge || (sheetItem.available ? "Fresh Batch" : "Out of Stock"),
    purityTag: sheetItem.purityTag || "100% Pure Farm Fresh"
  };
}

export const CATEGORIES_WITH_ICONS = [
  { name: "All Products", icon: "✨" },
  { name: "Milk", icon: "🥛" },
  { name: "Paneer", icon: "🧀" },
  { name: "Dahi", icon: "🥣" },
  { name: "Ghee", icon: "🛢️" },
  { name: "Butter", icon: "🧈" }
];

export const DELIVERY_OPTIONS = [
  {
    id: "delivery",
    title: "Delivery as per Demand",
    subtitle: "Chilled dispatch to your commercial kitchen / store",
    badge: "Direct Delivery",
    icon: "Truck"
  },
  {
    id: "pickup",
    title: "Self Pick-up",
    subtitle: "Collect directly from THEMOINMALIK DAIRY chilling center",
    badge: "Plant Pickup",
    icon: "Store"
  }
];

// Clean defaults for real buyers
export const DEFAULT_BUSINESS_PROFILE = {
  businessName: "",
  contactPerson: "",
  phone: "",
  deliveryAddress: "",
  areaPincode: "",
  notes: ""
};

// Fallback initial products if sheet is loading
export const INITIAL_PRODUCTS = [
  {
    id: "milk-full-cream",
    name: "Full Cream Buffalo Milk",
    category: "Milk",
    description: "Naturally thick farm-fresh milk with natural cream layer. Zero adulteration, tested for 70+ parameters.",
    image: "/images/fresh_full_cream_milk.jpg",
    packaging: "Crate (12 Litres / 24 Pouches)",
    mrp: 960,
    pricePerUnit: 816,
    available: true,
    badge: "Bestseller",
    purityTag: "100% Pure & Thick",
    categoryIcon: "🥛"
  },
  {
    id: "milk-cow",
    name: "Pure Cow Milk",
    category: "Milk",
    description: "Pure cow milk with natural golden cream. Sourced from grass-fed cows, naturally sweet and easy to digest.",
    image: "/images/fresh_pure_cow_milk.jpg",
    packaging: "Crate (12 Litres / 24 Pouches)",
    mrp: 816,
    pricePerUnit: 696,
    available: true,
    badge: "100% Cow Milk",
    purityTag: "Naturally A2 Rich",
    categoryIcon: "🥛"
  },
  {
    id: "milk-buffalo",
    name: "Special Buffalo Milk",
    category: "Milk",
    description: "High fat creamy buffalo milk. Gives rich texture to tea, thick malai, rabri, and artisanal sweets.",
    image: "/images/fresh_buffalo_milk.jpg",
    packaging: "Crate (12 Litres / 24 Pouches)",
    mrp: 980,
    pricePerUnit: 840,
    available: true,
    badge: "High Cream",
    purityTag: "Extra Creamy",
    categoryIcon: "🥛"
  },
  {
    id: "milk-toned",
    name: "Toned Fresh Milk",
    category: "Milk",
    description: "Pasteurized, homogenized light balanced milk. Standard daily supply for restaurants, cafes, and milk bars.",
    image: "/images/fresh_toned_milk.jpg",
    packaging: "Crate (12 Litres / 24 Pouches)",
    mrp: 720,
    pricePerUnit: 624,
    available: true,
    badge: "Daily Saver",
    purityTag: "Consistent Quality",
    categoryIcon: "🥛"
  },
  {
    id: "paneer-fresh",
    name: "Fresh Malai Paneer (5kg Block)",
    category: "Paneer",
    description: "Made from pure buffalo milk within hours of milking. Softest melt-in-mouth texture, zero starch or palm oil.",
    image: "/images/fresh_malai_paneer.jpg",
    packaging: "5 Kg Block",
    mrp: 1950,
    pricePerUnit: 1650,
    available: true,
    badge: "Chef's Choice",
    purityTag: "Zero Starch / Pure",
    categoryIcon: "🧀"
  },
  {
    id: "dahi-fresh",
    name: "Fresh Set Dahi (10kg Bucket)",
    category: "Dahi",
    description: "Thick, naturally set commercial grade curd with live probiotic cultures. Rich consistency for raita and lassi.",
    image: "/images/fresh_dahi_curd.jpg",
    packaging: "10 Kg Bucket",
    mrp: 900,
    pricePerUnit: 750,
    available: true,
    badge: "High Yield",
    purityTag: "Thick & Natural",
    categoryIcon: "🥣"
  },
  {
    id: "ghee-pure",
    name: "Pure Golden Danedaar Desi Ghee",
    category: "Ghee",
    description: "Traditional granular bilona style 100% pure desi ghee. Unrivalled aroma and rich golden grain for commercial kitchens.",
    image: "/images/pure_desi_ghee.jpg",
    packaging: "15 Kg Tin",
    mrp: 10500,
    pricePerUnit: 8700,
    available: true,
    badge: "100% Danedaar",
    purityTag: "Aromatic Pure Ghee",
    categoryIcon: "🛢️"
  },
  {
    id: "butter-fresh",
    name: "Fresh Creamery Butter (5kg Slab)",
    category: "Butter",
    description: "Freshly churned pure milk fat butter slab. Smooth spreading, superior browning for gravies, toasts, and parathas.",
    image: "/images/fresh_butter_block.jpg",
    packaging: "5 Kg Slab",
    mrp: 2750,
    pricePerUnit: 2350,
    available: true,
    badge: "Fresh Churned",
    purityTag: "Pure Milk Fat",
    categoryIcon: "🧈"
  }
];
