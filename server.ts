import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing with size limit for base64 AC uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Lazy initializer for GoogleGenAI client to avoid crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API for AC Repair Diagnostics using Gemini
app.post("/api/gemini/diagnose", async (req, res) => {
  try {
    const { symptoms, brand, image, mimeType } = req.body;

    if (!symptoms && !image) {
      return res.status(400).json({ error: "Please provide AC symptoms or upload an image." });
    }

    // Check if GEMINI_API_KEY exists. If not, fallback to offline diagnostic engine
    const apiKeyExists = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
    
    if (!apiKeyExists) {
      console.warn("GEMINI_API_KEY is missing or default. Providing professional local diagnostic response.");
      
      // Smart offline rules based on keywords
      const query = (symptoms || "").toLowerCase();
      let diagnosis = "General Split AC unit malfunction.";
      let probableCauses = ["Loose electrical wiring or faulty relay contact", "Dust accumulated on air filters restricting airflow", "Gradual refrigerant depletion"];
      let severity = "Medium";
      let complexity = "Moderate";
      let cost = "₹650 - ₹1,800";
      let emergency = ["Turn off the AC if you hear any grinding noises", "Check if the remote control batteries are working"];
      let services = ["Smart Diagnostics Inspection", "Deep Jet Cleaning"];

      if (query.includes("cool") || query.includes("warm") || query.includes("heat") || query.includes("cooling")) {
        diagnosis = "Inadequate cooling or AC blowing warm air.";
        probableCauses = ["Refrigerant (Gas) leakage in the condenser coil", "Extremely clogged air filters obstructing ventilation", "Faulty compressor capacitor"];
        severity = "Medium";
        complexity = "Complex";
        cost = "₹1,200 - ₹3,500";
        emergency = ["Turn off the compressor if it makes constant clicking noises", "Ensure the outdoor unit is not blocked by debris"];
        services = ["Gas Refilling & Leak Repair", "Deep Jet Cleaning", "Capacitor Replacement"];
      } else if (query.includes("leak") || query.includes("water") || query.includes("drip")) {
        diagnosis = "AC water dripping or indoor unit leaking.";
        probableCauses = ["Blocked/clogged drain pipe due to algae/dust build-up", "Frozen evaporator coils due to low refrigerant", "Improper indoor unit leveling"];
        severity = "Medium";
        complexity = "Easy";
        cost = "₹500 - ₹1,200";
        emergency = ["Place a bucket under the leak to avoid wall damage", "Switch to Fan Mode only to melt any internal ice formation"];
        services = ["Drainage Line Flush & Clear", "Split AC Deep Cleaning", "Re-installation Alignment Check"];
      } else if (query.includes("noise") || query.includes("sound") || query.includes("rattle") || query.includes("loud")) {
        diagnosis = "Abnormal vibration or noise from AC unit.";
        probableCauses = ["Unbalanced or cracked blower fan motor blades", "Loose front grill panel or casing screws", "Compressor mounting rubber pads worn out"];
        severity = "High";
        complexity = "Moderate";
        cost = "₹800 - ₹2,200";
        emergency = ["Turn off the AC immediately to prevent physical motor damage", "Do not stick any objects into the air vents"];
        services = ["Blower Fan Repair/Replacement", "Compressor Mounting Servicing", "General Body Tightening"];
      } else if (query.includes("power") || query.includes("start") || query.includes("on") || query.includes("dead") || query.includes("switch")) {
        diagnosis = "AC not powering on or shutting off abruptly.";
        probableCauses = ["Blown fuse in the main switch board or stabilizer", "Defective PCB (Printed Circuit Board) controller", "Tripped overload protector in compressor"];
        severity = "High";
        complexity = "Complex";
        cost = "₹1,500 - ₹4,500";
        emergency = ["Turn off the stabilizer power supply", "Check if other high-power appliances are working to rule out local voltage dips"];
        services = ["PCB Repair & Component Level Servicing", "Stabilizer Bypass & Safety Check", "Electrical Wiring Overhaul"];
      }

      if (image) {
        diagnosis = `Image-assisted analysis: ${diagnosis} (Visual inspection suggests physical external wear or localized dust)`;
      }

      return res.json({
        diagnosis,
        probableCauses,
        severity,
        complexity,
        estimatedCostRange: cost,
        emergencySteps: emergency,
        recommendedServices: services,
        isSimulated: true
      });
    }

    const ai = getGeminiClient();
    const promptParts: any[] = [];

    // Base text prompt
    let textPrompt = `You are an expert Air Conditioning technician and HVAC specialist at Detro Enterprises (Bokaro's top AC repair service).
Analyze the following user AC problem description and optional visual photo, then provide a highly detailed and professional diagnostic report.

User Symptoms/Description: "${symptoms || "Visual diagnostic of AC unit physical state"}"
AC Brand specified: "${brand || "Unknown/Standard Split AC"}"

Based on this, return a structured JSON report. Ensure estimates are realistic for professional services in Jharkhand/India (in INR currency).`;

    promptParts.push({ text: textPrompt });

    // Handle image input
    if (image && mimeType) {
      // Remove data URL prefix if present
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      promptParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: promptParts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: {
              type: Type.STRING,
              description: "A summary of the identified or suspected AC malfunction."
            },
            probableCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List 2 to 3 most probable technical reasons for this symptom."
            },
            severity: {
              type: Type.STRING,
              description: "Must be 'Low' (safe to operate), 'Medium' (operating issues, repair soon), or 'High' (safety or severe damage risk, power off immediately)."
            },
            complexity: {
              type: Type.STRING,
              description: "Must be 'Easy', 'Moderate', or 'Complex'."
            },
            estimatedCostRange: {
              type: Type.STRING,
              description: "Estimated cost range for repairs in India (INR currency, formatted with ₹), e.g. '₹500 - ₹1,200'."
            },
            emergencySteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Immediate safety/operational checks or actions for the homeowner."
            },
            recommendedServices: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The specific professional repairs/services needed from Detro Enterprises."
            }
          },
          required: ["diagnosis", "probableCauses", "severity", "complexity", "estimatedCostRange", "emergencySteps", "recommendedServices"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No diagnostic response from Gemini");
    }

    const diagnosticReport = JSON.parse(resultText.trim());
    return res.json({
      ...diagnosticReport,
      isSimulated: false
    });

  } catch (error: any) {
    console.error("Gemini Diagnostic Error:", error);
    return res.status(500).json({
      error: "Failed to perform diagnostic analysis. " + (error.message || ""),
      diagnosis: "Diagnostics offline due to a connection limit.",
      probableCauses: ["Local connection error", "API key status issue"],
      severity: "Medium",
      complexity: "Moderate",
      estimatedCostRange: "₹500 - ₹1,500",
      emergencySteps: ["Turn off AC if it behaves erratically", "Contact Detro Enterprises support via call"],
      recommendedServices: ["General Physical Inspection"],
      isSimulated: true
    });
  }
});

// Serve frontend build and handle SPA routing
async function startServer() {
  // Vite dev mode integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Detro Server] running on http://localhost:${PORT} under ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
