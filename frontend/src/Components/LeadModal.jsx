import React, { useState, useEffect } from "react";
import { X, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { createLead } from "../api/api";
import toast from "react-hot-toast";

const LeadModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    otp: "",
  });

  useEffect(() => {
    // Check if user has already seen/filled the modal
    const hasSeenModal = sessionStorage.getItem("bxc_lead_captured");
    if (!hasSeenModal) {
      // 3-second delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Please enter your name and phone number");
      return;
    }
    if (formData.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success("Demo OTP (1234) sent to your phone");
    }, 1000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (formData.otp !== "1234") {
      toast.error("Invalid OTP. Try 1234.");
      return;
    }

    try {
      setLoading(true);
      const res = await createLead({
        name: formData.name,
        phone: formData.phone,
      });

      if (res.data.success) {
        setStep(3);
        sessionStorage.setItem("bxc_lead_captured", "true");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    sessionStorage.setItem("bxc_lead_captured", "true"); // Optional: set it so it doesn't bother them again for this session
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all scale-100 opacity-100">
        
        {/* Close Button */}
        {step !== 3 && (
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8">
          
          {step === 1 && (
            <div className="animate-fade-in text-center">
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Book a Free Trial</h2>
              <p className="text-gray-400 text-sm mb-6">Get a 3-Day Free Gym Pass. Limited time offer.</p>
              
              <form onSubmit={handleSendOTP} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#defb02]/50 outline-none rounded-xl px-4 py-3 text-sm text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#defb02]/50 outline-none rounded-xl px-4 py-3 text-sm text-white transition-all"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden px-6 py-4 mt-2 bg-[#defb02] text-black rounded-xl text-xs tracking-wider uppercase group disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative z-10 flex items-center gap-2 font-bold" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                    {loading ? "Sending..." : "Send OTP"}
                    {!loading && <ArrowRight size={14} />}
                  </span>
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in text-center">
              <div className="flex justify-center mb-4">
                <ShieldCheck size={48} className="text-[#defb02]" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Verify Number</h2>
              <p className="text-gray-400 text-sm mb-6">Enter the demo OTP <strong className="text-white">1234</strong> sent to <br/>{formData.phone}</p>
              
              <form onSubmit={handleVerifyOTP} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 text-center">Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="----"
                    maxLength={4}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#defb02]/50 outline-none rounded-xl px-4 py-4 text-2xl text-center tracking-[1em] text-white transition-all"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden px-6 py-4 mt-2 bg-[#defb02] text-black rounded-xl text-xs tracking-wider uppercase group disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative z-10 font-bold" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                    {loading ? "Verifying..." : "Verify & Claim"}
                  </span>
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in text-center py-6">
              <div className="flex justify-center mb-4">
                <CheckCircle size={64} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Verified!</h2>
              <p className="text-gray-400 text-sm mb-6">Your pass has been securely claimed. Our team will contact you shortly.</p>
              
              <button
                onClick={closeModal}
                className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs tracking-wider uppercase font-bold transition-all"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LeadModal;
