import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Zap, 
  Target, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Search,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
      setMessage("You've been added to the waitlist!");
    } catch (err: any) {
      console.error("Error saving signup:", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">spoolx</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          </div>
          <button 
            onClick={() => document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })}
            className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all active:scale-95"
          >
            Join Waitlist
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-brand-light mb-6 tracking-wide uppercase">
              Now accepting early access
            </span>
            <h1 className="text-5xl md:text-8xl font-display font-bold leading-[0.9] tracking-tight mb-8">
              Connect with <span className="text-brand">paying customers</span> on X, instantly.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-12 leading-relaxed">
              Stop manual searching. AI-driven spoolx matches SaaS founders with high-intent leads on X.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-md mx-auto"
            id="waitlist-form"
          >
            <form onSubmit={handleSubmit} className="relative group">
              <div className="flex flex-col md:flex-row gap-3 p-2 bg-white/5 border border-white/10 rounded-2xl md:rounded-full focus-within:border-brand/50 transition-all">
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  disabled={status === "success" || status === "loading"}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-3 bg-transparent outline-none text-white text-lg placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={status === "success" || status === "loading"}
                  className="px-8 py-3 bg-brand text-white rounded-xl md:rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {status === "loading" ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Zap className="w-5 h-5" />
                    </motion.div>
                  ) : status === "success" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <>
                      Reserve Spot <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
              <AnimatePresence>
                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-10 left-0 right-0 text-emerald-400 text-sm font-medium"
                  >
                    {message}
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-10 left-0 right-0 text-red-400 text-sm font-medium"
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="w-6 h-6 text-brand" />}
              title="Smart Intent Discovery"
              description="Our AI scans X for users expressing pain points your SaaS solves, filtering out the noise."
            />
            <FeatureCard 
              icon={<Target className="w-6 h-6 text-brand" />}
              title="Direct Access"
              description="Get a curated list of potential customers ready to be engaged directly in their DMs or threads."
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-brand" />}
              title="Growth Automation"
              description="Automate your outreach strategy without sounding like a bot. Personalized, high-conversion distribution."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-20 tracking-tight">Distribution made effortless.</h2>
          <div className="space-y-12">
            <Step number="01" title="Define your Ideal Customer Profile" description="Tell us what problem your SaaS solves and who your target audience is." />
            <Step number="02" title="AI Finds Potential Leads" description="Our engine works 24/7 to find real-time conversations on X where your product adds value." />
            <Step number="03" title="Convert and Scale" description="Connect directly with high-intent leads and see your growth grow." />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto p-12 md:p-20 bg-brand rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:bg-white/20 transition-all duration-700" />
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">Ready to out-distribute your competition?</h2>
            <button 
              onClick={() => document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-5 bg-white text-brand rounded-full font-bold text-xl hover:scale-105 transition-transform active:scale-95 shadow-xl"
            >
              Get Early Access
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 text-center text-white/30 text-sm">
        <p>&copy; {new Date().getFullYear()} spoolx. Built for SaaS Founders.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-brand/30 transition-all"
    >
      <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-white/50 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="text-6xl font-display font-black text-white/5 group-hover:text-brand/20 transition-colors shrink-0 leading-none">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/40 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
