import React, { useEffect } from "react";

const Preloader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.isPreloaderDone = true;
      onComplete();
      window.dispatchEvent(new Event("preloaderComplete"));
    }, 2000); // 2 seconds loading

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute w-16 h-16 rounded-full border-[3px] border-transparent border-l-white border-b-[#e5ff00] animate-spin-slow"></div>

        {/* Middle Ring */}
        <div className="absolute w-11 h-11 rounded-full border-[3px] border-transparent border-r-white border-t-[#e5ff00] animate-spin-reverse"></div>

        {/* Inner Ring */}
        <div className="absolute w-6 h-6 rounded-full border-[3px] border-transparent border-l-white border-b-[#e5ff00] animate-spin-fast"></div>
      </div>

      <style>
        {`
          @keyframes spin-forward {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spin-backward {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          
          .animate-spin-slow {
            animation: spin-forward 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          }
          
          .animate-spin-reverse {
            animation: spin-backward 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          }
          
          .animate-spin-fast {
            animation: spin-forward 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Preloader;
