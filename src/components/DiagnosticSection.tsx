import React, { useState, useRef } from "react";
import { Upload, Activity, FileText, AlertTriangle, AlertCircle, RefreshCw, Sparkles, CheckCircle, HelpCircle } from "lucide-react";
import { DiagnosticScan } from "../types";
import { AC_BRANDS, AC_SYMPTOMS_SUGGESTIONS } from "../data";

interface DiagnosticSectionProps {
  onDiagnosticBook: (scan: DiagnosticScan) => void;
  savedScans: DiagnosticScan[];
  setSavedScans: React.Dispatch<React.SetStateAction<DiagnosticScan[]>>;
}

export default function DiagnosticSection({ onDiagnosticBook, savedScans, setSavedScans }: DiagnosticSectionProps) {
  const [symptoms, setSymptoms] = useState("");
  const [brand, setBrand] = useState("Voltas");
  const [image, setImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DiagnosticScan | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingMessages = [
    "Establishing connection with Detro Smart HVAC Engine...",
    "Analyzing visual inputs and physical signs of AC wear...",
    "Scanning split circuit boards and safety relay fuses...",
    "Correlating symptoms with Bokaro climate and humidity factors...",
    "Compiling safety steps and professional repair cost estimates..."
  ];

  // Pre-configured diagnostic templates for easy user demonstration
  const sampleScans = [
    {
      title: "Water Leaking (पानी लीक)",
      desc: "Water is continuously dripping from the indoor unit onto the wall.",
      img: "https://picsum.photos/seed/waterleak/400/300",
      symptoms: "Water dripping from the split AC indoor unit casing during operation."
    },
    {
      title: "Warm Air Blowing (गर्म हवा)",
      desc: "AC is running but blowing hot/normal room temperature air.",
      img: "https://picsum.photos/seed/warmac/400/300",
      symptoms: "The split AC is running but blowing warm air, compressor clicks off."
    },
    {
      title: "Loud Rattle (तेज़ आवाज़)",
      desc: "AC makes a metal rattling or clicking noise.",
      img: "https://picsum.photos/seed/acnoise/400/300",
      symptoms: "Loud rattling and vibrating noise coming from the indoor blower motor fan."
    }
  ];

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WEBP).");
      return;
    }
    
    // Check file size (limit to 4MB for faster base64 uploading)
    if (file.size > 4 * 1024 * 1024) {
      setError("File is too large. Please upload an image under 4MB.");
      return;
    }

    setError(null);
    setImageMime(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setImageMime(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSampleClick = (sample: typeof sampleScans[0]) => {
    setSymptoms(sample.symptoms);
    // Convert sample image placeholder to base64 so it travels with API
    setImage(sample.img);
    setImageMime("image/jpeg");
    setError(null);
  };

  const runDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() && !image) {
      setError("Please describe your AC issues or upload a photo of the unit first.");
      return;
    }

    setLoading(true);
    setReport(null);
    setError(null);
    setLoadingStep(0);

    // Dynamic message switching during load
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 1800);

    try {
      const response = await fetch("/api/gemini/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms,
          brand,
          image,
          mimeType: imageMime
        })
      });

      if (!response.ok) {
        throw new Error("Server responded with an error.");
      }

      const data = await response.json();
      
      const newScan: DiagnosticScan = {
        id: `scan-${Date.now()}`,
        symptoms: symptoms || "Visual inspection of air conditioning unit",
        brand,
        diagnosis: data.diagnosis,
        probableCauses: data.probableCauses,
        severity: data.severity,
        complexity: data.complexity,
        estimatedCostRange: data.estimatedCostRange,
        emergencySteps: data.emergencySteps,
        recommendedServices: data.recommendedServices,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }),
        isSimulated: !!data.isSimulated
      };

      setReport(newScan);
      
      // Save to local scans array
      const updated = [newScan, ...savedScans];
      setSavedScans(updated);
      localStorage.setItem("detro_scans", JSON.stringify(updated));

    } catch (err: any) {
      console.error(err);
      setError("Unable to process the AI analysis right now. Please describe your symptoms simply, or contact Bokaro support.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          AI-Powered Smart Diagnostics
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          Upload a photo of your split/window AC unit, remote control, or leaking area and let our Gemini-backed assistant diagnose the root cause immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand Input Column */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Sparkles className="w-5 h-5 text-cyan-600 animate-pulse" />
            <span className="font-bold text-slate-800 text-lg">Diagnostics Panel</span>
          </div>

          <form onSubmit={runDiagnosis} className="space-y-5 text-left">
            
            {/* AC Brand selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Your AC Manufacturer / Brand
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

            {/* Description symptoms */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                What problems are you facing? (सymptom लिखें)
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. AC indoor unit is constantly dripping water, or my Lloyd split AC turns off automatically after 10 mins..."
                className="w-full min-h-[100px] bg-slate-50 border border-slate-200 text-slate-800 py-3 px-4 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition-all placeholder-slate-400"
              />
              
              {/* Quick suggestions chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {AC_SYMPTOMS_SUGGESTIONS.slice(0, 3).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSymptoms(item)}
                    className="text-xxs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-100 px-2.5 py-1 rounded-full transition cursor-pointer"
                  >
                    + {item.split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* File upload drag-and-drop */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upload Photo of AC Unit / remote error code
              </label>
              
              {!image ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-cyan-500 bg-slate-50/50 hover:bg-cyan-50/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 group"
                  id="dropzone"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-all">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Drag photo here, or click to browse</p>
                  <p className="text-xs text-slate-400 font-semibold">Supports JPEG, PNG under 4MB</p>
                </div>
              ) : (
                <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 aspect-video flex items-center justify-center">
                  <img
                    src={image}
                    alt="Uploaded AC Diagnostic"
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition cursor-pointer font-extrabold text-xs"
                    title="Remove Photo"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="ac-photo-upload"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-bold shadow-md shadow-cyan-200 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                id="btn-run-diagnosis"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    <span>Run Diagnostic Scan</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Hand Template Suggestion Column */}
        <div className="md:col-span-5 space-y-6 text-left">
          <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
            <h3 className="font-bold text-lg flex items-center gap-2 text-cyan-400">
              <Activity className="w-5 h-5" />
              Quick Testing Templates
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Don't have a photo handy? Click one of these preloaded AC failure templates to see how our AI system classifies problems, generates emergency guidelines, and schedules technician visits.
            </p>
            
            <div className="space-y-3 pt-2">
              {sampleScans.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(sample)}
                  className="w-full p-3 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-cyan-500/50 rounded-xl text-left transition flex items-center gap-3 group cursor-pointer focus:outline-none"
                >
                  <div className="w-14 h-11 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-slate-800">
                    <img
                      src={sample.img}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white leading-tight group-hover:text-cyan-400 transition">
                      {sample.title}
                    </p>
                    <p className="text-xxs text-slate-400 truncate mt-1">
                      {sample.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Disclaimer */}
          <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-slate-700 block">⚠️ Note on Safety:</span>
            <p className="text-xxs text-slate-500 leading-relaxed font-medium">
              AI Diagnostic report provides suggestions based on HVAC neural networks. High-voltage AC units can be dangerous. Always shut down power supplies before undertaking checks, and leave repairs to certified Detro Enterprises technicians.
            </p>
          </div>
        </div>
      </div>

      {/* Loading Block */}
      {loading && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-md flex flex-col items-center justify-center gap-4 text-center max-w-xl mx-auto py-12 animate-pulse">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-100 border-t-cyan-600 animate-spin" />
            <Activity className="absolute w-6 h-6 text-cyan-600 animate-bounce" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-slate-800">Please wait while AI Diagnoses your issue</p>
            <p className="text-xs text-cyan-700 font-semibold h-5 transition-all">
              {loadingMessages[loadingStep]}
            </p>
          </div>
        </div>
      )}

      {/* Diagnostics Result Report */}
      {report && (
        <div className="bg-white rounded-3xl border border-cyan-100 shadow-lg shadow-cyan-50/50 overflow-hidden text-left max-w-3xl mx-auto animate-in zoom-in-95 duration-300">
          
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyan-100">
            <div>
              <span className="px-2.5 py-1 text-xxs font-bold bg-white/20 backdrop-blur-md rounded-full text-white uppercase tracking-wider block w-fit mb-1">
                SYSTEM GENERATED REPORT
              </span>
              <h3 className="font-sans font-extrabold text-xl sm:text-2xl">
                Diagnostic Scan Results
              </h3>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs font-medium">
              AC Model: <span className="font-bold">{report.brand}</span> • {report.date}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Quick Status Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-6">
              
              {/* Severity */}
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  SEVERITY LEVEL
                </span>
                <span className={`inline-flex items-center gap-1 text-sm font-extrabold ${
                  report.severity === "High" ? "text-rose-600" : report.severity === "Medium" ? "text-amber-600" : "text-emerald-600"
                }`}>
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {report.severity}
                </span>
              </div>

              {/* Repair Complexity */}
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  REPAIR COMPLEXITY
                </span>
                <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1">
                  <Activity className="w-4 h-4 text-cyan-600 shrink-0" />
                  {report.complexity}
                </span>
              </div>

              {/* Estimate */}
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  BOKARO REPAIR ESTIMATE
                </span>
                <span className="text-base font-extrabold text-slate-900 leading-tight">
                  {report.estimatedCostRange}
                </span>
              </div>

            </div>

            {/* Core Diagnosis description */}
            <div className="space-y-2">
              <h4 className="font-sans font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-600" />
                Problem Diagnosis Summary
              </h4>
              <p className="text-sm text-slate-600 bg-cyan-50/20 border border-cyan-100/30 p-4 rounded-xl leading-relaxed font-medium">
                {report.diagnosis}
              </p>
            </div>

            {/* Probable causes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h4 className="font-sans font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Probable Root Causes
                </h4>
                <ul className="space-y-2">
                  {report.probableCauses.map((cause, idx) => (
                    <li key={idx} className="text-xs font-semibold text-slate-600 flex items-start gap-2.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xxs font-extrabold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emergency Homeowner Actions */}
              <div className="space-y-3">
                <h4 className="font-sans font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  Emergency Safety Guidelines
                </h4>
                <ul className="space-y-2">
                  {report.emergencySteps.map((step, idx) => (
                    <li key={idx} className="text-xs font-semibold text-slate-600 flex items-start gap-2.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-50 text-rose-500 text-xxs font-extrabold shrink-0 mt-0.5">
                        ⚠️
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Services & Immediate CTA */}
            <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <p className="text-xxs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  RECOMMENDED SERVICES
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.recommendedServices.map((srv, idx) => (
                    <span key={idx} className="px-3 py-1 bg-cyan-50 border border-cyan-100/50 rounded-lg text-xs font-semibold text-cyan-700">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onDiagnosticBook(report)}
                className="px-6 py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-bold shadow-md shadow-cyan-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Schedule Technician Repair</span>
              </button>
            </div>

            {report.isSimulated && (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-xxs font-bold text-center">
                🤖 Simulated Smart Diagnosis active. Configure process.env.GEMINI_API_KEY in Secrets for live cloud diagnostics.
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
