import React, { useState } from "react";
import { SERVICES } from "../data";
import { Service } from "../types";
import { Wind, Gauge, Wrench, Cpu, ShieldAlert, Activity, Check, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

interface ServicesSectionProps {
  onSelectService: (service: Service) => void;
  setCurrentTab: (tab: string) => void;
}

// Icon helper to render the correct Lucide icon
export function ServiceIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  switch (name) {
    case "Wind":
      return <Wind className={className} />;
    case "Gauge":
      return <Gauge className={className} />;
    case "Wrench":
      return <Wrench className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "ShieldAlert":
      return <ShieldAlert className={className} />;
    case "Activity":
      return <Activity className={className} />;
    default:
      return <Wrench className={className} />;
  }
}

export default function ServicesSection({ onSelectService, setCurrentTab }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const categories = [
    { id: "all", name: "All Solutions" },
    { id: "cleaning", name: "Deep Washing" },
    { id: "repair", name: "Repairs & PCB" },
    { id: "maintenance", name: "Gas Refilling" },
    { id: "installation", name: "Fitting/Removal" }
  ];

  const filteredServices = SERVICES.filter(
    (s) => activeCategory === "all" || s.category === activeCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Professional AC Repair & Servicing
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
          Transparent flat-rate pricing. Zero hidden charges. Backed by Detro's 30-day service warranty.
        </p>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-100"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="group bg-white rounded-3xl border border-slate-100 hover:border-cyan-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
          >
            <div>
              {/* Icon & Category */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shadow-inner">
                  <ServiceIcon name={srv.icon} />
                </div>
                <span className="px-2.5 py-1 text-xxs font-extrabold text-cyan-700 bg-cyan-50 rounded-full uppercase tracking-wider">
                  {srv.category}
                </span>
              </div>

              {/* Title & Hindi Translation */}
              <div className="space-y-1 mb-2">
                <h3 className="font-sans font-extrabold text-lg text-slate-900 group-hover:text-cyan-600 transition-colors">
                  {srv.name}
                </h3>
                {srv.hindiName && (
                  <p className="text-xs font-bold text-slate-400">
                    {srv.hindiName}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-3 border-b border-slate-50 pb-3">
                <span className="text-2xl font-black text-slate-900">₹{srv.price}</span>
                <span className="text-xs font-semibold text-slate-400">/ per {srv.priceUnit}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-4 min-h-[50px]">
                {srv.description}
              </p>

              {/* Bullet features */}
              <ul className="space-y-2 mb-6">
                {srv.features.slice(0, 3).map((feat, idx) => (
                  <li key={idx} className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 mt-auto">
              <button
                onClick={() => {
                  onSelectService(srv);
                  setCurrentTab("book");
                }}
                className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-cyan-100 transition duration-200 text-center cursor-pointer"
              >
                Schedule Booking
              </button>
              <button
                onClick={() => setSelectedService(selectedService?.id === srv.id ? null : srv)}
                className="px-3 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-xl transition cursor-pointer"
                title="View Full Details"
              >
                {selectedService?.id === srv.id ? "Close" : "Info"}
              </button>
            </div>

            {/* Expanded details overlay/panel */}
            {selectedService?.id === srv.id && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm rounded-3xl p-6 text-white z-10 flex flex-col justify-between animate-in fade-in duration-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-cyan-400">FULL INCLUDED CHECKLIST</span>
                    <button
                      onClick={() => setSelectedService(null)}
                      className="text-white hover:text-cyan-400 text-sm font-bold cursor-pointer focus:outline-none"
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className="font-bold text-base text-cyan-400">{srv.name}</h4>
                  
                  <ul className="space-y-2">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="text-xs font-medium text-slate-200 flex items-start gap-2">
                        <span className="text-cyan-400 font-extrabold mt-0.5">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xxs text-slate-400 font-semibold leading-relaxed border-t border-white/10 pt-3">
                    ⏱️ <span className="text-slate-200">Job Duration:</span> {srv.duration} • Genuine spares used. 30 days warranty on compressor/leak repairs.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectService(srv);
                    setCurrentTab("book");
                  }}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1 mt-4"
                >
                  Book Service <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trust factors section */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left border border-slate-100">
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">30-Day Service Guarantee</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            If your split AC leaks water or stops cooling within 30 days of repair, our technician will visit and fix it again for 100% free.
          </p>
        </div>
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2">
            <Wrench className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Genuine OEM Spare Parts</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            We source original capacitors, fan motors, remote controllers, and copper insulation pipes directly from manufacturers.
          </p>
        </div>
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Transparent Fixed Pricing</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            You pay exactly what is shown in our catalog. No rate manipulation or post-service surprise surcharges. Flat pricing only.
          </p>
        </div>
      </div>

    </div>
  );
}
