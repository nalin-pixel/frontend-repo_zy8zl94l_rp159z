import React from 'react';
import { Home, MapPin, Clock, Compass, Calendar } from 'lucide-react';

const tabs = [
  { key: 'home', label: 'Beranda', icon: Home },
  { key: 'masjid', label: 'Masjid', icon: MapPin },
  { key: 'jadwal', label: 'Jadwal', icon: Clock },
  { key: 'kiblat', label: 'Kiblat', icon: Compass },
  { key: 'event', label: 'Event', icon: Calendar },
];

export default function Navbar({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-t border-[#88dbd3]">
      <div className="mx-auto max-w-md grid grid-cols-5">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex flex-col items-center justify-center py-2 text-xs transition-colors ${
                isActive ? 'text-[#037084]' : 'text-slate-500'
              }`}
              aria-label={label}
            >
              <Icon size={20} className="mb-0.5" />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
