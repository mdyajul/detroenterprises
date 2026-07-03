import React from "react";
import { MapPin, Phone, Mail, Clock, Star, Heart, Wrench, Activity } from "lucide-react";
import { BOKARO_LOCATION_INFO, TESTIMONIALS } from "../data";
import { Testimonial } from "../types";

interface FooterProps {
  testimonials: Testimonial[];
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ testimonials, setCurrentTab }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top layer: Contact details & Map Review snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-slate-800 pb-12">
          
          {/* Brand Intro */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-cyan-500 text-white flex items-center justify-center shadow-md">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold text-white text-base tracking-tight leading-tight">
                  Detro Enterprises
                </span>
                <span className="block text-xxs font-bold text-slate-500 uppercase tracking-wider">
                  Bokaro AC Repair Service
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-sm">
              We specialize in split AC and window AC deep jet cleaning, nitrogen pressure leak testing, compressor motor replacements, and electronic PCB card servicing across Bokaro Steel City.
            </p>

            {/* Timings */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 pt-1">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Timings: {BOKARO_LOCATION_INFO.timings}</span>
            </div>
          </div>

          {/* Quick contact list */}
          <div className="md:col-span-4 text-left space-y-3">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-b border-slate-800 pb-1.5">
              Contact & Address
            </h4>
            
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{BOKARO_LOCATION_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                <span>Hotline: {BOKARO_LOCATION_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                <span>Email: {BOKARO_LOCATION_INFO.email}</span>
              </li>
            </ul>
          </div>

          {/* Google Maps ratings review card */}
          <div className="md:col-span-3 bg-white/5 p-4 rounded-2xl border border-white/5 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xxs font-bold text-cyan-400 tracking-wider uppercase">Google Maps Listing</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-xxs font-black">5.0 ★</span>
            </div>
            
            <p className="text-xxs text-slate-400 font-semibold">
              "Best and value for money service"
            </p>
            
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-amber-500 text-sm">★</span>
              ))}
            </div>

            <button
              onClick={() => setCurrentTab("dashboard")}
              className="w-full py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xxs rounded-xl transition cursor-pointer text-center"
            >
              Write maps review
            </button>
          </div>

        </div>

        {/* Customer Testimonials Slider/Review Section */}
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center">
            <h4 className="font-sans font-bold text-white text-sm sm:text-base">
              Verified Customer Reviews ({testimonials.length})
            </h4>
            <span className="text-xxs text-cyan-400 font-bold uppercase tracking-widest">
              100% Satisfaction Rate in Jharkhand
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="p-4 bg-slate-850 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex gap-0.5 text-amber-500 text-xs">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-xxs text-slate-300 font-medium leading-relaxed italic line-clamp-3">
                    "{test.text}"
                  </p>
                </div>

                <div className="flex justify-between items-center text-slate-400 border-t border-slate-800 pt-2 text-xxs font-bold">
                  <span>{test.author}</span>
                  <span className="text-slate-500">{test.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright Layer */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xxs font-semibold text-slate-500">
          <p>© 2026 Detro Enterprises. All rights reserved. Managed near Bokaro Hardware, Makhdumpur.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Bokaro cooling comfort.
          </p>
        </div>

      </div>
    </footer>
  );
}
