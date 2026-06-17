import mongoose, { Schema } from 'mongoose';

export interface IVehicle {
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  images?: string[];
  color: string;
  transmission: string;
  fuelType: string;
  engine: string;
  status: 'Available' | 'Reserved' | 'Sold';
  slug: string;
  description: string;
  inquiriesCount: number;
  mileage?: number;
  trim?: string;
  features?: string[];
}

const VehicleSchema: Schema = new Schema({
  vin: { type: String, required: true, unique: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  color: { type: String, required: true },
  transmission: { type: String, required: true },
  fuelType: { type: String, required: true },
  engine: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Reserved', 'Sold'], default: 'Available' },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  inquiriesCount: { type: Number, default: 0 },
  mileage: { type: Number, default: 0 },
  trim: { type: String },
  features: { type: [String], default: [] }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model<IVehicle>('Vehicle', VehicleSchema);
