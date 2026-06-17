import React, { useState, useEffect } from 'react';
import { Sparkles, CloudUpload, ImageIcon, Send, ShieldAlert, CheckCircle, RotateCcw } from 'lucide-react';
import { Vehicle } from '../types';

interface AddVehicleViewProps {
  onPublish: (vehicle: Omit<Vehicle, 'id' | 'inquiriesCount'>) => void;
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'add-vehicle' | 'leads' | 'settings') => void;
}

export default function AddVehicleView({ onPublish, setActiveTab }: AddVehicleViewProps) {
  // Form values
  const [vin, setVin] = useState('');
  const [price, setPrice] = useState('');
  const [make, setMake] = useState('Mercedes-Benz');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2024');
  const [transmission, setTransmission] = useState('Automatic');
  const [fuelType, setFuelType] = useState('Petrol');
  const [engine, setEngine] = useState('');
  const [color, setColor] = useState('');
  const [images, setImages] = useState<string[]>(['', '', '', '']);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [mileage, setMileage] = useState('');
  const [featuresText, setFeaturesText] = useState('');

  // UI state
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-generate slug from Make & Model
  useEffect(() => {
    if (make || model) {
      const generated = `${year}-${make}-${model}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  }, [make, model, year]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!vin || vin.length < 5) {
      setErrorMessage('Please provide a valid Vehicle Identification Number (VIN).');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setErrorMessage('Please provide a realistic price (KSH).');
      return;
    }
    if (!model) {
      setErrorMessage('Please enter the model name.');
      return;
    }

    // Default premium luxury background images base on maker if empty
    let finalImages = [...images];
    let imageUrl = finalImages[0];
    if (!imageUrl) {
      const imagesByMake: Record<string, string> = {
        'Mercedes-Benz': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop',
        'BMW': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop',
        'Audi': 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=800&auto=format&fit=crop',
        'Porsche': 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop',
        'Land Rover': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
        'Ferrari': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop'
      };
      imageUrl = imagesByMake[make] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop';
      finalImages[0] = imageUrl;
    }

    setIsPublishing(true);

    // Simulate luxury server-publishing transitions
    setTimeout(() => {
      setIsPublishing(false);
      setIsSuccess(true);

      // Trigger actual state callback
      onPublish({
        vin: vin.toUpperCase(),
        make,
        model,
        year: parseInt(year) || 2024,
        price: parseFloat(price),
        image: imageUrl,
        images: finalImages,
        color: color || 'Carbon Gray',
        transmission,
        fuelType,
        engine: engine || '3.0L Inline-6 Turbo',
        status: 'Available',
        slug: slug || 'custom-listing',
        description: description || `Premium executive standard specimen ${make} ${model} finished in pristine elegance.`,
        mileage: parseInt(mileage) || 0,
        features: featuresText.split(',').map(f => f.trim()).filter(Boolean)
      });

      setTimeout(() => {
        setIsSuccess(false);
        setActiveTab('inventory');
      }, 1500);

    }, 1800);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      compressToWebP(file, (compressed) => {
        setImages(prev => {
          const next = [...prev];
          next[activeSlotIndex] = compressed;
          return next;
        });
      });
    } else {
      alert('Please drop a valid image file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleRandomizeDemo = () => {
    // Fill mock data
    const randomVins = ['WDD2221764B555432', 'WP0ZZZ99ZLS111222', 'WBA81EM080G777888', 'SALLHREF2LA999000'];
    const randomEngines = ['V8 BITURBO 585hp', '3.8L Twin-Turbo Flat-6', '3.0L Inline-6 Supercharged', 'Electric Dual Motor'];
    const randomColors = ['Obsidian Metallic Black', 'GT Silver Metallic', 'Portofino Matte Blue', 'Sakhir Orange'];
    const randomModelsByMake: Record<string, string[]> = {
      'Mercedes-Benz': ['SL63 Roadster', 'G63 AMG Stronger Than Time', 'EQS 580 SUV'],
      'BMW': ['M5 CS', 'M8 Competition Coupe', 'i7 xDrive60'],
      'Audi': ['RS e-tron GT', 'R8 V10 Performance', 'RS6 Avant'],
      'Porsche': ['Taycan Turbo S', 'Cayenne Turbo GT', '911 GT3 RS'],
      'Land Rover': ['Defender 110 V8', 'Range Rover Sport SV'],
      'Ferrari': ['SF90 Stradale', 'Purosangue SUV', '812 Superfast']
    };

    const currentMake = make;
    const modelList = randomModelsByMake[currentMake] || ['Concept Edition'];
    const randomModel = modelList[Math.floor(Math.random() * modelList.length)];

    setVin(randomVins[Math.floor(Math.random() * randomVins.length)]);
    setPrice((Math.floor(Math.random() * 25 + 15) * 1000000).toString());
    setModel(randomModel);
    setEngine(randomEngines[Math.floor(Math.random() * randomEngines.length)]);
    setColor(randomColors[Math.floor(Math.random() * randomColors.length)]);
    setDescription(`A breathtaking high-performance luxury masterpiece combining supreme engineering precision with absolute visual elegance. Maintained in impeccable showroom environment.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200 select-none pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl italic font-semibold text-[#F5F5F0] mb-2">Initialize New Listing</h2>
          <p className="text-[#C2C2BB]/80 text-xs">
            Enter technical data and marketing assets for the premium inventory collection.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRandomizeDemo}
          className="px-4 py-2.5 bg-transparent text-[#F5F5F0] border border-white/20 hover:bg-white hover:text-black hover:border-transparent active:scale-97 transition-all flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] rounded-none cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Autofill Spec Template
        </button>
      </header>

      {errorMessage && (
        <div className="p-4 bg-white/[0.02] border border-white/20 text-[#F5F5F0] text-xs font-sans rounded-none flex items-center gap-3 animate-pulse">
          <ShieldAlert className="w-4 h-4 text-white shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 font-mono text-xs">
        
        {/* Section 1: Core Details */}
        <section className="p-6 md:p-8 bg-[#0B0B0C] border border-white/10 rounded-none space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <span className="text-white/40 font-mono text-sm">01.</span>
            <h3 className="font-serif text-sm font-semibold italic text-[#F5F5F0] tracking-wider uppercase">Core Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Vehicle ID Number (VIN)</label>
              <input
                type="text"
                required
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="17-Digit Alpha-numeric"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none h-12 outline-none uppercase placeholder:text-white/20"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Price (KSH)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none h-12 outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Make</label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full bg-[#0B0B0C] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none h-12 outline-none uppercase"
              >
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="BMW">BMW</option>
                <option value="Audi">Audi</option>
                <option value="Porsche">Porsche</option>
                <option value="Land Rover">Land Rover</option>
                <option value="Ferrari">Ferrari</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Model</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. G-Wagon G63"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none h-12 outline-none placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Year</label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none h-12 outline-none placeholder:text-white/20"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Technical Specs */}
        <section className="p-6 md:p-8 bg-[#0B0B0C] border border-white/10 rounded-none space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <span className="text-white/40 font-mono text-sm">02.</span>
            <h3 className="font-serif text-sm font-semibold italic text-[#F5F5F0] tracking-wider uppercase">Technical Specs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full bg-[#0B0B0C] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none outline-none uppercase"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="PDK">PDK</option>
                <option value="Tiptronic">Tiptronic</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full bg-[#0B0B0C] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none outline-none uppercase"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Engine Description</label>
              <input
                type="text"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                placeholder="e.g. 4.0L V8"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none h-12 outline-none placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Exterior Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Obsidian Black"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none h-12 outline-none placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Mileage (KM)</label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none h-12 outline-none placeholder:text-white/20"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Media Upload */}
        <section className="p-6 md:p-8 bg-[#0B0B0C] border border-white/10 rounded-none space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-white/40 font-mono text-sm">03.</span>
              <h3 className="font-serif text-sm font-semibold italic text-[#F5F5F0] tracking-wider uppercase">Media Gallery</h3>
            </div>
            <div className="bg-white/5 border border-white/10 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-[#D4AF37]">
              Uploading to: {['Active Banner', 'Interior Angle', 'Engine Bay', 'Chassis Spec'][activeSlotIndex]}
            </div>
          </div>

          <div className="relative">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-44 border border-dashed border-white/10 hover:border-white/30 hover:bg-white/[0.02] rounded-none flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <CloudUpload className="w-10 h-10 text-[#C2C2BB]/40 group-hover:text-[#F5F5F0] transition-colors" />
              <div className="text-center flex flex-col items-center">
                <p className="font-serif font-semibold italic text-[#F5F5F0] tracking-wider text-[11px]">
                  Upload Image for {['Active Banner', 'Interior Angle', 'Engine Bay', 'Chassis Spec'][activeSlotIndex]}
                </p>
                <p className="text-[#C2C2BB]/40 text-[9px] uppercase tracking-[0.15em] mt-1">Drag assets or click to select a local file</p>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = prompt(`Please enter a custom web URL for ${['Active Banner', 'Interior Angle', 'Engine Bay', 'Chassis Spec'][activeSlotIndex]}:`);
                    if (url) {
                      setImages(prev => {
                        const next = [...prev];
                        next[activeSlotIndex] = url;
                        return next;
                      });
                    }
                  }}
                  className="mt-3 text-[8.5px] font-mono uppercase tracking-widest text-[#C2C2BB]/40 hover:text-[#F5F5F0] underline border-none bg-transparent cursor-pointer z-20"
                >
                  Or paste a web Image URL
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">
              Image URL Link for {['Active Banner', 'Interior Angle', 'Engine Bay', 'Chassis Spec'][activeSlotIndex]} (Optional Override)
            </label>
            <input
              type="url"
              value={images[activeSlotIndex]}
              onChange={(e) => {
                const val = e.target.value;
                setImages(prev => {
                  const next = [...prev];
                  next[activeSlotIndex] = val;
                  return next;
                });
              }}
              placeholder="https://images.unsplash.com/your-luxury-car-photo-link"
              className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none h-12 outline-none placeholder:text-white/20"
            />
          </div>

          {/* Visual Thumbnails strip */}
          <div className="grid grid-cols-4 gap-4 pt-2">
            {images.map((imgUrl, idx) => {
              const labels = ['Banner', 'Interior', 'Engine', 'Chassis'];
              const isActive = idx === activeSlotIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlotIndex(idx)}
                  className={`h-20 bg-[#0B0B0C] rounded-none border overflow-hidden relative flex flex-col items-center justify-center transition-all text-center cursor-pointer ${
                    isActive ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30' : 'border-white/10 hover:border-white/35'
                  }`}
                >
                  {imgUrl ? (
                    <>
                      <img src={imgUrl} className="w-full h-full object-cover" alt={labels[idx]} referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-1 opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-[7.5px] font-bold text-white tracking-[0.1em] uppercase font-mono">{labels[idx]}</span>
                        <span className="text-[6.5px] text-[#D4AF37] font-mono uppercase mt-1">Change</span>
                      </div>
                      <div className="absolute top-1 left-1 bg-black/80 px-1 py-0.5 text-[6px] font-mono text-white/90 border border-white/10 uppercase font-bold tracking-wider">
                        {labels[idx]}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#C2C2BB]/40 gap-1.5 p-1">
                      <ImageIcon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                      <span className="text-[7.5px] uppercase tracking-[0.05em] font-mono font-semibold">{labels[idx]}</span>
                      <span className="text-[6px] text-white/20 font-mono font-bold">EMPTY</span>
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#D4AF37]" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 4: Marketing / SEO */}
        <section className="p-6 md:p-8 bg-[#0B0B0C] border border-white/10 rounded-none space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <span className="text-white/40 font-mono text-sm">04.</span>
            <h3 className="font-serif text-sm font-semibold italic text-[#F5F5F0] tracking-wider uppercase">Marketing / SEO</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">URL Slug</label>
              <div className="flex items-center bg-white/[0.01] border-b border-white/10 focus-within:border-white/30 transition-colors">
                <span className="px-3 text-[#C2C2BB]/40 text-[10px] select-none font-mono tracking-wider lowercase">mansawhips.com/inventory/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="2024-mercedes-g63-amg"
                  className="flex-grow bg-transparent border-none text-[#F5F5F0] p-3 font-mono focus:ring-0 focus:outline-none h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Marketing Overview Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Craft a compelling executive description narrative for this ultimate luxury asset..."
                rows={4}
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-4 font-serif text-[12.5px] transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 resize-none rounded-none outline-none h-24"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-[#C2C2BB]/50 uppercase tracking-[0.15em] text-[9px]">Bespoke Features (Comma-Separated)</label>
              <input
                type="text"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="e.g. Burmester Audio, Matrix Adaptive LED, Custom Exhaust, Massage Seats"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-3 font-mono transition-colors border-l-0 border-r-0 border-t-0 focus:ring-0 rounded-none h-12 outline-none placeholder:text-white/20"
              />
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPublishing || isSuccess}
            className={`px-8 py-4 font-mono font-[500] rounded-none overflow-hidden transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] outline-none ${
              isSuccess
                ? 'bg-emerald-800 text-white'
                : isPublishing
                ? 'bg-white/15 text-[#C2C2BB] border border-white/10'
                : 'bg-[#F5F5F0] text-black hover:bg-white active:scale-97 cursor-pointer'
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-white" />
                Published Successfully!
              </>
            ) : isPublishing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing specs...
              </>
            ) : (
              <>
                Publish Listing
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
