import React, { useState } from "react";
import { Gauge, Calculator, Check, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { Service } from "../types";
import { SERVICES } from "../data";

interface PricingCalculatorProps {
  onQuoteBook: (quoteDetails: {
    serviceName: string;
    brand: string;
    cost: number;
    issue: string;
  }) => void;
}

export default function PricingCalculator({ onQuoteBook }: PricingCalculatorProps) {
  const [acType, setAcType] = useState<"split" | "window">("split");
  const [tonnage, setTonnage] = useState<"1.0" | "1.5" | "2.0">("1.5");
  const [brand, setBrand] = useState<string>("Voltas");
  const [selectedServices, setSelectedServices] = useState<string[]>([SERVICES[0].id]); // default select cleaning
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  const tonnageFees = {
    "1.0": 0,
    "1.5": 150,
    "2.0": 300,
  };

  const typeModifiers = {
    split: 1.0,
    window: 0.9, // Window AC servicing is slightly cheaper
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // Calculate costs
  const baseServicesCost = selectedServices.reduce((sum, id) => {
    const srv = SERVICES.find((s) => s.id === id);
    return sum + (srv ? srv.price : 0);
  }, 0);

  // Apply modifiers
  const tonnageExtra = selectedServices.length > 0 ? tonnageFees[tonnage] : 0;
  const modifier = typeModifiers[acType];
  const adjustedBase = Math.round(baseServicesCost * modifier) + tonnageExtra;

  // Visit Charge ( waived if any service is selected )
  const visitCharge = selectedServices.length > 0 ? 0 : 250;
  
  // Total
  const subtotal = adjustedBase + visitCharge;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = subtotal - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = discountCode.trim().toUpperCase();
    if (code === "DETRO10" || code === "BOKAROCOOL") {
      setDiscountApplied(true);
      setDiscountPercent(10);
      setDiscountCode("");
    } else {
      alert("Invalid Promo Code! Try using 'DETRO10' or 'BOKAROCOOL'");
    }
  };

  const handleBookQuote = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one AC service to generate a repair booking.");
      return;
    }

    const serviceNames = selectedServices
      .map((id) => SERVICES.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(" + ");

    onQuoteBook({
      serviceName: `Custom Package: ${serviceNames}`,
      brand,
      cost: finalTotal,
      issue: `Interactive Quote Summary: ${tonnage} Ton ${acType.toUpperCase()} AC (${brand}). Services requested: ${serviceNames}.`,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Interactive Price Estimator
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm">
          Select your air conditioner's configuration and choose the repairs needed to generate a real-time, personalized itemized quotation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left configurations selector */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-slate-100 shadow-sm rounded-3xl text-left space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Calculator className="w-5 h-5 text-cyan-600" />
            <span className="font-bold text-slate-800 text-lg">Step 1: Configure AC & Select Jobs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* AC Type */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                1. Air Conditioner Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAcType("split")}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm border transition cursor-pointer text-center ${
                    acType === "split"
                      ? "bg-cyan-50 border-cyan-500 text-cyan-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Split AC (दीवार)
                </button>
                <button
                  onClick={() => setAcType("window")}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm border transition cursor-pointer text-center ${
                    acType === "window"
                      ? "bg-cyan-50 border-cyan-500 text-cyan-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Window AC (खिड़की)
                </button>
              </div>
            </div>

            {/* AC Capacity */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                2. Cooling Capacity (Tonnage)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["1.0", "1.5", "2.0"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTonnage(t)}
                    className={`py-3 rounded-xl font-bold text-xs sm:text-sm border transition cursor-pointer text-center ${
                      tonnage === t
                        ? "bg-cyan-50 border-cyan-500 text-cyan-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t} Ton
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AC Brand */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              3. AC Brand / Manufacturer
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-3 px-4 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all"
            >
              {SERVICES.map((s, idx) => (
                <option key={idx} value={s.id === "pcb-repair" ? "Daikin" : s.id === "gas-refill" ? "LG" : "Voltas"}>
                  {s.id === "pcb-repair" ? "Daikin" : s.id === "gas-refill" ? "LG" : "Voltas"}
                </option>
              )).slice(0, 3)}
              <option value="Lloyd">Lloyd</option>
              <option value="Samsung">Samsung</option>
              <option value="Blue Star">Blue Star</option>
              <option value="Hitachi">Hitachi</option>
            </select>
          </div>

          {/* Services list multi selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              4. Select Services Required (You can select multiple)
            </label>
            
            <div className="grid grid-cols-1 gap-2.5">
              {SERVICES.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer focus:outline-none ${
                    selectedServices.includes(srv.id)
                      ? "bg-cyan-50/50 border-cyan-200 hover:bg-cyan-100/40"
                      : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                      selectedServices.includes(srv.id)
                        ? "bg-cyan-600 border-cyan-600 text-white"
                        : "border-slate-300"
                    }`}>
                      {selectedServices.includes(srv.id) && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">{srv.name}</p>
                      <p className="text-xxs text-slate-400 font-semibold">{srv.duration} • Genuine copper parts</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-800 shrink-0">
                    ₹{Math.round(srv.price * (acType === "window" ? 0.9 : 1.0))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right breakdown column */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-850 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-left">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <ShoppingBag className="w-5 h-5 text-cyan-400 animate-bounce-slow" />
            <span className="font-bold text-lg text-white">Step 2: Quotation Summary</span>
          </div>

          {/* Selections breakdown */}
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>AC System Config:</span>
              <span className="text-white font-bold uppercase tracking-wider">{tonnage} Ton {acType} ({brand})</span>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-white/5">
              <p className="text-xxs font-bold text-cyan-400 uppercase tracking-widest">Included Items</p>
              
              {selectedServices.length === 0 ? (
                <p className="text-xs text-rose-300 font-semibold italic">No services selected. Flat Inspection Fee applies.</p>
              ) : (
                selectedServices.map((id) => {
                  const srv = SERVICES.find((s) => s.id === id);
                  if (!srv) return null;
                  const itemPrice = Math.round(srv.price * typeModifiers[acType]);
                  return (
                    <div key={id} className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300 truncate max-w-[180px]">{srv.name}</span>
                      <span className="font-bold">₹{itemPrice}</span>
                    </div>
                  );
                })
              )}

              {tonnageExtra > 0 && (
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Capacity load fee ({tonnage} Ton AC)</span>
                  <span className="font-bold">+₹{tonnageExtra}</span>
                </div>
              )}

              {visitCharge > 0 && (
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Doorstep Visit & Inspect Charge</span>
                  <span className="font-bold">₹{visitCharge}</span>
                </div>
              )}
            </div>

            {/* Subtotal */}
            <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-4 text-slate-300">
              <span>Quote Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {/* Discount display */}
            {discountApplied && (
              <div className="flex justify-between text-sm font-bold text-emerald-400">
                <span>Special Promo Offer (10% off)</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-baseline border-t border-cyan-500/30 pt-4">
              <span className="text-base font-extrabold text-white">Estimated Grand Total</span>
              <span className="text-3xl font-black text-cyan-400">₹{finalTotal}</span>
            </div>
          </div>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2 border-t border-white/5">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter Promo Code"
              className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 font-bold focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-black text-xs px-4 rounded-xl transition cursor-pointer"
            >
              Apply
            </button>
          </form>

          {/* Suggestive Code tip */}
          {!discountApplied && (
            <p className="text-xxs text-slate-400 font-bold text-center">
              💡 Hint: Try code <span className="text-cyan-400 uppercase">DETRO10</span> to save 10% on your total!
            </p>
          )}

          {/* Proceed button */}
          <div className="pt-2">
            <button
              onClick={handleBookQuote}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-slate-900 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform shadow-md shadow-cyan-900/30 cursor-pointer"
            >
              <span>Schedule This Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl text-xxs text-slate-400 leading-normal text-center border border-white/5">
            📝 Local Bokaro prices fluctuate during peak May-July heatwaves. This estimate remains locked and valid for your booking for the next 14 days.
          </div>
        </div>

      </div>

    </div>
  );
}
