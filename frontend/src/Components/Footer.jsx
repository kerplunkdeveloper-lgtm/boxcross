import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#111111] border-t border-white/10">

      <div
        className="
          mt-3
        
          md:px-8

          lg:px-20
          py-10
          flex
          flex-col
          md:flex-row
          items-center
          justify-center
          gap-4
        max-w-[1400px]
          mx-auto
        "
      >

        {/* LEFT */}
        <p
          className="
            text-[#8b8b8b]
            text-center
            md:text-left
            text-[13px]
            md:text-[19px]
          "
          style={{ fontFamily: '"Brutal", sans-serif',  }}
        >
          Copyright © 2026{" "}
          <span className="text-[#d9ff00] font-bold mx-2">
           {" "} Box & Cross
          </span>
          . All Rights Reserved.
        </p>

{/* LEFT */}
        <p
          className="
            text-[#8b8b8b]
            text-center
            md:text-left
            text-[13px]
            md:text-[19px]
          "
          style={{ fontFamily: '"Brutal", sans-serif',  }}
        >
         Developed By
          <span className="text-[#d9ff00] font-bold mx-2">
          Kelpunk Media
          </span>
        </p>


      </div>

    </footer>
  );
};

export default Footer;