import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";
import DiagnosticSection from "./components/DiagnosticSection";
import PricingCalculator from "./components/PricingCalculator";
import BookingForm from "./components/BookingForm";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import { Service, Booking, DiagnosticScan, Testimonial } from "./types";
import { TESTIMONIALS, SERVICES } from "./data";
import { AlertCircle, ArrowRight, Activity, Sparkles, Star } from "lucide-react";
import splitUnitImg from "./assets/images/clean_cooling_ac_1782795681618.jpg";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [scans, setScans] = useState<DiagnosticScan[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);

  // References passed down to populate booking form
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<{
    serviceName: string;
    brand: string;
    cost: number;
    issue: string;
  } | null>(null);
  const [selectedScan, setSelectedScan] = useState<DiagnosticScan | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem("detro_bookings");
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }

      const storedScans = localStorage.getItem("detro_scans");
      if (storedScans) {
        setScans(JSON.parse(storedScans));
      }

      const storedTestimonials = localStorage.getItem("detro_testimonials");
      if (storedTestimonials) {
        setTestimonials(JSON.parse(storedTestimonials));
      } else {
        setTestimonials(TESTIMONIALS);
      }
    } catch (e) {
      console.error("Local storage reading failed", e);
    }
  }, []);

  const handleSelectService = (srv: Service) => {
    setSelectedService(srv);
    setSelectedQuote(null);
    setSelectedScan(null);
    setCurrentTab("book");
  };

  const handleQuoteBook = (quote: {
    serviceName: string;
    brand: string;
    cost: number;
    issue: string;
  }) => {
    setSelectedQuote(quote);
    setSelectedService(null);
    setSelectedScan(null);
    setCurrentTab("book");
  };

  const handleDiagnosticBook = (scanReport: DiagnosticScan) => {
    setSelectedScan(scanReport);
    setSelectedService(null);
    setSelectedQuote(null);
    setCurrentTab("book");
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    setCurrentTab("dashboard");
  };

  const handleAddTestimonial = (newTest: Testimonial) => {
    const updated = [newTest, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem("detro_testimonials", JSON.stringify(updated));
  };

  const clearSelectedReferences = () => {
    setSelectedService(null);
    setSelectedQuote(null);
    setSelectedScan(null);
  };

  // Render correct panel body based on active tab state
  const renderTabContent = () => {
    switch (currentTab) {
      case "home":
        return (
          <div className="space-y-12">
            <Hero setCurrentTab={setCurrentTab} />

            {/* Introductory highlights */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
              
              {/* Visual Split item image */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] bg-slate-50">
                <img
                  src={splitUnitImg}
                  alt="Splendid wall split AC unit blowing fresh cold air"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              </div>

              {/* Text descriptions */}
              <div className="space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-bold">
                  <Star className="w-4 h-4 fill-cyan-600 text-cyan-600" />
                  <span>Bokaro's Highly Commended HVAC Team</span>
                </div>
                
                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  Why Bokaro Trusts Detro Enterprises
                </h3>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-semibold">
                  We specialize in complete Split & Window AC services. From precision diagnostics using neural AI to deep copper coil cleaning and nitrogen leak checks, our senior technician <strong>Ajmer Ansari</strong> delivers transparent, high-value, and reliable repairs.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                    <span className="flex items-center justify-center w-5 h-5 bg-cyan-100 text-cyan-700 rounded-full text-xxs">✓</span>
                    <span>No hidden charges. We quote exact flat prices before working.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                    <span className="flex items-center justify-center w-5 h-5 bg-cyan-100 text-cyan-700 rounded-full text-xxs">✓</span>
                    <span>Instant same-day emergency repair visits across Bokaro Steel City.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                    <span className="flex items-center justify-center w-5 h-5 bg-cyan-100 text-cyan-700 rounded-full text-xxs">✓</span>
                    <span>30-Day service guarantee on splits leaks and gas charges.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentTab("services")}
                    className="inline-flex items-center gap-1.5 px-5 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-100 cursor-pointer"
                  >
                    <span>View Service Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Smart mini AI section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white py-14 border-y border-slate-800">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/20 rounded-full text-cyan-400 text-xxs font-black tracking-widest uppercase">
                  EXPERIENCE NEXT-GEN REPAIRS
                </span>
                
                <h3 className="font-sans font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                  Instant Diagnostics with Gemini AI
                </h3>
                
                <p className="text-slate-300 text-sm max-w-xl mx-auto font-medium leading-relaxed">
                  No more guessing why your AC is not cooling. Take a quick snapshot of the leakage, filters, remote controller, or sound vibrations, write the symptoms, and get a professional breakdown instantly.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentTab("diagnose")}
                    className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer"
                  >
                    Start AI Scan
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "services":
        return <ServicesSection onSelectService={handleSelectService} setCurrentTab={setCurrentTab} />;
      case "diagnose":
        return (
          <DiagnosticSection
            onDiagnosticBook={handleDiagnosticBook}
            savedScans={scans}
            setSavedScans={setScans}
          />
        );
      case "estimator":
        return <PricingCalculator onQuoteBook={handleQuoteBook} />;
      case "book":
        return (
          <BookingForm
            selectedService={selectedService}
            selectedQuote={selectedQuote}
            selectedScan={selectedScan}
            onBookingSuccess={handleBookingSuccess}
            clearSelectedReferences={clearSelectedReferences}
          />
        );
      case "dashboard":
        return (
          <Dashboard
            bookings={bookings}
            setBookings={setBookings}
            scans={scans}
            onAddTestimonial={handleAddTestimonial}
          />
        );
      default:
        return <Hero setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="app-container">
      
      {/* Operating banner (Explaining Maps "Temporarily Closed" detail gracefully) */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 text-center text-xs font-bold shadow-inner flex items-center justify-center gap-1.5 relative z-50">
        <AlertCircle className="w-4 h-4 text-white shrink-0" />
        <span>
          Storefront temporarily closed for physical walk-ins. We are 100% FULLY OPERATIONAL for immediate home doorstep services across Bokaro!
        </span>
      </div>

      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} bookingCount={bookings.length} />
      
      {/* Main Container */}
      <main className="flex-grow">
        {renderTabContent()}
      </main>

      <Footer testimonials={testimonials} setCurrentTab={setCurrentTab} />
    </div>
  );
}
