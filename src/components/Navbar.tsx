import React, { useState } from "react";
import { Wrench, Menu, X, User, Shield, HelpCircle, Activity } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  bookingCount: number;
}

export default function Navbar({ currentTab, setCurrentTab, bookingCount }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", id: "home" },
    { name: "Our Services", id: "services" },
    { name: "AI Diagnostics", id: "diagnose", highlight: true },
    { name: "Price Estimator", id: "estimator" },
    { name: "Book Repair", id: "book" },
    { name: "My Dashboard", id: "dashboard", count: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentTab("home")}
              className="flex items-center gap-3 group focus:outline-none cursor-pointer"
              id="brand-logo"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-600 text-white shadow-md shadow-cyan-200 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="block font-sans font-bold text-xl text-slate-900 tracking-tight leading-tight group-hover:text-cyan-600 transition-colors">
                  Detro Enterprises
                </span>
                <span className="block font-sans text-xs font-semibold text-slate-400 tracking-wider">
                  डेट्रो एंटरप्राइजेज • BOKARO
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  currentTab === item.id
                    ? item.highlight
                      ? "bg-cyan-600 text-white shadow-md shadow-cyan-100"
                      : "bg-slate-100 text-cyan-600"
                    : item.highlight
                    ? "text-cyan-600 border border-cyan-100 hover:bg-cyan-50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                } flex items-center gap-1.5`}
                id={`nav-${item.id}`}
              >
                {item.highlight && <Activity className="w-4 h-4" />}
                {item.name}
                {item.count && bookingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xxs font-bold bg-rose-500 text-white rounded-full leading-none">
                    {bookingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-expanded="false"
              id="mobile-menu-btn"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-semibold flex items-center justify-between cursor-pointer ${
                  currentTab === item.id
                    ? item.highlight
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-100 text-cyan-600 font-bold"
                    : item.highlight
                    ? "text-cyan-600 bg-cyan-50/50 hover:bg-cyan-50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                id={`mobile-nav-${item.id}`}
              >
                <span className="flex items-center gap-2">
                  {item.highlight && <Activity className="w-4 h-4 animate-bounce" />}
                  {item.name}
                </span>
                {item.count && bookingCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                    {bookingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
