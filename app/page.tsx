"use client";

import Link from "next/link";
import { ArrowRight, Mail, Sparkles, Target, Zap, Shield, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              ColdReach AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <Link href="/dashboard" className="px-5 py-2.5 bg-white text-black rounded-full hover:bg-zinc-200 transition-all font-semibold">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Personalization is here</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              Get 3x higher response rates on your cold emails.
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Research-backed templates, AI-driven personalization, and automated follow-ups. Built for students targeting professors and research opportunities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/25 group">
                Start Sending Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold text-lg transition-all">
                See Live Demo
              </button>
            </div>

            <div className="pt-12 flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-sm font-bold tracking-widest uppercase italic">Stanford</span>
              <span className="text-sm font-bold tracking-widest uppercase italic">MIT</span>
              <span className="text-sm font-bold tracking-widest uppercase italic">Harvard</span>
              <span className="text-sm font-bold tracking-widest uppercase italic">UC Berkeley</span>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/20 transition-colors group">
              <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Hyper-Targeted</h3>
              <p className="text-zinc-400 leading-relaxed">
                Automatically search for professors based on research areas and recent publications.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-violet-500/20 transition-colors group">
              <div className="h-12 w-12 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-6 text-violet-500 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">AI Personalization</h3>
              <p className="text-zinc-400 leading-relaxed">
                Every email is unique. AI reads their bio and research papers to write a custom intro.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/20 transition-colors group">
              <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Safe Sending</h3>
              <p className="text-zinc-400 leading-relaxed">
                Built-in daily limits and wait times to ensure your email reputation stays protected.
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="bg-zinc-900/30 border-y border-white/5 py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-16">Why students love ColdReach</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <div className="space-y-4 p-8 bg-zinc-900/50 rounded-3xl border border-white/5">
                <div className="flex gap-1 text-yellow-500">
                  <Sparkles className="h-4 w-4 fill-current" />
                  <Sparkles className="h-4 w-4 fill-current" />
                  <Sparkles className="h-4 w-4 fill-current" />
                  <Sparkles className="h-4 w-4 fill-current" />
                  <Sparkles className="h-4 w-4 fill-current" />
                </div>
                <p className="text-lg text-zinc-300 italic">"I sent 15 emails and got 4 interviews in one week. The AI personalization actually sounds human."</p>
                <div>
                  <p className="font-bold">Alex Chen</p>
                  <p className="text-sm text-zinc-500">CS Undergrad @ CMU</p>
                </div>
              </div>
              <div className="space-y-4 p-8 bg-zinc-900/50 rounded-3xl border border-white/5">
                <div className="flex gap-1 text-yellow-500">
                  <Sparkles className="h-4 w-4 fill-current" />
                  <Sparkles className="h-4 w-4 fill-current" />
                  <Sparkles className="h-4 w-4 fill-current" />
                  <Sparkles className="h-4 w-4 fill-current" />
                  <Sparkles className="h-4 w-4 fill-current" />
                </div>
                <p className="text-lg text-zinc-300 italic">"The research publication search saved me hours of manually looking up lab pages. Highly recommend."</p>
                <div>
                  <p className="font-bold">Sarah Miller</p>
                  <p className="text-sm text-zinc-500">Pre-med @ Johns Hopkins</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto relative rounded-[40px] overflow-hidden bg-gradient-to-br from-blue-600 to-violet-700 p-12 md:p-24 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to land your dream internship?</h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Join 1,000+ students using AI to scale their outreach. Start your first campaign in 2 minutes.
            </p>
            <div className="pt-4">
              <Link href="/dashboard" className="inline-flex px-10 py-5 bg-white text-black rounded-2xl font-bold text-xl hover:bg-zinc-100 transition-all shadow-2xl">
                Get Started Now
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-white/60 text-sm">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> No credit card</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> 15 free emails/day</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> AI Research Search</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-zinc-500 text-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <p>© 2024 ColdReach AI. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </footer>
    </div>
  );
}
