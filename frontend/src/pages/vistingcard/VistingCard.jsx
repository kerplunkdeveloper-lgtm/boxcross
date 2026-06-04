import React from 'react';
import { Phone, Globe, Mail, MapPin, Share2 } from 'lucide-react';
import { FaFacebook, FaLinkedin, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import cover  from "../../assets/cover.jpg"

const VistingCard = () => {
  return (
    <div className="min-h-screen bg-black flex font-sans">
      {/* Main Container - Mobile Stacked, Desktop Two Columns */}
      <div className="w-full min-h-screen bg-white flex flex-col md:flex-row shadow-2xl">
        
        {/* Left Column - Card Details (Dark Blue) */}
        <div className="w-full md:w-1/2 bg-[#0c0850] text-white flex flex-col relative">
          
          {/* Top Banner Area */}
          <div className="relative h-48 md:h-64 p-2 flex">
            {/* Share Icon */}
            <div className="absolute top-4 right-4 z-10 text-white flex items-center text-xs font-semibold cursor-pointer hover:text-gray-300 drop-shadow-md">
              Share <Share2 className="w-4 h-4 ml-1" />
            </div>

            {/* Full width cover image */}
            <div className="w-full  h-full bg-cover bg-center" style={{ backgroundImage: `url(${cover})` }}>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="flex justify-center -mt-12 md:-mt-16 relative z-10">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#0c0850] bg-orange-400 overflow-hidden shadow-lg relative">
              <div className="absolute inset-0 border-4 border-yellow-500 rounded-full"></div>
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" alt="Vasanth Raju" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>

          {/* Name & Title */}
          <div className="text-center mt-3 mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold">Vasanth Raju</h2>
            <p className="text-sm md:text-base font-medium text-gray-300">Managing Director</p>
          </div>

          {/* Contact Icons Grid */}
          <div className="grid grid-cols-4 gap-y-8 gap-x-4 px-4 md:px-12 mb-12">
            <IconBox icon={<Phone />} label="Phone" />
            <IconBox icon={<FaWhatsapp />} label="Whatsapp" />
            <IconBox icon={<Globe />} label="Website" />
            <IconBox icon={<Mail />} label="Mail" />
            
            <IconBox icon={<MapPin />} label="Location" />
            <IconBox icon={<FaLinkedin />} label="LinkedIn" />
            <IconBox icon={<FaFacebook />} label="Facebook" />
            <IconBox icon={<FaYoutube />} label="Youtube" />
          </div>

          {/* Google Review */}
          <div className="flex justify-center items-center mb-8 md:mb-12 text-sm md:text-base font-semibold cursor-pointer hover:text-gray-300">
            Review us on Google &gt;&gt; 
            <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" className="w-5 h-5 md:w-6 md:h-6 ml-2 bg-white rounded-full p-0.5" />
          </div>
          
        </div>

        {/* Right Column - Form & QR (White) */}
        <div className="w-full md:w-1/2 bg-white text-gray-800 flex flex-col justify-between">
          <div className="p-8 md:p-12 lg:p-16 flex-grow">
            <div className="flex items-start justify-between mb-8">
              <div className="text-[#0c0850] font-bold text-lg md:text-xl leading-tight">
                Send Vasanth Raju your<br/>contact details.
              </div>
              <svg className="w-6 h-6 text-gray-300 transform rotate-45" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v2.1l1.22 1.22a2 2 0 01.58 1.41V14a1 1 0 01-1 1H8a1 1 0 01-1-1V7.73a2 2 0 01.58-1.41L8.8 5.1V3a1 1 0 011-1z" />
              </svg>
            </div>

            <form className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wide">Name</label>
                  <input type="text" placeholder="First Name" className="w-full bg-[#f4f5f7] border-none rounded-md p-3.5 text-sm focus:ring-2 focus:ring-[#0c0850] outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wide">Company Name</label>
                  <input type="text" placeholder="Company Name" className="w-full bg-[#f4f5f7] border-none rounded-md p-3.5 text-sm focus:ring-2 focus:ring-[#0c0850] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wide">Email Address *</label>
                <input type="email" placeholder="Email" required className="w-full bg-[#f4f5f7] border-none rounded-md p-3.5 text-sm focus:ring-2 focus:ring-[#0c0850] outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wide">Phone</label>
                <input type="tel" placeholder="Phone" className="w-full bg-[#f4f5f7] border-none rounded-md p-3.5 text-sm focus:ring-2 focus:ring-[#0c0850] outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wide">I want a quote for</label>
                <div className="relative">
                  <select className="w-full bg-[#f4f5f7] border-none rounded-md p-3.5 text-sm focus:ring-2 focus:ring-[#0c0850] outline-none text-gray-600 appearance-none">
                    <option>Choose an option</option>
                    <option>Digital Marketing</option>
                    <option>Web Development</option>
                    <option>SEO</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button type="submit" className="bg-[#0c0850] text-white font-bold py-3 px-12 rounded-full hover:bg-blue-900 transition-colors text-sm tracking-widest shadow-lg">
                  SUBMIT
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#fafafa] p-8 flex flex-col items-center border-t border-gray-100">
            <h3 className="text-[#0c0850] font-bold text-sm mb-4">Point the camera at the QR Code</h3>
            <div className="bg-white p-3 border border-gray-200 rounded-xl shadow-sm relative">
               {/* Decorative corner markers for QR feel */}
               <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-black"></div>
               <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-black"></div>
               <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-black"></div>
               <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-black"></div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://vistingcard-example.com" alt="QR Code" className="w-32 h-32 md:w-36 md:h-36 relative z-10 p-2" />
              {/* Optional center logo in QR code */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="bg-white p-1 rounded-full shadow-sm">
                      <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="6">
                        <path d="M50 10 L90 50 L50 90 L10 50 Z" />
                        <path d="M50 10 L50 90" />
                        <path d="M50 50 L90 10" />
                        <path d="M50 50 L90 90" />
                      </svg>
                  </div>
              </div>
            </div>
          </div>
          
          {/* Footer Bar for Pay Us */}
          <div className="bg-[#0c0850] w-full p-4 md:p-6 flex justify-center">
            <button className="bg-white text-[#0c0850] font-extrabold py-2 px-8 rounded-full text-sm flex items-center hover:bg-gray-100 transition-colors shadow-lg tracking-wider">
              PAY US <span className="ml-2 font-black text-lg">$</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

const IconBox = ({ icon, label }) => (
  <div className="flex flex-col items-center cursor-pointer group">
    <div className="mb-2 text-white group-hover:scale-110 transition-transform duration-200">
      {React.cloneElement(icon, { className: "w-8 h-8 md:w-10 md:h-10", strokeWidth: 1.5 })}
    </div>
    <span className="text-[10px] md:text-xs font-medium tracking-wide">{label}</span>
  </div>
);

export default VistingCard;