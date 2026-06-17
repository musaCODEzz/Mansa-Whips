import React, { useState } from 'react';
import { Car, Tag, Lightbulb, Users, Megaphone, TrendingUp, MoreVertical, Eye, FileText, ArrowUpRight, Award, Trash2, Mail, CheckCircle, ShieldAlert } from 'lucide-react';
import { Vehicle, Inquiry } from '../types';

interface DashboardViewProps {
  vehicles: Vehicle[];
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  viewVehicleDetails: (v: Vehicle) => void;
  viewInquiryDetails: (inq: Inquiry) => void;
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'add-vehicle' | 'leads' | 'settings') => void;
}

export default function DashboardView({
  vehicles,
  inquiries,
  setInquiries,
  viewVehicleDetails,
  viewInquiryDetails,
  setActiveTab
}: DashboardViewProps) {
  // Stats calculations
  const totalStock = vehicles.length + 27; // 32 original stock
  const soldThisMonth = vehicles.filter(v => v.status === 'Sold').length + 4; // 5 original
  const newLeads = inquiries.filter(i => i.status === 'New').length + 15; // 18 original

  // Find high demand car or Ferrari F8 Tributo as default
  const ferrari = vehicles.find(v => v.model.includes('F8') || v.make === 'Ferrari') || vehicles[vehicles.length - 1];

  const handleInquiryStatusToggle = (id: string, currentStatus: 'New' | 'Contacted') => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        return { ...inq, status: currentStatus === 'New' ? 'Contacted' : 'New' };
      }
      return inq;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Metric Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Total Stock */}
        <div className="tonal-card p-6 rounded-none flex flex-col justify-between h-32 relative overflow-hidden group border border-white/10 hover:border-white/35 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-semibold text-[#C2C2BB]/60 uppercase tracking-[0.2em]">Total Stock</span>
            <Car className="text-white/35 w-4 h-4 group-hover:scale-105 transition-transform" />
          </div>
          <div className="z-10 mt-auto">
            <div className="text-4xl font-serif font-light text-[#F5F5F0]">{totalStock}</div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 mt-1 uppercase tracking-wider">
              <TrendingUp className="w-3 h-3 text-white/40" />
              <span>+3 this week</span>
            </div>
          </div>
        </div>

        {/* Sold This Month */}
        <div className="tonal-card p-6 rounded-none flex flex-col justify-between h-32 relative overflow-hidden group border border-white/10 hover:border-white/35 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-semibold text-[#C2C2BB]/60 uppercase tracking-[0.2em]">Sold This Month</span>
            <Tag className="text-white/35 w-4 h-4 group-hover:scale-105 transition-transform" />
          </div>
          <div className="z-10 mt-auto">
            <div className="text-4xl font-serif font-light text-[#F5F5F0]">{soldThisMonth}</div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 mt-1 uppercase tracking-wider">
              <Award className="w-3 h-3 text-white/40" />
              <span>KES 84M Revenue</span>
            </div>
          </div>
        </div>

        {/* New Leads */}
        <div className="tonal-card p-6 rounded-none flex flex-col justify-between h-32 relative overflow-hidden group border border-white/10 hover:border-white/35 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-semibold text-[#C2C2BB]/60 uppercase tracking-[0.2em]">New Leads</span>
            <Users className="text-white/35 w-4 h-4 group-hover:scale-105 transition-transform" />
          </div>
          <div className="z-10 mt-auto">
            <div className="text-4xl font-serif font-light text-[#F5F5F0]">{newLeads}</div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 mt-1 uppercase tracking-wider">
              <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-0.5" />
              <span>Requires Attention</span>
            </div>
          </div>
        </div>

        {/* Active Ads */}
        <div className="tonal-card p-6 rounded-none flex flex-col justify-between h-32 relative overflow-hidden group border border-white/10 hover:border-white/35 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-semibold text-[#C2C2BB]/60 uppercase tracking-[0.2em]">Active Ads</span>
            <Megaphone className="text-white/35 w-4 h-4 group-hover:scale-105 transition-transform" />
          </div>
          <div className="z-10 mt-auto">
            <div className="text-4xl font-serif font-light text-[#F5F5F0]">4</div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 mt-1 uppercase tracking-wider">
              <span>Google • Instagram</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Activity & Inventory Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Inquiries Table Column */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif italic font-medium text-lg md:text-xl text-[#F5F5F0] tracking-tight">Recent Inquiries</h3>
            <button
              onClick={() => setActiveTab('leads')}
              className="text-[#F5F5F0] font-mono text-[10px] uppercase tracking-[0.2em] hover:opacity-75 flex items-center gap-1.5 transition-all text-left"
            >
              View All Activity
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#0B0B0C] rounded-none border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/10">
                    <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#C2C2BB]/70 font-semibold">Client Name</th>
                    <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#C2C2BB]/70 font-semibold">Vehicle</th>
                    <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#C2C2BB]/70 font-semibold">Date</th>
                    <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#C2C2BB]/70 font-semibold">Status</th>
                    <th className="px-5 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs text-[#F5F5F0]">
                  {inquiries.slice(0, 5).map((inq) => (
                    <tr
                      key={inq.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => viewInquiryDetails(inq)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-none bg-white/[0.04] border border-white/15 flex items-center justify-center font-bold text-[#F5F5F0] text-xs">
                            {inq.clientInitials}
                          </div>
                          <span className="font-sans font-medium text-[#F5F5F0]">{inq.clientName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#F5F5F0]/80">{inq.vehicleName}</td>
                      <td className="px-5 py-4 text-[#C2C2BB]/60">{inq.date}</td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleInquiryStatusToggle(inq.id, inq.status)}
                          className={`status-badge border transition-colors cursor-pointer rounded-none ${
                            inq.status === 'New'
                              ? 'bg-white/10 text-[#F5F5F0] border-white/20 hover:bg-white/15'
                              : 'bg-white/[0.02] text-[#C2C2BB]/60 border-white/5 hover:bg-white/[0.05]'
                          }`}
                        >
                          {inq.status}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-[#C2C2BB]/60 hover:text-[#F5F5F0] p-1.5 rounded transition-transform group-hover:translate-x-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Sidebar Content (Market Performance & High Demand) */}
        <section className="space-y-6">
          {/* Market Performance */}
          <div>
            <h3 className="font-serif italic font-medium text-lg md:text-xl text-[#F5F5F0] mb-4">Market Performance</h3>
            <div className="bg-[#0B0B0C] p-6 rounded-none border border-white/10 shadow-2xl space-y-6 select-none animate-in fade-in">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#C2C2BB]/80 font-sans tracking-wide">Inventory Turnaround</span>
                  <span className="font-mono text-xs font-medium text-[#F5F5F0]">18 Days</span>
                </div>
                <div className="w-full bg-white/5 h-[3px] rounded-none overflow-hidden">
                  <div className="bg-[#F5F5F0] h-full w-[75%] transition-all duration-1000"></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#C2C2BB]/80 font-sans tracking-wide">Lead Conversion</span>
                  <span className="font-mono text-xs font-medium text-[#F5F5F0]">22%</span>
                </div>
                <div className="w-full bg-white/5 h-[3px] rounded-none overflow-hidden">
                  <div className="bg-[#F5F5F0] h-full w-[45%] transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          </div>

          {/* High Demand vehicle Card */}
          {ferrari && (
            <div>
              <h3 className="font-serif italic font-medium text-lg md:text-xl text-[#F5F5F0] mb-4">High Demand</h3>
              <div className="tonal-card overflow-hidden rounded-none group/card shadow-2xl border border-white/10 bg-[#0B0B0C]">
                <div className="h-44 overflow-hidden relative border-b border-white/10">
                  <img
                    alt={ferrari.model}
                    src={ferrari.image}
                    className="w-full h-full object-cover grayscale brightness-90 group-hover/card:grayscale-0 group-hover/card:brightness-100 group-hover/card:scale-105 transition-all duration-700 pointer-events-none"
                  />
                  <div className="absolute top-3 right-3 bg-[#F5F5F0] text-black font-mono text-[9px] uppercase tracking-[0.25em] font-bold px-3 py-1 shadow">
                    HOT
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[#F5F5F0] font-serif font-medium text-base tracking-wide leading-tight">{ferrari.make} <span className="italic">{ferrari.model}</span></h4>
                    <span className="text-xs font-mono font-medium text-[#F5F5F0] shrink-0">KSH {(ferrari.price / 1000000).toFixed(1)}M</span>
                  </div>
                  <p className="text-[#C2C2BB]/60 text-[10.5px] font-mono">{ferrari.inquiriesCount} Inquiries in 48h</p>
                  <button
                    onClick={() => viewVehicleDetails(ferrari)}
                    className="w-full py-2.5 bg-transparent border border-white/10 text-[#F5F5F0] font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-transparent transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
