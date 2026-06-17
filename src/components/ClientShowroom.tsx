import React, { useState, useEffect } from 'react';
import { 
  Search, Car, MapPin, Clock, Phone, Mail, Award, CheckCircle2, Shield, 
  ArrowRight, PhoneCall, Calendar, Bookmark, RefreshCw, X, ChevronRight, 
  SlidersHorizontal, Sparkles, AlertCircle, PlayCircle, Star, MessageSquare 
} from 'lucide-react';
import { Vehicle, Inquiry } from '../types';

interface ClientShowroomProps {
  vehicles: Vehicle[];
  currency: 'KSH' | 'USD' | 'EUR';
  getCurrencySymbol: () => string;
  onInquire: (clientName: string, vehicleName: string, email: string, phone: string, notes: string) => void;
  onSwitchToAdmin: () => void;
}

export default function ClientShowroom({
  vehicles,
  currency,
  getCurrencySymbol,
  onInquire,
  onSwitchToAdmin
}: ClientShowroomProps) {
  const [activeClientTab, setActiveClientTab] = useState<'home' | 'inventory' | 'about' | 'contact'>('home');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('All');
  const [selectedFuel, setSelectedFuel] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(60000000);
  const [selectedYear, setSelectedYear] = useState<string>('All');

  // Sorting state
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'year-desc'>('year-desc');

  // Home quick search states
  const [hpMake, setHpMake] = useState('All');
  const [hpPrice, setHpPrice] = useState('All');

  // SRP Pagination state (default 6 items per page)
  const [visibleCount, setVisibleCount] = useState(6);

  // VDP states
  const [activeVdpTab, setActiveVdpTab] = useState<'overview' | 'technical' | 'features'>('overview');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Modal forms
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadDate, setLeadDate] = useState('');
  const [leadTime, setLeadTime] = useState('');

  // Contact page form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('v');
    if (slug) {
      const v = vehicles.find(veh => veh.slug === slug);
      return v ? v.id : null;
    }
    return null;
  });

  // Sync selectedVehicleId state changes to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentV = params.get('v');
    const v = vehicles.find(veh => veh.id === selectedVehicleId);
    if (v) {
      if (currentV !== v.slug) {
        params.set('v', v.slug);
        window.history.pushState({ vehicleId: v.id }, '', `${window.location.pathname}?${params.toString()}`);
      }
    } else {
      if (currentV) {
        params.delete('v');
        const search = params.toString();
        window.history.pushState({ vehicleId: null }, '', `${window.location.pathname}${search ? `?${search}` : ''}`);
      }
    }
  }, [selectedVehicleId, vehicles]);

  // Synchronize browser back/forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('v');
      if (slug) {
        const v = vehicles.find(veh => veh.slug === slug);
        setSelectedVehicleId(v ? v.id : null);
      } else {
        setSelectedVehicleId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [vehicles]);

  // Dynamically inject schema.org JSON-LD structured data in document head for web crawlers
  useEffect(() => {
    let script = document.getElementById('mansa-jsonld-seo') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'mansa-jsonld-seo';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
    if (selectedVehicleId && selectedVehicle) {
      const carData = {
        "@context": "https://schema.org",
        "@type": "Car",
        "name": `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
        "brand": {
          "@type": "Brand",
          "name": selectedVehicle.make
        },
        "model": selectedVehicle.model,
        "productionDate": selectedVehicle.year,
        "vehicleIdentificationNumber": selectedVehicle.vin,
        "color": selectedVehicle.color,
        "vehicleTransmission": selectedVehicle.transmission,
        "fuelType": selectedVehicle.fuelType,
        "vehicleEngine": {
          "@type": "EngineSpecification",
          "name": selectedVehicle.engine
        },
        "mileageFromOdometer": {
          "@type": "QuantitativeValue",
          "value": selectedVehicle.mileage || 10000,
          "unitCode": "KMT"
        },
        "image": selectedVehicle.image,
        "description": selectedVehicle.description,
        "offers": {
          "@type": "Offer",
          "price": selectedVehicle.price,
          "priceCurrency": currency,
          "availability": selectedVehicle.status === 'Available'
            ? "https://schema.org/InStock"
            : (selectedVehicle.status === 'Reserved' ? "https://schema.org/PreOrder" : "https://schema.org/OutOfStock")
        }
      };
      script.textContent = JSON.stringify(carData, null, 2);
    } else {
      const activeCars = vehicles.filter(v => v.status !== 'Sold');
      const listData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": activeCars.slice(0, 30).map((car, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Car",
            "name": `${car.year} ${car.make} ${car.model}`,
            "brand": {
              "@type": "Brand",
              "name": car.make
            },
            "model": car.model,
            "offers": {
              "@type": "Offer",
              "price": car.price,
              "priceCurrency": currency
            }
          }
        }))
      };
      script.textContent = JSON.stringify(listData, null, 2);
    }

    return () => {
      const scriptToRemove = document.getElementById('mansa-jsonld-seo');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [selectedVehicleId, vehicles, currency]);

  // Auto-scroll on tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeClientTab, selectedVehicleId]);

  // List of unique makers
  const makes = ['All', ...Array.from(new Set(vehicles.map(v => v.make)))];
  const fuels = ['All', ...Array.from(new Set(vehicles.map(v => v.fuelType)))];
  const years = ['All', ...Array.from(new Set(vehicles.map(v => v.year.toString())))].sort((a,b) => b.localeCompare(a));

  // Format KSH Helper
  const formatPrice = (priceInBase: number) => {
    return `${getCurrencySymbol()} ${priceInBase.toLocaleString()}`;
  };

  // Main filtered vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.trim && v.trim.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMake = selectedMake === 'All' || v.make === selectedMake;
    const matchesTransmission = selectedTransmission === 'All' || v.transmission === selectedTransmission;
    const matchesFuel = selectedFuel === 'All' || v.fuelType === selectedFuel;
    const matchesPrice = v.price <= maxPrice;
    const matchesYear = selectedYear === 'All' || v.year.toString() === selectedYear;

    return matchesSearch && matchesMake && matchesTransmission && matchesFuel && matchesPrice && matchesYear;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    // Keep sold cars at the absolute bottom of the catalog list
    if (a.status === 'Sold' && b.status !== 'Sold') return 1;
    if (a.status !== 'Sold' && b.status === 'Sold') return -1;

    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return b.year - a.year; // year-desc
  });

  // Featured Vehicles (4 cars of highest prices)
  const featuredVehicles = [...vehicles]
    .filter(v => v.status === 'Available')
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  // Trigger quick search from Home
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hpMake !== 'All') setSelectedMake(hpMake);
    if (hpPrice !== 'All') setMaxPrice(parseInt(hpPrice));
    setActiveClientTab('inventory');
  };

  // Booking submit helper
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) {
      alert('Please fill out your name and contact phone number.');
      return;
    }

    const targetCarName = selectedVehicle 
      ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
      : 'General Showroom Visit';

    const notes = `Client booked exclusive test-drive viewing for ${targetCarName} on ${leadDate} at ${leadTime}.`;
    onInquire(leadName, targetCarName, leadEmail, leadPhone, notes);

    setShowViewingModal(false);
    setLeadName('');
    setLeadEmail('');
    setLeadPhone('');
    setLeadDate('');
    setLeadTime('');
    
    alert(`Success: Private showroom briefing reserved for you. Our executive concierge will contact you shortly.`);
  };

  // Public General Contact submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) {
      alert('Your name and mobile number are mandatory.');
      return;
    }

    onInquire(
      contactName, 
      'General Consultation', 
      contactEmail, 
      contactPhone, 
      `Inquiry through public website: "${contactMsg}"`
    );

    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMsg('');
    setIsSubmitSuccess(true);
    setTimeout(() => setIsSubmitSuccess(false), 5000);
  };

  // Compile seamless WhatsApp redirect link
  const getWhatsAppLink = (v: Vehicle) => {
    const pageUrl = `${window.location.origin}${window.location.pathname}?v=${v.slug}`;
    if (v.status === 'Sold') {
      const textMessage = `Hello Mansa Whips, I saw that the ${v.year} ${v.make} ${v.model} (VIN: ${v.vin}) has been sold. Link: ${pageUrl}. I am highly interested in sourcing a similar unit. Could you assist me with custom import options?`;
      return `https://wa.me/254719328248?text=${encodeURIComponent(textMessage)}`;
    }
    const textMessage = `Hello Mansa Whips, I'm interested in the ${v.year} ${v.make} ${v.model} (VIN: ${v.vin}) priced at ${formatPrice(v.price)}. Link: ${pageUrl}. Is it still available for viewing?`;
    return `https://wa.me/254719328248?text=${encodeURIComponent(textMessage)}`;
  };

  // Extract 4 specific gallery images per vehicle
  const getVehicleImages = (v: Vehicle) => {
    const main = v.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop';
    const fallbackInterior = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop';
    const fallbackEngine = 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800&auto=format&fit=crop';
    const fallbackChassis = 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop';

    if (v.images && v.images.length === 4) {
      return [
        v.images[0] || main,
        v.images[1] || fallbackInterior,
        v.images[2] || fallbackEngine,
        v.images[3] || fallbackChassis
      ];
    }
    return [
      main,
      fallbackInterior,
      fallbackEngine,
      fallbackChassis
    ];
  };

  const currentImagesList = selectedVehicle ? getVehicleImages(selectedVehicle) : [];

  return (
    <div id="client-showroom-viewport" className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans selection:bg-white selection:text-black">
      
      {/* 1. Global Navigation Frame Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 h-20 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-10">
          <button 
            onClick={() => { setActiveClientTab('home'); setSelectedVehicleId(null); }}
            className="flex flex-col text-left cursor-pointer outline-none"
          >
            <span className="font-serif text-xl md:text-2xl font-bold tracking-[0.25em] text-[#F5F5F0] block">
              MANSA WHIPS
            </span>
            <span className="text-[7.5px] font-mono tracking-[0.4em] uppercase text-white/40 mt-0.5">
              Premium Automotive Showroom
            </span>
          </button>

          {/* Large screens links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-mono uppercase tracking-[0.2em] text-[#C2C2BB]/75">
            <button 
              onClick={() => { setActiveClientTab('home'); setSelectedVehicleId(null); }}
              className={`hover:text-white transition-colors cursor-pointer ${activeClientTab === 'home' && !selectedVehicleId ? 'text-white font-semibold' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setActiveClientTab('inventory'); setSelectedVehicleId(null); }}
              className={`hover:text-white transition-colors cursor-pointer ${activeClientTab === 'inventory' && !selectedVehicleId ? 'text-white font-semibold' : ''}`}
            >
              Inventory
            </button>
            <button 
              onClick={() => { setActiveClientTab('about'); setSelectedVehicleId(null); }}
              className={`hover:text-white transition-colors cursor-pointer ${activeClientTab === 'about' ? 'text-white font-semibold' : ''}`}
            >
              About
            </button>
            <button 
              onClick={() => { setActiveClientTab('contact'); setSelectedVehicleId(null); }}
              className={`hover:text-white transition-colors cursor-pointer ${activeClientTab === 'contact' ? 'text-white font-semibold' : ''}`}
            >
              Contact
            </button>
          </nav>
        </div>

        {/* Header Right Action */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSwitchToAdmin}
            className="px-4 py-2 bg-white text-black font-mono text-[10px] uppercase font-semibold tracking-[0.2em] hover:bg-[#F5F5F0] transition-colors border-none cursor-pointer outline-none active:scale-95 duration-150"
          >
            Staff Login
          </button>
        </div>
      </header>

      {/* 2. Main Page Render Route */}
      <main className="pb-16 select-none animate-in fade-in duration-300">
        
        {/* VIEW DETAILED POINTER: If selected vehicle exists, render VDP first */}
        {selectedVehicleId && selectedVehicle ? (
          <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 mt-4 space-y-12">
            
            {/* VDP Top Breadcrumbs bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#C2C2BB]/50 uppercase tracking-widest pb-4 border-b border-white/5">
              <button onClick={() => { setSelectedVehicleId(null); setActiveClientTab('home'); }} className="hover:text-white cursor-pointer">Home</button>
              <ChevronRight className="w-3 h-3 text-white/20" />
              <button onClick={() => { setSelectedVehicleId(null); setActiveClientTab('inventory'); }} className="hover:text-white cursor-pointer">Inventory</button>
              <ChevronRight className="w-3 h-3 text-white/20" />
              <span className="text-white/30">{selectedVehicle.make}</span>
              <ChevronRight className="w-3 h-3 text-white/30" />
              <span className="text-white font-medium">{selectedVehicle.year} {selectedVehicle.model}</span>
            </div>

            {selectedVehicle.status === 'Sold' && (
              <div className="bg-[#b21c24]/10 border border-[#b21c24]/20 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                <div className="space-y-1">
                  <h4 className="font-serif italic font-semibold text-white text-base flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#b21c24]" />
                    Sold Specimen
                  </h4>
                  <p className="font-mono text-[9px] text-[#C2C2BB]/85 uppercase tracking-wider leading-relaxed">
                    This premium asset has been sold and delivered to its new custodian. You can inquire about custom importing a similar unit or explore other available vehicles below.
                  </p>
                </div>
                <a 
                  href={getWhatsAppLink(selectedVehicle)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-[#b21c24] text-white hover:bg-[#8f161c] transition-colors font-mono text-[9.5px] font-semibold uppercase tracking-wider text-center shrink-0 border-none cursor-pointer"
                >
                  Inquire Sourcing Options
                </a>
              </div>
            )}

            {/* VDP Core Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Media gallery Left column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="h-96 md:h-[480px] bg-black border border-white/10 relative overflow-hidden">
                  <img 
                    src={currentImagesList[activeMediaIndex]} 
                    alt={selectedVehicle.model} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {selectedVehicle.status === 'Sold' && (
                    <div className="absolute inset-0 bg-[#050505]/65 backdrop-blur-[1.5px] flex items-center justify-center pointer-events-none z-10">
                      <div className="border border-[#b21c24]/30 bg-[#050505]/90 px-8 py-4 text-center transform -rotate-6 animate-in zoom-in-95 duration-300 shadow-2xl">
                        <span className="font-serif italic font-bold tracking-[0.3em] uppercase text-[#b21c24] text-2xl sm:text-3xl block">
                          SOLD OUTLET
                        </span>
                        <span className="text-[8px] font-mono tracking-[0.35em] uppercase text-white/50 block mt-1.5">
                          Acquired by Custodian
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/75 px-3 py-1 text-[8.5px] font-mono tracking-[0.2em] uppercase text-white/80 border border-white/10">
                    Showroom Specimen
                  </div>
                </div>

                {/* Multiple custom high-tier showcase thumbnail gallery */}
                <div className="grid grid-cols-4 gap-3">
                  {currentImagesList.map((imgUrl, idx) => {
                    const labels = ['Banner', 'Interior', 'Engine', 'Chassis'];
                    const isActive = activeMediaIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`h-20 bg-[#0B0B0C] border overflow-hidden transition-all relative ${
                          isActive ? 'border-[#D4AF37]' : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} className="w-full h-full object-cover" alt={`${labels[idx]} Thumbnail`} referrerPolicy="no-referrer" />
                        <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 text-[6.5px] font-mono text-white/80 border border-white/5 uppercase tracking-widest font-bold">
                          {labels[idx]}
                        </div>
                        {isActive && (
                          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#D4AF37]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sales Panel Right column */}
              <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-none inline-block">
                      {selectedVehicle.transmission} • {selectedVehicle.fuelType}
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl italic font-semibold text-[#F5F5F0]">
                      {selectedVehicle.year} {selectedVehicle.make} <span className="block mt-1 font-normal select-text">{selectedVehicle.model} {selectedVehicle.trim || ''}</span>
                    </h2>
                  </div>

                  <div className="p-5 bg-white/[0.01] border border-white/5 space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C2C2BB]/40">Asking Showroom Valuation</span>
                    <p className="text-3xl font-mono font-medium tracking-tight text-white select-all">
                      {formatPrice(selectedVehicle.price)}
                    </p>
                    <p className="text-[9.5px] font-mono text-white/30 uppercase tracking-widest pt-2">
                      Custom duties fully paid • Local registration complete
                    </p>
                  </div>

                  {/* Trust Signals bullet brief */}
                  <div className="grid grid-cols-2 gap-3 text-left font-mono text-[10px] text-[#C2C2BB]/70">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white/30" />
                      <span>Certified 150pt diagnostics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white/30" />
                      <span>Elite bespoke financing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white/30" />
                      <span>3-Year Mansa Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white/30" />
                      <span>Import duty certified</span>
                    </div>
                  </div>
                </div>

                {/* Call To Actions Block */}
                <div className="space-y-3 pt-6 border-t border-white/5">
                  {selectedVehicle.status === 'Sold' ? (
                    <>
                      <a 
                        href={getWhatsAppLink(selectedVehicle)}
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full bg-[#1BD741] text-black font-semibold font-mono py-4 text-[10px] uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2 transition-all hover:bg-[#12b934] active:scale-97 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 fill-black text-black" />
                        Inquire Sourcing via WhatsApp
                      </a>

                      <button 
                        onClick={() => {
                          alert('Custom Import Sourcing: Our executive concierge team can source similar luxury German vehicles directly from global collections. Please inquire via WhatsApp to discuss your specific desires.');
                        }}
                        className="w-full bg-transparent text-white border border-white/20 font-semibold font-mono py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-colors active:scale-97 outline-none cursor-pointer"
                      >
                        Custom Import Options
                      </button>
                    </>
                  ) : (
                    <>
                      <a 
                        href={getWhatsAppLink(selectedVehicle)}
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full bg-[#1BD741] text-black font-semibold font-mono py-4 text-[10px] uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2 transition-all hover:bg-[#12b934] active:scale-97 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 fill-black text-black" />
                        Inquire via WhatsApp
                      </a>

                      <button 
                        onClick={() => setShowViewingModal(true)}
                        className="w-full bg-white text-black font-semibold font-mono py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#F5F5F0] transition-colors active:scale-97 outline-none border-none cursor-pointer"
                      >
                        Schedule Private Viewing
                      </button>
                    </>
                  )}

                  <p className="text-center font-mono text-[9px] text-[#C2C2BB]/50 uppercase tracking-[0.15em] pt-1">
                    Showroom open: Ngong Road. Mon - Sat 8 AM - 6 PM
                  </p>
                </div>
              </div>
            </div>

            {/* VDP Bottom Tabbed Specifications section */}
            <div className="border-t border-white/5 pt-10">
              <div className="flex border-b border-white/10 mb-6 text-[10px] uppercase tracking-[0.2em] font-mono">
                <button 
                  onClick={() => setActiveVdpTab('overview')}
                  className={`pb-4 px-6 relative cursor-pointer ${activeVdpTab === 'overview' ? 'text-white' : 'text-[#C2C2BB]/50'}`}
                >
                  Overview
                  {activeVdpTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></span>}
                </button>
                <button 
                  onClick={() => setActiveVdpTab('technical')}
                  className={`pb-4 px-6 relative cursor-pointer ${activeVdpTab === 'technical' ? 'text-white' : 'text-[#C2C2BB]/50'}`}
                >
                  Technical Specifications
                  {activeVdpTab === 'technical' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></span>}
                </button>
                <button 
                  onClick={() => setActiveVdpTab('features')}
                  className={`pb-4 px-6 relative cursor-pointer ${activeVdpTab === 'features' ? 'text-white' : 'text-[#C2C2BB]/50'}`}
                >
                  Bespoke Features
                  {activeVdpTab === 'features' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></span>}
                </button>
              </div>

              {/* Specifications tabs output */}
              <div className="animate-in fade-in duration-200">
                {activeVdpTab === 'overview' && (
                  <div className="space-y-4 max-w-4xl font-serif text-[13.5px] italic text-[#C2C2BB] leading-relaxed select-text">
                    <p>
                      "{selectedVehicle.description}"
                    </p>
                    <p className="font-mono text-xs text-white/40 not-italic uppercase tracking-widest pt-2">
                       Chassis Identification: {selectedVehicle.vin} • Import status: Hand-inspected Stuttgart, Germany collection. Fully prepared for Kenya fuel coefficients.
                    </p>
                  </div>
                )}

                {activeVdpTab === 'technical' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-[11px] uppercase tracking-wider">
                    <div className="p-4 bg-white/[0.01] border border-white/5 flex justify-between">
                      <span className="text-[#C2C2BB]/40">ENGINE</span>
                      <span className="text-white font-medium">{selectedVehicle.engine}</span>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/5 flex justify-between">
                      <span className="text-[#C2C2BB]/40">TRANSMISSION</span>
                      <span className="text-white font-medium">{selectedVehicle.transmission}</span>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/5 flex justify-between">
                      <span className="text-[#C2C2BB]/40">FUEL TYPE</span>
                      <span className="text-white font-medium">{selectedVehicle.fuelType}</span>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/5 flex justify-between">
                      <span className="text-[#C2C2BB]/40">COGNIZANT MILEAGE</span>
                      <span className="text-white font-medium">{(selectedVehicle.mileage || 12000).toLocaleString()} KM</span>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/5 flex justify-between">
                      <span className="text-[#C2C2BB]/40">COLORSPEC</span>
                      <span className="text-white font-medium">{selectedVehicle.color}</span>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/5 flex justify-between">
                      <span className="text-[#C2C2BB]/40">YEAR</span>
                      <span className="text-white font-medium">{selectedVehicle.year}</span>
                    </div>
                  </div>
                )}

                {activeVdpTab === 'features' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[10.5px] uppercase text-[#C2C2BB]/80">
                    {(selectedVehicle.features && selectedVehicle.features.length > 0
                      ? selectedVehicle.features
                      : [
                          'Burmester / Harman Audio',
                          'Matrix Adaptive LED',
                          'Panoramic Soft-roof',
                          'Surround View 3D Cameras',
                          'Executive Seat Heaters',
                          'Adaptive Air Suspension',
                          'Custom Cabin Air Diffuser',
                          'Active Lane Keep Pilot'
                        ]
                    ).map((feature, index) => (
                      <div key={index} className="p-3 bg-white/[0.01] border border-white/5 flex items-center gap-2 animate-in fade-in duration-200">
                        <CheckCircle2 className="w-3 h-3 text-white/30" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Elite Alternatives / Recommendations section */}
            <div className="border-t border-white/5 pt-12 text-left space-y-6">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C2C2BB]/40 block mb-1">Elite Alternatives</span>
                <h3 className="font-serif italic font-semibold text-white text-xl">
                  {selectedVehicle.status === 'Sold' 
                    ? `This exact model is gone, but here are 3 similar ${selectedVehicle.make}s currently in stock.`
                    : 'Other Specimen You May Like'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vehicles
                  .filter(v => v.status === 'Available' && v.id !== selectedVehicle.id)
                  .sort((a, b) => {
                    if (a.make === selectedVehicle.make && b.make !== selectedVehicle.make) return -1;
                    if (a.make !== selectedVehicle.make && b.make === selectedVehicle.make) return 1;
                    return b.price - a.price;
                  })
                  .slice(0, 3)
                  .map(car => (
                    <div 
                      key={car.id} 
                      onClick={() => {
                        setSelectedVehicleId(car.id);
                        setActiveMediaIndex(0);
                      }}
                      className="bg-[#0B0B0C] border border-white/10 overflow-hidden cursor-pointer group hover:border-[#F5F5F0]/30 transition-all duration-300 shadow-xl flex flex-col justify-between"
                    >
                      <div className="h-36 relative bg-black overflow-hidden border-b border-white/10">
                        <img 
                          src={car.image} 
                          alt={car.model} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[10%] group-hover:grayscale-0"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-2 left-2 bg-black/80 border border-white/10 text-white/70 font-mono text-[8px] uppercase tracking-wider px-2 py-0.5">
                          {car.year} SPEC
                        </span>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="space-y-0.5 text-left">
                          <span className="text-[8px] font-mono text-[#C2C2BB]/40 uppercase tracking-widest">{car.make}</span>
                          <h4 className="font-serif italic font-semibold text-[#F5F5F0] text-sm group-hover:text-white transition-colors">{car.model}</h4>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5 font-mono">
                          <span className="text-[10.5px] font-light text-white">{formatPrice(car.price)}</span>
                          <span className="text-[8px] uppercase text-[#C2C2BB]/50 flex items-center gap-0.5 group-hover:text-white transition-all">
                            Specs <ChevronRight className="w-2 h-2 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Back action */}
            <div className="flex justify-start pt-4">
              <button 
                onClick={() => { setSelectedVehicleId(null); setActiveClientTab('inventory'); }}
                className="px-5 py-2.5 border border-white/10 text-white hover:bg-white/5 transition-colors font-mono text-[10px] uppercase tracking-widest cursor-pointer"
              >
                ← Back to catalog list
              </button>
            </div>
          </div>
        ) : activeClientTab === 'home' ? (
          
          /* HOMEPAGE VIEW */
          <div className="space-y-20">
            
            {/* HERO SECTION CONTAINER */}
            <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden border-b border-white/5">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2000&auto=format&fit=crop" 
                  alt="Cinematic German Porsche Car" 
                  className="w-full h-full object-cover brightness-[0.35]" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent"></div>
              </div>

              {/* Hero Contents */}
              <div className="relative z-10 text-center space-y-6 max-w-4xl px-4 md:px-0">
                <span className="font-mono text-[10px] font-bold text-white/50 uppercase tracking-[0.4em] block animate-pulse">
                  ESTABLISHED 2021 • NAIROBI, KENYA
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold italic text-[#F5F5F0] tracking-wider leading-tight">
                  Premium German Engineering in Nairobi
                </h1>
                <p className="text-[12.5px] font-mono text-[#C2C2BB]/70 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                  Located along Ngong Road next to UDA Center. Nairobi's premier collection of elite German precision, top-tier Japanese luxury, and performance imports.
                </p>

                <div className="pt-6">
                  <button 
                    onClick={() => setActiveClientTab('inventory')}
                    className="px-8 py-4 bg-white text-black font-semibold font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-[#F5F5F0] active:scale-97 transition-all border-none cursor-pointer"
                  >
                    Explore Showroom Inventory
                  </button>
                </div>
              </div>
            </section>

            {/* QUICK SEARCH BAR SECTION */}
            <section className="max-w-6xl mx-auto px-6 md:px-12 -mt-28 relative z-25">
              <form 
                onSubmit={handleQuickSearchSubmit}
                className="bg-[#0B0B0C] border border-white/10 p-6 md:p-8 rounded-none shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="space-y-1.5 text-left">
                  <label htmlFor="quick-make" className="text-[9px] font-mono uppercase text-[#C2C2BB]/50 tracking-[0.15em]">Select Maker</label>
                  <select 
                    id="quick-make"
                    name="quick-make"
                    value={hpMake}
                    onChange={(e) => setHpMake(e.target.value)}
                    className="w-full bg-white/[0.02] border-b border-white/10 p-2.5 text-[#F5F5F0] font-mono text-xs border-r-0 border-l-0 border-t-0 focus:ring-0 outline-none uppercase"
                  >
                    <option value="All" className="bg-[#050505]">All German Makers</option>
                    <option value="Mercedes-Benz" className="bg-[#050505]">Mercedes-Benz</option>
                    <option value="BMW" className="bg-[#050505]">BMW</option>
                    <option value="Porsche" className="bg-[#050505]">Porsche</option>
                    <option value="Land Rover" className="bg-[#050505]">Land Rover</option>
                    <option value="Ferrari" className="bg-[#050505]">Ferrari</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label htmlFor="quick-price" className="text-[9px] font-mono uppercase text-[#C2C2BB]/50 tracking-[0.15em]">Maximum Price (KSH)</label>
                  <select 
                    id="quick-price"
                    name="quick-price"
                    value={hpPrice}
                    onChange={(e) => setHpPrice(e.target.value)}
                    className="w-full bg-white/[0.02] border-b border-white/10 p-2.5 text-[#F5F5F0] font-mono text-xs border-r-0 border-l-0 border-t-0 focus:ring-0 outline-none uppercase"
                  >
                    <option value="All" className="bg-[#050505]">No Limit</option>
                    <option value="20000000" className="bg-[#050505]">Below 20M KSH</option>
                    <option value="30000000" className="bg-[#050505]">Below 30M KSH</option>
                    <option value="50000000" className="bg-[#050505]">Below 50M KSH</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full h-11 bg-[#F5F5F0] text-black font-semibold font-mono text-[9px] uppercase tracking-[0.2em] hover:bg-white flex items-center justify-center gap-1.5 active:scale-97 transition-colors rounded-none outline-none border-none cursor-pointer"
                  >
                    <Search className="w-3 h-3" />
                    Query Listings
                  </button>
                </div>
              </form>
            </section>

            {/* TRUST SIGNALS VALUE TILES (SEO friendly badges) */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 border border-white/5 bg-[#080809] hover:border-white/10 transition-colors space-y-4">
                  <div className="w-10 h-10 rounded-none bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-white/50" />
                  </div>
                  <h3 className="font-serif italic text-base text-white">Genuine Certification</h3>
                  <p className="font-mono text-[10px] text-[#C2C2BB]/60 tracking-wider uppercase leading-relaxed">
                    Every German asset undergoes a rigorous 150-point diagnostic run by factory-certified diagnostic experts before export.
                  </p>
                </div>

                <div className="p-8 border border-white/5 bg-[#080809] hover:border-white/10 transition-colors space-y-4">
                  <div className="w-10 h-10 rounded-none bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white/50" />
                  </div>
                  <h3 className="font-serif italic text-base text-white">Comprehensive 3-Yr Warranty</h3>
                  <p className="font-mono text-[10px] text-[#C2C2BB]/60 tracking-wider uppercase leading-relaxed">
                    Absolute coverage for your engine, PDK gearbox, and sensitive electronic controllers to give you complete peace of mind.
                  </p>
                </div>

                <div className="p-8 border border-white/5 bg-[#080809] hover:border-white/10 transition-colors space-y-4">
                  <div className="w-10 h-10 rounded-none bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    <PhoneCall className="w-5 h-5 text-white/50" />
                  </div>
                  <h3 className="font-serif italic text-base text-white">Bespoke Financial Leases</h3>
                  <p className="font-mono text-[10px] text-[#C2C2BB]/60 tracking-wider uppercase leading-relaxed">
                    Arranged directly through local elite Kenyan private bank partners, guaranteeing low interest rates and quick vehicle releases.
                  </p>
                </div>
              </div>
            </section>

            {/* FEATURED CARS PANEL CAROUSEL */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-10">
              <div className="flex justify-between items-end">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C2C2BB]/40 block mb-1">Meticulously curated</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold italic text-white">Specimen Spotlight</h2>
                </div>
                <button 
                  onClick={() => { setActiveClientTab('inventory'); setSelectedVehicleId(null); }}
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#C2C2BB]/80 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  All 30+ Vehicles
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Featured Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredVehicles.map((car) => (
                  <div 
                    key={car.id} 
                    onClick={() => { setSelectedVehicleId(car.id); }}
                    className="bg-[#0B0B0C] border border-white/10 overflow-hidden cursor-pointer group hover:border-white/30 transition-all duration-300 shadow-xl flex flex-col justify-between"
                  >
                    <div className="h-44 relative bg-black overflow-hidden border-b border-white/10">
                      <img 
                        src={car.image} 
                        alt={car.model} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-3 left-3 bg-black/80 border border-white/10 text-white/70 font-mono text-[8px] uppercase tracking-wider px-2 py-0.5">
                        {car.year} SPEC
                      </span>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="space-y-1 text-left">
                        <span className="text-[8px] font-mono text-[#C2C2BB]/40 uppercase tracking-widest">{car.make}</span>
                        <h4 className="font-serif italic font-semibold text-[#F5F5F0] text-sm group-hover:text-white transition-colors">{car.model}</h4>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-white/5 font-mono">
                        <span className="text-[11px] font-light text-white">{formatPrice(car.price)}</span>
                        <span className="text-[8.5px] uppercase text-[#C2C2BB]/50 flex items-center gap-1 group-hover:text-white transition-all">
                          Specs <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        ) : activeClientTab === 'inventory' ? (
          
          /* INVENTORY / SEARCH RESULTS PAGE (SRP) */
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 mt-4 space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C2C2BB]/40 block">Showroom floor</span>
              <h2 className="font-serif text-3xl font-semibold italic text-[#F5F5F0]">Mansa Asset Fleet</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Sidebar (Filters) Accordion style */}
              <aside className="lg:col-span-3 space-y-6">
                <div className="p-5 bg-[#0B0B0C] border border-white/10 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white">Filter Parameters</span>
                    <SlidersHorizontal className="w-3.5 h-3.5 text-white/40" />
                  </div>

                  {/* Filter Search */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="showroom-search" className="text-[8.5px] font-mono uppercase tracking-[0.15em] text-[#C2C2BB]/50">Search Name</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#C2C2BB]/40" />
                      <input 
                        id="showroom-search"
                        name="showroom-search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search model, trim..."
                        className="w-full bg-white/[0.01] border border-white/10 p-2 pl-8 font-mono text-[10.5px] text-[#F5F5F0] placeholder:text-white/20 focus:outline-none focus:border-white/30 h-9 rounded-none outline-none"
                      />
                    </div>
                  </div>

                  {/* Make Accordion Filter */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="showroom-make" className="text-[8.5px] font-mono text-[#C2C2BB]/50 uppercase tracking-[0.15em]">German Manufacturer</label>
                    <select 
                      id="showroom-make"
                      name="showroom-make"
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                      className="w-full bg-[#050505] p-2 border border-white/10 text-white font-mono text-[10.5px] outline-none rounded-none focus:border-white/30"
                    >
                      {makes.map(m => (
                        <option key={m} value={m}>{m === 'All' ? 'All Manufacturers' : m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="showroom-year" className="text-[8.5px] font-mono text-[#C2C2BB]/50 uppercase tracking-[0.15em]">Model Year</label>
                    <select 
                      id="showroom-year"
                      name="showroom-year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full bg-[#050505] p-2 border border-white/10 text-white font-mono text-[10.5px] outline-none rounded-none focus:border-white/30"
                    >
                      <option value="All">All Years</option>
                      {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fuel Filter */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="showroom-fuel" className="text-[8.5px] font-mono text-[#C2C2BB]/50 uppercase tracking-[0.15em]">Fuel Feed</label>
                    <select 
                      id="showroom-fuel"
                      name="showroom-fuel"
                      value={selectedFuel}
                      onChange={(e) => setSelectedFuel(e.target.value)}
                      className="w-full bg-[#050505] p-2 border border-white/10 text-white font-mono text-[10.5px] outline-none rounded-none focus:border-white/30"
                    >
                      {fuels.map(f => (
                        <option key={f} value={f}>{f === 'All' ? 'All Fuel Types' : f}</option>
                      ))}
                    </select>
                  </div>

                  {/* Gearbox filter */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="showroom-transmission" className="text-[8.5px] font-mono text-[#C2C2BB]/50 uppercase tracking-[0.15em]">Transmission Gearbox</label>
                    <select 
                      id="showroom-transmission"
                      name="showroom-transmission"
                      value={selectedTransmission}
                      onChange={(e) => setSelectedTransmission(e.target.value)}
                      className="w-full bg-[#050505] p-2 border border-white/10 text-white font-mono text-[10.5px] outline-none rounded-none focus:border-white/30"
                    >
                      <option value="All">All Transmissions</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="PDK">PDK</option>
                    </select>
                  </div>

                  {/* Price budget slider */}
                  <div className="space-y-2 text-left pt-2 border-t border-white/5">
                    <div className="flex justify-between items-center text-[8.5px] font-mono uppercase text-[#C2C2BB]/50">
                      <label htmlFor="showroom-price">Max Price Limit</label>
                      <span className="text-white">{(maxPrice / 1000000).toFixed(0)}M KSH</span>
                    </div>
                    <input 
                      id="showroom-price"
                      name="showroom-price"
                      type="range"
                      min={10000000}
                      max={60000000}
                      step={2000000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full accent-white bg-white/10"
                    />
                  </div>

                  {/* Clear filter button */}
                  <button 
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedMake('All');
                      setSelectedTransmission('All');
                      setSelectedFuel('All');
                      setMaxPrice(60000000);
                      setSelectedYear('All');
                    }}
                    className="w-full py-2 border border-white/15 text-[#C2C2BB] font-mono text-[9px] uppercase tracking-wider hover:bg-white hover:text-black transition-colors rounded-none outline-none cursor-pointer"
                  >
                    Reset Grid filters
                  </button>
                </div>
              </aside>

              {/* Grid content Area */}
              <div className="lg:col-span-9 space-y-8">
                
                {/* Control bar: display counter + Sort dropdown */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 px-5 bg-[#0B0B0C] border border-white/10 gap-3">
                  <span className="font-mono text-[9px] text-[#C2C2BB]/50 uppercase tracking-widest leading-none">
                    Found {sortedVehicles.length} premium listing{sortedVehicles.length !== 1 ? 's' : ''}
                  </span>

                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[#C2C2BB]/60">
                    <label htmlFor="showroom-sort" className="sr-only">Sort by</label>
                    <span>Sort by:</span>
                    <select 
                      id="showroom-sort"
                      name="showroom-sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-white border-none py-0 focus:ring-0 outline-none uppercase font-semibold tracking-wider text-[10px]"
                    >
                      <option value="year-desc" className="bg-[#0B0B0C]">Newest Specimens</option>
                      <option value="price-asc" className="bg-[#0B0B0C]">Price: Low to High</option>
                      <option value="price-desc" className="bg-[#0B0B0C]">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Fleet Cards list */}
                {sortedVehicles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedVehicles.slice(0, visibleCount).map(car => (
                      <div 
                        key={car.id}
                        onClick={() => setSelectedVehicleId(car.id)}
                        className="bg-[#0B0B0C] border border-white/10 overflow-hidden cursor-pointer group hover:border-white/30 transition-all duration-300 shadow-xl flex flex-col justify-between"
                      >
                        <div className="h-48 relative overflow-hidden bg-black border-b border-white/10">
                          <img 
                            src={car.image} 
                            alt={car.model} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            referrerPolicy="no-referrer"
                          />
                          {car.status === 'Sold' && (
                            <div className="absolute inset-0 bg-[#050505]/65 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10 animate-in fade-in duration-200">
                              <div className="border border-[#b21c24]/30 bg-[#050505]/95 px-5 py-2 transform -rotate-6 shadow-2xl">
                                <span className="font-serif italic font-bold tracking-[0.25em] text-[#b21c24] text-[10px] uppercase block">
                                  SOLD OUTLET
                                </span>
                              </div>
                            </div>
                          )}
                          <span className="absolute top-3 left-3 bg-black/80 border border-white/10 px-2.5 py-0.5 text-[8.5px] font-mono text-white/80 uppercase tracking-wider">
                            {car.year}
                          </span>
                        </div>

                        <div className="p-5 flex-grow space-y-4">
                          <div className="space-y-0.5 text-left">
                            <span className="text-[8.5px] font-mono uppercase tracking-[0.2em] text-[#C2C2BB]/40">{car.make}</span>
                            <h4 className="font-serif italic font-semibold text-white group-hover:text-white transition-colors">{car.model}</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[8.5px] font-mono text-[#C2C2BB]/50 uppercase tracking-widest pt-2 border-t border-white/5 text-left">
                            <span>Gearbox: {car.transmission}</span>
                            <span>Fuel: {car.fuelType}</span>
                            <span className="col-span-2">Engine: {car.engine}</span>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-white/5 font-mono">
                            <span className="text-xs text-white font-medium">{formatPrice(car.price)}</span>
                            <span className="text-[8.5px] uppercase tracking-widest text-[#C2C2BB]/60 group-hover:text-white transition-all flex items-center gap-1">
                              Examine Specs <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center font-mono border border-white/5 bg-[#0B0B0C] text-[#C2C2BB]/40 uppercase text-[10.5px] tracking-widest">
                    No pristine fleet assets match your parameters. Please reset filters.
                  </div>
                )}

                {/* PAGINATION / INFINITE SCROLL */}
                {sortedVehicles.length > visibleCount && (
                  <div className="flex justify-center pt-4">
                    <button 
                      onClick={() => setVisibleCount(c => c + 6)}
                      className="px-8 py-3 bg-transparent text-[#F5F5F0] border border-white/20 hover:bg-white hover:text-black hover:border-transparent transition-all font-mono text-[9px] uppercase tracking-[0.2em] rounded-none cursor-pointer"
                    >
                      Load More Fleet Assets
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        ) : activeClientTab === 'about' ? (
          
          /* ABOUT THE DEALER COMPONENT */
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 mt-4 space-y-12">
            <header className="space-y-2">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-[#C2C2BB]/40 block text-center">Nairobi's Automotive Crown</span>
              <h1 className="font-serif text-3xl md:text-4xl italic font-semibold text-[#F5F5F0] text-center">The Mansa Legacy</h1>
            </header>

            <section className="space-y-6 font-serif text-[13.5px] italic text-[#C2C2BB] leading-relaxed leading-6 select-text text-left max-w-3xl mx-auto">
              <p>
                Incepted with an unwavering focus on peak automotive perfection, Mansa Whips stands as Kenya's premier boutique showroom. Our flagship destination along Ngong Road, Nairobi, curates the finest high-performance German engineering, premium Japanese luxury imports, and bespoke global automotive models.
              </p>
              <p>
                We do not sell mere transport vehicles; we coordinate luxury mechanical assets. Our imports catalog includes low-mileage performance coupes, grand tourers, twin-turbocharged utility vehicles, and exceptional select luxury imports hand-chosen from verified global collections. 
              </p>
              <p>
                Before crossing onto Kenyan ports, every vehicle undergoes absolute 150-point diagnostic tests, certified mechanical overhauls, and complete custom clearances. This uncompromising procurement filter ensures that power, safety, and ultimate comfort behave flawlessly on Nairobi roads. We invite you to experience executive driving.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5 text-left font-mono text-xs">
              <div className="p-6 bg-[#0B0B0C] border border-white/10 space-y-3">
                <h4 className="text-white font-serif italic text-sm">Privileged Sourcing</h4>
                <p className="text-[#C2C2BB]/60 text-[10.5px] tracking-wider uppercase leading-relaxed">
                  We leverage strategic trade relationships in Germany, Austria, and the United Kingdom, pulling rare low-mileage editions with bespoke interior codes that are otherwise unavailable in East Africa.
                </p>
              </div>

              <div className="p-6 bg-[#0B0B0C] border border-white/10 space-y-3">
                <h4 className="text-white font-serif italic text-sm">Concierge Experience</h4>
                <p className="text-[#C2C2BB]/60 text-[10.5px] tracking-wider uppercase leading-relaxed">
                  From custom registration transfers to elite financial lease architectures, our internal legal team streamlines high-profile acquisitions seamlessly with absolute confidentiality.
                </p>
              </div>
            </section>
          </div>
        ) : (
          
          /* CONTACT SHOWROOM PAGE */
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 mt-4 space-y-12">
            <header className="space-y-2 text-center">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C2C2BB]/40 block">Inquire Today</span>
              <h1 className="font-serif text-3xl font-semibold italic text-[#F5F5F0]">Coordinate Showroom Visit</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
              
              {/* Left sidebar details info */}
              <div className="lg:col-span-5 space-y-8 font-mono text-xs">
                <div className="space-y-2">
                  <h3 className="font-serif text-sm font-semibold italic text-white uppercase tracking-wider">Showroom Presence</h3>
                  <div className="p-4 bg-white/[0.01] border border-white/10 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium text-[11.5px]">Mansa Whips Showroom</p>
                      <p className="text-[#C2C2BB]/60 font-sans text-[11px] mt-1 select-text">
                        Along Ngong Road, Next to UDA Center,<br />
                        Nairobi, Kenya
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-sm font-semibold italic text-white uppercase tracking-wider">Working Hours</h3>
                  <div className="p-4 bg-white/[0.01] border border-white/10 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-[#C2C2BB]/80 space-y-1 font-sans">
                      <p><span className="font-mono font-bold uppercase text-white/50 inline-block w-24">Mon - Sat:</span> 8:00 AM - 6:00 PM</p>
                      <p><span className="font-mono font-bold uppercase text-white/50 inline-block w-24">Sunday:</span> 10:00 AM - 4:00 PM</p>
                      <p className="font-mono text-[9.5px] uppercase tracking-widest text-[#F5F5F0]/30 pt-1">Closed on Kenyan Public Holidays</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-sm font-semibold italic text-white uppercase tracking-wider">Direct Directives</h3>
                  <div className="p-4 bg-white/[0.01] border border-white/10 text-[11px] font-mono tracking-wider space-y-4">
                    <a href="tel:+254719328248" className="flex items-center gap-2.5 text-[#C2C2BB]/80 hover:text-white transition-colors">
                      <Phone className="w-3.5 h-3.5 text-white/20" />
                      0719328248
                    </a>
                    <a href="mailto:concierge@mansawhips.co.ke" className="flex items-center gap-2.5 text-[#C2C2BB]/80 hover:text-white transition-colors select-all">
                      <Mail className="w-3.5 h-3.5 text-white/20" />
                      concierge@mansawhips.co.ke
                    </a>
                  </div>
                </div>
              </div>

              {/* Secure message registration form */}
              <div className="lg:col-span-7 bg-[#0B0B0C] border border-white/10 p-6 md:p-8 rounded-none shadow-2xl relative">
                
                {isSubmitSuccess && (
                  <div className="absolute inset-0 bg-[#0B0B0C]/95 flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in">
                    <CheckCircle2 className="w-12 h-12 text-[#1BD741] mb-3 animate-bounce" />
                    <h3 className="font-serif italic text-lg text-white font-semibold">Consultation Registered</h3>
                    <p className="font-mono text-[10px] text-[#C2C2BB]/60 tracking-wider uppercase mt-2 max-w-sm leading-relaxed">
                      Your general consultation and parameters have been logged to the Mansa Command Center registry.
                    </p>
                    <button 
                      onClick={() => setIsSubmitSuccess(false)}
                      className="mt-6 px-5 py-2.5 bg-white text-black font-mono text-[9px] uppercase tracking-wider h-9"
                    >
                      Submit new message
                    </button>
                  </div>
                )}

                <h3 className="font-serif italic text-base font-semibold text-white tracking-wide mb-6">Staff Memorandum Inquiry Form</h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="space-y-1.5">
                      <label htmlFor="memo-client-name" className="text-[9px] uppercase tracking-[0.15em] text-[#C2C2BB]/40 font-semibold">Client Name</label>
                      <input 
                        id="memo-client-name"
                        name="memo-client-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Kipkosgei Lagat"
                        className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 resize-none rounded-none outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="memo-client-phone" className="text-[9px] uppercase tracking-[0.15em] text-[#C2C2BB]/40 font-semibold">Mobile Number</label>
                      <input 
                        id="memo-client-phone"
                        name="memo-client-phone"
                        type="text"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g. +254 712 345 678"
                        className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 resize-none rounded-none outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="memo-client-email" className="text-[9px] uppercase tracking-[0.15em] text-[#C2C2BB]/40 font-semibold">Email Address (Optional)</label>
                    <input 
                      id="memo-client-email"
                      name="memo-client-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. client@lagatorg.com"
                      className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 resize-none rounded-none outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="memo-client-notes" className="text-[9px] uppercase tracking-[0.15em] text-[#C2C2BB]/40 font-semibold">Inquiry Memorandum</label>
                    <textarea 
                      id="memo-client-notes"
                      name="memo-client-notes"
                      required
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Detail your procurement specs, financing request, or custom configuration wishes..."
                      rows={4}
                      className="w-full bg-white/[0.01] border p-3 border-white/10 text-white focus:ring-0 focus:border-white/30 rounded-none transition-colors resize-none outline-none text-[11px]"
                    ></textarea>
                  </div>

                  <div className="pt-3">
                    <button 
                      type="submit"
                      className="w-full bg-white text-black font-semibold font-mono py-3.5 text-[9px] uppercase tracking-[0.2em] hover:bg-[#F5F5F0] active:scale-[0.98] transition-all rounded-none outline-none border-none cursor-pointer"
                    >
                      Transmit Parameters
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* 3. Global Elegant Footer with SEO Anchor Tags */}
      <footer className="bg-[#0A0A0B] border-t border-white/5 py-12 px-6 md:px-12 select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left font-mono text-xs">
          
          {/* Logo element */}
          <div className="space-y-3">
            <h4 className="font-serif italic font-semibold text-sm text-[13px] tracking-wider text-white">Mansa Whips</h4>
            <p className="text-[#C2C2BB]/40 text-[9px] leading-relaxed uppercase tracking-wider">
               Premium German Engineering, in Nairobi, Kenya. The showroom curated of gold standards.
            </p>
          </div>

          {/* Showroom address */}
          <div className="space-y-3">
            <h5 className="font-serif italic font-semibold text-xs text-white uppercase tracking-wider">Showroom Presence</h5>
            <div className="text-[#C2C2BB]/50 text-[10px] space-y-1 uppercase tracking-widest leading-relaxed">
              <p>Along Ngong Road</p>
              <p>Next to UDA Center</p>
              <p>Nairobi, Kenya</p>
            </div>
          </div>

          {/* Business hours */}
          <div className="space-y-3">
            <h5 className="font-serif italic font-semibold text-xs text-white uppercase tracking-wider">Showroom Timings</h5>
            <div className="text-[#C2C2BB]/50 text-[10px] space-y-1 uppercase tracking-widest font-mono">
              <p>Mon - Sat: 8 AM - 6 PM</p>
              <p>Sunday: 10 AM - 4 PM</p>
            </div>
          </div>

          {/* Social media connections */}
          <div className="space-y-3">
            <h5 className="font-serif italic font-semibold text-xs text-[#F5F5F0] uppercase tracking-wider">Network Channels</h5>
            <div className="text-[10px] space-y-2 uppercase tracking-widest font-mono text-white/50 flex flex-col">
              <a href="#instagram" onClick={(e) => { e.preventDefault(); alert('Redirecting to @MansaWhips on Instagram. Follow for daily luxury transport posts!'); }} className="hover:text-white transition-colors">Instagram</a>
              <a href="#youtube" onClick={(e) => { e.preventDefault(); alert('Redirecting to Mansa Whips TV on YouTube. Premium German exhaust soundtracks and reviews!'); }} className="hover:text-white transition-colors">YouTube Channel</a>
              <a href="#twitter" onClick={(e) => { e.preventDefault(); alert('Redirecting to @MansaWhips on Twitter (X) portal.'); }} className="hover:text-white transition-colors">Platform X</a>
            </div>
          </div>
        </div>

        {/* Brand Copyright and Legal Sitemap links */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[9.5px]">
          <p className="text-[#C2C2BB]/40 uppercase tracking-widest">
            © 2026 MANSA WHIPS. NAIROBI, KENYA. Located along Ngong Road next to UDA Center.
          </p>
          
          <div className="flex flex-wrap gap-4 uppercase tracking-[0.18em] text-[#C2C2BB]/30">
            <a href="#sitemap" onClick={(e) => { e.preventDefault(); alert('SEO Sitemap generated and indexed. All premium German, Japanese luxury, and bespoke sports models matched perfectly.'); }} className="hover:text-white transition-colors">Sitemap</a>
            <span>•</span>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Mansa Whips Privacy Policy ensures absolute high-net-worth customer profile discretion.'); }} className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Mansa Whips Dealership Covenant rules applied.'); }} className="hover:text-white transition-colors">Terms of Covenant</a>
          </div>
        </div>
      </footer>

      {/* 4. PRIVATE VIEWING BOOKING CONCIERGE MODAL */}
      {showViewingModal && selectedVehicle && (
        <div className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0B0B0C] border border-white/10 rounded-none w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200 text-left font-mono">
            
            <button 
              onClick={() => setShowViewingModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors border border-white/10 p-1.5 rounded-none cursor-pointer hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-white/10 pb-3 mb-4 space-y-1">
              <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#C2C2BB]/40">Private Showroom Briefing</span>
              <h3 className="font-serif italic font-semibold text-white text-base">
                Viewing: {selectedVehicle.make} {selectedVehicle.model}
              </h3>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label htmlFor="booking-client-name" className="text-[9px] uppercase tracking-[0.15em] text-[#C2C2BB]/40 font-semibold">Your full Name</label>
                <input 
                  id="booking-client-name"
                  name="booking-client-name"
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Kiprono Langat"
                  className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 border-t-0 border-l-0 border-r-0 rounded-none h-10 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="booking-client-phone" className="text-[9px] uppercase tracking-[0.15em] text-[#C2C2BB]/40 font-semibold">Mobile phone No.</label>
                  <input 
                    id="booking-client-phone"
                    name="booking-client-phone"
                    type="text"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+254 700 888 777"
                    className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 border-t-0 border-l-0 border-r-0 rounded-none h-10 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="booking-client-email" className="text-[9px] uppercase tracking-[0.15em] text-[#C2C2BB]/40 font-semibold">Email Address</label>
                  <input 
                    id="booking-client-email"
                    name="booking-client-email"
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="e.g. client@exclusive.co.ke"
                    className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 border-t-0 border-l-0 border-r-0 rounded-none h-10 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="booking-client-date" className="text-[9px] uppercase tracking-[0.15em] text-[#C2C2BB]/40 font-semibold">Select Date</label>
                  <input 
                    id="booking-client-date"
                    name="booking-client-date"
                    type="date"
                    required
                    value={leadDate}
                    onChange={(e) => setLeadDate(e.target.value)}
                    className="w-full bg-[#0B0B0C] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 border-t-0 border-l-0 border-r-0 rounded-none h-10 outline-none uppercase text-[10px]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="booking-client-time" className="text-[9px] uppercase tracking-[0.15em] text-[#C2C2BB]/40 font-semibold">Select Time</label>
                  <input 
                    id="booking-client-time"
                    name="booking-client-time"
                    type="time"
                    required
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    className="w-full bg-[#0B0B0C] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 border-t-0 border-l-0 border-r-0 rounded-none h-10 outline-none text-[10px]"
                  />
                </div>
              </div>

              <p className="text-[9.5px] text-[#C2C2BB]/40 uppercase tracking-wider leading-relaxed pt-2">
                * Note: Viewings are confidential and take place in a private meeting suite at our Ngong Road showroom location.
              </p>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowViewingModal(false)}
                  className="px-4 py-2 border border-white/15 text-[#C2C2BB] hover:bg-white/5 font-mono text-[9px] uppercase tracking-wider rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-semibold font-mono text-[9px] uppercase tracking-wider rounded-none"
                >
                  Reserve Briefing Suite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Hidden SEO fallback markup for web crawlers (Google/Meta bots) to read specs without JS parsing */}
      <div className="sr-only" aria-hidden="true" style={{ display: 'none' }}>
        <h2>Mansa Whips Premium Automotive Fleet Catalog</h2>
        {vehicles.map(car => (
          <article key={`seo-${car.id}`}>
            <h3>{car.year} {car.make} {car.model} {car.trim || ''}</h3>
            <p>Asking Price: {car.price} KSH</p>
            <p>Manufacturer: {car.make}</p>
            <p>Model Designation: {car.model}</p>
            <p>Production Year: {car.year}</p>
            <p>Chassis Number (VIN): {car.vin}</p>
            <p>Gearbox Transmission: {car.transmission}</p>
            <p>Fuel Feed Type: {car.fuelType}</p>
            <p>Engine Spec: {car.engine}</p>
            <p>Odometer Mileage: {car.mileage || 10000} KM</p>
            <p>Exterior Finish: {car.color}</p>
            <p>Asset Status: {car.status}</p>
            <p>Description: {car.description}</p>
            <a href={`?v=${car.slug}`}>Examine {car.make} {car.model} asset details page</a>
          </article>
        ))}
      </div>

    </div>
  );
}
