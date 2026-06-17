import mongoose, { Schema } from 'mongoose';

export interface IInquiry {
  clientName: string;
  clientInitials: string;
  vehicleName: string;
  date: string;
  status: 'New' | 'Contacted';
  notes?: string;
  email?: string;
  phone?: string;
}

const InquirySchema: Schema = new Schema({
  clientName: { type: String, required: true },
  clientInitials: { type: String, required: true },
  vehicleName: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['New', 'Contacted'], default: 'New' },
  notes: { type: String },
  email: { type: String },
  phone: { type: String }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model<IInquiry>('Inquiry', InquirySchema);
