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
        { name: 'FIGHT CLUB', path: '/membership' },
        { name: 'STRENGTH LAB', path: '/membership' },
        { name: 'HYBRID PERFORMANCE', path: '/membership' },
        { name: 'FIGHT PERFORMANCE', path: '/membership' },
        { name: 'HYROX LAB', path: '/membership' },
        { name: 'JUNIOR ATHLETES', path: '/membership' },
        { name: '1:1 COACHING', path: '/membership' }
      ]
    }
  };

  const mainLinks = [
    { name: 'HOME', path: '/' },
    { name: 'COACHING', path: '/trainers' },
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
    <div className="md:px-10 px-2 mt-4 relative z-[100]">
      {/* Main Navbar */}
      <nav className="relative rounded-2xl z-[100] bg-black/95 backdrop-blur-sm border-b border-[#a3ff00]/20">
        <div className="px-4 md:px-6 py-2.5">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 group cursor-pointer flex-shrink-0">
               <img src={logo} alt="Box & Cross" className='w-28 md:w-32' />
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {mainLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-[#a3ff00] transition-colors duration-300 uppercase tracking-wider relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a3ff00] group-hover:w-full transition-all duration-300"></span>
                </NavLink>
              ))}

              {/* Dropdown Items */}
              {Object.entries(dropdownMenus).map(([key, dropdown]) => (
                <div
                  key={key}
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter(key)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-[#a3ff00] transition-colors duration-300 uppercase tracking-wider flex items-center gap-1 group relative">
                    {dropdown.label}
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a3ff00] group-hover:w-full transition-all duration-300"></span>
                  </button>

                  {/* Standard Vertical Dropdown Menu */}
                  {openDropdown === key && (
                    <div className="absolute left-0 top-full mt-4 w-60 bg-[#fbfbfb] shadow-xl flex flex-col animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      {dropdown.items.map((item, idx) => (
                        <NavLink
                          key={item.name}
                          to={item.path}
                          onClick={() => setOpenDropdown(null)}
                          className={`group/item px-6 py-3.5 text-[13px] tracking-wide text-black bg-[#fbfbfb] hover:bg-gray-50 flex items-center transition-colors duration-200 ${
                            idx !== dropdown.items.length - 1 ? 'border-b border-gray-200/80' : ''
                          }`}
                        >
                          <span className="w-0 overflow-hidden group-hover/item:w-6 group-hover/item:mr-3 h-[1.5px] bg-black transition-all duration-300"></span>
                          <span className="uppercase">{item.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3 ml-auto">
           {/* CTA Button */}
<button className="hidden lg:block relative overflow-hidden px-4 py-3 bg-[#defb02] text-black font-bold uppercase text-xs tracking-wider rounded-lg group transition-all duration-300">

  {/* Sliding Background */}
  <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>

  {/* Button Text */}
  <span className="relative z-10">
    ENTER THE ARENA
  </span>

</button>

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
              {/* Main Links */}
              {mainLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-white hover:text-[#a3ff00] hover:bg-[#a3ff00]/10 transition-colors duration-300 uppercase text-sm font-bold tracking-wide rounded"
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="border-t border-[#a3ff00]/20 my-2"></div>

              {/* Mobile Dropdowns */}
              {Object.entries(dropdownMenus).map(([key, dropdown]) => (
                <div key={key}>
                  <button
                    onClick={() => toggleMobileDropdown(key)}
                    className="w-full flex items-center justify-between px-4 py-3 text-white hover:text-[#a3ff00] hover:bg-[#a3ff00]/10 transition-colors duration-300 uppercase text-sm font-bold tracking-wide rounded"
                  >
                    <span>{dropdown.label}</span>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-300 ${openDropdown === key ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Mobile Dropdown Items */}
                  {openDropdown === key && (
                    <div className="bg-[#a3ff00]/5 border-l-4 border-[#a3ff00] ml-2 my-1 rounded">
                      {dropdown.items.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.path}
                          onClick={closeMobileMenu}
                          className="block px-6 py-2.5 text-gray-300 hover:text-[#a3ff00] hover:bg-[#a3ff00]/10 transition-colors duration-300 text-sm border-b border-[#a3ff00]/10 last:border-b-0"
                        >
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="border-t border-[#a3ff00]/20 my-2"></div>

              {/* Mobile CTA Button */}
              <button className="w-full px-4 py-3 bg-[#a3ff00] text-black font-bold uppercase text-sm tracking-wider rounded hover:scale-105 transition-all duration-300 mt-2">
                ENTER THE ARENA
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
