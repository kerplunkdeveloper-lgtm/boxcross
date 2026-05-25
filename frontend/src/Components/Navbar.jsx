import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, Menu, X, Grid3x3, Phone, Mail, MapPin } from 'lucide-react';
import gsap from 'gsap';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const gridIconRef = useRef(null);

  // Desktop dropdown menus
  const dropdownMenus = {
    arena: {
      label: 'THE ARENA',
      items: [
        { name: 'Arena Overview', path: '/about' },
        { name: 'Facilities', path: '/about#facilities' },
        { name: 'Schedule', path: '/about#schedule' }
      ]
    },

    community: {
      label: 'COMMUNITY',
      items: [
        { name: 'Events', path: '/contact' },
        { name: 'Success Stories', path: '/#stories' },
        { name: 'Community Forum', path: '/contact' }
      ]
    },
    memberships: {
      label: 'MEMBERSHIPS',
      items: [
        { name: 'FIGHT CLUB', path: 'https://boxandcross.com/fight-club/' },
        { name: 'STRENGTH LAB', path: 'https://boxandcross.com/strength-lab/' },
        { name: 'HYBRID PERFORMANCE', path: 'https://boxandcross.com/hybrid-performance/' },
        { name: 'FIGHT PERFORMANCE', path: 'https://boxandcross.com/fight-performance/' },
        { name: 'HYROX LAB', path: 'https://boxandcross.com/hyrox-lab/' },
        { name: 'JUNIOR ATHLETES', path: 'https://boxandcross.com/junior-athletes/' },
        { name: '1:1 COACHING', path: 'https://boxandcross.com/1-1-coaching/' }
      ]
    }
  };

  const mainLinks = [
    { name: 'COACHING', path: 'https://boxandcross.com/coaching/' },
    { name: 'CONTACT US', path: 'https://boxandcross.com/contact-us/' },
  ];

  const arenaDropdown = [
    { name: 'BRAND STORY', path: 'https://boxandcross.com/brand-story/' },
    { name: 'FACILITY', path: 'https://boxandcross.com/facility/' },
    { name: 'PHILOSOPHY', path: 'https://boxandcross.com/philosophy/' },
    { name: 'WHY BXC', path: 'https://boxandcross.com/why-bxc/' },
  ];

  const communityDropdown = [
    { name: 'EVENTS', path: 'https://boxandcross.com/events/' },
    { name: 'CHALLENGES', path: 'https://boxandcross.com/challenges/' },
    { name: 'LEADERBOARDS', path: 'https://boxandcross.com/leaderboards/' },
    { name: 'FIGHT NIGHTS', path: 'https://boxandcross.com/fight-nights/' },
  ];

  const membershipDropdown = [
    { name: 'FIGHT CLUB', path: 'https://boxandcross.com/fight-club/' },
    { name: 'STRENGTH LAB', path: 'https://boxandcross.com/strength-lab/' },
    { name: 'HYBRID PERFORMANCE', path: 'https://boxandcross.com/hybrid-performance/' },
    { name: 'FIGHT PERFORMANCE', path: 'https://boxandcross.com/fight-performance/' },
    { name: 'HYROX LAB', path: 'https://boxandcross.com/hyrox-lab/' },
    { name: 'JUNIOR ATHLETES', path: 'https://boxandcross.com/junior-athletes/' },
    { name: '1:1 COACHING', path: 'https://boxandcross.com/1-1-coaching/' },
  ];





  // Handle desktop dropdown hover
  const handleDropdownEnter = (dropdown) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Toggle mobile dropdown
  const toggleMobileDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  // Animate grid icon
  useEffect(() => {
    if (gridIconRef.current) {
      gsap.to(gridIconRef.current, {
        rotation: offcanvasOpen ? 90 : 0,
        duration: 0.4,
        ease: 'power2.inOut'
      });
    }
  }, [offcanvasOpen]);

  return (
    <div className="md:px-10 px-2 mt-4 relative">
      {/* Main Navbar */}
      <nav className="relative rounded-2xl z-[50] bg-black backdrop-blur-sm border-b border-[#a3ff00]/20">
        <div className="px-4 md:px-6 py-2.5">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 group cursor-pointer flex-shrink-0">
               <img src={logo} alt="Box & Cross" className='w-28 md:w-32' />
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {/* HOME */}
              <a href="https://boxandcross.com/" className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-white transition-colors duration-300 uppercase tracking-wider">
                HOME
              </a>

              {/* THE ARENA Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('arena')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-white transition-colors duration-300 uppercase tracking-wider flex items-center gap-1">
                  THE ARENA
                  <ChevronDown size={13} className={`transition-transform duration-300 ${openDropdown === 'arena' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'arena' && (
                  <div className="absolute left-0 top-full mt-3 w-52 bg-[#fbfbfb] shadow-2xl flex flex-col z-50 rounded-b-xl overflow-hidden ">
                    {arenaDropdown.map((item, idx) => (
                      <a key={item.name} href={item.path} onClick={() => setOpenDropdown(null)}
                        className={`group/item px-5 py-3.5 text-[10px] tracking-widest text-black bg-[#fbfbfb] flex items-center transition-colors duration-200 uppercase ${
                          idx !== arenaDropdown.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <span className="w-0 overflow-hidden group-hover/item:w-4 group-hover/item:mr-2 h-[2px] bg-black transition-all duration-300"></span>
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* COACHING - 3rd item */}
              <a href="https://boxandcross.com/coaching/"
                className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-white transition-colors duration-300 uppercase tracking-wider"
              >
                COACHING
              </a>

              {/* COMMUNITY Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('community')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-white transition-colors duration-300 uppercase tracking-wider flex items-center gap-1">
                  COMMUNITY
                  <ChevronDown size={13} className={`transition-transform duration-300 ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'community' && (
                  <div className="absolute left-0 top-full mt-3 w-52 bg-[#fbfbfb] shadow-2xl flex flex-col z-50 rounded-b-xl overflow-hidden ">
                    {communityDropdown.map((item, idx) => (
                      <a key={item.name} href={item.path} onClick={() => setOpenDropdown(null)}
                        className={`group/item px-5 py-3.5 text-[10px] tracking-widest text-black bg-[#fbfbfb]  flex items-center transition-colors duration-200 uppercase ${
                          idx !== communityDropdown.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <span className="w-0 overflow-hidden group-hover/item:w-4 group-hover/item:mr-2 h-[2px] bg-black transition-all duration-300"></span>
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Rest of links */}
              {/* MEMBERSHIP Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('membership')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-white transition-colors duration-300 uppercase tracking-wider flex items-center gap-1">
                  MEMBERSHIP
                  <ChevronDown size={13} className={`transition-transform duration-300 ${openDropdown === 'membership' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'membership' && (
                  <div className="absolute left-0 top-full mt-3 w-56 bg-[#fbfbfb] shadow-2xl flex flex-col z-50 rounded-b-xl overflow-hidden ">
                    {membershipDropdown.map((item, idx) => (
                      <a key={item.name} href={item.path} onClick={() => setOpenDropdown(null)}
                        className={`group/item px-5 py-3.5 text-[10px] tracking-widest text-black bg-[#fbfbfb]  flex items-center transition-colors duration-200 uppercase ${
                          idx !== membershipDropdown.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <span className="w-0 overflow-hidden group-hover/item:w-4 group-hover/item:mr-2 h-[2px] bg-black transition-all duration-300"></span>
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* CONTACT US */}
              <a href="https://boxandcross.com/contact-us/"
                className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-white transition-colors duration-300 uppercase tracking-wider"
              >
                CONTACT US
              </a>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3 ml-auto">
           {/* CTA Button */}
<a href="https://boxandcross.com/contact-us/" target="_blank" rel="noopener noreferrer" className="hidden lg:block relative overflow-hidden px-4 py-3 bg-[#defb02] text-black font-bold uppercase text-xs tracking-wider rounded-lg group transition-all duration-300">

  {/* Sliding Background */}
  <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>

  {/* Button Text */}
  <span className="relative z-10">
    ENTER THE ARENA
  </span>

</a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-white hover:text-[#a3ff00] hover:bg-[#a3ff00]/10 p-2 rounded transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden bg-black/98 border-t border-[#a3ff00]/20 max-h-[calc(100vh-70px)] overflow-y-auto">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Main Links */}
              <a href="https://boxandcross.com/" onClick={closeMobileMenu} className="block px-4 py-3 text-white hover:text-[#a3ff00] hover:bg-[#a3ff00]/10 transition-colors duration-300 uppercase text-sm font-bold tracking-wide rounded">
                HOME
              </a>

              {/* THE ARENA mobile dropdown */}
              <div>
                <button onClick={() => toggleMobileDropdown('arena')}
                  className="w-full flex items-center justify-between px-4 py-3 text-white hover:text-[#a3ff00] hover:bg-[#a3ff00]/10 transition-colors duration-300 uppercase text-sm font-bold tracking-wide rounded"
                >
                  <span>THE ARENA</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${openDropdown === 'arena' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'arena' && (
                  <div className="bg-[#a3ff00]/5 border-l-4 border-[#a3ff00] ml-2 my-1 rounded">
                    {arenaDropdown.map(item => (
                      <a key={item.name} href={item.path} onClick={closeMobileMenu}
                        className="block px-6 py-2.5 text-gray-300 hover:text-[#a3ff00] hover:bg-[#a3ff00]/10 transition-colors text-sm border-b border-[#a3ff00]/10 last:border-b-0 uppercase font-semibold tracking-wider"
                      >{item.name}</a>
                    ))}
                  </div>
                )}
              </div>

              {/* COMMUNITY mobile dropdown */}
              <div>
                <button onClick={() => toggleMobileDropdown('community')}
                  className="w-full flex items-center justify-between px-4 py-3 text-white hover:text-[#a3ff00] hover:bg-[#a3ff00]/10 transition-colors duration-300 uppercase text-sm font-bold tracking-wide rounded"
                >
                  <span>COMMUNITY</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'community' && (
                  <div className="bg-[#a3ff00]/5 border-l-4 border-[#a3ff00] ml-2 my-1 rounded">
                    {communityDropdown.map(item => (
                      <a key={item.name} href={item.path} onClick={closeMobileMenu}
                        className="block px-6 py-2.5 text-gray-300 hover:text-[#a3ff00] hover:bg-[#a3ff00]/10 transition-colors text-sm border-b border-[#a3ff00]/10 last:border-b-0 uppercase font-semibold tracking-wider"
                      >{item.name}</a>
                    ))}
                  </div>
                )}
              </div>

              {/* MEMBERSHIP mobile dropdown */}
              <div>
                <button onClick={() => toggleMobileDropdown('membership')}
                  className="w-full flex items-center justify-between px-4 py-3 text-white transition-colors duration-300 uppercase text-sm font-bold tracking-wide rounded"
                >
                  <span>MEMBERSHIP</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${openDropdown === 'membership' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'membership' && (
                  <div className="border-l-4 ml-2 my-1 rounded">
                    {membershipDropdown.map(item => (
                      <a key={item.name} href={item.path} onClick={closeMobileMenu}
                        className="block px-6 py-2.5 text-gray-300 transition-colors text-sm last:border-b-0 uppercase  tracking-wider"
                      >{item.name}</a>
                    ))}
                  </div>
                )}
              </div>

              {mainLinks.map((link) => (
                <a key={link.name} href={link.path} onClick={closeMobileMenu}
                  className="block px-4 py-3 text-white transition-colors duration-300 uppercase text-sm font-bold tracking-wide rounded"
                >{link.name}</a>
              ))}

              <div className="border-t border-[#a3ff00]/20 my-2"></div>

              {/* Mobile CTA Button */}
              <a href="https://boxandcross.com/contact-us/" target="_blank" rel="noopener noreferrer" className="block w-full px-4 py-3 bg-[#a3ff00] text-black font-bold uppercase text-sm tracking-wider rounded hover:scale-105 transition-all duration-300 mt-2 text-center">
                ENTER THE ARENA
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
