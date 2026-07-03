import React from "react";
import { ShieldCheck, Sparkles, Award, Star, ThumbsUp } from "lucide-react";
import heroImg from "../assets/images/ac_repair_hero_1782795666461.jpg";

interface HeroProps {
  setCurrentTab: (tab: string) => void;
}

export default function Hero({ setCurrentTab }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-cyan-100/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: Text Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-cyan-600 animate-spin-slow" />
              <span>Bokaro's #1 Air Conditioning Experts</span>
            </div>

            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight">
              Professional AC Care, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                Guaranteed Cooling
              </span>
            </h1>

            <p className="font-sans text-xl font-bold text-cyan-700 tracking-wide">
              गर्मी से राहत, तुरंत समाधान!
            </p>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
              Struggling with a weak breeze or unusual noises? <span className="font-semibold text-slate-800">Detro Enterprises</span> provides premier, lightning-fast split & window air conditioning repairs, deep power-jet washing, and leak sealing right at your doorstep in <span className="font-semibold text-slate-900">Bokaro Steel City</span>.
            </p>

            {/* AI Diagnostics Banner */}
            <div className="p-4 bg-gradient-to-r from-cyan-50/80 to-blue-50/80 border border-cyan-100/50 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-800 uppercase tracking-widest block mb-1">NEW: AI ADVANTAGE</span>
                <p className="text-sm text-slate-700 font-medium">Upload AC photos or symptoms for instant diagnostic report.</p>
              </div>
              <button
                onClick={() => setCurrentTab("diagnose")}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-sm cursor-pointer"
              >
                Scan Now
              </button>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => setCurrentTab("book")}
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-bold shadow-lg shadow-cyan-200 hover:shadow-cyan-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                id="btn-hero-book"
              >
                Book Doorstep Visit
              </button>
              <button
                onClick={() => setCurrentTab("services")}
                className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-center"
                id="btn-hero-services"
              >
                Explore Services
              </button>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-50 text-cyan-600">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">100% Safe</p>
                  <p className="text-xxs text-slate-400 mt-1">Verified experts</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-50 text-cyan-600">
                  <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">5.0 Rating</p>
                  <p className="text-xxs text-slate-400 mt-1">Two Google reviews</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-50 text-cyan-600">
                  <Award className="w-4.5 h-4.5 text-cyan-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">Best Price</p>
                  <p className="text-xxs text-slate-400 mt-1">Value-for-money</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: AI Generated Image with Overlays */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Outer decorative frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-3xl opacity-10 blur-xl" />

              {/* Main Image */}
              <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl bg-slate-100 aspect-[16/9] lg:aspect-square">
                <img
                  src={heroImg}
                  alt="Detro Enterprises HVAC Expert Repairing split AC unit"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  id="img-hero-ai"
                />
              </div>

              {/* Float Card 1: Map Reviews */}
              <div className="absolute -left-6 bottom-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3 animate-bounce-slow">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500 text-white font-bold text-lg">
                  ★
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-extrabold text-slate-800">5.0 Rated</span>
                    <span className="text-xs text-slate-400 font-semibold">(2 reviews)</span>
                  </div>
                  <p className="text-xxs text-slate-500">Official Maps Listing</p>
                </div>
              </div>

              {/* Float Card 2: Bokaro Pride */}
              <div className="absolute -right-4 top-12 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-2.5">
                <ThumbsUp className="w-5 h-5 text-cyan-600" />
                <div className="text-left">
                  <p className="text-xs font-extrabold text-slate-800">Near Bokaro Hardware</p>
                  <p className="text-xxs text-slate-400">Rahmat Nagar Location</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
