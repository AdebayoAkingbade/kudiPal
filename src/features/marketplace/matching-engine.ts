export type BuyerLocation = {
  label: string;
  lat: number;
  lng: number;
};

export type SellerListing = {
  id: string;
  businessName: string;
  listing: string;
  kind: string;
  location: string;
  lat: number;
  lng: number;
  priceLabel: string;
  rating: number;
  responseTime: string;
  trust: string;
  tokens: string[];
  tags: string[];
  retrievalNote: string;
};

export type ParsedIntent = {
  intent: "BUY_REQUEST" | "SERVICE_REQUEST" | "ERRAND_REQUEST" | "UNKNOWN";
  item: string;
  attributes: string[];
  budget: string;
  locationSignal: string;
  needsLocationPin: boolean;
  confidence: number;
};

export type RankedMatch = SellerListing & {
  distanceKm: number;
  matchedTokens: string[];
  score: number;
};

export const buyerLocations: BuyerLocation[] = [
  { label: "Lekki Phase 1", lat: 6.4474, lng: 3.4723 },
  { label: "Victoria Island", lat: 6.4281, lng: 3.4219 },
  { label: "Yaba", lat: 6.5158, lng: 3.3717 },
  { label: "Ikeja", lat: 6.6018, lng: 3.3515 },
];

export const sampleMessages = [
  "I want a brown timberland shoe vendor close to me",
  "I need a woman that can serve as my laundry agent",
  "I need an erand boy",
];

const listings: SellerListing[] = [
  {
    id: "lekki-boots",
    businessName: "Lekki Boots Supply",
    listing: "Brown Timberland shoe vendor",
    kind: "Product vendor",
    location: "Lekki Phase 1",
    lat: 6.4479,
    lng: 3.4718,
    priceLabel: "from NGN 34,000",
    rating: 4.8,
    responseTime: "7 min",
    trust: "Verified inventory and payout account",
    tokens: ["brown", "timberland", "shoe", "boot", "vendor", "footwear"],
    tags: ["pickup", "same-day delivery", "inventory checked"],
    retrievalNote: "Inventory memory says brown Timberland stock was confirmed today.",
  },
  {
    id: "island-shoe-market",
    businessName: "Island Shoe Market",
    listing: "Timberland and work boot seller",
    kind: "Product vendor",
    location: "Oniru",
    lat: 6.4317,
    lng: 3.4624,
    priceLabel: "from NGN 37,500",
    rating: 4.5,
    responseTime: "11 min",
    trust: "Three recent fulfilled orders",
    tokens: ["timberland", "shoe", "boot", "seller", "vendor", "brown"],
    tags: ["delivery", "photos available", "escrow ready"],
    retrievalNote: "Recent orders mention Timberland boots, delivery photos, and escrow readiness.",
  },
  {
    id: "adacare-laundry",
    businessName: "AdaCare Laundry Agents",
    listing: "Female-led laundry pickup agent",
    kind: "Service agent",
    location: "Victoria Island",
    lat: 6.4282,
    lng: 3.4221,
    priceLabel: "from NGN 2,500 per bag",
    rating: 4.9,
    responseTime: "5 min",
    trust: "Identity verified field team",
    tokens: ["woman", "female", "laundry", "agent", "wash", "ironing", "pickup"],
    tags: ["female-led team", "pickup", "next-day return"],
    retrievalNote: "Service profile covers female-led pickup teams and next-day return.",
  },
  {
    id: "cleanloop",
    businessName: "CleanLoop Services",
    listing: "Laundry collection and delivery",
    kind: "Service agent",
    location: "Ikoyi",
    lat: 6.4549,
    lng: 3.4246,
    priceLabel: "from NGN 3,000 per bag",
    rating: 4.6,
    responseTime: "14 min",
    trust: "Insured delivery partner",
    tokens: ["laundry", "agent", "wash", "cleaning", "pickup", "delivery"],
    tags: ["pickup", "insured", "invoice available"],
    retrievalNote: "Policy memory confirms insured laundry collection and delivery.",
  },
  {
    id: "swifthands",
    businessName: "SwiftHands Errands",
    listing: "Errand runner for pickup and delivery",
    kind: "Errand agent",
    location: "Yaba",
    lat: 6.5161,
    lng: 3.3714,
    priceLabel: "from NGN 1,500 per task",
    rating: 4.7,
    responseTime: "6 min",
    trust: "Live location tracking enabled",
    tokens: ["errand", "erand", "runner", "boy", "agent", "pickup", "delivery"],
    tags: ["live tracking", "cashless", "same-day"],
    retrievalNote: "Fulfillment memory shows same-day errand completion with live tracking.",
  },
  {
    id: "ikeja-runners",
    businessName: "Ikeja Task Runners",
    listing: "Errand agent and dispatch assistant",
    kind: "Errand agent",
    location: "Ikeja",
    lat: 6.6019,
    lng: 3.3512,
    priceLabel: "from NGN 2,000 per task",
    rating: 4.4,
    responseTime: "10 min",
    trust: "Background checked runners",
    tokens: ["errand", "runner", "agent", "dispatch", "assistant", "delivery"],
    tags: ["background checked", "dispatch", "scheduled"],
    retrievalNote: "Trust profile includes background checks and scheduled dispatch support.",
  },
];

export function parseBuyerRequest(message: string, buyerLocation: BuyerLocation): ParsedIntent {
  const lower = normalizeMessage(message);
  const attributes = [
    lower.includes("brown") ? "brown" : "",
    lower.includes("woman") || lower.includes("female") ? "female agent preferred" : "",
    /close to me|near me|around me/.test(lower) ? "nearby" : "",
  ].filter(Boolean);

  const needsLocationPin = /close to me|near me|around me/.test(lower) || !/(lekki|yaba|ikeja|island|ikoyi|ajah)/.test(lower);
  const budgetMatch = lower.match(/(?:ngn|n)?\s?(\d{2,3})(?:k|,000)/);
  const budget = budgetMatch ? `NGN ${Number(budgetMatch[1]) * 1000}` : "not stated";

  if (/timberland|shoe|boot|vendor/.test(lower)) {
    return createIntent("BUY_REQUEST", "timberland shoe", attributes, budget, buyerLocation, needsLocationPin, 0.91);
  }

  if (/laundry|wash|cleaning|agent/.test(lower)) {
    return createIntent("SERVICE_REQUEST", "laundry agent", attributes, budget, buyerLocation, needsLocationPin, 0.88);
  }

  if (/errand|erand|runner|dispatch|boy/.test(lower)) {
    return createIntent("ERRAND_REQUEST", "errand runner", attributes, budget, buyerLocation, needsLocationPin, 0.84);
  }

  return createIntent("UNKNOWN", "unknown", attributes, budget, buyerLocation, needsLocationPin, 0.34);
}

export function rankMarketplaceMatches(
  parsedIntent: ParsedIntent,
  buyerLocation: BuyerLocation,
  candidateListings = listings,
): RankedMatch[] {
  const queryTokens = tokenize(`${parsedIntent.item} ${parsedIntent.attributes.join(" ")}`);

  return candidateListings
    .map((listing) => {
      const matchedTokens = listing.tokens.filter((token) => queryTokens.includes(token));
      const relevance = queryTokens.length ? matchedTokens.length / queryTokens.length : 0;
      const distanceKm = distanceBetweenKm(buyerLocation, listing);
      const distanceScore = Math.max(0, 1 - distanceKm / 18);
      const trustScore = listing.rating / 5;
      const score = relevance * 0.5 + distanceScore * 0.32 + trustScore * 0.18;

      return {
        ...listing,
        distanceKm,
        matchedTokens,
        score,
      };
    })
    .filter((match) => match.score >= 0.4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function createIntent(
  intent: ParsedIntent["intent"],
  item: string,
  attributes: string[],
  budget: string,
  buyerLocation: BuyerLocation,
  needsLocationPin: boolean,
  confidence: number,
): ParsedIntent {
  return {
    intent,
    item,
    attributes,
    budget,
    locationSignal: needsLocationPin ? `${buyerLocation.label} pin` : "typed location",
    needsLocationPin,
    confidence,
  };
}

function normalizeMessage(message: string) {
  return message.toLowerCase().replace(/\berand\b/g, "errand erand");
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function distanceBetweenKm(origin: BuyerLocation, destination: Pick<SellerListing, "lat" | "lng">) {
  const radiusKm = 6371;
  const latDelta = toRadians(destination.lat - origin.lat);
  const lngDelta = toRadians(destination.lng - origin.lng);
  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(toRadians(origin.lat)) *
      Math.cos(toRadians(destination.lat)) *
      Math.sin(lngDelta / 2) *
      Math.sin(lngDelta / 2);

  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
