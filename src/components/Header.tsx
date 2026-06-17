import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, Check, Info } from 'lucide-react';

interface HeaderProps {
  title: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearch?: boolean;
}

export default function Header({ title, searchQuery, setSearchQuery, showSearch = true }: HeaderProps) {
  const [time, setTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', text: 'New lead "Kamau Maina" registered for G63 AMG', type: 'lead', read: false, time: '3m ago' },
    { id: '2', text: 'Mercedes-Benz S580 status set to "Available"', type: 'status', read: false, time: '2h ago' },
    { id: '3', text: 'System diagnostics complete. All systems nominal', type: 'sys', read: true, time: '5h ago' }
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as 12-hour AM/PM with seconds
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const nairobiTimeString = now.toLocaleTimeString('en-US', options);
      setTime(nairobiTimeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-20 flex items-center justify-between px-6 md:px-12 border-b border-white/10 glass-header sticky top-0 z-40 select-none">
      <div>
        <h2 className="font-serif text-xl md:text-2xl italic font-semibold text-[#F5F5F0] tracking-tight flex items-center gap-2">
          {title}
        </h2>
        <p className="font-mono text-[9px] text-[#C2C2BB]/60 uppercase tracking-[0.2em] mt-1">
          System operational • Nairobi {time || '05:24:18 AM'} GMT+3
        </p>
      </div>

      <div className="flex items-center gap-6">
        {showSearch && (
          <div className="hidden lg:flex items-center bg-white/[0.02] rounded-none px-4 py-1.5 border border-white/10 focus-within:border-white/30 transition-colors">
            <Search className="text-[#C2C2BB]/60 w-3.5 h-3.5 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search VIN, Client, or Order..."
              className="bg-transparent border-none focus:outline-none text-[#F5F5F0] text-[11px] font-mono w-56 placeholder:text-white/30"
            />
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-[#C2C2BB] hover:text-white transition-colors p-2 rounded-none hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0B0B0C] border border-white/10 shadow-2xl p-4 rounded-none z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
                <span className="font-mono text-[9px] text-[#F5F5F0] uppercase font-bold tracking-[0.2em]">Journal Updates ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[9px] font-mono text-white/80 hover:text-white hover:underline flex items-center gap-1 uppercase tracking-wider"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-2 rounded-none flex flex-col gap-1 transition-colors ${
                      notif.read ? 'bg-transparent' : 'bg-white/[0.02] border-l-2 border-white'
                    }`}
                  >
                    <p className="text-xs text-[#F5F5F0] leading-normal">{notif.text}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">{notif.type}</span>
                      <span className="text-[9px] font-mono text-white/40">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
