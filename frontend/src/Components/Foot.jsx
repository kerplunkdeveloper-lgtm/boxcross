import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import logo from '../assets/images/logo.png'

const Foot = () => {
  return (
    <footer className="w-full bg-[#111111] border-t border-white/10 overflow-hidden">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

        {/* COLUMN 1 */}
        <div className="px-6 md:px-8 py-10 lg:py-12 border-b lg:border-b-0 lg:border-r border-white/10">

          {/* LOGO */}
          <img
            src={logo} // replace with your logo
            alt="logo"
            className="w-[140px] object-contain"
          />

          {/* DESCRIPTION */}
          <p className="text-[#9b9b9b] text-[13px] md:text-sm leading-[1.6] mt-6 max-w-[340px]">
            Stay connected and motivated by joining our newsletter
            Get exclusive fitness tips, workout guides.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4 mt-8">

            <a
              href="/"
              className="
                w-[36px]
                h-[36px]
                rounded-full
                border
                border-white/10
                flex
                items-center
                justify-center
                text-white
                hover:bg-[#d9ff00]
                hover:text-black
                transition-all
                duration-300
              "
            >
              <FaFacebookF size={14} />
            </a>

            <a
              href="/"
              className="
                w-[36px]
                h-[36px]
                rounded-full
                border
                border-white/10
                flex
                items-center
                justify-center
                text-white
                hover:bg-[#d9ff00]
                hover:text-black
                transition-all
                duration-300
              "
            >
              <FaInstagram size={14} />
            </a>

          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="px-6 md:px-8 py-10 lg:py-12 border-b lg:border-b-0 lg:border-r border-white/10">

          <h3 className="text-white text-lg font-extrabold uppercase tracking-wide">
            Memberships
          </h3>

          <ul className="mt-6 space-y-4">

            {[
              "Fight Club",
              "Strength Lab",
              "Hybrid Performance",
              "Fight Performance",
              "HYROX Lab",
              "Junior Athletes",
            ].map((item, index) => (
              <li
                key={index}
                className="
                  flex
                  items-center
                  gap-3
                  text-[#b3b3b3]
                  text-[13px] md:text-sm
                  hover:text-[#d9ff00]
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >
                <span className="text-[#7a7a7a] text-[16px]">›</span>
                {item}
              </li>
            ))}

          </ul>
        </div>

        {/* COLUMN 3 */}
        <div className="px-6 md:px-8 py-10 lg:py-12 border-b lg:border-b-0 lg:border-r border-white/10">

          <h3 className="text-white text-lg font-extrabold uppercase tracking-wide">
            Opening Hours
          </h3>

          <div className="mt-6 space-y-6">

            <div>
              <p className="text-[#b3b3b3] text-[13px] md:text-sm leading-[1.6]">
                Morning <span className="font-semibold text-white">05:00 Am -</span>
              </p>

              <p className="text-[#b3b3b3] text-[13px] md:text-sm leading-[1.6]">
                <span className="font-semibold text-white">12:00 Pm</span>
              </p>
            </div>

            <div>
              <p className="text-[#b3b3b3] text-[13px] md:text-sm leading-[1.6]">
                Evening <span className="font-semibold text-white">04:00 Pm -</span>
              </p>

              <p className="text-[#b3b3b3] text-[13px] md:text-sm leading-[1.6]">
                <span className="font-semibold text-white">10:00 Pm</span>
              </p>
            </div>

          </div>
        </div>

        {/* COLUMN 4 */}
        <div className="px-6 md:px-8 py-10 lg:py-12">

          <h3 className="text-white text-lg font-extrabold uppercase tracking-wide">
            Location
          </h3>

          <div className="mt-6 space-y-6">

            <p className="text-[#b3b3b3] text-[13px] md:text-sm leading-[1.6] max-w-[300px]">
              No. 69, Church Street, Krishna Nagar, Lawspet,
              Pondicherry, Pondicherry - 605008
            </p>

            <div className="space-y-4">

              <p className="text-[#b3b3b3] text-[13px] md:text-sm hover:text-[#d9ff00] transition-all duration-300 cursor-pointer">
                hello@boxandcross.com
              </p>

              <p className="text-[#b3b3b3] text-[13px] md:text-sm hover:text-[#d9ff00] transition-all duration-300 cursor-pointer">
                +91 89255 56900
              </p>

            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Foot;