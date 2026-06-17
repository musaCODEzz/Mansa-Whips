export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number; // in KSH
  image: string;
  images?: string[];
  color: string;
  transmission: string; // e.g., Automatic
  fuelType: string; // e.g., Petrol
  engine: string; // e.g., 4.0L V8
  status: 'Available' | 'Reserved' | 'Sold';
  slug: string;
  description: string;
  inquiriesCount: number;
  mileage?: number; // in km, e.g., 23000
  trim?: string; // e.g., AMG Line or Competition
  features?: string[];
}

export interface Inquiry {
  id: string;
  clientName: string;
  clientInitials: string;
  vehicleName: string;
  date: string;
  status: 'New' | 'Contacted';
  notes?: string;
  email?: string;
  phone?: string;
}

export type ActiveTab = 'dashboard' | 'inventory' | 'add-vehicle' | 'leads' | 'settings';
