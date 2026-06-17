import React, { useState } from 'react';
import { X, CheckCircle, Phone, Mail, Award, FileText, Settings, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import { Vehicle, Inquiry } from '../types';

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onInquire?: (v: Vehicle) => void;
}

export function VehicleDetailsModal({ vehicle, onClose, onInquire }: VehicleDetailsModalProps) {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-200 font-mono text-xs select-none">
      <div className="bg-[#0B0B0C] border border-white/10 w-full max-w-2xl rounded-none overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Banner image of luxury vehicle */}
        <div className="h-60 relative w-full overflow-hidden">
          <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-[#0B0B0C] text-[#F5F5F0] hover:bg-white hover:text-black hover:border-transparent p-2 rounded-none cursor-pointer transition-colors border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="absolute bottom-4 left-6">
            <span className="bg-white text-black font-semibold text-[9px] px-2 py-0.5 rounded-none tracking-[0.15em] uppercase">
              {vehicle.status}
            </span>
            <h3 className="font-serif text-xl md:text-2xl font-semibold italic text-[#F5F5F0] mt-1 uppercase tracking-wider">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
        </div>

        {/* content body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center py-4 border-y border-white/10">
            <div className="space-y-1">
              <span className="text-[#C2C2BB]/40 uppercase text-[9px] tracking-[0.1em]">ENGINE</span>
              <p className="font-semibold text-[#F5F5F0] overflow-hidden text-ellipsis whitespace-nowrap">{vehicle.engine}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[#C2C2BB]/40 uppercase text-[9px] tracking-[0.1em]">GEARBOX</span>
              <p className="font-semibold text-[#F5F5F0]">{vehicle.transmission}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[#C2C2BB]/40 uppercase text-[9px] tracking-[0.1em]">COLOR</span>
              <p className="font-semibold text-[#F5F5F0] overflow-hidden text-ellipsis whitespace-nowrap">{vehicle.color}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[#C2C2BB]/40 uppercase text-[9px] tracking-[0.1em]">YEAR</span>
              <p className="font-semibold text-[#F5F5F0]">{vehicle.year}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-white/40 font-bold text-[10px] uppercase tracking-wider block">SHOWROOM INSIGHT</span>
            <p className="font-serif text-[12.5px] text-[#C2C2BB] leading-relaxed italic">
              "{vehicle.description}"
            </p>
          </div>

          <div className="p-4 bg-white/[0.01] border border-white/10 rounded-none grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[#C2C2BB]/40 uppercase text-[9px] tracking-[0.1em]">VEHICLE IDENTITY NUMBER</span>
              <p className="font-bold text-[#F5F5F0] tracking-wider font-mono uppercase">{vehicle.vin}</p>
            </div>
            <div className="space-y-1 md:text-right">
              <span className="text-[#C2C2BB]/40 uppercase text-[9px] tracking-[0.1em]">SHOWROOM INVESTMENT PRICE</span>
              <p className="text-sm md:text-base font-semibold font-mono text-[#F5F5F0]">KSH {vehicle.price.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-white/15 text-[#C2C2BB] hover:text-white hover:bg-white/5 tracking-[0.15em] font-mono uppercase text-[10px] rounded-none cursor-pointer"
            >
              Close specs
            </button>
            {onInquire && vehicle.status !== 'Sold' && (
              <button
                onClick={() => onInquire(vehicle)}
                className="px-5 py-2.5 bg-white text-black hover:bg-[#F5F5F0] tracking-[0.15em] font-semibold font-mono uppercase text-[10px] rounded-none"
              >
                Inquire For client
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InquiryDetailsModalProps {
  inquiry: Inquiry | null;
  onClose: () => void;
  onUpdateStatus: (id: string, s: 'New' | 'Contacted') => void;
  onAddComment: (id: string, comment: string) => void;
}

export function InquiryDetailsModal({
  inquiry,
  onClose,
  onUpdateStatus,
  onAddComment
}: InquiryDetailsModalProps) {
  const [commentInput, setCommentInput] = useState('');

  if (!inquiry) return null;

  const handleStatusChange = (newStatus: 'New' | 'Contacted') => {
    onUpdateStatus(inquiry.id, newStatus);
  };

  const handleSaveComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      onAddComment(inquiry.id, commentInput.trim());
      setCommentInput('');
      alert('Internal staff memorandum saved securely to client records.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono text-xs select-none">
      <div className="bg-[#0B0B0C] border border-white/10 w-full max-w-lg rounded-none overflow-hidden shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#0B0B0C] text-[#F5F5F0] hover:bg-white hover:text-black hover:border-transparent p-2 rounded-none border border-white/10 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
          <div className="w-12 h-12 rounded-none bg-white/[0.04] border border-white/15 flex items-center justify-center font-bold text-[#F5F5F0] text-sm shrink-0">
            {inquiry.clientInitials}
          </div>
          <div>
            <h3 className="font-serif tracking-wider text-[#F5F5F0] text-base font-medium">{inquiry.clientName}</h3>
            <p className="text-[#C2C2BB]/40 text-[9px] uppercase tracking-[0.15em] mt-0.5">{inquiry.date}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/[0.01] border border-white/10 rounded-none">
              <span className="text-[#C2C2BB]/40 uppercase text-[9px] tracking-[0.1em] block">CLIENT PHONE</span>
              <a href={`tel:${inquiry.phone}`} className="font-bold text-[#F5F5F0] hover:text-white flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-white/30 shrink-0" />
                {inquiry.phone || 'No Mobile Given'}
              </a>
            </div>
            
            <div className="p-3 bg-white/[0.01] border border-white/10 rounded-none">
              <span className="text-[#C2C2BB]/40 uppercase text-[9px] block tracking-[0.1em]">CLIENT EMAIL</span>
              <a href={`mailto:${inquiry.email}`} className="font-bold text-[#F5F5F0] hover:text-white flex items-center gap-1.5 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                <Mail className="w-3.5 h-3.5 text-white/30 shrink-0" />
                {inquiry.email || 'No Email Given'}
              </a>
            </div>
          </div>

          <div className="p-3 bg-white/[0.01] border border-white/10 rounded-none space-y-1">
            <span className="text-[#C2C2BB]/40 uppercase text-[9px] tracking-[0.1em] block">TARGET STOCK ASSET</span>
            <p className="font-bold text-[#F5F5F0] flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-white/30 shrink-0" />
              {inquiry.vehicleName}
            </p>
          </div>

          <div className="space-y-1.5 p-3 bg-white/[0.02] border border-white/5 rounded-none">
            <span className="text-[#C2C2BB]/60 font-bold uppercase text-[9px] block tracking-wider">CLIENT TELEGRAM / NOTES BRIEF</span>
            <p className="font-serif text-xs text-[#C2C2BB] italic leading-relaxed">
              "{inquiry.notes}"
            </p>
          </div>

          <div className="space-y-2 pt-2 pb-4 border-t border-white/10">
            <span className="text-[#C2C2BB]/40 uppercase text-[9px] block tracking-[0.15em] font-medium">Inquiry Pipeline stage</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange('New')}
                className={`py-2 border font-mono font-semibold text-[10px] tracking-[0.15em] uppercase text-center rounded-none ${
                  inquiry.status === 'New'
                    ? 'bg-white text-black border-transparent shadow'
                    : 'border-white/10 text-[#C2C2BB] hover:bg-white/5'
                }`}
              >
                Pipeline: New
              </button>
              
              <button
                type="button"
                onClick={() => handleStatusChange('Contacted')}
                className={`py-2 border font-mono font-semibold text-[10px] tracking-[0.15em] uppercase text-center rounded-none relative ${
                  inquiry.status === 'Contacted'
                    ? 'bg-white text-black border-transparent shadow'
                    : 'border-white/10 text-[#C2C2BB] hover:bg-white/5'
                }`}
              >
                Pipeline: Contacted
              </button>
            </div>
          </div>

          {/* Internal staff memorandum log */}
          <form onSubmit={handleSaveComment} className="pt-3 border-t border-white/10 space-y-2">
            <label htmlFor="inquiry-memo-notes" className="text-[#C2C2BB]/40 uppercase text-[9px] block tracking-[0.15em] font-medium">Log Internal memo notes</label>
            <div className="flex gap-2">
              <input
                id="inquiry-memo-notes"
                name="inquiry-memo-notes"
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Spoke with client, trade-in value is satisfactory..."
                className="flex-grow bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 resize-none rounded-none outline-none h-10"
              />
              <button
                type="submit"
                className="bg-transparent text-[#F5F5F0] hover:bg-white hover:text-black border border-white/20 px-3 font-mono tracking-wider text-[9px] uppercase rounded-none transition-colors hover:border-transparent shrink-0"
              >
                Log memo
              </button>
            </div>
          </form>
        </div>

        <div className="flex justify-end pt-4 mt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-white/15 text-[#C2C2BB]/70 hover:text-white rounded-none font-mono text-[10px] uppercase tracking-wider h-10 flex items-center justify-center transition-colors"
          >
            Close Inquiry view
          </button>
        </div>
      </div>
    </div>
  );
}

interface EditVehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSave: (v: Vehicle) => void;
}

export function EditVehicleModal({ vehicle, onClose, onSave }: EditVehicleModalProps) {
  const [price, setPrice] = useState(vehicle ? vehicle.price.toString() : '');
  const [color, setColor] = useState(vehicle ? vehicle.color : '');
  const [status, setStatus] = useState<Vehicle['status']>(vehicle ? vehicle.status : 'Available');
  const [engine, setEngine] = useState(vehicle ? vehicle.engine : '');
  const [transmission, setTransmission] = useState(vehicle ? vehicle.transmission : 'Automatic');
  const [description, setDescription] = useState(vehicle ? vehicle.description : '');
  const [mileage, setMileage] = useState(vehicle ? (vehicle.mileage || 0).toString() : '');
  const [featuresText, setFeaturesText] = useState(vehicle && vehicle.features ? vehicle.features.join(', ') : '');
  const [images, setImages] = useState<string[]>(() => {
    if (vehicle && vehicle.images && vehicle.images.length === 4) {
      return [...vehicle.images];
    }
    return [vehicle ? vehicle.image : '', '', '', ''];
  });
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);

  if (!vehicle) return null;

  const uploadToCloudinary = async (base64WebP: string): Promise<string> => {
    const cloudName = ((import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || '').trim();
    const uploadPreset = ((import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim();

    if (!cloudName || !uploadPreset) {
      return base64WebP;
    }

    try {
      const formData = new FormData();
      formData.append('file', base64WebP);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Cloudinary response not OK');
      }

      const data = await res.json();
      return data.secure_url || base64WebP;
    } catch (err) {
      console.error('Cloudinary cloud upload failed, utilizing high-performance local fallback:', err);
      return base64WebP;
    }
  };

  const compressToWebP = (file: File, callback: (finalUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Export as WebP with 0.82 quality to balance visual beauty and mobile download speed
        const compressedBase64 = canvas.toDataURL('image/webp', 0.82);
        
        uploadToCloudinary(compressedBase64).then((finalUrl) => {
          callback(finalUrl);
        });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || parseFloat(price) <= 0) {
      alert('Must be a realistic showroom valuation.');
      return;
    }

    onSave({
      ...vehicle,
      price: parseFloat(price),
      color,
      status,
      engine,
      transmission,
      description,
      image: images[0] || vehicle.image,
      images: images,
      mileage: parseInt(mileage) || 0,
      features: featuresText.split(',').map(f => f.trim()).filter(Boolean)
    });
    alert('Vehicle asset records recalibrated successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono text-xs select-none">
      <form onSubmit={handleSubmit} className="bg-[#0B0B0C] border border-white/10 w-full max-w-lg rounded-none overflow-hidden shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 space-y-4">
        
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <h3 className="font-serif text-sm font-semibold italic text-[#F5F5F0] tracking-wider uppercase">
            Reconfigure Specs • {vehicle.make} {vehicle.model}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="edit-price" className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em] block">Showroom Valuer Price (KSH)</label>
            <input
              id="edit-price"
              name="edit-price"
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2.5 focus:ring-0 border-t-0 border-r-0 border-l-0 rounded-none h-11 h-12 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="edit-color" className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em] block">Exterior Paint Code</label>
              <input
                id="edit-color"
                name="edit-color"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Matte GT Silver"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2.5 focus:ring-0 border-t-0 border-r-0 border-l-0 rounded-none h-11 h-12 outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="edit-status" className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em] block">Pipeline Inventory Stage</label>
              <select
                id="edit-status"
                name="edit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#0B0B0C] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2.5 focus:ring-0 border-t-0 border-r-0 border-l-0 rounded-none h-11 h-12 outline-none uppercase"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Visual Thumbnails strip for the 4 slots */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em]">Media Gallery Slots</label>
              <span className="text-[8px] font-mono text-[#D4AF37] uppercase">
                Active Slot: {['Banner', 'Interior', 'Engine', 'Chassis'][activeSlotIndex]}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((imgUrl, idx) => {
                const labels = ['Banner', 'Interior', 'Engine', 'Chassis'];
                const isActive = idx === activeSlotIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlotIndex(idx)}
                    className={`h-12 bg-[#0B0B0C] border overflow-hidden relative flex flex-col items-center justify-center transition-all text-center cursor-pointer ${
                      isActive ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {imgUrl ? (
                      <img src={imgUrl} className="w-full h-full object-cover" alt={labels[idx]} referrerPolicy="no-referrer" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#C2C2BB]/30 text-[7px] font-mono uppercase">
                        <span>{labels[idx]}</span>
                        <span className="text-[5px] text-white/10">EMPTY</span>
                      </div>
                    )}
                    {isActive && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#D4AF37]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em] block">
                Slot Preview ({['Banner', 'Interior', 'Engine', 'Chassis'][activeSlotIndex]})
              </label>
              {images[activeSlotIndex] ? (
                <div className="h-16 w-full border border-white/10 overflow-hidden relative">
                  <img src={images[activeSlotIndex]} className="w-full h-full object-cover" alt="Car Preview" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="h-16 w-full border border-white/10 flex items-center justify-center text-[#C2C2BB]/30 font-mono text-[9.5px] uppercase">
                  Empty Slot
                </div>
              )}
            </div>
            <div className="space-y-1 flex flex-col justify-end">
              <label htmlFor="edit-vehicle-file" className="sr-only">Upload Vehicle Image</label>
              <input 
                type="file" 
                id="edit-vehicle-file" 
                name="edit-vehicle-file" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    compressToWebP(file, (compressed) => {
                      setImages(prev => {
                        const next = [...prev];
                        next[activeSlotIndex] = compressed;
                        return next;
                      });
                    });
                  }
                }}
                accept="image/*" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => document.getElementById('edit-vehicle-file')?.click()}
                className="w-full h-10 border border-white/10 hover:border-white/30 hover:bg-white/[0.02] text-white font-mono text-[9px] uppercase tracking-wider rounded-none cursor-pointer flex items-center justify-center"
              >
                Upload Photo
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = prompt(`Please enter a custom web URL for ${['Active Banner', 'Interior Angle', 'Engine Bay', 'Chassis Spec'][activeSlotIndex]}:`);
                  if (url) {
                    setImages(prev => {
                      const next = [...prev];
                      next[activeSlotIndex] = url;
                      return next;
                    });
                  }
                }}
                className="mt-1 w-full text-right text-[8.5px] font-mono uppercase tracking-widest text-[#C2C2BB]/40 hover:text-white underline border-none bg-transparent cursor-pointer"
              >
                Or paste web URL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="edit-engine" className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em] block">Engine Spec</label>
              <input
                id="edit-engine"
                name="edit-engine"
                type="text"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2.5 focus:ring-0 border-t-0 border-r-0 border-l-0 rounded-none h-11 h-12 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="edit-transmission" className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em] block">Gearbox Type</label>
              <input
                id="edit-transmission"
                name="edit-transmission"
                type="text"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2.5 focus:ring-0 border-t-0 border-r-0 border-l-0 rounded-none h-11 h-12 outline-none text-[#F5F5F0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="edit-mileage" className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em] block">Mileage (KM)</label>
              <input
                id="edit-mileage"
                name="edit-mileage"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2.5 focus:ring-0 border-t-0 border-r-0 border-l-0 rounded-none h-11 h-12 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="edit-features" className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em] block">Bespoke Features (Comma-Separated)</label>
              <input
                id="edit-features"
                name="edit-features"
                type="text"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="e.g. Burmester Audio, Matrix Adaptive LED"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2.5 focus:ring-0 border-t-0 border-r-0 border-l-0 rounded-none h-11 h-12 outline-none text-[#F5F5F0]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-description" className="text-[#C2C2BB]/50 uppercase text-[9px] tracking-[0.15em] block">Overview Description Memoir</label>
            <textarea
              id="edit-description"
              name="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-white/[0.01] border p-3 border-white/10 text-[#F5F5F0] focus:ring-0 focus:border-white/30 rounded-none transition-colors resize-none outline-none h-20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-white/15 text-[#C2C2BB]/70 hover:text-[#F5F5F0] rounded-none font-mono text-[10px] uppercase tracking-wider"
          >
            Discard Modifications
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-white text-black hover:bg-[#F5F5F0] font-mono text-[10px] font-semibold uppercase tracking-wider rounded-none"
          >
            Save specifications
          </button>
        </div>
      </form>
    </div>
  );
}
