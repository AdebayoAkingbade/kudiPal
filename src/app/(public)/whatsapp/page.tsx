import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardCheck,
  LocateFixed,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "WhatsApp",
  description: "KudiPal WhatsApp buyer, seller, payment, and fulfillment loops.",
};

const flow = [
  {
    title: "Buyer sends request",
    detail: "I want a brown timberland shoe vendor close to me.",
    icon: MessageCircle,
  },
  {
    title: "KudiPal asks for location",
    detail: "A WhatsApp location pin powers true nearby ranking.",
    icon: LocateFixed,
  },
  {
    title: "Top sellers receive pings",
    detail: "Only verified, available vendors enter the seller loop.",
    icon: ClipboardCheck,
  },
  {
    title: "Buyer pays safely",
    detail: "Paystack link, idempotent webhook, and audit trail are kept server-side.",
    icon: ShieldCheck,
  },
  {
    title: "Loop improves",
    detail: "Outcomes feed evals, prompt versions, trust scores, and retrieval quality.",
    icon: RefreshCcw,
  },
];

export default function WhatsAppPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[0.95fr_1.05fr] md:py-14">
          <div>
            <p className="text-sm font-bold uppercase text-primary">WhatsApp route</p>
            <h1 className="mt-2 font-heading text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              The marketplace lives inside chat.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Buyers can ask naturally, sellers can accept quickly, and the system can remember what worked.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/marketplace">Try Matching Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/scale">Scale Plan</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-[2rem] border-8 border-slate-950 bg-[#ECE5DD] p-4 shadow-2xl dark:border-slate-800 dark:bg-[#0B141A]">
            <div className="mb-4 flex items-center gap-2 rounded-t-[1.25rem] bg-[#075E54] px-3 py-3 text-white">
              <div className="h-9 w-9 rounded-full bg-white/20" />
              <div>
                <p className="text-sm font-bold">KudiPal</p>
                <p className="text-xs text-white/75">online</p>
              </div>
            </div>
            <ChatBubble side="buyer">I need a woman that can serve as my laundry agent</ChatBubble>
            <ChatBubble side="kudipal">
              Share your location pin and I will find verified laundry agents near you.
            </ChatBubble>
            <ChatBubble side="buyer">Lekki Phase 1 pin shared</ChatBubble>
            <ChatBubble side="kudipal">
              AdaCare Laundry Agents is 2.7 km away, rated 4.9, and can pick up today. Reply 1 to request.
            </ChatBubble>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-3 md:grid-cols-5">
            {flow.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 p-4">
                <item.icon className="h-5 w-5 text-primary" />
                <h2 className="mt-4 text-base font-bold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
              <p className="text-sm leading-6 text-emerald-950">
                Existing backend routes already include WhatsApp webhook verification, text handling, seller selection,
                Paystack payment initialization, reminder loops, prompt version rollover, and dataset export.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function ChatBubble({ children, side }: { children: React.ReactNode; side: "buyer" | "kudipal" }) {
  return (
    <div className={side === "buyer" ? "mb-3 flex justify-end" : "mb-3 flex justify-start"}>
      <p
        className={
          side === "buyer"
            ? "max-w-[82%] rounded-lg rounded-tr-sm bg-[#DCF8C6] px-3 py-2 text-sm leading-6 text-slate-950 dark:bg-[#005C4B] dark:text-white"
            : "max-w-[82%] rounded-lg rounded-tl-sm bg-white px-3 py-2 text-sm leading-6 text-slate-950 shadow-sm"
        }
      >
        {children}
      </p>
    </div>
  );
}
