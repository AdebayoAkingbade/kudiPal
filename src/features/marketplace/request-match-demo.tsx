"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ClipboardCheck,
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
import {
  buyerLocations,
  parseBuyerRequest,
  rankMarketplaceMatches,
  sampleMessages,
} from "./matching-engine";

const pipeline = [
  { label: "NLP", value: "intent + slots", icon: MessageSquareText },
  { label: "RAG", value: "inventory + vendor memory", icon: SearchCheck },
  { label: "Rank", value: "distance, trust, price", icon: SlidersHorizontal },
  { label: "Harness", value: "evals + replay tests", icon: ClipboardCheck },
  { label: "Loop", value: "seller accept + buyer pay", icon: Sparkles },
  { label: "Guard", value: "audit, escrow, abuse checks", icon: ShieldCheck },
];

export function RequestMatchDemo({ className }: { className?: string }) {
  const [message, setMessage] = useState(sampleMessages[0]);
  const [locationLabel, setLocationLabel] = useState(buyerLocations[0].label);

  const buyerLocation = buyerLocations.find((location) => location.label === locationLabel) ?? buyerLocations[0];

  const parsedIntent = useMemo(() => parseBuyerRequest(message, buyerLocation), [message, buyerLocation]);
  const matches = useMemo(() => rankMarketplaceMatches(parsedIntent, buyerLocation), [parsedIntent, buyerLocation]);

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

                <div className="mt-3 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2">
                  <p className="text-xs font-semibold uppercase text-emerald-800">RAG evidence</p>
                  <p className="mt-1 text-xs leading-5 text-emerald-950">{match.retrievalNote}</p>
                  <p className="mt-1 text-xs text-emerald-800">
                    Matched: {match.matchedTokens.length ? match.matchedTokens.join(", ") : "location and trust signals"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-3 px-4 pb-6 sm:grid-cols-2 lg:grid-cols-6">
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
