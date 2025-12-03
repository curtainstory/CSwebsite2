import React from 'react';

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1505691938895-1758d7fab530?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&q=80&w=500',
];

export default function GalleryMarquee() {
  return (
    <div className="bg-white py-12 overflow-hidden border-b border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Our Curated Collection</h2>
        <p className="mt-2 text-gray-500">A glimpse into our finest work.</p>
      </div>
      <div className="relative w-full">
        <div className="flex w-[200%] animate-scroll-gallery">
          {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((src, index) => (
            <div key={index} className="w-64 h-64 flex-shrink-0 mx-4 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
              <img src={src} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll-gallery {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .animate-scroll-gallery{animation:scroll-gallery 40s linear infinite;display:flex;}
        .animate-scroll-gallery:hover{animation-play-state:paused;}
      `}</style>
    </div>
  );
}
