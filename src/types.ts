export interface Service {
  id: string;
  name: string;
  hindiName?: string;
  category: "repair" | "installation" | "cleaning" | "maintenance" | "diagnostic";
  price: number;
  priceUnit: string;
  duration: string;
  description: string;
  features: string[];
  icon: string;
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  time: string;
  brand: string;
  serviceId: string;
  serviceName: string;
  issue: string;
  status: "pending" | "assigned" | "completed" | "cancelled";
  technicianName?: string;
  cost: number;
  createdAt: string;
  googleMapsLink?: string;
}

export interface DiagnosticScan {
  id: string;
  symptoms: string;
  brand: string;
  diagnosis: string;
  probableCauses: string[];
  severity: "Low" | "Medium" | "High" | string;
  complexity: "Easy" | "Moderate" | "Complex" | string;
  estimatedCostRange: string;
  emergencySteps: string[];
  recommendedServices: string[];
  date: string;
  isSimulated: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
  verified: boolean;
  likes?: number;
}
