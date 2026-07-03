import { Service, Testimonial } from "./types";

export const SERVICES: Service[] = [
  {
    id: "deep-cleaning",
    name: "Deep Jet Power Cleaning",
    hindiName: "डीप जेट पावर क्लीनिंग",
    category: "cleaning",
    price: 599,
    priceUnit: "service",
    duration: "45 - 60 mins",
    description: "High-pressure indoor & outdoor jet cleaning to remove stubborn dust, improve cooling efficiency, and eliminate bacteria. Ideal for yearly pre-summer preparation.",
    features: [
      "Indoor coil high-pressure wash",
      "Outdoor condenser unit flush",
      "Drain pipe cleaning & clearing",
      "Air filter sanitization",
      "Airflow and temperature check"
    ],
    icon: "Wind"
  },
  {
    id: "gas-refill",
    name: "Gas Detection & Full Charging",
    hindiName: "गैस रिफिलिंग और लीक मरम्मत",
    category: "maintenance",
    price: 1899,
    priceUnit: "refill",
    duration: "60 - 90 mins",
    description: "Professional nitrogen leak testing, vacuuming, and exact brand-compliant refrigerant refilling (R22, R32, R410a) to restore optimal ice-cold cooling.",
    features: [
      "Nitrogen pressure leak testing",
      "Condenser & evaporator coil soldering",
      "System vacuuming & dehumidifying",
      "Premium eco-friendly refrigerant gas fill",
      "Compressor pressure monitoring"
    ],
    icon: "Gauge"
  },
  {
    id: "ac-install",
    name: "Split / Window AC Installation",
    hindiName: "एसी इंस्टॉलेशन सेवा",
    category: "installation",
    price: 1199,
    priceUnit: "installation",
    duration: "90 - 120 mins",
    description: "Safe, perfectly aligned bracket installation and copper pipe insulation connection with professional vibration-damping cushions. Completed by certified HVAC experts.",
    features: [
      "Indoor plate drilling and alignment",
      "Outdoor unit bracket installation",
      "Copper pipe flare connection",
      "Vacuum check & circuit wiring",
      "Vibration and sound reduction test"
    ],
    icon: "Wrench"
  },
  {
    id: "pcb-repair",
    name: "Electrical & PCB Board Repair",
    hindiName: "इलेक्ट्रिकल पीसीबी मरम्मत",
    category: "repair",
    price: 1499,
    priceUnit: "repair",
    duration: "1 - 2 days",
    description: "Diagnostic scan and component-level repairs of the Printed Circuit Board (PCB), display panels, sensor units, and relays.",
    features: [
      "Faulty relay & capacitor swap",
      "Microcontroller IC diagnostics",
      "Display pane & sensor replacement",
      "Short circuit safety check",
      "100% genuine electronics spares"
    ],
    icon: "Cpu"
  },
  {
    id: "compressor-service",
    name: "Compressor & Fan Motor Overhaul",
    hindiName: "कंप्रेशर और मोटर मरम्मत",
    category: "repair",
    price: 3499,
    priceUnit: "repair",
    duration: "2 - 4 hours",
    description: "Comprehensive compressor repairs, starting capacitor replacement, and fan motor servicing to fix loud rattling, grinding noises, and sudden power cuts.",
    features: [
      "Compressor oil quality inspection",
      "Heavy-duty capacitor replacement",
      "Blower fan blade realignment",
      "Motor winding insulation test",
      "Vibration-damping rubber pads"
    ],
    icon: "ShieldAlert"
  },
  {
    id: "smart-diagnostic",
    name: "Smart Diagnostics Inspection",
    hindiName: "स्मार्ट डायग्नोस्टिक जांच",
    category: "diagnostic",
    price: 299,
    priceUnit: "visit",
    duration: "20 - 30 mins",
    description: "Complete health check-up of the AC unit including electrical current flow, voltage checks, gas pressure reading, and duct health inspect. Free if you get repair done!",
    features: [
      "Electrical current and load scan",
      "Refrigerant gas pressure check",
      "Airflow speed & filter inspection",
      "Blower sound & health rating",
      "Repair quote with zero hidden charges"
    ],
    icon: "Activity"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "rev-1",
    author: "AJMERHUSSAIN ANSARI",
    text: "Best service. Very professional technicians who completed the AC deep cleaning in Bokaro Steel City quickly and effectively.",
    rating: 5,
    date: "8 months ago",
    verified: true,
    likes: 4
  },
  {
    id: "rev-2",
    author: "Auto phone",
    text: "Best and value for money service. Highly recommended for gas refilling and repair services near Makhdumpur, Bokaro. Rates are very transparent.",
    rating: 5,
    date: "8 months ago",
    verified: true,
    likes: 2
  },
  {
    id: "rev-3",
    author: "Rohan Kumar",
    text: "My Voltas 1.5 Ton split AC was leaking water continuously inside the bedroom. I booked Detro Enterprises and their technician solved it in 30 minutes! Clogged pipe flushed properly.",
    rating: 5,
    date: "2 months ago",
    verified: true,
    likes: 1
  },
  {
    id: "rev-4",
    author: "Manoj Singh",
    text: "Superb installation work of my new Daikin AC. They used proper vacuum pump and insulation. No vibrations at all. Good behavior and pricing is reasonable.",
    rating: 5,
    date: "1 month ago",
    verified: true,
    likes: 5
  }
];

export const AC_BRANDS = [
  "Voltas",
  "Daikin",
  "Lloyd",
  "LG",
  "Samsung",
  "Blue Star",
  "Hitachi",
  "Panasonic",
  "Carrier",
  "O General",
  "Godrej",
  "Whirlpool",
  "Haier"
];

export const AC_SYMPTOMS_SUGGESTIONS = [
  "Not cooling / blowing warm air (एसी ठंडा नहीं कर रहा)",
  "Water dripping from indoor unit (एसी से पानी टपक रहा है)",
  "AC making rattling or loud noise (एसी से आवाज आ रही है)",
  "AC not turning on at all (एसी चालू नहीं हो रहा है)",
  "Foul burning smell from vents (हवा से जलने की गंध)",
  "AC switching off frequently (एसी बार-बार बंद हो रहा है)"
];

export const FAQ_LIST = [
  {
    question: "How often should I service my air conditioner?",
    answer: "For residential split ACs in India, we strongly recommend a wet filter cleaning twice a year: once before the high summer season starts (Feb-March), and once mid-season or before winter storage. This ensures efficient cooling and keeps electric bills low."
  },
  {
    question: "What causes an AC indoor unit to leak water?",
    answer: "The most common culprit is a blocked condensate drain pipe due to slime, dirt, or ice build-up. This causes water to overflow from the drain pan inside. Other reasons include low refrigerant gas causing evaporator coils to freeze."
  },
  {
    question: "Why is my AC running but not cooling the room?",
    answer: "This is usually caused by either heavily clogged air filters restricting indoor air flow, or a leak in the refrigerant coil leading to low gas pressure. Faulty capacitors or an overheated outdoor unit can also cause the compressor to trip."
  },
  {
    question: "Are your technicians certified and safe to call home?",
    answer: "Absolutely. All Detro Enterprises technicians are native to Bokaro Steel City, undergo background checks, and hold professional diplomas in refrigeration & HVAC engineering. They carry authentic company ID cards."
  }
];

export const BOKARO_LOCATION_INFO = {
  address: "J4PM+GH5, near Bokaro Hardware, Makhdumpur, Rahmat Nagar, Makdumpur, Bokaro Steel City, Jharkhand 827012",
  phone: "+91 90069 62443", // Realistic phone format with the requested number
  email: "support@detroenterprises.com",
  timings: "9:00 AM - 8:00 PM (Monday - Sunday)",
  gmapsSnippet: "J4PM+GH5, Bokaro Steel City"
};
