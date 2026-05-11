import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// ── Word-by-word scroll reveal ──
function WordReveal({ text }: { text: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <span ref={ref} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <motion.span key={i} className="inline-block mr-[0.25em]"
          initial={{ opacity: 0.07, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ── Fade-in on scroll ──
function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string; key?: React.Key;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-6%" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Intent ticker ──
const INTENT_PHRASES = [
  `"anyone know a PM tool that doesn't feel like enterprise bloat?"`,
  `"switching from Asana next month, need recs from fellow founders"`,
  `"been manually searching twitter for early adopters all week"`,
  `"frustrated with cold outreach — open to smarter ways to find customers"`,
  `"looking for people who actually need my product, not spray-and-pray"`,
];

function IntentTicker() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % INTENT_PHRASES.length), 3800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="overflow-hidden h-6 flex items-center max-w-full">
      <AnimatePresence mode="wait">
        <motion.p key={index}
          className="text-[12px] sm:text-[13px] font-mono text-gray-500 truncate min-w-0 w-full"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
        >
          <span className="font-semibold text-[#2563EB] mr-1.5">@founder:</span>
          {INTENT_PHRASES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ── Lead digest preview ──
const EXAMPLE_LEADS = [
  {
    handle: "@aaronfields_",
    time: "43 min ago",
    body: "switching from Jira next month. nothing works for our 12-person eng team. need something lightweight and actually opinionated.",
    intent: "Actively switching",
    fitLabel: "Strong match",
    fitStrong: true,
  },
  {
    handle: "@sara_builds",
    time: "2h ago",
    body: "does anyone have a PM tool that doesn't require a 2hr onboarding? we're a small startup, jira feels like overkill.",
    intent: "Pain-driven search",
    fitLabel: "Strong match",
    fitStrong: true,
  },
  {
    handle: "@mikepascale",
    time: "5h ago",
    body: "open to recs — Notion isn't cutting it for our engineering workflows. what are people using?",
    intent: "Seeking alternatives",
    fitLabel: "Good match",
    fitStrong: false,
  },
];

function LeadPreviewSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-8 sm:mb-10">
          <p className="text-[10px] uppercase tracking-[0.15em] font-medium mb-3 text-gray-400">What you'd receive</p>
          <h2 className="font-display font-bold text-[24px] sm:text-[32px] lg:text-[40px] leading-tight mb-2 text-gray-900">
            Your daily lead digest.
          </h2>
          <p className="text-[14px] sm:text-[15px] max-w-[460px] leading-[1.7] text-gray-500">
            Every morning, a curated list of X conversations that match your product. Real posts, full context, no noise.
          </p>
        </FadeIn>

        <div ref={ref} className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          {/* Header bar */}
          <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]/50 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-wide text-gray-400">spoolx · daily digest</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono italic text-gray-300">example output</span>
          </div>

          {/* Query */}
          <div className="px-4 sm:px-5 py-2 sm:py-2.5 border-b border-gray-100 bg-gray-50/50 overflow-hidden">
            <p className="text-[10px] sm:text-[11px] font-mono text-gray-400 truncate">
              matching:{" "}
              <span className="font-medium text-gray-600">"project management" · "switching" · "startup"</span>
            </p>
          </div>

          {/* Lead rows */}
          <div className="divide-y divide-gray-100">
            {EXAMPLE_LEADS.map((lead, i) => (
              <motion.div key={lead.handle}
                className="px-4 sm:px-5 py-4 sm:py-5 hover:bg-gray-50/70 transition-colors duration-200"
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Row top: avatar + handle + fit label */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-mono text-gray-400">{lead.handle[1].toUpperCase()}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <span className="text-[12px] sm:text-[13px] font-semibold text-gray-800 truncate">{lead.handle}</span>
                      <span className="text-[10px] sm:text-[11px] font-mono text-gray-400 shrink-0">{lead.time}</span>
                    </div>
                  </div>
                  {/* Fit label — always visible, intent label hidden on mobile */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] sm:text-[11px] font-medium whitespace-nowrap ${lead.fitStrong ? "text-[#2563EB]" : "text-[#93c5fd]"}`}>
                      {lead.fitLabel}
                    </span>
                    <span className="hidden sm:inline text-[10px] font-mono text-gray-400 whitespace-nowrap">· {lead.intent}</span>
                  </div>
                </div>
                {/* Body text — no left indent on mobile */}
                <p className="text-[13px] sm:text-[14px] leading-relaxed text-gray-500 pl-0 sm:pl-8">{lead.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-5 py-2 sm:py-2.5 border-t border-gray-100 bg-gray-50 flex justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono text-gray-400">3 of 12 leads today</span>
            <span className="text-[10px] sm:text-[11px] font-mono text-gray-400">9 more →</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Waitlist form ──
function WaitlistForm({ id = "waitlist-form" }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status !== "idle") return;
    setStatus("loading");
    try {
      await addDoc(collection(db, "waitlist"), { email, createdAt: serverTimestamp() });
      setStatus("success");
      setMsg("You're on the list. We'll be in touch.");
    } catch {
      setStatus("error");
      setMsg("Something went wrong — try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div id={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex items-center gap-2.5 text-emerald-600"
      >
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span className="text-[14px] font-medium">{msg}</span>
      </motion.div>
    );
  }

  return (
    <form id={id} onSubmit={submit} className="flex flex-col sm:flex-row gap-2 w-full sm:max-w-[400px]">
      <input type="email" required placeholder="your@email.com"
        value={email} disabled={status === "loading"}
        onChange={e => setEmail(e.target.value)}
        className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl px-4 py-3 sm:py-2.5 text-[15px] sm:text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2563EB]/40 focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
      />
      <button type="submit" disabled={status === "loading"}
        className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl bg-[#2563EB] text-white text-[15px] sm:text-[14px] font-semibold hover:bg-[#1d4ed8] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request access"}
      </button>
      {status === "error" && <p className="text-[12px] text-red-500 mt-1">{msg}</p>}
    </form>
  );
}

// ══════════════════════════════════════════════════════
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToWaitlist = () =>
    document.getElementById("hero-waitlist")?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <div className="min-h-screen bg-[#f9f9f7] text-gray-900 font-sans antialiased overflow-x-hidden">

      {/* ── NAV ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-[#F0F0EE]/95 backdrop-blur-xl border-gray-200"
          : "bg-[#F0F0EE] border-gray-200"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <a href="/" className="text-[17px] sm:text-[18px] font-display font-bold tracking-tight text-gray-900">
            spoolx
          </a>

          <nav className="hidden md:flex items-center gap-7 text-[13px] text-gray-500">
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#principles" className="hover:text-gray-900 transition-colors">Principles</a>
          </nav>

          <button onClick={scrollToWaitlist}
            className="text-[12px] sm:text-[13px] font-medium px-3.5 sm:px-4 py-1.5 rounded-full border border-[#2563EB]/30 text-[#2563EB] hover:border-[#2563EB]/60 transition-all whitespace-nowrap"
          >
            Request access
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-6xl mx-auto w-full">

          {/* Ticker */}
          <motion.div className="mb-8 sm:mb-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.7 }}
          >
            <p className="text-[10px] uppercase tracking-[0.15em] font-medium mb-2.5 text-gray-400">
              happening on X right now
            </p>
            <IntentTicker />
          </motion.div>

          {/* Headline — no hardcoded line breaks, let text flow naturally */}
          <motion.h1
            className="font-display font-bold leading-[1.08] tracking-tight mb-5 text-[30px] sm:text-[46px] lg:text-[58px] text-gray-900"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            The people who need your product are{" "}
            <span className="italic text-gray-400">tweeting</span>{" "}
            right now.
          </motion.h1>

          {/* Sub */}
          <motion.p
            className="text-[14px] sm:text-[16px] max-w-[480px] mb-8 sm:mb-9 leading-[1.75] text-gray-500"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            spoolx monitors X for high-intent conversations matching your product, then delivers a daily digest of warm leads — people actively looking for what you built.
          </motion.p>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div id="hero-waitlist">
              <WaitlistForm id="waitlist-form" />
            </div>
            <p className="text-[11px] sm:text-[12px] mt-3 text-gray-400">
              Early access — we review every request personally.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── LEAD PREVIEW ── */}
      <LeadPreviewSection />

      {/* ── STATEMENT ── */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          {/* Label above on all sizes */}
          <FadeIn className="mb-5 sm:mb-8">
            <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-gray-400">The problem</p>
          </FadeIn>
          <div className="max-w-3xl">
            <p className="font-display font-bold leading-[1.25] text-[20px] sm:text-[26px] lg:text-[34px] text-gray-800">
              <WordReveal text="Every day, potential customers post on X about the exact problem you solve. Most founders never see them. The posts expire. The window closes. spoolx makes sure that doesn't happen to you." />
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-10 sm:mb-16">
            <p className="text-[10px] uppercase tracking-[0.15em] font-medium mb-3 text-gray-400">How it works</p>
            <h2 className="font-display font-bold text-[24px] sm:text-[32px] lg:text-[40px] leading-tight text-gray-900">
              Simple by design.
            </h2>
          </FadeIn>
          {[
            {
              num: "01",
              title: "Describe your product",
              body: "Tell us what your SaaS does, who it's for, and what pain it solves. One paragraph is enough. The more specific you are, the more precise your matches.",
            },
            {
              num: "02",
              title: "spoolx monitors X continuously",
              body: "Our model reads public conversations and surfaces posts where someone expresses a need your product addresses. Not just keywords — actual intent.",
            },
            {
              num: "03",
              title: "You receive warm leads daily",
              body: "Every morning, a curated digest of relevant conversations with full context. You decide who to engage and how. We never post on your behalf.",
            },
          ].map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.07}>
              <div className="group py-7 sm:py-9 border-b border-gray-200">
                {/* Mobile: number inline with title */}
                <div className="flex items-baseline gap-3 sm:gap-0 mb-2 sm:mb-0 sm:grid sm:grid-cols-[72px_1fr] sm:gap-10 sm:items-start">
                  <span className="font-mono text-[11px] tracking-widest text-gray-300 shrink-0 sm:pt-0.5">{step.num}</span>
                  <h3 className="font-display font-bold text-[16px] sm:text-[20px] text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                    {step.title}
                  </h3>
                </div>
                <p className="text-[13px] sm:text-[15px] leading-[1.7] text-gray-500 mt-2 sm:mt-0 sm:grid sm:grid-cols-[72px_1fr] sm:gap-10">
                  <span className="hidden sm:block" />{/* spacer column */}
                  <span className="max-w-lg">{step.body}</span>
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── PRINCIPLES ── */}
      <section id="principles" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-10 sm:mb-16">
            <p className="text-[10px] uppercase tracking-[0.15em] font-medium mb-3 text-gray-400">What we believe</p>
            <h2 className="font-display font-bold text-[24px] sm:text-[32px] lg:text-[40px] leading-tight text-gray-900">
              Built with restraint.
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-0">
            {[
              {
                title: "We don't post on your behalf.",
                body: "Your voice is yours. spoolx surfaces the opportunity — what you do with it is entirely up to you.",
              },
              {
                title: "We don't manufacture engagement.",
                body: "No fake followers. No automated replies. No vanity metrics. Real conversations with real people.",
              },
              {
                title: "We surface intent, not noise.",
                body: "The feed is already overwhelming. We filter aggressively so your digest only contains leads worth your time.",
              },
              {
                title: "We're honest about what we are.",
                body: "spoolx is early. It will get things wrong sometimes. We'd rather say that upfront than overpromise.",
              },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.06}>
                <div className={`py-7 sm:py-10 border-b border-gray-200 ${
                  i % 2 === 0 ? "sm:border-r sm:pr-10 lg:pr-16" : "sm:pl-10 lg:pl-16"
                }`}>
                  <h3 className="font-display font-semibold text-[14px] sm:text-[16px] mb-2 text-gray-800">{p.title}</h3>
                  <p className="text-[13px] sm:text-[14px] leading-[1.7] text-gray-500">{p.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARLY ACCESS ── */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1fr] gap-10 md:gap-24 items-start">
          <FadeIn>
            <p className="text-[10px] uppercase tracking-[0.15em] font-medium mb-4 text-gray-400">Early access</p>
            <h2 className="font-display font-bold text-[24px] sm:text-[32px] lg:text-[38px] leading-tight mb-5 text-gray-900">
              We're building this with founders, not for them.
            </h2>
            <p className="text-[14px] sm:text-[15px] leading-[1.75] text-gray-500">
              spoolx is in closed early access. We're working directly with a small group of SaaS founders to understand what actually moves the needle. If you join now, you'll shape the product.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="md:pt-10">
            <WaitlistForm id="waitlist-form-2" />
            <div className="mt-6 sm:mt-7 pt-6 sm:pt-7 border-t border-gray-200 space-y-2.5">
              {[
                "No credit card required",
                "We review every application personally",
                "Early access means early influence over what we build",
              ].map(item => (
                <p key={item} className="text-[12px] sm:text-[13px] flex items-start gap-2.5 text-gray-400">
                  <span className="mt-px shrink-0 text-gray-300">—</span>
                  {item}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-7 sm:py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <span className="text-[14px] sm:text-[15px] font-display font-bold text-gray-400">spoolx</span>
          <p className="text-[11px] sm:text-[12px] text-gray-400">
            &copy; {new Date().getFullYear()} spoolx · Find your customers. Close faster.
          </p>
        </div>
      </footer>

    </div>
  );
}
