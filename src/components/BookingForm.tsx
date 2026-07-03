import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Phone, User, Mail, Sparkles, CheckCircle, ShieldAlert, Award, Navigation, Compass } from "lucide-react";
import { Service, Booking } from "../types";
import { SERVICES, AC_BRANDS, BOKARO_LOCATION_INFO } from "../data";

interface BookingFormProps {
  selectedService: Service | null;
  selectedQuote: {
    serviceName: string;
    brand: string;
    cost: number;
    issue: string;
  } | null;
  selectedScan: any | null;
  onBookingSuccess: (booking: Booking) => void;
  clearSelectedReferences: () => void;
}

export default function BookingForm({
  selectedService,
  selectedQuote,
  selectedScan,
  onBookingSuccess,
  clearSelectedReferences,
}: BookingFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("Rahmat Nagar, Bokaro Steel City");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00 PM - 04:00 PM (Afternoon)");
  const [brand, setBrand] = useState("Voltas");
  const [serviceId, setServiceId] = useState("");
  const [issue, setIssue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationMethod, setLocationMethod] = useState<"none" | "gps" | "manual">("none");
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Your browser does not support GPS location detection.");
      return;
    }

    setDetectingLocation(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setGoogleMapsLink(link);
        setLocationMethod("gps");
        setDetectingLocation(false);
      },
      (err) => {
        console.error("GPS detection error", err);
        setDetectingLocation(false);
        if (err.code === 1) {
          setGpsError("Location access denied by your browser or the security container. Click the lock icon in your address bar to allow location permissions, or open the app in a new tab.");
        } else if (err.code === 2) {
          setGpsError("GPS position unavailable. Please ensure your device's location services are turned on.");
        } else if (err.code === 3) {
          setGpsError("Location detection request timed out. Please try clicking again, or copy and paste your link manually.");
        } else {
          setGpsError("Unable to fetch exact location automatically. Please copy & paste a Google Maps link manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 8500 }
    );
  };

  // Load selected references into form on mount / update
  useEffect(() => {
    if (selectedService) {
      setServiceId(selectedService.id);
      setIssue(`Standard maintenance requested for ${selectedService.name}.`);
    } else if (selectedQuote) {
      setServiceId("custom-package");
      setBrand(selectedQuote.brand || "Voltas");
      setIssue(selectedQuote.issue);
    } else if (selectedScan) {
      setServiceId("smart-diagnostic");
      setBrand(selectedScan.brand || "Voltas");
      setIssue(`AI Diagnostics Scan Report reference: ${selectedScan.diagnosis}. Recommended Repair: ${selectedScan.recommendedServices.join(", ")}`);
    } else {
      setServiceId(SERVICES[0].id);
    }
  }, [selectedService, selectedQuote, selectedScan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!customerName.trim()) {
      setError("Please provide your full name.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError("Please provide a valid 10-digit mobile number so our technician can call you.");
      return;
    }
    if (!address.trim()) {
      setError("Please specify your installation/repair address in Bokaro.");
      return;
    }
    if (!date) {
      setError("Please select a preferred service date.");
      return;
    }

    const matchedService = SERVICES.find((s) => s.id === serviceId);
    const serviceName = serviceId === "custom-package"
      ? (selectedQuote?.serviceName || "Custom Repair Package")
      : (matchedService?.name || "General Repair Diagnostics");

    let cost = matchedService ? matchedService.price : 299;
    if (serviceId === "custom-package" && selectedQuote) {
      cost = selectedQuote.cost;
    }

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      customerName,
      phone,
      email: email || "customer@bokaro.com",
      address,
      date,
      time,
      brand,
      serviceId,
      serviceName,
      issue,
      status: "assigned", // Directly assigned for excellent customer simulation
      technicianName: "A. Ansari (Senior HVAC Specialist)", // Direct assignment matches reviewer Ajmerhussain Ansari!
      cost,
      createdAt: new Date().toLocaleDateString("en-IN"),
      googleMapsLink: googleMapsLink || undefined
    };

    // Save Booking
    const localBookings = JSON.parse(localStorage.getItem("detro_bookings") || "[]");
    const updated = [newBooking, ...localBookings];
    localStorage.setItem("detro_bookings", JSON.stringify(updated));

    // Construct WhatsApp message with booking details and trigger direct redirect
    const whatsappNumber = "919006962443";
    const text = `*New AC Service Booking Request* 🛠️💨
----------------------------------
*Booking ID:* ${newBooking.id}
*Customer Name:* ${newBooking.customerName}
*Mobile:* ${newBooking.phone}
*Address:* ${newBooking.address}
${newBooking.googleMapsLink ? `*Exact Home Map Location:* ${newBooking.googleMapsLink}\n` : ''}*AC Brand:* ${newBooking.brand}
*Service Type:* ${newBooking.serviceName}
*Service Date:* ${newBooking.date}
*Preferred Time:* ${newBooking.time}
*Estimated Price:* ₹${newBooking.cost}
${newBooking.issue ? `*Symptoms/Details:* ${newBooking.issue}` : ''}
----------------------------------
Please confirm my appointment. Thank you!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    
    // Open WhatsApp in a new tab/window for immediate dispatch
    window.open(whatsappUrl, "_blank");

    // Callback to App
    onBookingSuccess(newBooking);

    // Clear form and selections
    setCustomerName("");
    setPhone("");
    setEmail("");
    setIssue("");
    setGoogleMapsLink("");
    setLocationMethod("none");
    clearSelectedReferences();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 text-left">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Schedule Doorstep AC Repair
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm">
          No credit card required. Pay securely online or via Cash/UPI after the servicing is completed at your residence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left main form */}
        <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Calendar className="w-5 h-5 text-cyan-600 animate-pulse" />
            <span className="font-bold text-slate-800 text-lg">Booking Information</span>
          </div>

          {selectedQuote && (
            <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100/50 rounded-2xl">
              <span className="text-xxs font-bold text-cyan-800 uppercase tracking-widest block mb-1">SELECTED QUOTE ACTIVE</span>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                {selectedQuote.serviceName} • Estimated Grand Total: <span className="font-black text-slate-900 text-sm">₹{selectedQuote.cost}</span>
              </p>
            </div>
          )}

          {selectedScan && (
            <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100/50 rounded-2xl">
              <span className="text-xxs font-bold text-cyan-800 uppercase tracking-widest block mb-1">ATTACHED SMART AI DIAGNOSIS</span>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                Issue: {selectedScan.diagnosis.slice(0, 100)}...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Customer Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <User className="w-4 h-4 text-slate-400" /> Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ajmer Ansari"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-3 px-4 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Phone className="w-4 h-4 text-slate-400" /> Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 91234 56789"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-3 px-4 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all placeholder-slate-400"
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Mail className="w-4 h-4 text-slate-400" /> Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. client@bokaro.com"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-3 px-4 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all placeholder-slate-400"
              />
            </div>

            {/* Address in Bokaro */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" /> Address (Bokaro Steel City location)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Makhdumpur, near Bokaro Hardware, Sector 4, Bokaro"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-3 px-4 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all placeholder-slate-400"
              />
            </div>

            {/* Exact Google Location Selection */}
            <div className="p-4 bg-gradient-to-tr from-cyan-50/50 to-slate-50 border border-slate-200/60 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyan-600 animate-spin-slow" />
                  Exact Google Maps Link / GPS (Optional)
                </span>
                <span className="text-[10px] font-extrabold text-cyan-600 bg-cyan-100/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Accurate Navigation
                </span>
              </div>
              
              <p className="text-[11px] text-slate-500 leading-normal font-medium">
                Share your home location so our technician can navigate directly to your home using Google Maps. You can auto-detect your current GPS location or paste a link.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white disabled:bg-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
                >
                  {detectingLocation ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Pinpointing GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5 text-white" />
                      <span>Detect Live GPS Location</span>
                    </>
                  )}
                </button>

                <div className="flex-grow">
                  <input
                    type="text"
                    value={googleMapsLink}
                    onChange={(e) => {
                      setGoogleMapsLink(e.target.value);
                      setLocationMethod("manual");
                    }}
                    placeholder="Paste your Google Maps location link here manually"
                    className="w-full bg-white border border-slate-200 text-slate-800 py-3 px-3.5 rounded-xl font-semibold text-xs focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              {locationMethod === "gps" && (
                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 py-2 px-3.5 rounded-xl border border-emerald-100 animate-fade-in">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span>GPS Location Detected: {googleMapsLink.slice(0, 45)}... Attached for technician navigation!</span>
                </div>
              )}

              {gpsError && (
                <div className="p-3 bg-amber-50/80 border border-amber-200/50 rounded-xl text-[11px] text-amber-800 font-semibold space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Notice: {gpsError}
                  </p>
                  <p className="text-slate-500 font-medium leading-relaxed pl-3.5">
                    No worries! You can still type your address above or copy-paste a Google Maps link directly into the text box to proceed with your booking.
                  </p>
                </div>
              )}

              {locationMethod === "manual" && googleMapsLink.trim() && (
                <div className="flex items-center gap-2 text-[11px] font-bold text-cyan-700 bg-cyan-50 py-2 px-3.5 rounded-xl border border-cyan-100">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                  <span>Manual Google Maps Link attached successfully!</span>
                </div>
              )}
            </div>

            {/* Date & Time Slot selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-400" /> Service Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-3 px-4 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" /> Preferred Slot
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-3 px-4 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all"
                >
                  <option value="09:00 AM - 12:00 PM (Morning)">09:00 AM - 12:00 PM (Morning)</option>
                  <option value="12:00 PM - 04:00 PM (Afternoon)">12:00 PM - 04:00 PM (Afternoon)</option>
                  <option value="04:00 PM - 08:00 PM (Evening)">04:00 PM - 08:00 PM (Evening)</option>
                </select>
              </div>
            </div>

            {/* Service & Brand selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Service Selection
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  disabled={!!selectedQuote}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-3 px-4 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all disabled:opacity-70"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} (₹{s.price})</option>
                  ))}
                  <option value="custom-package">Custom Package Quote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  AC Brand / Brand Manufacturer
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-3 px-4 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all"
                >
                  {AC_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Issue descriptions box */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Explain Symptoms or Error details (Optional)
              </label>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="e.g. Split outdoor fan is running, but indoor panel is blinking error light..."
                className="w-full min-h-[100px] bg-slate-50 border border-slate-200 text-slate-800 py-3 px-4 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all placeholder-slate-400 text-sm"
              />
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-bold shadow-md shadow-cyan-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                id="btn-submit-booking"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Confirm Doorstep Booking</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right sidebar info */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Quick contact / Address Card */}
          <div className="bg-slate-50 p-6 border border-slate-100 rounded-3xl space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <MapPin className="w-5 h-5 text-cyan-600" />
              Office Location
            </h3>
            
            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <p className="leading-relaxed">
                <span className="font-bold text-slate-800 block mb-0.5">Address:</span>
                {BOKARO_LOCATION_INFO.address}
              </p>
              <p>
                <span className="font-bold text-slate-800 block mb-0.5">Operating Hours:</span>
                {BOKARO_LOCATION_INFO.timings}
              </p>
              <p>
                <span className="font-bold text-slate-800 block mb-0.5">Support Call Line:</span>
                {BOKARO_LOCATION_INFO.phone}
              </p>
              <p className="flex flex-col pt-2 border-t border-slate-200/60">
                <span className="font-bold text-emerald-700 block mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  WhatsApp Direct Help:
                </span>
                <a
                  href="https://wa.me/919006962443"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xxs w-fit transition cursor-pointer decoration-transparent shadow-sm"
                >
                  💬 Chat on 9006962443
                </a>
              </p>
            </div>
          </div>

          {/* Guarantee highlights */}
          <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 text-white p-6 rounded-3xl space-y-4 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-cyan-200" />
            </div>
            <h4 className="font-bold text-base">Booking Benefits</h4>
            
            <ul className="space-y-3 text-xs font-medium text-slate-100">
              <li className="flex items-start gap-2">
                <span className="text-cyan-200 font-black">✓</span>
                <span>Zero Inspection Fee when you get repair done.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-200 font-black">✓</span>
                <span>Genuine manufacturer spare parts used.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-200 font-black">✓</span>
                <span>Bokaro's only 30-day service guaranteed.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
