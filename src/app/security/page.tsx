import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Security",
  description: "KudiPal defense-in-depth posture for WhatsApp commerce, payments, and marketplace data.",
};

const controls = [
  { title: "Identity and tenant isolation", detail: "JWT, row-level security, least privilege roles, and tenant-scoped access.", icon: Fingerprint },
  { title: "Webhook integrity", detail: "Meta verification tokens, Paystack HMAC checks, replay protection, and idempotency.", icon: KeyRound },
  { title: "Data protection", detail: "PII encryption, secret rotation, payment token boundaries, and audit retention.", icon: LockKeyhole },
  { title: "Abuse detection", detail: "Rate limits, fraud signals, bot scoring, seller trust scoring, and moderation queues.", icon: ShieldAlert },
  { title: "Continuous testing", detail: "SAST, dependency scanning, container scanning, fuzzing, and payment-flow threat models.", icon: ScanSearch },
  { title: "Monitoring", detail: "Structured logs, WAF signals, anomaly alerts, incident runbooks, and forensic trails.", icon: Activity },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <p className="text-sm font-bold uppercase text-emerald-300">Security route</p>
          <h1 className="mt-2 max-w-4xl font-heading text-4xl font-black leading-tight md:text-5xl">
            Make KudiPal expensive to attack and quick to recover.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            No serious system is unbreakable, so the standard is layered prevention, blast-radius control, detection,
            evidence, and practiced recovery.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-100">
              <Link href="/marketplace">Back to Marketplace</Link>
            </Button>
            <Button asChild size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
              <Link href="/scale">Scale Architecture</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-2 lg:grid-cols-3">
          {controls.map((control) => (
            <article key={control.title} className="rounded-lg border border-slate-200 p-4">
              <control.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-heading text-lg font-bold text-slate-950">{control.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{control.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#FFF7ED] py-10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Siren className="h-7 w-7 text-orange-700" />
            <h2 className="mt-4 font-heading text-2xl font-bold text-slate-950">Launch security gates</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              These gates should block production rollout until they are green.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "No committed secrets or generated build artifacts",
              "Production CORS and CSP tuned against real domains",
              "Payment webhook replay tests passing",
              "RLS verified with cross-tenant negative tests",
              "WAF and rate limits active on public endpoints",
              "Incident runbook and alert ownership assigned",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg bg-white p-3 text-sm font-semibold text-slate-800">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
