import React from 'react';
import { ExternalLink } from 'lucide-react';

const Eventlastcontact = () => {
  return (
    <div className="w-full flex justify-center items-center py-14 px-4">
      <div className="max-w-7xl w-full bg-[#111111] rounded-2xl shadow-sm p-8 md:p-20 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold text-[#e5ff00] mb-7">
          More Exciting Workshops Coming Soon!
        </h2>
        <p className="text-white italic  mb-8 text-sm md:text-base max-w-2xl mx-auto">
          We're constantly adding new workshop formats and events. Have a specific workshop in mind? Let us know and we'll consider it for our next schedule!
        </p>
        <button 
          onClick={() => window.open('https://wa.me/918925556900', '_blank')}
          className="inline-block card-border-spin-container rounded-md p-[3px] shadow-md transition-transform hover:scale-105 cursor-pointer"
          style={{ '--spin-glow-color': '#e5ff00' }}
        >
          <div className="card-border-spin-inner !flex-row items-center justify-center gap-2 px-6 py-3 font-semibold text-white hover:bg-neutral-900 transition-colors">
            <ExternalLink size={20} />
            <span>Contact WhatsApp's up</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Eventlastcontact;