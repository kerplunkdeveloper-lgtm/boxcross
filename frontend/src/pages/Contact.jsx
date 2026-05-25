import React, { useState } from 'react';

// SVGs
const LocationIcon = () => <svg viewBox="0 0 24 24" fill="black" className="w-6 h-6"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" fill="black" className="w-6 h-6"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>;
const PhoneIcon = () => <svg viewBox="0 0 24 24" fill="black" className="w-6 h-6"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24" fill="black" className="w-6 h-6"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
const InfoIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>;
const ChevronDown = ({ isOpen }) => <svg viewBox="0 0 24 24" fill="none" stroke="#a3ff00" strokeWidth="3" className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>;

const FbIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7v-3h3V9.5C10 7.57 11.57 6 13.5 6c.86 0 1.72.16 1.72.16V9h-1c-.96 0-1.22.6-1.22 1.18V12h3.08l-.49 3h-2.59v6.8C18.56 20.87 22 16.84 22 12z"/></svg>;
const YtIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>;
const InstaIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.3-1.46.72-2.12 1.38-.66.66-1.08 1.33-1.38 2.12-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.63.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.12-1.38.66-.66 1.08-1.33 1.38-2.12.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.12-.66-.66-1.33-1.08-2.12-1.38-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1018.16 12 6.16 6.16 0 0012 5.84zm0 10.16A4 4 0 1116 12a4 4 0 01-4 4zm5.8-10.3a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>;


const InputField = ({ label, placeholder, type = "text", dark = false }) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-xs text-white font-bold">{label}</label>}
    <input 
      type={type} 
      placeholder={placeholder} 
      className={`w-full ${dark ? 'bg-[#0a0a0a]' : 'bg-[#050505]'} border border-[#222] text-sm text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#a3ff00] transition-colors`} 
    />
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#222]">
      <button 
        className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white font-bold text-lg group-hover:text-[#a3ff00] transition-colors">{question}</span>
        <ChevronDown isOpen={isOpen} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-6' : 'max-h-0'}`}>
        <p className="text-gray-400 leading-relaxed text-sm">{answer}</p>
      </div>
    </div>
  )
}

const Contact = () => {
  const faqs = [
    { q: "Why choose us for your fitness journey?", a: "We provide state-of-the-art equipment, certified professional trainers, and a supportive community to ensure you reach your fitness goals effectively and safely." },
    { q: "What are your operating hours?", a: "We are open Monday to Saturday from 5:00 am to 11:00 pm, and on Sundays from 7:00 am to 7:00 pm." },
    { q: "Do you offer personal training?", a: "Yes, we offer tailored personal training sessions with certified coaches who will design a program specifically for your needs and goals." },
    { q: "Is there a membership contract?", a: "We offer both flexible month-to-month options and discounted annual plans to suit your lifestyle. You can choose what works best for you without getting locked in." },
  ];

  return (
    <div className="w-full bg-[#050505] min-h-screen flex flex-col font-sans text-white">
      
      {/* 1. Contact Banner */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image - Styled with green/dark tint similar to "Just Do It" vibe */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop')",
            filter: "grayscale(1) brightness(0.2) sepia(1) hue-rotate(50deg) saturate(3)"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505]"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-4 mt-16">
          <h1 
            className="text-7xl sm:text-8xl md:text-9xl font-black text-white drop-shadow-2xl" 
            style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}
          >
            OUR CONTACT
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-lg mt-4 mb-8 drop-shadow-md px-4 leading-relaxed">
            Reach out to us with any questions or concerns you may have, and we'll be happy to help.
          </p>
          {/* Neon green dashes */}
          <div className="flex gap-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-8 h-1.5 bg-[#a3ff00] transform skew-x-[-30deg] shadow-[0_0_10px_rgba(163,255,0,0.5)]"></div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Contact Details & Form */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
        
        {/* Left Column: Details & Quick Consult */}
        <div className="flex flex-col gap-10">
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2 tracking-widest uppercase">Get in touch</p>
            <h2 className="text-5xl md:text-6xl font-black text-white" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
              OUR CONTACT DETAIL
            </h2>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
              Serious about your fitness? So are we. Visit us or get in touch below.
            </p>
          </div>

          {/* Grid of 4 info boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-6">
            {/* ITEM 1 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#a3ff00] rounded-sm flex items-center justify-center shrink-0">
                <LocationIcon />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white text-xl mb-1" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>GYM STUDIO</span>
                <span className="text-xs text-gray-400 leading-relaxed">2nd and 3rd Floor, KP Landmark,<br/>7th Main, 100ft road,<br/>Indiranagar, Bangalore 560008</span>
              </div>
            </div>
            
            {/* ITEM 2 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#a3ff00] rounded-sm flex items-center justify-center shrink-0">
                <ClockIcon />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white text-xl mb-1" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>WORKING HOURS</span>
                <span className="text-xs text-gray-400 leading-relaxed">Mon-Sat : 5:00 am - 11:00 pm<br/>Sunday : 7:00 am - 7:00 pm</span>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#a3ff00] rounded-sm flex items-center justify-center shrink-0">
                <PhoneIcon />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white text-xl mb-1" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>CALL US</span>
                <span className="text-xs text-gray-400 leading-relaxed">8877221131</span>
              </div>
            </div>

            {/* ITEM 4 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#a3ff00] rounded-sm flex items-center justify-center shrink-0">
                <MailIcon />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white text-xl mb-1" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>EMAIL US</span>
                <span className="text-xs text-gray-400 leading-relaxed">getfit@woohoofitness.com</span>
              </div>
            </div>
          </div>

          {/* Consult Box */}
          <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 sm:p-8 mt-2 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-2 tracking-wide" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>PLEASE CONSULT US HERE</h3>
            <p className="text-xs text-gray-400 mb-6">Need expert advice? Fill in your details for a quick consultancy call.</p>
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Name" className="w-full bg-[#050505] border border-[#222] text-sm text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#a3ff00]" />
              <input type="email" placeholder="Email Address" className="w-full bg-[#050505] border border-[#222] text-sm text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#a3ff00]" />
              <input type="tel" placeholder="Phone Number" className="w-full bg-[#050505] border border-[#222] text-sm text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#a3ff00]" />
              <button className="w-full bg-[#111] hover:bg-[#222] border border-[#333] text-white py-3.5 mt-2 rounded-lg text-xs font-bold transition-colors tracking-widest">SEND CONSULTANCY REQUEST</button>
            </div>
          </div>
        </div>

        {/* Right Column: Send Message Form */}
        <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 sm:p-10 relative overflow-hidden shadow-2xl flex flex-col">
          {/* Top right green accent corner */}
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none">
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#a3ff00] rounded-tr-xl opacity-60"></div>
            <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-[#a3ff00] blur-[100px] opacity-10"></div>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-black text-white mb-2" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>SEND US A MESSAGE</h3>
          <p className="text-xs text-gray-400 mb-8">Have a question? Fill out the form and we'll get right back to you.</p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 flex-grow">
            <InputField label="Your Name *" placeholder="Your name" />
            <InputField label="Phone *" placeholder="Phone number" type="tel" />
            <InputField label="Email Address" placeholder="Your email" type="email" />
            <InputField label="Subject" placeholder="Subject" />
            
            <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
              <label className="text-xs text-white font-bold">Where did you hear about us?</label>
              <div className="relative">
                <select className="w-full bg-[#050505] border border-[#222] text-sm text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#a3ff00] appearance-none">
                  <option value="">Select an option</option>
                  <option value="google">Google Search</option>
                  <option value="social">Social Media</option>
                  <option value="friend">Friend/Family</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDown isOpen={false} />
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
              <label className="text-xs text-white font-bold">Message</label>
              <textarea placeholder="Your message" rows="4" className="w-full bg-[#050505] border border-[#222] text-sm text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#a3ff00] resize-none"></textarea>
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col gap-6 mt-4">
              <button className="bg-[#a3ff00] hover:bg-white text-black font-bold text-sm px-8 py-3.5 w-fit rounded-sm transition-colors tracking-widest uppercase shadow-[0_0_15px_rgba(163,255,0,0.2)]">
                SEND MESSAGE
              </button>
              <div className="flex items-center gap-2 text-[#a3ff00] text-xs font-medium">
                <InfoIcon />
                <span>Limited Consultation Slots Available This Month</span>
              </div>
            </div>
          </form>

          {/* Footer social inside the form box */}
          <div className="mt-10 pt-8 border-t border-[#222] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-white font-black text-xl tracking-wider" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>FOLLOW SOCIAL MEDIA :</span>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 border border-[#333] hover:border-[#a3ff00] rounded-sm flex items-center justify-center text-gray-400 hover:text-[#a3ff00] transition-colors bg-[#050505]">
                <FbIcon />
              </a>
              <a href="#" className="w-10 h-10 border border-[#333] hover:border-[#a3ff00] rounded-sm flex items-center justify-center text-gray-400 hover:text-[#a3ff00] transition-colors bg-[#050505]">
                <YtIcon />
              </a>
              <a href="#" className="w-10 h-10 border border-[#333] hover:border-[#a3ff00] rounded-sm flex items-center justify-center text-gray-400 hover:text-[#a3ff00] transition-colors bg-[#050505]">
                <InstaIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQ Section */}
      <section className="w-full bg-[#0a0a0a] border-t border-[#1a1a1a] grid grid-cols-1 lg:grid-cols-2">
        {/* Left: FAQs */}
        <div className="p-8 sm:p-12 lg:p-24 flex flex-col justify-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-12 tracking-wide leading-none" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
            <span className="text-white">FREQUENTLY ASKED </span>
            <span className="text-[#a3ff00]">QUESTIONS</span>
          </h2>
          <div className="flex flex-col gap-2 max-w-2xl">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
        
        {/* Right: BG Image */}
        <div 
          className="w-full min-h-[40vh] lg:h-auto bg-cover bg-center hidden sm:block" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop')", // Guy talking in gym placeholder
            filter: "brightness(0.4) grayscale(0.5)"
          }}
        ></div>
      </section>

    </div>
  );
};

export default Contact;