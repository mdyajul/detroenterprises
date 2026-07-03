import React, { useState } from "react";
import { Booking, DiagnosticScan, Testimonial } from "../types";
import { SERVICES, BOKARO_LOCATION_INFO } from "../data";
import { ServiceIcon } from "./ServicesSection";
import { User, Calendar, MapPin, Phone, ShieldCheck, CheckCircle, RefreshCw, AlertTriangle, FileText, Star, ClipboardList, Database, MessageSquare } from "lucide-react";

interface DashboardProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  scans: DiagnosticScan[];
  onAddTestimonial: (test: Testimonial) => void;
}

export default function Dashboard({ bookings, setBookings, scans, onAddTestimonial }: DashboardProps) {
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [selectedScanDetail, setSelectedScanDetail] = useState<DiagnosticScan | null>(null);

  // Simulate progress of a booking to make the app incredibly interactive
  const handleSimulateStatus = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        let nextStatus: "pending" | "assigned" | "completed" | "cancelled" = b.status;
        let techName = b.technicianName;
        
        if (b.status === "pending") {
          nextStatus = "assigned";
          techName = "A. Ansari (Senior HVAC Specialist)";
        } else if (b.status === "assigned") {
          nextStatus = "completed";
        } else if (b.status === "completed") {
          nextStatus = "pending"; // reset loop for fun
        }
        
        return {
          ...b,
          status: nextStatus,
          technicianName: techName
        };
      }
      return b;
    });

    setBookings(updated);
    localStorage.setItem("detro_bookings", JSON.stringify(updated));
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this doorstep AC service booking?")) {
      const updated = bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as const } : b
      );
      setBookings(updated);
      localStorage.setItem("detro_bookings", JSON.stringify(updated));
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) {
      alert("Please fill out both your name and review message.");
      return;
    }

    const newTestimonial: Testimonial = {
      id: `rev-${Date.now()}`,
      author: reviewName,
      text: reviewText,
      rating: reviewRating,
      date: "Just now",
      verified: true,
      likes: 0
    };

    onAddTestimonial(newTestimonial);
    setReviewName("");
    setReviewText("");
    setReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 text-left">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          My Account Dashboard
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm">
          Track active service appointments in Bokaro Steel City, review past smart diagnostic scans, and submit service ratings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Active Bookings List & Scans */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Bookings Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-sans font-bold text-slate-800 text-lg flex items-center gap-2 border-b border-slate-100 pb-3">
              <ClipboardList className="w-5 h-5 text-cyan-600" />
              Active Servicing Appointments ({bookings.length})
            </h3>

            {bookings.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl space-y-3">
                <p className="text-sm text-slate-500 font-semibold">No active split or window AC bookings found.</p>
                <p className="text-xxs text-slate-400 font-bold">Use the Book Repair panel to schedule certified doorstep servicing.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((book) => {
                  const matchedService = SERVICES.find((s) => s.id === book.serviceId);
                  const iconName = matchedService?.icon || "Wrench";

                  return (
                    <div
                      key={book.id}
                      className="border border-slate-100 hover:border-cyan-100 rounded-2xl p-5 space-y-4 bg-slate-50/50 hover:bg-white transition-all duration-300"
                    >
                      {/* Booking Header: Service Name & Price */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                            <ServiceIcon name={iconName} className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                              {book.serviceName}
                            </h4>
                            <p className="text-xxs text-slate-400 font-bold mt-0.5">
                              ID: {book.id} • Registered on {book.createdAt}
                            </p>
                          </div>
                        </div>

                        {/* Cost & Status Badges */}
                        <div className="flex items-center gap-2.5 sm:text-right">
                          <span className="text-base font-black text-slate-900 shrink-0">₹{book.cost}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xxs font-extrabold uppercase tracking-wide shrink-0 ${
                            book.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : book.status === "cancelled"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-cyan-100 text-cyan-800"
                          }`}>
                            {book.status}
                          </span>
                        </div>
                      </div>

                      {/* Booking details info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                        <p className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Customer: <strong className="text-slate-700">{book.customerName}</strong> ({book.phone})</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Slot: <strong className="text-slate-700">{book.date}</strong> at {book.time.split(" (")[0]}</span>
                        </p>
                        <p className="flex items-center gap-1.5 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Location: <strong className="text-slate-700">{book.address}</strong></span>
                        </p>
                      </div>

                      {/* Status Tracker Stepper (Split unit details) */}
                      {book.status !== "cancelled" && (
                        <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-2">
                          <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest block">Live Servicing Status</span>
                          <div className="flex items-center gap-1">
                            <span className={`w-2.5 h-2.5 rounded-full ${book.status === "assigned" || book.status === "completed" ? "bg-cyan-500 animate-ping" : "bg-slate-300"}`} />
                            <span className="text-xs font-extrabold text-slate-700">
                              {book.status === "assigned" ? "Technician dispatched & heading your way!" : "AC Servicing complete. Cool airflow verified."}
                            </span>
                          </div>
                          {book.technicianName && (
                            <p className="text-xxs text-slate-500 font-semibold">
                              Assigned HVAC Specialist: <strong className="text-slate-700">{book.technicianName}</strong> • Phone verified.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Interactive Actions */}
                      <div className="flex gap-2 justify-end pt-2 flex-wrap">
                        {book.status !== "completed" && book.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancelBooking(book.id)}
                            className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-xl text-xxs transition cursor-pointer"
                          >
                            Cancel Appointment
                          </button>
                        )}
                        <button
                          onClick={() => handleSimulateStatus(book.id)}
                          className="px-4 py-2 bg-cyan-600 text-white hover:bg-cyan-700 font-black rounded-xl text-xxs transition flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Simulate Next Stage</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Scans History Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-sans font-bold text-slate-800 text-lg flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-cyan-600" />
              My Past AI Diagnostic Scans ({scans.length})
            </h3>

            {scans.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold text-center italic py-4">
                No past scans recorded yet. Go to AI Diagnostics to analyze any AC issue.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-cyan-100 bg-slate-50/30 text-left space-y-2.5 hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelectedScanDetail(scan)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 text-xxs font-extrabold bg-cyan-50 text-cyan-700 rounded uppercase">
                        {scan.brand}
                      </span>
                      <span className="text-xxs text-slate-400 font-bold">{scan.date}</span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate">{scan.symptoms}</p>
                      <p className="text-xxs text-slate-500 line-clamp-2 mt-1">{scan.diagnosis}</p>
                    </div>

                    <div className="flex justify-between items-center text-xxs font-bold pt-2 border-t border-slate-100 text-slate-400">
                      <span>Cost: {scan.estimatedCostRange}</span>
                      <span className="text-cyan-600 hover:underline">View Report →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Write a Review Form */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Review form */}
          <div className="bg-slate-50 p-6 border border-slate-100 rounded-3xl space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
              Write a Review
            </h3>
            
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. AJMERHUSSAIN ANSARI"
                  className="w-full bg-white border border-slate-200 text-slate-800 p-3 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Select Star Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl cursor-pointer ${star <= reviewRating ? "text-amber-500" : "text-slate-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Review Description</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell others about pricing, cooling quality, or technician response..."
                  className="w-full bg-white border border-slate-200 text-slate-800 p-3 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all min-h-[80px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold cursor-pointer transition shadow-sm"
              >
                Submit Review
              </button>
            </form>

            {reviewSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xxs font-bold text-center animate-bounce">
                🎉 Review submitted! Thank you for rating Detro Enterprises.
              </div>
            )}
          </div>

          {/* Service Trust Guarantee */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white p-6 rounded-3xl space-y-4 shadow-lg border border-slate-800">
            <h4 className="font-sans font-bold text-sm text-cyan-400 border-b border-white/10 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Service Assurance Guarantee
            </h4>
            
            <div className="space-y-4 text-xs">
              <div className="flex gap-2.5">
                <span className="text-cyan-400 font-extrabold text-sm shrink-0">01</span>
                <div>
                  <h5 className="font-extrabold text-slate-100">Certified Senior Engineers</h5>
                  <p className="text-slate-400 font-medium mt-0.5 leading-normal">
                    Servicing handled only by highly trained specialists (Minimum 5+ years experience) under supervision of Senior HVAC Specialist Ajmer Ansari.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="text-cyan-400 font-extrabold text-sm shrink-0">02</span>
                <div>
                  <h5 className="font-extrabold text-slate-100">Genuine Spare Parts & Gas</h5>
                  <p className="text-slate-400 font-medium mt-0.5 leading-normal">
                    All spare capacitors, copper pipes, filters, and refrigerant gases used are sourced strictly from OEM manufacturers.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="text-cyan-400 font-extrabold text-sm shrink-0">03</span>
                <div>
                  <h5 className="font-extrabold text-slate-100">Clean & Hygienic Execution</h5>
                  <p className="text-slate-400 font-medium mt-0.5 leading-normal">
                    We utilize high-pressure water jet bags to capture dirt and water spillages, leaving your home perfectly clean.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="text-cyan-400 font-extrabold text-sm shrink-0">04</span>
                <div>
                  <h5 className="font-extrabold text-slate-100">30-Day Peace of Mind</h5>
                  <p className="text-slate-400 font-medium mt-0.5 leading-normal">
                    Enjoy a full, unconditional 30-day warranty on all craftsmanship, cooling performance, and service resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modal Detail overlay for scan */}
      {selectedScanDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-left overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedScanDetail(null)}
              className="absolute top-4 right-4 bg-slate-100 text-slate-800 p-2 rounded-full hover:bg-slate-200 transition font-bold cursor-pointer"
            >
              ✕
            </button>

            <span className="px-2.5 py-1 text-xxs font-extrabold bg-cyan-50 text-cyan-700 rounded-full uppercase tracking-wider block w-fit">
              PAST DIAGNOSTIC RECORD
            </span>

            <h3 className="font-sans font-bold text-2xl text-slate-900">{selectedScanDetail.brand} AC Diagnosis</h3>
            <p className="text-xxs text-slate-400 font-bold">Diagnosed on {selectedScanDetail.date}</p>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
              <span className="text-xxs font-bold text-slate-400 block uppercase">Symptom Statement</span>
              <p className="text-xs text-slate-700 font-semibold">{selectedScanDetail.symptoms}</p>
            </div>

            <div className="p-4 bg-cyan-50/20 border border-cyan-100/30 rounded-xl space-y-2">
              <span className="text-xxs font-bold text-cyan-800 block uppercase">Gemini Diagnosis Analysis</span>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{selectedScanDetail.diagnosis}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xxs text-slate-400 font-bold block uppercase mb-1">Estimated Cost</span>
                <span className="text-sm font-extrabold text-slate-900">{selectedScanDetail.estimatedCostRange}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xxs text-slate-400 font-bold block uppercase mb-1">Severity</span>
                <span className="text-sm font-extrabold text-slate-900">{selectedScanDetail.severity}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedScanDetail(null)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
