import React from 'react';
import { MapPin, Clock, Compass, Calendar } from 'lucide-react';

const icons = {
  masjid: MapPin,
  jadwal: Clock,
  kiblat: Compass,
  event: Calendar,
};

export default function MenuCard({ type = 'masjid', title, description, onClick }) {
  const Icon = icons[type] || MapPin;
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-4 bg-gradient-to-br from-[#037084] to-[#17c9c3] text-white shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-xl">
          <Icon size={22} />
        </div>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-xs/5 text-white/90">{description}</p>
        </div>
      </div>
    </button>
  );
}
