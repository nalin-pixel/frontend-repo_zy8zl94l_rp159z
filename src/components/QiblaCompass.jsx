import React, { useEffect, useRef, useState } from 'react';

export default function QiblaCompass({ qiblaBearing = 0 }) {
  const [alpha, setAlpha] = useState(0);
  const dialRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      const a = typeof e.alpha === 'number' ? e.alpha : 0;
      setAlpha(a);
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS
        DeviceOrientationEvent.requestPermission().then((res) => {
          if (res === 'granted') {
            window.addEventListener('deviceorientation', handle, true);
          }
        });
      } else {
        window.addEventListener('deviceorientation', handle, true);
      }
    }
    return () => window.removeEventListener('deviceorientation', handle, true);
  }, []);

  const rotation = qiblaBearing - alpha; // rotate dial so arrow points to Qibla

  return (
    <div className="w-full aspect-square max-w-xs mx-auto">
      <div
        ref={dialRef}
        className="relative w-full h-full rounded-full bg-gradient-to-br from-[#cee2e3] to-[#88dbd3] border-4 border-white shadow-inner flex items-center justify-center"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[#045362] text-xs font-semibold">N</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[#045362] text-xs font-semibold">S</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[#045362] text-xs font-semibold">W</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#045362] text-xs font-semibold">E</div>
        <div className="w-1 h-1/3 bg-[#037084] rounded-full" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-[18px] border-l-transparent border-r-transparent border-b-[#17c9c3]" />
      </div>
    </div>
  );
}
