import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Plus, ExternalLink, Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import AddVehicleView from './components/AddVehicleView';
import LeadsView from './components/LeadsView';
import SettingsView from './components/SettingsView';
import ClientShowroom from './components/ClientShowroom';
import AdminLogin from './components/AdminLogin';
import { Vehicle, Inquiry, ActiveTab } from './types';
import { INITIAL_VEHICLES, INITIAL_INQUIRIES } from './initialData';
import { VehicleDetailsModal, InquiryDetailsModal, EditVehicleModal } from './components/Modals';

export default function App() {
  // App Mode (Client Showroom vs Admin Command Center)
  const [appMode, setAppMode] = useState<'client' | 'admin'>(() => {
    return (localStorage.getItem('mansa_showroom_app_mode') as 'client' | 'admin') || 'client';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('mansa_admin_authenticated') === 'true';
  });

  // Persistence state
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('mansa_showroom_vehicles_v2');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('mansa_showroom_inquiries_v2');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('mansa_admin_user_name') || 'Mansa Admin';
  });

  const [currency, setCurrency] = useState<'KSH' | 'USD' | 'EUR'>(() => {
    return (localStorage.getItem('mansa_showroom_currency') as any) || 'KSH';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Save to local storage when state changes
  useEffect(() => {
    localStorage.setItem('mansa_showroom_vehicles_v2', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('mansa_showroom_inquiries_v2', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('mansa_admin_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('mansa_showroom_app_mode', appMode);
  }, [appMode]);

  useEffect(() => {
    localStorage.setItem('mansa_showroom_currency', currency);
  }, [currency]);

  // Reset function to clear custom items
  const handleResetData = () => {
    setVehicles(INITIAL_VEHICLES);
    setInquiries(INITIAL_INQUIRIES);
    setUserName('Mansa Admin');
    setCurrency('KSH');
    setActiveTab('dashboard');
    alert('Browser Cache Cleared. Showroom inventory initialized back to original settings.');
  };

  // Convert prices based on currency state
  const convertPrice = (kshValue: number) => {
    const conversionRates = {
      KSH: 1,
      USD: 130,
      EUR: 142
    };
    const rate = conversionRates[currency];
    return Math.round(kshValue / rate);
  };

  const getCurrencySymbol = () => {
    const symbols = {
      KSH: 'KSH',
      USD: '$',
      EUR: '€'
    };
    return symbols[currency];
  };

  // Translate vehicles listing based on currency state
  const displayedVehicles = vehicles.map(v => ({
    ...v,
    price: convertPrice(v.price)
  }));

  const API_BASE = 'http://localhost:5001/api';

  // Load from DB on mount with local storage fallback
  useEffect(() => {
    fetch(`${API_BASE}/vehicles`)
      .then(res => {
        if (!res.ok) throw new Error('API down');
        return res.json();
      })
      .then(data => {
        const mapped = data.map((d: any) => ({ ...d, id: d.id || d._id }));
        setVehicles(mapped);
      })
      .catch(err => console.warn('Vehicles DB sync skipped (offline/cache fallback active).', err));

    fetch(`${API_BASE}/inquiries`)
      .then(res => {
        if (!res.ok) throw new Error('API down');
        return res.json();
      })
      .then(data => {
        const mapped = data.map((d: any) => ({ ...d, id: d.id || d._id }));
        setInquiries(mapped);
      })
      .catch(err => console.warn('Inquiries DB sync skipped (offline/cache fallback active).', err));
  }, []);

  const handleDeleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    fetch(`${API_BASE}/vehicles/${id}`, { method: 'DELETE' })
      .catch(err => console.warn('Database offline: Vehicle deleted locally only.', err));
  };

  const handleDeleteSelectedVehicles = (ids: string[]) => {
    setVehicles(prev => prev.filter(v => !ids.includes(v.id)));
    ids.forEach(id => {
      fetch(`${API_BASE}/vehicles/${id}`, { method: 'DELETE' })
        .catch(err => console.warn('Database offline: Vehicle deleted locally only.', err));
    });
  };

  const handleUpdateVehicleStatus = (id: string, status: 'Available' | 'Reserved' | 'Sold') => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    fetch(`${API_BASE}/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(err => console.warn('Database offline: Status updated locally only.', err));
  };

  const handleMarkSelectedAsSold = (ids: string[]) => {
    setVehicles(prev => prev.map(v => ids.includes(v.id) ? { ...v, status: 'Sold' } : v));
    ids.forEach(id => {
      fetch(`${API_BASE}/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Sold' })
      }).catch(err => console.warn('Database offline: Status updated locally only.', err));
    });
  };

  const handleToggleInquiryStatus = (id: string, currentStatus: 'New' | 'Contacted') => {
    const newStatus = currentStatus === 'New' ? 'Contacted' : 'New';
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(err => console.warn('Database offline: Inquiry status updated locally only.', err));
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
    fetch(`${API_BASE}/inquiries/${id}`, { method: 'DELETE' })
      .catch(err => console.warn('Database offline: Inquiry deleted locally only.', err));
  };

  const handleAddManualInquiry = (inq: Inquiry) => {
    setInquiries(prev => [inq, ...prev]);
    fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inq)
    })
    .then(res => {
      if (!res.ok) throw new Error('API down');
      return res.json();
    })
    .then(saved => {
      setInquiries(prev => prev.map(item => item.id === inq.id ? { ...item, id: saved.id || saved._id } : item));
    })
    .catch(err => console.warn('Database offline: Inquiry saved locally only.', err));
  };

  const handleRegisterClientLead = (clientName: string, vehicleName: string, email: string, phone: string, notes: string) => {
    const initials = clientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'VIP';
    const newInq: Inquiry = {
      id: `inq-${Date.now()}`,
      clientName,
      clientInitials: initials,
      vehicleName,
      date: 'Just now',
      status: 'New',
      email: email || 'No email given',
      phone: phone || 'No mobile given',
      notes
    };
    setInquiries(prev => [newInq, ...prev]);

    fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInq)
    })
    .then(res => {
      if (!res.ok) throw new Error('API down');
      return res.json();
    })
    .then(saved => {
      setInquiries(prev => prev.map(item => item.id === newInq.id ? { ...item, id: saved.id || saved._id } : item));
    })
    .catch(err => console.warn('Database offline: Inquiry saved locally only.', err));
  };

  const handleInquiryFromVehicleModal = (v: Vehicle) => {
    setSelectedVehicle(null);
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const mockInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      clientName: 'VIP Showroom Lead',
      clientInitials: initials || 'VIP',
      vehicleName: `${v.make} ${v.model}`,
      date: 'Just now',
      status: 'New',
      email: 'not-provided@gmail.com',
      phone: '+254 700 888 999',
      notes: `High net worth client requested private quotation regarding ${v.make} ${v.model} finished in ${v.color}. Available spec details sent.`
    };
    setInquiries(prev => [mockInquiry, ...prev]);
    setActiveTab('leads');

    fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockInquiry)
    })
    .then(res => {
      if (!res.ok) throw new Error('API down');
      return res.json();
    })
    .then(saved => {
      setInquiries(prev => prev.map(item => item.id === mockInquiry.id ? { ...item, id: saved.id || saved._id } : item));
    })
    .catch(err => console.warn('Database offline: Inquiry saved locally only.', err));
    alert(`Incoming Lead registered for ${v.make} ${v.model}. Redirected to Leads panel.`);
  };

  const handleUpdateInquiryStatus = (id: string, newStatus: 'New' | 'Contacted') => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        return { ...inq, status: newStatus };
      }
      return inq;
    }));
    // Sync current modal state
    setSelectedInquiry(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);

    fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(err => console.warn('Database offline: Inquiry status updated locally only.', err));
  };

  const handleSaveInquiryComment = (id: string, comment: string) => {
    const targetInquiry = inquiries.find(inq => inq.id === id);
    if (!targetInquiry) return;
    const updatedNotes = `${targetInquiry.notes}\n[memo]: ${comment}`;

    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        return {
          ...inq,
          notes: updatedNotes
        };
      }
      return inq;
    }));
    // Sync current modal state
    setSelectedInquiry(prev => prev && prev.id === id ? {
      ...prev,
      notes: updatedNotes
    } : prev);

    fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: updatedNotes })
    }).catch(err => console.warn('Database offline: Comment saved locally only.', err));
  };

  const handleSaveVehicleEdits = (v: Vehicle) => {
    // Need to save in KSH, so if we converted it we must convert it back!
    const conversionRates = {
      KSH: 1,
      USD: 130,
      EUR: 142
    };
    const rate = conversionRates[currency];
    const originalPriceKSH = Math.round(v.price * rate);

    const updatedVehicle = {
      ...v,
      price: originalPriceKSH
    };

    setVehicles(prev => prev.map(item => {
      if (item.id === v.id) {
        return updatedVehicle;
      }
      return item;
    }));

    fetch(`${API_BASE}/vehicles/${v.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedVehicle)
    }).catch(err => console.warn('Database offline: Vehicle edits saved locally only.', err));
  };

  const activeInquiries = inquiries.filter(i => {
    const s = searchQuery.toLowerCase();
    return i.clientName.toLowerCase().includes(s) || i.vehicleName.toLowerCase().includes(s);
  });

  if (appMode === 'client') {
    return (
      <ClientShowroom
        vehicles={displayedVehicles}
        currency={currency}
        getCurrencySymbol={getCurrencySymbol}
        onInquire={handleRegisterClientLead}
        onSwitchToAdmin={() => setAppMode('admin')}
      />
    );
  }

  if (appMode === 'admin' && !isAdminAuthenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          sessionStorage.setItem('mansa_admin_authenticated', 'true');
          setIsAdminAuthenticated(true);
        }}
        onCancel={() => {
          setAppMode('client');
        }}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-[#F5F5F0] font-sans antialiased">
      
      {/* SideNavBar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inquiriesCount={inquiries.filter(i => i.status === 'New').length}
        onSwitchToClient={() => setAppMode('client')}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header Component */}
        <Header
          title={
            activeTab === 'dashboard'
              ? 'Mansa Command Center'
              : activeTab === 'inventory'
              ? 'Inventory Manager'
              : activeTab === 'add-vehicle'
              ? 'Initialize New Listing'
              : activeTab === 'leads'
              ? 'Leads & Inquiries'
              : 'Command Settings'
          }
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSearch={activeTab === 'dashboard' || activeTab === 'inventory' || activeTab === 'leads'}
        />

        {/* Workspace Scroll Container */}
        <div className="flex-grow overflow-y-auto p-6 md:p-12 custom-scrollbar bg-[#050505]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                vehicles={displayedVehicles}
                inquiries={activeInquiries}
                onToggleInquiryStatus={handleToggleInquiryStatus}
                viewVehicleDetails={(v) => setSelectedVehicle(vehicles.find(item => item.id === v.id) || null)}
                viewInquiryDetails={setSelectedInquiry}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryView
                vehicles={displayedVehicles}
                onDeleteVehicle={handleDeleteVehicle}
                onDeleteSelectedVehicles={handleDeleteSelectedVehicles}
                onUpdateVehicleStatus={handleUpdateVehicleStatus}
                onMarkSelectedAsSold={handleMarkSelectedAsSold}
                viewVehicleDetails={(v) => setSelectedVehicle(vehicles.find(item => item.id === v.id) || null)}
                openEditModal={(v) => setEditingVehicle(vehicles.find(item => item.id === v.id) || null)}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'add-vehicle' && (
              <AddVehicleView
                onPublish={(newVSubmit) => {
                  const newV: Vehicle = {
                    ...newVSubmit,
                    id: `v-${Date.now()}`,
                    inquiriesCount: 0
                  };
                  setVehicles(prev => [newV, ...prev]);

                  fetch(`${API_BASE}/vehicles`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newV)
                  })
                  .then(res => {
                    if (!res.ok) throw new Error('API down');
                    return res.json();
                  })
                  .then(saved => {
                    setVehicles(prev => prev.map(item => item.id === newV.id ? { ...item, id: saved.id || saved._id } : item));
                  })
                  .catch(err => console.warn('Database offline: Vehicle saved locally only.', err));
                }}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'leads' && (
              <LeadsView
                inquiries={activeInquiries}
                onAddManualInquiry={handleAddManualInquiry}
                onDeleteInquiry={handleDeleteInquiry}
                onToggleInquiryStatus={handleToggleInquiryStatus}
                viewInquiryDetails={setSelectedInquiry}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                userName={userName}
                setUserName={setUserName}
                currency={currency}
                setCurrency={setCurrency}
                onResetData={handleResetData}
                onLogout={() => {
                  sessionStorage.removeItem('mansa_admin_authenticated');
                  setIsAdminAuthenticated(false);
                  setAppMode('client');
                  alert('Session Terminated. Administrative lock active.');
                }}
              />
            )}
          </div>
        </div>

        {/* Footer info bar */}
        <footer className="bg-[#0A0A0B] border-t border-white/5 px-6 md:px-12 py-4 select-none">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-mono">
            <p className="text-[#C2C2BB]/40">
              © 2026 Mansa Whips. Nairobi, Kenya. Currently displaying prices in <span className="text-white font-semibold">{currency}</span>.
            </p>
            <div className="flex gap-6 uppercase tracking-[0.15em] text-[#C2C2BB]/50 text-[10px]">
              <a href="#warranty" onClick={(e) => { e.preventDefault(); alert('Warranty coverage limits: 3-Year comprehensive engine, transmission and electrical warranty included for all Mansa vehicles.'); }} className="hover:text-white transition-colors">Warranty</a>
              <a href="#financing" onClick={(e) => { e.preventDefault(); alert('Financing details: Asset financial lease structures arranged seamlessly through local elite private bank partnerships.'); }} className="hover:text-white transition-colors">Financing</a>
              <a href="#inspection" onClick={(e) => { e.preventDefault(); alert('Inspection standards: Comprehensive 150-point diagnostics and certified German mechanical tests completed.'); }} className="hover:text-white transition-colors">Inspection</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating menu button for smaller viewport/mobile navigation overlays */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-14 h-14 bg-[#F5F5F0] text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-center border-none outline-none"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#050505]/98 z-40 flex flex-col justify-center items-center gap-6 p-8 animate-in fade-in duration-200">
          <div className="text-center">
            <h1 className="font-serif text-3xl italic font-semibold text-[#F5F5F0] uppercase tracking-wider">MANSA</h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#C2C2BB]/50">Showroom manager</p>
          </div>
          <nav className="flex flex-col gap-4 text-center">
            {(['dashboard', 'inventory', 'add-vehicle', 'leads', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                className={`py-3.5 px-6 font-mono font-semibold text-[10px] uppercase tracking-[0.2em] border transition-all rounded-none ${
                  activeTab === tab
                    ? 'bg-white text-black border-transparent shadow'
                    : 'text-[#C2C2BB] border-white/10 hover:bg-white/5'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Modals Container */}
      <VehicleDetailsModal
        vehicle={selectedVehicle ? { ...selectedVehicle, price: convertPrice(selectedVehicle.price) } : null}
        onClose={() => setSelectedVehicle(null)}
        onInquire={handleInquiryFromVehicleModal}
      />

      <InquiryDetailsModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onUpdateStatus={handleUpdateInquiryStatus}
        onAddComment={handleSaveInquiryComment}
      />

      <EditVehicleModal
        vehicle={editingVehicle ? { ...editingVehicle, price: convertPrice(editingVehicle.price) } : null}
        onClose={() => setEditingVehicle(null)}
        onSave={handleSaveVehicleEdits}
      />

    </div>
  );
}
