import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Target,
  TrendingUp,
  Search,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const FEATURES = [
  {
    icon: <Search className="w-5 h-5" />,
    title: "Smart Intent Discovery",
    description:
      "AI scans X in real-time for users expressing the exact pain points your product solves. Signal over noise, every time.",
    glow: "from-violet-500/20 to-brand/10",
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Curated Lead Lists",
    description:
      "A ready-to-engage list of potential customers — no scraping, no manual work, just warm high-intent leads.",
    glow: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Growth Automation",
    description:
      "Personalized outreach that converts. Automate without sounding like a bot — stay authentic, scale fast.",
    glow: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Real-time Analytics",
    description:
      "Track engagement, conversions, and ROI. Know exactly what's working so you can double down on it.",
    glow: "from-orange-500/20 to-amber-500/10",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "ICP Matching",
    description:
      "Define your ideal customer profile once. spoolx continuously matches it against live X conversations.",
    glow: "from-pink-500/20 to-rose-500/10",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "Conversation Intelligence",
    description:
      "Understand sentiment and context before you engage. Step in at the perfect moment every time.",
    glow: "from-indigo-500/20 to-violet-500/10",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Define your Ideal Customer Profile",
    description:
      "Tell us what problem your SaaS solves and who benefits most. The more specific, the better your matches.",
    side: "right",
  },
  {
    number: "02",
    title: "AI Finds High-Intent Leads",
    description:
      "Our engine runs 24/7, scanning X for real-time conversations where your product is the answer people need.",
    side: "left",
  },
  {
    number: "03",
    title: "Engage and Convert",
    description:
      "Receive curated leads and outreach suggestions. Connect directly and watch your pipeline fill up.",
    side: "right",
  },
];

const STATS = [
  { value: "10x", label: "More leads found" },
  { value: "< 5 min", label: "To first result" },
  { value: "24/7", label: "Always on" },
];

export default function App() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await addDoc(collection(db, "waitlist"), {
        email,
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setMessage("You're on the list! We'll be in touch soon.");
    } catch (err: any) {
      console.error("Error saving signup:", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-brand selection:text-white overflow-x-hidden">

      {/* ── Animated background ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-[20%] -left-[10%] w-[65%] h-[65%] bg-brand/[0.08] blur-[160px] rounded-full animate-blob" />
        <div className="absolute top-[35%] -right-[10%] w-[45%] h-[45%] bg-blue-600/[0.06] blur-[140px] rounded-full animate-blob [animation-delay:2.5s]" />
        <div className="absolute -bottom-[10%] left-[15%] w-[45%] h-[45%] bg-violet-900/[0.08] blur-[120px] rounded-full animate-blob [animation-delay:5s]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold tracking-tight">spoolx</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How it works</a>
          </div>
          <button
            onClick={() => document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })}
            className="px-4 py-2 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-all active:scale-95 shadow-lg shadow-brand/25"
          >
            Join Waitlist
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 sm:pt-36 pb-24 sm:pb-40 px-4 sm:px-6">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-xs font-semibold text-brand-light tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-light animate-pulse" />
              Now accepting early access
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-7xl lg:text-[88px] font-display font-bold leading-[0.92] tracking-tight mb-6 sm:mb-8"
          >
            Connect with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-brand to-violet-400">
              paying customers
            </span>{" "}
            on X, instantly.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="max-w-xl mx-auto text-base sm:text-lg text-white/50 mb-10 sm:mb-14 leading-relaxed"
          >
            Stop manual searching. AI-driven spoolx finds high-intent leads on X so SaaS founders can focus on closing, not hunting.
          </motion.p>

          {/* Waitlist form */}
          <motion.div variants={fadeUp} id="waitlist-form" className="max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white/[0.05] border border-white/[0.10] rounded-2xl focus-within:border-brand/40 focus-within:bg-white/[0.07] transition-all duration-300 shadow-xl shadow-black/40">
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  disabled={status === "success" || status === "loading"}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3 bg-transparent outline-none text-white placeholder:text-white/25 text-sm sm:text-base min-w-0"
                />
                <button
                  type="submit"
                  disabled={status === "success" || status === "loading"}
                  className="px-6 py-3 bg-brand text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand/25 shrink-0"
                >
                  {status === "loading" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                  ) : status === "success" ? (
                    <><CheckCircle2 className="w-4 h-4" /> Done!</>
                  ) : (
                    <><span>Reserve Spot</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
              <AnimatePresence>
                {(status === "success" || status === "error") && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-3 text-sm text-center font-medium ${
                      status === "success" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
            <p className="mt-3 text-xs text-white/25 text-center">No spam. Unsubscribe any time.</p>
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="max-w-lg mx-auto mt-20 sm:mt-28 grid grid-cols-3 gap-4 sm:gap-8 px-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-white/35 leading-tight">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight mb-4">
              Everything you need to grow on X
            </h2>
            <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto">
              Powerful tools built for founders who ship fast and want results faster.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative p-6 sm:p-8 bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.16] hover:bg-white/[0.05] transition-all duration-300 cursor-default"
              >
                {/* Hover glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="relative">
                  <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center text-brand-light mb-5 group-hover:bg-brand/20 group-hover:border-brand/40 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-2.5">{feature.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight mb-4">
              Up and running in minutes
            </h2>
            <p className="text-white/40 text-base sm:text-lg">
              Three steps from sign-up to your first qualified lead.
            </p>
          </motion.div>

          <div className="relative">
            {/* Center vertical line — desktop only */}
            <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-gradient-to-b from-brand/40 via-brand/15 to-transparent hidden sm:block" />

            <div className="space-y-10 sm:space-y-0">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: step.side === "right" ? -32 : 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex items-start sm:items-center gap-5 sm:gap-0 sm:mb-16 ${
                    step.side === "left" ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 sm:w-[calc(50%-3rem)] sm:flex-none ${
                      step.side === "right"
                        ? "sm:pr-14 sm:text-right"
                        : "sm:pl-14 sm:ml-auto"
                    }`}
                  >
                    <div className="font-display font-black text-5xl sm:text-6xl text-brand/15 leading-none mb-2 select-none">
                      {step.number}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-white/45 text-sm sm:text-base leading-relaxed">{step.description}</p>
                  </div>

                  {/* Center dot — desktop */}
                  <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-brand ring-4 ring-brand/20 shadow-lg shadow-brand/40" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative p-10 sm:p-20 rounded-[2rem] overflow-hidden bg-gradient-to-br from-brand via-violet-600 to-indigo-700 text-center shadow-2xl shadow-brand/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[70%] bg-white/10 blur-[90px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-400/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
                Ready to out-distribute your competition?
              </h2>
              <p className="text-white/70 text-base sm:text-lg mb-8 sm:mb-10 max-w-lg mx-auto">
                Join founders already on the waitlist. Early access is limited.
              </p>
              <button
                onClick={() =>
                  document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 sm:px-12 py-4 sm:py-5 bg-white text-brand rounded-2xl font-bold text-base sm:text-lg hover:scale-105 hover:shadow-2xl transition-all active:scale-95 shadow-xl"
              >
                Get Early Access
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-4 sm:px-6 border-t border-white/[0.06] text-center text-white/25 text-sm">
        <p>&copy; {new Date().getFullYear()} spoolx. Built for SaaS Founders.</p>
      </footer>
    </div>
  );
}
