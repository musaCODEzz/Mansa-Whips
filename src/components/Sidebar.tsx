import { LayoutDashboard, Car, Plus, Mail, Settings, Sparkles, ExternalLink } from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  inquiriesCount: number;
  onSwitchToClient?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, inquiriesCount, onSwitchToClient }: SidebarProps) {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inventory' as ActiveTab,
      label: 'Inventory Manager',
      icon: Car,
      badge: null
    },
    {
      id: 'add-vehicle' as ActiveTab,
      label: 'Add New Vehicle',
      icon: Plus,
      badge: null
    },
    {
      id: 'leads' as ActiveTab,
      label: 'Leads / Inquiries',
      icon: Mail,
      badge: inquiriesCount > 0 ? inquiriesCount : null
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-[#050505] border-r border-white/10 p-6 gap-3 z-50 shrink-0 select-none">
      <div className="mb-10 px-2 pt-4">
        <h1 className="font-serif text-2xl font-semibold text-[#F5F5F0] tracking-[0.2em] flex items-center gap-2">
          MANSA
          <Sparkles className="w-3.5 h-3.5 text-white/30 animate-pulse" />
        </h1>
        <p className="text-[9px] font-mono font-medium text-[#C2C2BB]/50 tracking-[0.3em] mt-1.5 uppercase">
          Command Center
        </p>
      </div>

      <nav className="flex flex-col gap-1 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-none transition-all duration-200 text-left ${
                isActive
                  ? 'bg-[#F5F5F0] text-black font-semibold'
                  : 'text-[#C2C2BB]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#C2C2BB]/60 group-hover:text-white transition-colors'}`} />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em]">{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-none font-bold ${
                  isActive ? 'bg-black text-[#F5F5F0]' : 'bg-white/10 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
        <button
          onClick={() => setActiveTab('add-vehicle')}
          className="w-full bg-transparent text-[#F5F5F0] border border-white/20 py-3 rounded-none font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-transparent active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          New Listing
        </button>

        {onSwitchToClient && (
          <button
            onClick={onSwitchToClient}
            className="w-full bg-white text-black py-3 rounded-none font-mono text-[10px] uppercase font-semibold tracking-[0.2em] hover:bg-[#F5F5F0] active:scale-98 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Public Site
          </button>
        )}

        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-9 h-9 rounded-none overflow-hidden border border-white/20">
            <img
              alt="Admin Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcSooCTueKTaQUmb698S4-DV4uuqxUtU8hcjlxoS2hTTDjxFh7LIbFY8k01IZw9NE2mdf94teQvzhB7F-SaNnONYVV_6ScisvZ6vbC3UkZypw45_PNf1CkbygejxKXGVNALtJXWqOsyaKEfweCyXq-5d-CE9qnQj2_ZYdpImN0sZfeI6KpTWUqF2TDqRg9xv7J8Kln-1_8M8IGlOvUNfLu3pC55kijRZUgE5N1VlPvIA5Aodhii2aFCrDmCs1VSMDCDY45Rdks0JDe"
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div>
            <p className="text-[#F5F5F0] font-medium text-xs font-mono tracking-wider">Mansa Admin</p>
            <p className="text-[#C2C2BB]/50 text-[9px] font-mono uppercase tracking-[0.15em] mt-0.5">Superuser</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
