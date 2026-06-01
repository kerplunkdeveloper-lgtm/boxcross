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
          justify-between
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
          style={{ fontFamily: '"Brutal Font Light", sans-serif',  }}
        >
          Copyright © 2026{" "}
          <span className="text-[#e5ff00] font-bold mx-2">
           {" "} Box & Cross
          </span>{" "}
          . All Rights Reserved.
        </p>

        {/* RIGHT LINKS */}
        <div
          className="
            flex
            items-center
            flex-wrap 
            justify-center
            gap-4
            md:gap-20
          "
        >

          {[
            "Privacy Policy",
            "Terms of Use",
            "FAQs",
          ].map((item, index) => (
            <button
              key={index}
              className="
                text-[#8b8b8b]
                hover:text-white
                transition-all
                duration-300
                text-[13px]
                md:text-[18px]
              "
              style={{ fontFamily: '"Brutal Font Light", sans-serif'}}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

    </footer>
  );
};

export default Footer;