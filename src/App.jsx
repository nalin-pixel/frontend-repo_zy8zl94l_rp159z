import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import MenuCard from './components/MenuCard';
import PrayerCard from './components/PrayerCard';
import QiblaCompass from './components/QiblaCompass';

// Helper: format number to 2 digits
const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);

export default function App() {
  const [active, setActive] = useState('home');
  const [coords, setCoords] = useState(null);
  const [timings, setTimings] = useState(null);
  const [qibla, setQibla] = useState(0);
  const today = useMemo(() => new Date(), []);

  // Get user location
  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
      },
      () => {
        // fallback Jakarta
        setCoords({ lat: -6.200000, lng: 106.816666 });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // Fetch prayer times from Aladhan when coords ready
  useEffect(() => {
    if (!coords) return;
    const d = today;
    const dateStr = `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${coords.lat}&longitude=${coords.lng}&method=3`;
    fetch(url)
      .then((r) => r.json())
      .then((j) => setTimings(j?.data?.timings || null))
      .catch(() => {});

    // Fetch Qibla bearing
    fetch(`https://api.aladhan.com/v1/qibla/${coords.lat}/${coords.lng}`)
      .then((r) => r.json())
      .then((j) => setQibla(j?.data?.direction || 0))
      .catch(() => {});
  }, [coords, today]);

  return (
    <div className="min-h-screen bg-[#cee2e3] text-slate-800 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#037084] to-[#17c9c3] text-white shadow">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-lg font-semibold">Masjid Kita</h1>
          <p className="text-xs/5 text-white/90">Bantu temukan masjid, jadwal sholat, kiblat, dan kajian terdekat.</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-5">
        {active === 'home' && (
          <div className="space-y-4">
            <section className="rounded-2xl p-4 bg-white shadow border border-[#88dbd3]">
              <h2 className="text-[#045362] font-semibold mb-2">Assalamu'alaikum</h2>
              <p className="text-sm text-slate-600">Selamat datang di Masjid Kita. Pilih menu untuk mulai.</p>
            </section>

            <div className="grid grid-cols-1 gap-3">
              <MenuCard
                type="masjid"
                title="Masjid Terdekat"
                description="Temukan masjid di sekitar Anda"
                onClick={() => setActive('masjid')}
              />
              <MenuCard
                type="jadwal"
                title="Jadwal Sholat"
                description="Waktu sholat harian yang akurat"
                onClick={() => setActive('jadwal')}
              />
              <MenuCard
                type="kiblat"
                title="Arah Kiblat"
                description="Kompas untuk arah Ka'bah"
                onClick={() => setActive('kiblat')}
              />
              <MenuCard
                type="event"
                title="Kajian & Event"
                description="Daftar kajian dan kegiatan Islam"
                onClick={() => setActive('event')}
              />
            </div>
          </div>
        )}

        {active === 'masjid' && (
          <div className="space-y-4">
            <h2 className="text-[#045362] font-semibold">Masjid Terdekat</h2>
            <p className="text-sm text-slate-600">Peta sederhana menggunakan OpenStreetMap tersemat.</p>
            <div className="rounded-2xl overflow-hidden border border-[#88dbd3] shadow">
              <iframe
                title="Peta Masjid"
                className="w-full aspect-[3/4]"
                src={coords ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng-0.02}%2C${coords.lat-0.02}%2C${coords.lng+0.02}%2C${coords.lat+0.02}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}` : 'https://www.openstreetmap.org'}
              />
            </div>
            <p className="text-xs text-slate-500">Gunakan zoom pada peta untuk jelajah area sekitar Anda.</p>
          </div>
        )}

        {active === 'jadwal' && (
          <div className="space-y-4">
            <h2 className="text-[#045362] font-semibold">Jadwal Sholat Hari Ini</h2>
            {!timings ? (
              <div className="text-sm text-slate-600">Memuat jadwal berdasarkan lokasi Anda...</div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <PrayerCard name="Subuh" time={timings.Fajr} />
                <PrayerCard name="Terbit" time={timings.Sunrise} />
                <PrayerCard name="Dzuhur" time={timings.Dhuhr} />
                <PrayerCard name="Ashar" time={timings.Asr} />
                <PrayerCard name="Maghrib" time={timings.Maghrib} />
                <PrayerCard name="Isya" time={timings.Isha} />
              </div>
            )}
          </div>
        )}

        {active === 'kiblat' && (
          <div className="space-y-4">
            <h2 className="text-[#045362] font-semibold">Arah Kiblat</h2>
            <QiblaCompass qiblaBearing={qibla} />
            <div className="text-center text-sm text-slate-600">
              Sudut Kiblat: <span className="font-semibold text-[#037084]">{Math.round(qibla)}°</span>
            </div>
            <p className="text-xs text-slate-500">Aktifkan izin orientasi perangkat jika diminta agar kompas bekerja.</p>
          </div>
        )}

        {active === 'event' && (
          <div className="space-y-4">
            <h2 className="text-[#045362] font-semibold">Kajian & Event</h2>
            <p className="text-sm text-slate-600">Contoh daftar event (statis). Integrasi database dapat ditambahkan kemudian.</p>
            <ul className="space-y-3">
              {[{
                title: 'Kajian Tafsir Juz Amma', speaker: 'Ust. Ahmad', date: 'Minggu, 10 Nov 2025', location: 'Masjid Raya, Jakarta'
              },{
                title: 'Fiqih Muamalah', speaker: 'Ust. Budi', date: 'Sabtu, 16 Nov 2025', location: 'Masjid Al Hidayah, Bandung'
              }].map((e, idx) => (
                <li key={idx} className="rounded-xl p-4 bg-white border border-[#88dbd3] shadow-sm">
                  <div className="text-[#037084] font-semibold">{e.title}</div>
                  <div className="text-xs text-slate-600">{e.speaker}</div>
                  <div className="text-xs text-slate-600">{e.date}</div>
                  <div className="text-xs text-slate-600">{e.location}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <Navbar active={active} onChange={setActive} />
    </div>
  );
}
