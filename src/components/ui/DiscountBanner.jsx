import React from 'react';

export default function DiscountBanner() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden py-2 relative z-40 shadow-sm">
      <div className="flex w-[200%] animate-marquee">
        {[1, 2].map((key) => (
          <div key={key} className="flex-1 flex justify-around whitespace-nowrap px-4">
            <span className="mx-4 font-medium text-sm flex items-center"><span className="mr-2">🎉</span> Flat 10% OFF | Code: <span className="font-bold ml-1">NEW10</span></span>
            <span className="mx-4 font-medium text-sm flex items-center"><span className="mr-2">🚚</span> Free Shipping on ₹2999+</span>
            <span className="mx-4 font-medium text-sm flex items-center"><span className="mr-2">✨</span> Premium Stitching ₹120/panel</span>
            <span className="mx-4 font-medium text-sm flex items-center"><span className="mr-2">📞</span> 24/7 Design Support</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .animate-marquee{display:flex;animation:marquee 30s linear infinite;}
        .animate-marquee:hover{animation-play-state:paused;}
      `}</style>
    </div>
  );
}
