import React from 'react';

export default function PrayerCard({ name, time }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-white shadow-sm border border-[#88dbd3]">
      <div className="font-semibold text-[#045362]">{name}</div>
      <div className="text-[#037084] font-bold tracking-wide">{time}</div>
    </div>
  );
}
