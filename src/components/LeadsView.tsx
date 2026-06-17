import React, { useState } from 'react';
import { Mail, Search, Plus, Filter, CheckCircle, Clock, Trash2, Phone, FileText } from 'lucide-react';
import { Inquiry } from '../types';

interface LeadsViewProps {
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  viewInquiryDetails: (inq: Inquiry) => void;
}

export default function LeadsView({ inquiries, setInquiries, viewInquiryDetails }: LeadsViewProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'New' | 'Contacted'>('All');

  const [clientName, setClientName] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !vehicleName) {
      alert('Client Name and Vehicle make are required.');
      return;
    }

    const initials = clientName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      clientName,
      clientInitials: initials || 'CL',
      vehicleName,
      date: 'Just now',
      status: 'New',
      email: email || 'not-provided@gmail.com',
      phone: phone || '+254 status phone',
      notes: notes || 'Walk-in showroom visitor interested in immediate test-driving.'
    };

    setInquiries(prev => [newInquiry, ...prev]);
    
    // Reset Form
    setClientName('');
    setVehicleName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleDeleteInquiry = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete inquiry from ${name}?`)) {
      setInquiries(prev => prev.filter(inq => inq.id !== id));
    }
  };

  const handleToggleStatus = (id: string, current: 'New' | 'Contacted') => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        return { ...inq, status: current === 'New' ? 'Contacted' : 'New' };
      }
      return inq;
    }));
  };

  const filtered = inquiries.filter(inq => {
    const matchesSearch = inq.clientName.toLowerCase().includes(search.toLowerCase()) || 
                          inq.vehicleName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || inq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200 select-none pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl italic font-semibold text-[#F5F5F0] mb-2">Leads & Inquiries Manager</h2>
          <p className="text-[#C2C2BB]/80 text-xs">
            Monitor incoming client interest, log test drives, and register private customer specifications.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-transparent text-[#F5F5F0] border border-white/20 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-transparent active:scale-97 transition-all flex items-center gap-1.5 rounded-none"
        >
          <Plus className="w-3.5 h-3.5" />
          Log Manual Lead
        </button>
      </div>

      {/* Manual log form */}
      {showAddForm && (
        <form onSubmit={handleCreateInquiry} className="p-6 bg-[#0B0B0C] border border-white/10 rounded-none space-y-4 font-mono text-xs animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-serif text-sm font-semibold italic text-[#F5F5F0] tracking-wider">Log Manual Spec / Offline Client</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#C2C2BB]/50 text-[9px] uppercase tracking-[0.15em]">Client Full Name</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Kiprono Langat"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 border-t-0 border-l-0 border-r-0 rounded-none h-10 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#C2C2BB]/50 text-[9px] uppercase tracking-[0.15em]">Interested Vehicle / Spec</label>
              <input
                type="text"
                required
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                placeholder="e.g. Range Rover Sport SV"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 border-t-0 border-l-0 border-r-0 rounded-none h-10 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#C2C2BB]/50 text-[9px] uppercase tracking-[0.15em]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@exclusive.co.ke"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 border-t-0 border-l-0 border-r-0 rounded-none h-10 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#C2C2BB]/50 text-[9px] uppercase tracking-[0.15em]">Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 700 888 777"
                className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white/30 text-[#F5F5F0] p-2 focus:ring-0 border-t-0 border-l-0 border-r-0 rounded-none h-10 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#C2C2BB]/50 text-[9px] uppercase tracking-[0.15em]">Initial inquiry specifications notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Prefers titanium paint. Will pay bank guarantee..."
              rows={3}
              className="w-full bg-white/[0.01] border p-3 border-white/10 text-[#F5F5F0] focus:ring-0 focus:border-white/30 rounded-none transition-colors resize-none outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-white/15 text-[#C2C2BB]/70 hover:text-[#F5F5F0] hover:bg-white/5 font-mono text-[10px] uppercase tracking-[0.15em]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white text-black font-semibold font-mono text-[10px] uppercase tracking-[0.15em]"
            >
              Register Lead
            </button>
          </div>
        </form>
      )}

      {/* Filter and custom Search bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-[#0B0B0C] border border-white/10 p-4 rounded-none shadow-2xl">
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C2C2BB]/50 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, initials or target vehicle..."
            className="w-full bg-white/[0.01] border border-white/10 focus:border-white/30 text-[#F5F5F0] pl-11 pr-4 py-2.5 font-mono text-xs rounded-none transition-colors"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto shrink-0 font-mono text-xs">
          {(['All', 'New', 'Contacted'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 md:flex-none px-4 py-2.5 border transition-all rounded-none ${
                filterStatus === status
                  ? 'bg-white text-black border-transparent font-semibold shadow'
                  : 'border-white/10 text-[#C2C2BB]/80 hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map(inq => (
            <div
              key={inq.id}
              onClick={() => viewInquiryDetails(inq)}
              className="tonal-card bg-[#0B0B0C] p-6 rounded-none hover:border-white/35 border border-white/10 transition-all flex flex-col justify-between h-60 cursor-pointer relative"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-white/[0.04] border border-white/15 flex items-center justify-center font-bold text-[#F5F5F0] text-sm">
                      {inq.clientInitials}
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-sm text-[#F5F5F0]">{inq.clientName}</h4>
                      <p className="font-mono text-[9px] text-[#C2C2BB]/40 uppercase tracking-[0.2em]">{inq.date}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(inq.id, inq.status);
                    }}
                    className={`status-badge border transition-colors cursor-pointer rounded-none ${
                      inq.status === 'New'
                        ? 'bg-white/10 text-[#F5F5F0] border-white/20 hover:bg-white/15'
                        : 'bg-white/[0.02] text-[#C2C2BB]/60 border-white/5 hover:bg-white/[0.05]'
                    }`}
                  >
                    {inq.status}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono text-[#C2C2BB]/80 pt-2 border-t border-white/10">
                  <span className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    <Mail className="w-3.5 h-3.5 text-white/30 shrink-0" />
                    {inq.email}
                  </span>
                  <span className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    <Phone className="w-3.5 h-3.5 text-white/30 shrink-0" />
                    {inq.phone}
                  </span>
                </div>

                <div className="pt-2">
                  <p className="font-serif text-[11.5px] text-[#C2C2BB]/80 italic line-clamp-2">
                    "{inq.notes || 'No description notes provided by receptionist.'}"
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/5 font-mono text-[9px] text-[#C2C2BB]/40 mt-2">
                <span className="uppercase tracking-wider">Inquired: <span className="font-medium text-[#F5F5F0]">{inq.vehicleName}</span></span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteInquiry(inq.id, inq.clientName);
                  }}
                  className="p-1 hover:bg-white/5 rounded-none text-[#C2C2BB]/40 hover:text-red-300 border border-transparent hover:border-white/10 transition-colors"
                  title="Archive Inquiry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center p-12 bg-[#0B0B0C] border border-white/10 rounded-none text-[#C2C2BB]/40 font-mono text-xs uppercase tracking-wider">
            No active inquiries match your current filters.
          </div>
        )}
      </div>
    </div>
  );
}
