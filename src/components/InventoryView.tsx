import React, { useState } from 'react';
import { Search, Filter, Download, Edit, Trash2, Plus, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Vehicle } from '../types';

interface InventoryViewProps {
  vehicles: Vehicle[];
  onDeleteVehicle: (id: string) => void;
  onDeleteSelectedVehicles: (ids: string[]) => void;
  onUpdateVehicleStatus: (id: string, status: 'Available' | 'Reserved' | 'Sold') => void;
  onMarkSelectedAsSold: (ids: string[]) => void;
  viewVehicleDetails: (v: Vehicle) => void;
  openEditModal: (v: Vehicle) => void;
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'add-vehicle' | 'leads' | 'settings') => void;
}

export default function InventoryView({
  vehicles,
  onDeleteVehicle,
  onDeleteSelectedVehicles,
  onUpdateVehicleStatus,
  onMarkSelectedAsSold,
  viewVehicleDetails,
  openEditModal,
  setActiveTab
}: InventoryViewProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleCheckboxChange = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredVehicles.map(v => v.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected vehicles?`)) {
      onDeleteSelectedVehicles(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleMarkAsSold = () => {
    onMarkSelectedAsSold(selectedIds);
    setSelectedIds([]);
  };

  const handleStatusChange = (id: string, newStatus: 'Available' | 'Reserved' | 'Sold') => {
    onUpdateVehicleStatus(id, newStatus);
  };

  const handleDeleteVehicle = (id: string, model: string) => {
    if (window.confirm(`Delete ${model} from the virtual inventory?`)) {
      onDeleteVehicle(id);
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  // Filter & search
  const filteredVehicles = vehicles.filter(v => {
    const q = search.toLowerCase();
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.vin.toLowerCase().includes(q) ||
      v.color.toLowerCase().includes(q)
    );
  });

  // Pagination
  const totalItems = filteredVehicles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);

  const formatPriceKSH = (val: number) => {
    return `KSH ${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200 select-none">
      
      {/* Filter & Bulk Actions Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#0B0B0C] border border-white/10 p-4 rounded-none shadow-2xl">
        
        {/* Search Bar */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C2C2BB]/50 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by VIN, Model, Make..."
            className="w-full bg-white/[0.01] border border-white/10 focus:border-white/30 focus:ring-0 text-[#F5F5F0] pl-11 pr-4 py-2.5 font-mono text-[11px] rounded-none transition-colors placeholder:text-white/20"
          />
        </div>

        {/* Bulk Actions / Controls */}
        <div className="md:col-span-6 flex justify-end items-center gap-3">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3 bg-white/[0.02] p-1.5 px-3 rounded-none border border-white/10 animate-in slide-in-from-right-2 duration-300">
              <span className="font-mono text-[#C2C2BB]/60 text-[9px] uppercase tracking-[0.2em]">
                {selectedIds.length} selected
              </span>
              <button
                onClick={handleMarkAsSold}
                className="px-3 py-1 bg-white text-black font-mono text-[9px] uppercase font-semibold border border-transparent hover:opacity-90 transition-all rounded-none"
              >
                Mark as Sold
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 border border-white/25 text-white hover:bg-white/5 font-mono text-[9px] uppercase font-semibold transition-all rounded-none"
              >
                Delete
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setSearch(''); setSelectedIds([]); }}
              className="p-2 text-[#C2C2BB]/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-none transition-colors"
              title="Reset Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert('Exporting high-resolution inventory PDF reports to local storage...')}
              className="p-2 text-[#C2C2BB]/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-none transition-colors"
              title="Download Report"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#0B0B0C] border border-white/10 rounded-none overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.01]">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedVehicles.length > 0 && paginatedVehicles.every(v => selectedIds.includes(v.id))}
                    onChange={handleSelectAllChange}
                    className="w-4 h-4 bg-transparent border-white/20 focus:ring-0 cursor-pointer accent-white"
                  />
                </th>
                <th className="p-4 font-mono text-[9px] text-[#C2C2BB]/70 uppercase tracking-[0.2em] font-semibold">Image</th>
                <th className="p-4 font-mono text-[9px] text-[#C2C2BB]/70 uppercase tracking-[0.2em] font-semibold">VIN</th>
                <th className="p-4 font-mono text-[9px] text-[#C2C2BB]/70 uppercase tracking-[0.2em] font-semibold">Make / Model</th>
                <th className="p-4 font-mono text-[9px] text-[#C2C2BB]/70 uppercase tracking-[0.2em] font-semibold">Price</th>
                <th className="p-4 font-mono text-[9px] text-[#C2C2BB]/70 uppercase tracking-[0.2em] font-semibold">Status</th>
                <th className="p-4 font-mono text-[9px] text-[#C2C2BB]/70 uppercase tracking-[0.2em] font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs divide-y divide-white/5">
              {paginatedVehicles.length > 0 ? (
                paginatedVehicles.map((vehicle) => {
                  const isChecked = selectedIds.includes(vehicle.id);
                  let statusColorClass = 'text-white font-medium';
                  if (vehicle.status === 'Reserved') statusColorClass = 'text-white/40';
                  if (vehicle.status === 'Sold') statusColorClass = 'text-white/20';

                  return (
                    <tr
                      key={vehicle.id}
                      className={`hover:bg-white/[0.01] transition-all duration-150 group/row ${isChecked ? 'bg-white/[0.02]' : ''}`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(vehicle.id)}
                          className="w-4 h-4 bg-transparent border-white/20 focus:ring-0 cursor-pointer accent-white"
                        />
                      </td>
                      <td className="p-4">
                        <div
                          onClick={() => viewVehicleDetails(vehicle)}
                          className="w-24 h-14 rounded-none overflow-hidden bg-black border border-white/10 group-hover/row:border-white/30 transition-colors cursor-zoom-in group"
                        >
                          <img
                            src={vehicle.image}
                            alt={vehicle.model}
                            className="w-full h-full object-cover grayscale brightness-95 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                          />
                        </div>
                      </td>
                      <td className="p-4 text-[#C2C2BB]/60 tracking-tight">{vehicle.vin}</td>
                      <td className="p-4">
                        <div className="font-serif font-medium text-[#F5F5F0] text-sm group-hover/row:text-white transition-colors">
                          {vehicle.make} <span className="italic">{vehicle.model}</span>
                        </div>
                        <div className="text-[9px] text-[#C2C2BB]/40 uppercase tracking-[0.2em] mt-0.5">
                          {vehicle.year} • {vehicle.color}
                        </div>
                      </td>
                      <td className="p-4 font-serif font-medium text-white text-sm">
                        {formatPriceKSH(vehicle.price)}
                      </td>
                      <td className="p-4">
                        <select
                          value={vehicle.status}
                          onChange={(e) => handleStatusChange(vehicle.id, e.target.value as any)}
                          className={`bg-[#0B0B0C] border border-white/10 text-[9px] uppercase py-1.5 px-2.5 tracking-[0.15em] rounded-none font-mono focus:ring-0 focus:border-white/30 transition-colors ${statusColorClass}`}
                        >
                          <option value="Available" className="bg-[#0B0B0C] text-[#F5F5F0]">Available</option>
                          <option value="Reserved" className="bg-[#0B0B0C] text-white/50">Reserved</option>
                          <option value="Sold" className="bg-[#0B0B0C] text-white/20">Sold</option>
                        </select>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => openEditModal(vehicle)}
                          className="p-1.5 hover:bg-white/5 rounded-none text-[#C2C2BB]/60 hover:text-white border border-transparent hover:border-white/10 transition-colors"
                          title="Edit Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id, `${vehicle.make} ${vehicle.model}`)}
                          className="p-1.5 hover:bg-white/5 rounded-none text-[#C2C2BB]/60 hover:text-red-300 border border-transparent hover:border-white/10 transition-colors"
                          title="Remove from Inventory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-12 text-[#C2C2BB]/40 font-mono text-[11px] uppercase tracking-wider">
                    No matching vehicles found in the Mansa inventory cache.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-[#0B0B0C] border border-white/10 p-4 rounded-none shadow-2xl font-mono text-[11px]">
        <p className="text-[#C2C2BB]/50">
          Showing <span className="text-[#F5F5F0] font-semibold">{totalItems === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-[#F5F5F0] font-semibold">{totalItems}</span> vehicles
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="w-8 h-8 flex items-center justify-center border border-white/10 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent rounded-none text-[#C2C2BB] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-none font-medium transition-all ${
                currentPage === idx + 1
                  ? 'bg-[#F5F5F0] text-black font-semibold'
                  : 'border border-white/10 text-[#C2C2BB] hover:bg-white/5'
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="w-8 h-8 flex items-center justify-center border border-white/10 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent rounded-none text-[#C2C2BB] transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
