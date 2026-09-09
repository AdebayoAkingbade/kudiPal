"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Clock3,
  MapPin,
  MessageSquareText,
  Navigation,
  SearchCheck,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BuyerLocation = {
  label: string;
  lat: number;
  lng: number;
};

type SellerListing = {
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
};

type ParsedIntent = {
  intent: "BUY_REQUEST" | "SERVICE_REQUEST" | "ERRAND_REQUEST" | "UNKNOWN";
  item: string;
  attributes: string[];
  budget: string;
  locationSignal: string;
  needsLocationPin: boolean;
  confidence: number;
};

type RankedMatch = SellerListing & {
  distanceKm: number;
  score: number;
};

const buyerLocations: BuyerLocation[] = [
  { label: "Lekki Phase 1", lat: 6.4474, lng: 3.4723 },
  { label: "Victoria Island", lat: 6.4281, lng: 3.4219 },
  { label: "Yaba", lat: 6.5158, lng: 3.3717 },
  { label: "Ikeja", lat: 6.6018, lng: 3.3515 },
];

const sampleMessages = [
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
  },
];

const pipeline = [
  { label: "NLP", value: "intent + slots", icon: MessageSquareText },
  { label: "RAG", value: "inventory + vendor memory", icon: SearchCheck },
  { label: "Rank", value: "distance, trust, price", icon: SlidersHorizontal },
  { label: "Loop", value: "seller accept + buyer pay", icon: Sparkles },
  { label: "Guard", value: "audit, escrow, abuse checks", icon: ShieldCheck },
];

export function RequestMatchDemo({ className }: { className?: string }) {
  const [message, setMessage] = useState(sampleMessages[0]);
  const [locationLabel, setLocationLabel] = useState(buyerLocations[0].label);

  const buyerLocation = buyerLocations.find((location) => location.label === locationLabel) ?? buyerLocations[0];

  const parsedIntent = useMemo(() => parseIntent(message, buyerLocation), [message, buyerLocation]);
  const matches = useMemo(() => rankMatches(parsedIntent, buyerLocation), [parsedIntent, buyerLocation]);

  return (
    <section className={cn("border-y border-slate-200 bg-slate-50", className)}>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">WhatsApp inbox</p>
              <h2 className="font-heading text-2xl font-bold text-slate-950">Live buyer request</h2>
            </div>
            <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              Prototype
            </span>
          </div>

          <label className="text-sm font-semibold text-slate-800" htmlFor="buyer-message">
            Buyer message
          </label>
          <textarea
            id="buyer-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="mt-2 min-h-28 w-full resize-none rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-base leading-6 text-slate-950 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {sampleMessages.map((sample) => (
              <Button
                key={sample}
                type="button"
                variant={sample === message ? "default" : "outline"}
                size="sm"
                onClick={() => setMessage(sample)}
                className="h-auto min-h-9 whitespace-normal text-left"
              >
                {sample}
              </Button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1.15fr]">
            <label className="block text-sm font-semibold text-slate-800" htmlFor="location-pin">
              Location pin
              <select
                id="location-pin"
                value={locationLabel}
                onChange={(event) => setLocationLabel(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                {buyerLocations.map((location) => (
                  <option key={location.label} value={location.label}>
                    {location.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-lg border border-slate-200 bg-slate-950 p-3 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Navigation className="h-4 w-4 text-emerald-300" />
                {parsedIntent.locationSignal}
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                {parsedIntent.needsLocationPin
                  ? "Ranking is using the shared WhatsApp pin because the message says close to me."
                  : "Ranking can use a typed location, a saved buyer address, or a live WhatsApp pin."}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <IntentStat label="Intent" value={parsedIntent.intent.replace("_", " ")} />
            <IntentStat label="Item" value={parsedIntent.item} />
            <IntentStat label="Attributes" value={parsedIntent.attributes.join(", ") || "none"} />
            <IntentStat label="Confidence" value={`${Math.round(parsedIntent.confidence * 100)}%`} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Nearby marketplace</p>
              <h2 className="font-heading text-2xl font-bold text-slate-950">Top local matches</h2>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {buyerLocation.label}
            </div>
          </div>

          <div className="grid gap-3">
            {matches.map((match, index) => (
              <article key={match.id} className="rounded-lg border border-slate-200 p-3 transition hover:border-primary/40 hover:bg-emerald-50/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-slate-950">{match.businessName}</h3>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{match.listing}</p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                    {Math.round(match.score * 100)}%
                  </span>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  <MatchMetric icon={MapPin} label={`${match.distanceKm.toFixed(1)} km`} value={match.location} />
                  <MatchMetric icon={Clock3} label={match.responseTime} value={match.priceLabel} />
                  <MatchMetric icon={BadgeCheck} label={`${match.rating.toFixed(1)} rating`} value={match.kind} />
                  <MatchMetric icon={ShieldCheck} label="Trust" value={match.trust} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {match.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-3 px-4 pb-6 sm:grid-cols-2 lg:grid-cols-5">
        {pipeline.map((stage) => (
          <div key={stage.label} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <stage.icon className="h-4 w-4 text-primary" />
              <p className="text-sm font-bold text-slate-950">{stage.label}</p>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-600">{stage.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function IntentStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

function MatchMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="break-words text-xs leading-5 text-slate-500">{value}</p>
      </div>
    </div>
  );
}

function parseIntent(message: string, buyerLocation: BuyerLocation): ParsedIntent {
  const lower = message.toLowerCase();
  const attributes = [
    lower.includes("brown") ? "brown" : "",
    lower.includes("woman") || lower.includes("female") ? "female agent preferred" : "",
    lower.includes("close to me") || lower.includes("near me") ? "nearby" : "",
  ].filter(Boolean);

  const needsLocationPin = /close to me|near me|around me/.test(lower) || !/(lekki|yaba|ikeja|island|ikoyi|ajah)/.test(lower);
  const budgetMatch = lower.match(/(?:ngn|n)?\s?(\d{2,3})(?:k|,000)/);
  const budget = budgetMatch ? `NGN ${Number(budgetMatch[1]) * 1000}` : "not stated";

  if (/timberland|shoe|boot|vendor/.test(lower)) {
    return {
      intent: "BUY_REQUEST",
      item: "timberland shoe",
      attributes,
      budget,
      locationSignal: needsLocationPin ? `${buyerLocation.label} pin` : "typed location",
      needsLocationPin,
      confidence: 0.91,
    };
  }

  if (/laundry|wash|cleaning|agent/.test(lower)) {
    return {
      intent: "SERVICE_REQUEST",
      item: "laundry agent",
      attributes,
      budget,
      locationSignal: needsLocationPin ? `${buyerLocation.label} pin` : "typed location",
      needsLocationPin,
      confidence: 0.88,
    };
  }

  if (/errand|erand|runner|dispatch|boy/.test(lower)) {
    return {
      intent: "ERRAND_REQUEST",
      item: "errand runner",
      attributes,
      budget,
      locationSignal: needsLocationPin ? `${buyerLocation.label} pin` : "typed location",
      needsLocationPin,
      confidence: 0.84,
    };
  }

  return {
    intent: "UNKNOWN",
    item: "unknown",
    attributes,
    budget,
    locationSignal: needsLocationPin ? `${buyerLocation.label} pin` : "typed location",
    needsLocationPin,
    confidence: 0.34,
  };
}

function rankMatches(parsedIntent: ParsedIntent, buyerLocation: BuyerLocation): RankedMatch[] {
  const queryTokens = tokenize(`${parsedIntent.item} ${parsedIntent.attributes.join(" ")}`);

  return listings
    .map((listing) => {
      const overlap = listing.tokens.filter((token) => queryTokens.includes(token)).length;
      const relevance = queryTokens.length ? overlap / queryTokens.length : 0;
      const distanceKm = distanceBetweenKm(buyerLocation, listing);
      const distanceScore = Math.max(0, 1 - distanceKm / 18);
      const trustScore = listing.rating / 5;
      const score = relevance * 0.5 + distanceScore * 0.32 + trustScore * 0.18;

      return {
        ...listing,
        distanceKm,
        score,
      };
    })
    .filter((match) => match.score >= 0.4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
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
