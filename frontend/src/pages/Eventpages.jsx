import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Info,
  Lock,
  User,
  Mail,
  QrCode,
  Ticket,
  Filter,
  Sparkles,
  ArrowLeft,
  X,
  ShieldCheck,
  TrendingUp,
  TicketPercent,
} from "lucide-react";
import { createEventBooking, getMyEventBookings } from "../api/api";

// ──────────────── EVENTS DATA ────────────────
const EVENTS = [
  {
    id: "evt_1",
    title: "Clash of Titans 2026",
    subtitle: "Elite CrossFit Championship",
    category: "CrossFit",
    price: 499,
    rating: "4.9 (120+ Votes)",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    date: "2026-06-15",
    dates: ["2026-06-15", "2026-06-16", "2026-06-17"],
    times: ["09:00 AM", "02:00 PM", "06:00 PM"],
    venue: "Arena A, Box & Cross HQ, Chennai",
    desc: "The ultimate showdown of functional fitness. Watch elite athletes push their limits across weightlifting, gymnastics, and high-intensity cardio, or step onto the floor and compete yourself!",
    trending: true,
  },
  {
    id: "evt_2",
    title: "Iron & Grace Powerlifting",
    subtitle: "Annual Powerlifting Open",
    category: "Powerlifting",
    price: 299,
    rating: "4.8 (85 Votes)",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop",
    date: "2026-06-22",
    dates: ["2026-06-22", "2026-06-23"],
    times: ["10:00 AM", "03:00 PM", "07:00 PM"],
    venue: "Strength Lab, Box & Cross, Bangalore",
    desc: "Squat, Bench, and Deadlift. Witness record-breaking raw lifts or register to test your maximum strength. Hosted under professional referee supervision with national level lifters.",
    trending: false,
  },
  {
    id: "evt_3",
    title: "Hyrox Hybrid Performance",
    subtitle: "Endurance & Conditioning Workshop",
    category: "Hyrox",
    price: 799,
    rating: "4.7 (140+ Votes)",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1000&auto=format&fit=crop",
    date: "2026-06-29",
    dates: ["2026-06-29"],
    times: ["08:00 AM", "04:00 PM"],
    venue: "Turf Zone, Box & Cross, Mumbai",
    desc: "Learn execution mechanics, pacing strategy, and energy system management for Hyrox physical races. Lead by certified Hyrox masters. Price includes workshop kit.",
    trending: true,
  },
  {
    id: "evt_4",
    title: "Neon Night Fight League",
    subtitle: "Amateur Boxing Championship",
    category: "Boxing",
    price: 999,
    rating: "5.0 (200+ Votes)",
    image: "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?q=80&w=1000&auto=format&fit=crop",
    date: "2026-07-05",
    dates: ["2026-07-05", "2026-07-06"],
    times: ["07:00 PM", "09:30 PM"],
    venue: "Fight Ring, Box & Cross, Chennai",
    desc: "An electric atmosphere under glowing neon ring lights. 10 action-packed amateur matches, live DJ sets, and VIP food stalls. General and ringside tickets available.",
    trending: true,
  },
];

const CATEGORIES = ["All", "CrossFit", "Powerlifting", "Hyrox", "Boxing"];

const Eventpages = () => {
  const { user, loginGoogle } = useAuth();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Booking States
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [personCount, setPersonCount] = useState(1);
  const [checkoutStep, setCheckoutStep] = useState("details"); // details, auth, payment, ticket
  
  // Custom Login Sim States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi, card
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // My Bookings Drawer State
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Initialize selected values when opening detail modal
  const openBookingModal = (event) => {
    setSelectedEvent(event);
    setSelectedDate(event.dates[0]);
    setSelectedTime(event.times[0]);
    setPersonCount(1);
    setCheckoutStep("details");
    setBookingResult(null);
  };

  // Google GIS loader (Real Google Button)
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return; // Do not load Google script if client ID is missing
    
    // Check if the script exists, if not load it
    const existingScript = document.getElementById("google-gsi-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = "google-gsi-script";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleSignIn(clientId);
      };
      document.body.appendChild(script);
    } else {
      initGoogleSignIn(clientId);
    }
  }, [checkoutStep, selectedEvent]);

  const initGoogleSignIn = (clientId) => {
    if (!clientId) return;
    if (window.google && (checkoutStep === "auth" || showGoogleModal)) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });
        
        const btnElement = document.getElementById("google-real-btn");
        if (btnElement) {
          window.google.accounts.id.renderButton(btnElement, {
            theme: "dark",
            size: "large",
            width: btnElement.clientWidth || 320,
          });
        }
      } catch (err) {
        console.warn("Google GIS initialization skipped or failed", err);
      }
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    try {
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const decoded = JSON.parse(jsonPayload);
      const googleUser = {
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        profilePic: decoded.picture,
      };

      const res = await loginGoogle(googleUser);
      if (res.success) {
        toast.success(`Signed in as ${decoded.name}!`);
        setShowGoogleModal(false);
        if (checkoutStep === "auth") {
          setCheckoutStep("payment");
        }
      } else {
        toast.error(res.message || "Failed to log in with Google");
      }
    } catch (err) {
      console.error("Error decoding Google credential token", err);
      toast.error("Could not complete Google Sign-In");
    }
  };

  // Google Login Simulation Handler (for quick mock testing)
  const handleSimulatedGoogleLogin = async (mockEmail, mockName) => {
    if (!mockEmail || !mockName) {
      toast.error("Please enter email and name");
      return;
    }
    const simulatedId = "g_sim_" + Math.random().toString(36).substr(2, 9);
    const mockAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(mockName)}`;

    const googleUser = {
      googleId: simulatedId,
      email: mockEmail,
      name: mockName,
      profilePic: mockAvatar,
    };

    const loadingToast = toast.loading("Connecting with Google Secure Sign-In...");
    const res = await loginGoogle(googleUser);
    toast.dismiss(loadingToast);

    if (res.success) {
      toast.success(`Google Account Loaded: Welcome ${mockName}!`);
      setShowGoogleModal(false);
      if (checkoutStep === "auth") {
        setCheckoutStep("payment");
      }
    } else {
      toast.error(res.message || "Failed Google Auth Simulation");
    }
  };

  // Handle Proceed after Details step
  const handleProceedToAuth = () => {
    if (user) {
      setCheckoutStep("payment");
    } else {
      setCheckoutStep("auth");
    }
  };

  // Fetch My Event Bookings
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const { data } = await getMyEventBookings(user ? {} : { email: "guest" });
      if (data.success) {
        setMyBookings(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (showMyBookings) {
      fetchBookings();
    }
  }, [showMyBookings]);

  // Payment Execution (Dummy Payment process)
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast.error("Please fill in all credit card details.");
        return;
      }
    } else {
      if (!upiId) {
        toast.error("Please enter your UPI ID.");
        return;
      }
    }

    setPaymentLoading(true);
    const paymentToast = toast.loading("Contacting payment gateway... Do not refresh.");

    setTimeout(async () => {
      try {
        const dummyTransactionId = "TXN" + Math.floor(Math.random() * 900000000 + 100000000);
        const bookingData = {
          eventName: selectedEvent.title,
          eventDate: selectedDate,
          eventTime: selectedTime,
          venue: selectedEvent.venue,
          userName: user ? user.name : "Google Guest User",
          userEmail: user ? user.email : "guest@gmail.com",
          personCount: personCount,
          ticketPrice: selectedEvent.price,
          totalAmount: selectedEvent.price * personCount,
          transactionId: dummyTransactionId,
          paymentStatus: "success",
        };

        const { data } = await createEventBooking(bookingData);
        toast.dismiss(paymentToast);

        if (data.success) {
          setBookingResult(data.data);
          toast.success("Payment Received! Ticket generated successfully.");
          setCheckoutStep("ticket");
          // Refresh list if page open
          if (showMyBookings) fetchBookings();
        } else {
          toast.error(data.message || "Booking failed.");
        }
      } catch (err) {
        toast.dismiss(paymentToast);
        toast.error(err.response?.data?.message || "Payment request rejected by server.");
      } finally {
        setPaymentLoading(false);
      }
    }, 2000);
  };

  // Filtered Events
  const filteredEvents = EVENTS.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 md:px-12 font-sans relative overflow-hidden">
      {/* Background lights decoration */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#defb02]/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-purple-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Header section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#defb02]">
            <Sparkles size={14} className="animate-pulse" />
            BOOKMYSHOW EXPERIENCE
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
            FITNESS & COMBAT <span className="stroke-text">EVENTS</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Book professional showdowns, hybrid races, and premium workshops.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowMyBookings(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-xs uppercase tracking-wider font-bold hover:bg-[#defb02] hover:text-black transition-all duration-300 shadow-md cursor-pointer ml-auto md:ml-0"
            style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
          >
            <Ticket size={16} />
            My Bookings
          </button>
        </div>
      </div>

      {/* Hero Banner Grid Carousel */}
      <div className="max-w-7xl mx-auto mb-16 relative z-10 rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2000&auto=format&fit=crop"
          alt="Featured Event Banner"
          className="w-full h-[320px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 flex flex-col items-start max-w-2xl">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-[#defb02] text-black text-[10px] font-black tracking-widest rounded-full mb-4 uppercase">
            <TrendingUp size={10} />
            FEATURED CHAMPIONSHIP
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-3 text-white uppercase tracking-tight">
            CLASH OF TITANS 2026
          </h2>
          <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
            The premier CrossFit showdown of the year. Grab your arena entry passes now to witness record breakers, high stakes, and pure hybrid performance.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400 mb-6">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#defb02]" /> Jun 15-17, 2026</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#defb02]" /> Box & Cross HQ, Chennai</span>
            <span className="flex items-center gap-1.5 text-white bg-white/10 px-2 py-0.5 rounded">₹499 onwards</span>
          </div>
          <button
            onClick={() => openBookingModal(EVENTS[0])}
            className="px-8 py-4 bg-[#defb02] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all duration-300 shadow-xl shadow-[#defb02]/10 cursor-pointer"
            style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
          >
            BOOK PASSES
          </button>
        </div>
      </div>

      {/* Search & Categories filtering section */}
      <div className="max-w-7xl mx-auto mb-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search event name, venue, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121415] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#defb02]/50 focus:ring-1 focus:ring-[#defb02]/25 transition-all shadow-inner"
          />
        </div>

        {/* Categories Horizontal */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
          <Filter size={14} className="text-gray-500 mr-2 shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-[#defb02] text-black border-[#defb02] shadow-md shadow-[#defb02]/5"
                  : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
              }`}
              style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((evt) => (
            <motion.div
              key={evt.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="bg-[#0e0f10] border border-white/[0.06] hover:border-white/15 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 shadow-xl"
            >
              {/* Event Image & Badges */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.95]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Category Badge */}
                <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold tracking-widest px-2.5 py-1.5 rounded uppercase">
                  {evt.category}
                </span>

                {/* Trending label */}
                {evt.trending && (
                  <span className="absolute top-4 right-4 bg-[#defb02] text-black text-[9px] font-black tracking-widest px-2.5 py-1.5 rounded uppercase flex items-center gap-1 shadow-md">
                    <TrendingUp size={10} />
                    TRENDING
                  </span>
                )}

                {/* Price Display */}
                <div className="absolute bottom-4 left-4 flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pass price</span>
                  <span className="text-xl font-extrabold text-white">₹{evt.price}</span>
                </div>
              </div>

              {/* Event Metadata */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white group-hover:text-[#defb02] transition-colors uppercase leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-[#defb02] font-semibold mt-0.5 tracking-wide">{evt.subtitle}</p>
                  
                  <p className="text-gray-400 text-xs mt-3 line-clamp-3 leading-relaxed">
                    {evt.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.05] space-y-2.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#defb02]" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#defb02] shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                </div>

                <button
                  onClick={() => openBookingModal(evt)}
                  className="mt-6 w-full py-3.5 bg-white/5 border border-white/10 group-hover:bg-[#defb02] group-hover:text-black group-hover:border-[#defb02] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md cursor-pointer"
                  style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                >
                  Book Tickets
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredEvents.length === 0 && (
          <div className="col-span-full py-16 text-center bg-[#0d0d0d] border border-white/5 rounded-3xl">
            <Ticket size={48} className="mx-auto text-gray-600 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold uppercase tracking-wider text-gray-300">No Events Found</h3>
            <p className="text-gray-500 text-sm mt-1">Try relaxing your search terms or choosing another category.</p>
          </div>
        )}
      </div>

      {/* ──────────────── BOOKING / CHECKOUT MODAL ──────────────── */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Dark blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl bg-[#0c0d0e] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-[85vh]"
            >
              {/* Left Column: Event Visuals & Details Info */}
              <div className="w-full md:w-2/5 relative overflow-hidden bg-black/40 border-r border-white/5 flex flex-col justify-between p-6 md:p-8">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none filter blur-sm"
                  style={{ backgroundImage: `url(${selectedEvent.image})` }}
                />
                
                <div>
                  {/* Close button (Mobile) */}
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 md:hidden text-white/50 hover:text-white"
                  >
                    <X size={24} />
                  </button>

                  <span className="inline-block px-3 py-1 bg-[#defb02]/10 border border-[#defb02]/30 text-[#defb02] text-[9px] font-bold tracking-widest rounded uppercase mb-4">
                    {selectedEvent.category} event
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none mb-1">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-xs text-[#defb02] font-bold uppercase tracking-wider">{selectedEvent.subtitle}</p>

                  <p className="text-gray-400 text-xs mt-6 leading-relaxed border-l-2 border-[#defb02] pl-3">
                    {selectedEvent.desc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-start gap-3 text-xs">
                    <MapPin size={16} className="text-[#defb02] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white uppercase">Venue</p>
                      <p className="text-gray-400 mt-0.5">{selectedEvent.venue}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <Calendar size={16} className="text-[#defb02]" />
                    <div>
                      <p className="font-bold text-white uppercase">Scheduled Date</p>
                      <p className="text-gray-400 mt-0.5">{selectedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <Clock size={16} className="text-[#defb02]" />
                    <div>
                      <p className="font-bold text-white uppercase">Time Selection</p>
                      <p className="text-gray-400 mt-0.5">{selectedTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout Interactive Steps */}
              <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-none">
                {/* Header Actions */}
                <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                  <div className="flex items-center gap-2">
                    {checkoutStep !== "details" && checkoutStep !== "ticket" && (
                      <button
                        onClick={() => {
                          if (checkoutStep === "auth") setCheckoutStep("details");
                          if (checkoutStep === "payment") setCheckoutStep(user ? "details" : "auth");
                        }}
                        className="text-gray-400 hover:text-white flex items-center gap-1 text-xs uppercase font-bold cursor-pointer"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Checkout Progress
                  </span>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="hidden md:block text-gray-500 hover:text-white cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* ──────────────── STEP 1: CONFIGURE BOOKING DETAILS ──────────────── */}
                {checkoutStep === "details" && (
                  <div className="space-y-6 flex-grow">
                    <h4 className="text-lg font-black text-white uppercase tracking-wider">Configure Passes</h4>

                    {/* 1. Date Selection */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">
                        1. Select Event Date
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {selectedEvent.dates.map((d) => (
                          <button
                            key={d}
                            onClick={() => setSelectedDate(d)}
                            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              selectedDate === d
                                ? "bg-[#defb02] text-black border-[#defb02]"
                                : "bg-[#151718] text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Showtime Selection */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">
                        2. Select Time Slot
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {selectedEvent.times.map((t) => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              selectedTime === t
                                ? "bg-[#defb02] text-black border-[#defb02]"
                                : "bg-[#151718] text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Persons Counter */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2.5">
                        3. Number of Persons (Tickets)
                      </label>
                      <div className="flex items-center gap-4 bg-[#151718] w-fit p-1.5 rounded-xl border border-white/5">
                        <button
                          disabled={personCount <= 1}
                          onClick={() => setPersonCount((p) => p - 1)}
                          className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-40 disabled:hover:bg-white/5 cursor-pointer"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-base font-extrabold w-12 text-center text-white">{personCount}</span>
                        <button
                          onClick={() => setPersonCount((p) => p + 1)}
                          className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-lg cursor-pointer"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ──────────────── STEP 2: SECURE USER DATA (GOOGLE SIGN-IN) ──────────────── */}
                {checkoutStep === "auth" && (
                  <div className="space-y-6 flex-grow flex flex-col justify-center items-center py-6 text-center">
                    <div className="w-16 h-16 bg-[#defb02]/10 border border-[#defb02]/30 text-[#defb02] rounded-full flex items-center justify-center mb-2 animate-pulse">
                      <Lock size={28} />
                    </div>
                    <h4 className="text-xl font-black text-white uppercase tracking-wider">Secure Google Authentication</h4>
                    <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
                      To complete event passes booking, please sign in with Google to retrieve secure user booking data.
                    </p>

                    <div className="w-full max-w-xs space-y-3.5 pt-4">
                      {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                        <>
                          {/* Real Google GSI Button Container */}
                          <div id="google-real-btn" className="w-full min-h-[44px]" />
                          
                          <div className="relative flex py-2 items-center text-xs text-gray-500">
                            <div className="flex-grow border-t border-white/5"></div>
                            <span className="flex-shrink mx-4 font-bold">OR USE SIMULATED LOGIN</span>
                            <div className="flex-grow border-t border-white/5"></div>
                          </div>
                        </>
                      ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] p-3 rounded-lg text-left leading-normal space-y-1.5 mb-2">
                          <p className="font-bold uppercase tracking-wider">⚠️ Google Client ID Missing</p>
                          <p>Running in secure demo mode. Authenticate instantly using simulated Google accounts below.</p>
                          <p className="text-gray-400">To enable real Google Login, set VITE_GOOGLE_CLIENT_ID in your frontend .env file.</p>
                        </div>
                      )}

                      {/* Mock simulated Google Account Choose */}
                      <button
                        onClick={() => setShowGoogleModal(true)}
                        className="w-full py-4 bg-white text-black hover:bg-gray-100 rounded-xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-3 cursor-pointer transition-colors shadow-md shadow-white/5"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.832 0-8.75-3.918-8.75-8.75s3.918-8.75 8.75-8.75c2.27 0 4.305.87 5.86 2.29l3.1-3.1C18.665.65 15.65 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.76 0 11.76-4.76 11.76-11.76 0-.715-.065-1.4-.185-2.015H12.24z"
                          />
                        </svg>
                        Sign In With Google (Demo)
                      </button>
                    </div>

                    <p className="text-[10px] text-gray-500 pt-4">
                      By logging in, we retrieve your Name, Email, and Google profile picture to populate your digital ticket automatically.
                    </p>
                  </div>
                )}

                {/* ──────────────── STEP 3: PAYMENT BREAKDOWN (DUMMY GATEWAY) ──────────────── */}
                {checkoutStep === "payment" && (
                  <form onSubmit={handleProcessPayment} className="space-y-6 flex-grow">
                    <h4 className="text-lg font-black text-white uppercase tracking-wider mb-2">Secure Pass Purchase</h4>

                    {/* Booking User Details Info */}
                    <div className="bg-[#121415] border border-white/5 rounded-xl p-4 flex items-center gap-4">
                      {user?.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt="Google Profile"
                          className="w-10 h-10 rounded-full border border-[#defb02]/30"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white">
                          <User size={18} />
                        </div>
                      )}
                      <div>
                        <p className="text-[9px] text-[#defb02] font-black uppercase tracking-wider">Authenticated Holder</p>
                        <p className="text-sm font-bold text-white leading-tight">{user?.name || "Google Guest User"}</p>
                        <p className="text-xs text-gray-400">{user?.email || "guest@gmail.com"}</p>
                      </div>
                      <span className="ml-auto text-[9px] bg-green-500/10 border border-green-500/20 text-green-400 font-extrabold tracking-widest uppercase px-2 py-1 rounded">
                        Logged In
                      </span>
                    </div>

                    {/* Method selector */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`py-3.5 rounded-xl text-xs font-black tracking-widest uppercase border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          paymentMethod === "upi"
                            ? "bg-[#defb02] text-black border-[#defb02]"
                            : "bg-[#151718] text-gray-400 border-white/5 hover:text-white"
                        }`}
                      >
                        <QrCode size={14} /> UPI Scan
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`py-3.5 rounded-xl text-xs font-black tracking-widest uppercase border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          paymentMethod === "card"
                            ? "bg-[#defb02] text-black border-[#defb02]"
                            : "bg-[#151718] text-gray-400 border-white/5 hover:text-white"
                        }`}
                      >
                        <CreditCard size={14} /> Credit Card
                      </button>
                    </div>

                    {/* Card inputs */}
                    {paymentMethod === "card" ? (
                      <div className="space-y-3 pt-2">
                        <input
                          type="text"
                          placeholder="Card Holder Name"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full bg-[#151718] border border-white/5 rounded-xl py-3.5 px-4 text-xs text-white placeholder-gray-500 outline-none focus:border-[#defb02]/40 transition-all"
                          required
                        />
                        <input
                          type="text"
                          placeholder="16-Digit Card Number (0000 0000 0000 0000)"
                          value={cardNumber}
                          maxLength="19"
                          onChange={(e) => {
                            // Simple format spacing
                            const val = e.target.value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();
                            setCardNumber(val);
                          }}
                          className="w-full bg-[#151718] border border-white/5 rounded-xl py-3.5 px-4 text-xs text-white placeholder-gray-500 outline-none focus:border-[#defb02]/40 transition-all"
                          required
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="MM / YY"
                            maxLength="5"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="bg-[#151718] border border-white/5 rounded-xl py-3.5 px-4 text-xs text-white placeholder-gray-500 outline-none focus:border-[#defb02]/40 transition-all"
                            required
                          />
                          <input
                            type="password"
                            placeholder="CVV"
                            maxLength="3"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="bg-[#151718] border border-white/5 rounded-xl py-3.5 px-4 text-xs text-white placeholder-gray-500 outline-none focus:border-[#defb02]/40 transition-all"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      // UPI Input
                      <div className="space-y-4 pt-2">
                        <input
                          type="text"
                          placeholder="Enter your UPI ID (e.g. mobile@ybl, name@okaxis)"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-[#151718] border border-white/5 rounded-xl py-3.5 px-4 text-xs text-white placeholder-gray-500 outline-none focus:border-[#defb02]/40 transition-all"
                          required
                        />
                        <div className="bg-[#121415] border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center text-center">
                          <QrCode size={96} className="text-white/60 mb-2 p-2 bg-white rounded" />
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Interactive Demo Payment QR
                          </span>
                          <p className="text-[9px] text-gray-500 max-w-[200px] mt-0.5 leading-normal">
                            No money will be deducted. Proceeding will trigger a mock success response.
                          </p>
                        </div>
                      </div>
                    )}
                  </form>
                )}

                {/* ──────────────── STEP 4: TICKETS SUMMARY (QR TICKET) ──────────────── */}
                {checkoutStep === "ticket" && bookingResult && (
                  <div className="flex-grow flex flex-col items-center py-2">
                    {/* Confetti / Badge effect */}
                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mb-4">
                      <Check size={24} className="stroke-[3]" />
                    </div>
                    <h4 className="text-xl font-black text-green-400 uppercase tracking-widest text-center">Passes Confirmed</h4>
                    <p className="text-gray-400 text-[10px] text-center mb-6 uppercase tracking-wider font-semibold">
                      Passes sent to {bookingResult.userEmail}
                    </p>

                    {/* BookMyShow Style Digital Ticket card */}
                    <div className="w-full max-w-sm bg-[#121415] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl">
                      {/* Top banner strip */}
                      <div className="bg-[#defb02] px-5 py-3 text-black flex justify-between items-center font-bold">
                        <span className="text-[9px] uppercase tracking-widest font-black">BOX & CROSS ARENA PASS</span>
                        <span className="text-xs font-extrabold">{bookingResult.personCount} Ticket(s)</span>
                      </div>

                      {/* Ticket body */}
                      <div className="p-5 space-y-4">
                        <div className="border-b border-white/[0.06] pb-3">
                          <span className="text-[9px] text-[#defb02] font-black uppercase tracking-wider">Event Name</span>
                          <h5 className="text-base font-black text-white uppercase tracking-tight">
                            {bookingResult.eventName}
                          </h5>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-b border-white/[0.06] pb-3">
                          <div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Date</span>
                            <p className="text-xs font-bold text-white mt-0.5">{bookingResult.eventDate}</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Showtime</span>
                            <p className="text-xs font-bold text-[#defb02] mt-0.5">{bookingResult.eventTime}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Venue</span>
                          <p className="text-xs font-semibold text-gray-300 mt-0.5 leading-relaxed">
                            {bookingResult.venue}
                          </p>
                        </div>

                        {/* Dashed perforation line */}
                        <div className="relative py-2 border-t border-dashed border-white/10">
                          {/* Side punch outs */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[21px] w-4 h-4 bg-[#0c0d0e] border-r border-white/10 rounded-full" />
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[21px] w-4 h-4 bg-[#0c0d0e] border-l border-white/10 rounded-full" />
                        </div>

                        {/* QR Code and Holder info */}
                        <div className="flex items-center gap-4 pt-1">
                          <div className="p-2 bg-white rounded-lg shrink-0">
                            <QrCode size={64} className="text-black" />
                          </div>
                          <div className="text-xs space-y-1">
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Holder Details</p>
                            <p className="font-bold text-white truncate max-w-[180px]">{bookingResult.userName}</p>
                            <p className="text-gray-400 truncate max-w-[180px] text-[10px]">{bookingResult.userEmail}</p>
                            <p className="text-[9px] text-[#defb02] font-mono tracking-wider pt-0.5">
                              ID: {bookingResult.transactionId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ──────────────── BOOKING ACTIONS / SUMMARIES ──────────────── */}
                {checkoutStep !== "ticket" && (
                  <div className="mt-8 pt-5 border-t border-white/5 space-y-4">
                    {/* Price Breakdown Summary */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>Pass Cost ({personCount} person)</span>
                        <span>₹{selectedEvent.price} × {personCount}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>GST & Booking Charges</span>
                        <span className="text-green-400">FREE</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/5">
                        <span className="uppercase">Total Amount</span>
                        <span className="text-[#defb02]">₹{selectedEvent.price * personCount}</span>
                      </div>
                    </div>

                    {/* Bottom buttons */}
                    {checkoutStep === "details" && (
                      <button
                        onClick={handleProceedToAuth}
                        className="w-full py-4 bg-[#defb02] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                        style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                      >
                        Confirm Details & Pay <ChevronRight size={15} />
                      </button>
                    )}

                    {checkoutStep === "auth" && (
                      <button
                        disabled
                        className="w-full py-4 bg-white/5 border border-white/10 text-gray-500 font-extrabold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5"
                        style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                      >
                        Please Authenticate to Proceed
                      </button>
                    )}

                    {checkoutStep === "payment" && (
                      <button
                        onClick={handleProcessPayment}
                        disabled={paymentLoading}
                        className="w-full py-4 bg-[#defb02] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white disabled:opacity-50 transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
                        style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                      >
                        {paymentLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={16} />
                            Pay ₹{selectedEvent.price * personCount} (Mock Payment)
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Close Button on success ticket */}
                {checkoutStep === "ticket" && (
                  <div className="mt-8 pt-5 border-t border-white/5">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="w-full py-4 bg-white/5 border border-white/10 hover:bg-[#defb02] hover:text-black hover:border-[#defb02] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer text-center"
                      style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                    >
                      Done & Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────── GOOGLE ACCOUNT SELECTION MODAL SIMULATION ──────────────── */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoogleModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white text-black rounded-3xl overflow-hidden shadow-2xl p-7 z-10"
            >
              {/* Google Header */}
              <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
                <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.832 0-8.75-3.918-8.75-8.75s3.918-8.75 8.75-8.75c2.27 0 4.305.87 5.86 2.29l3.1-3.1C18.665.65 15.65 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.76 0 11.76-4.76 11.76-11.76 0-.715-.065-1.4-.185-2.015H12.24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.49 7.375l3.525 2.585A8.707 8.707 0 0 1 12.24 3.49c2.27 0 4.305.87 5.86 2.29l3.1-3.1C18.665.65 15.65 0 12.24 0 8.445 0 5.09 2.08 3.49 5.17l-.022.05L3.49 7.375z"
                  />
                  <path
                    fill="#34A853"
                    d="M12.24 20.99c-4.832 0-8.75-3.918-8.75-8.75 0-.256.02-.51.045-.765L3.49 14.89c1.6 3.09 4.955 5.17 8.75 5.17 3.32 0 6.26-1.5 8.23-3.9l-3.32-2.545c-1.12.98-2.6 1.375-4.92 1.375z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.815 10.285c.12.615.185 1.3.185 2.015 0 7-5 11.76-11.76 11.76-3.795 0-7.15-2.08-8.75-5.17l3.525-2.73a8.707 8.707 0 0 0 5.225 7.9c4.368 0 6.239-1.704 6.887-4.114H12.24v-4.115h11.575z"
                  />
                </svg>
                <h5 className="text-lg font-bold text-gray-900">Sign in with Google</h5>
                <p className="text-xs text-gray-500 mt-1">to continue to Box & Cross</p>
              </div>

              {/* Demo Accounts List */}
              <div className="py-5 space-y-2.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Choose a simulated account
                </p>

                {[
                  { name: "Sudhagar Developer", email: "sudhagar.dev@gmail.com", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=sudhagar" },
                  { name: "Sarah Connor", email: "sarah.strong@gmail.com", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=sarah" },
                  { name: "John Doe", email: "johndoe@gmail.com", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=johndoe" },
                ].map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleSimulatedGoogleLogin(acc.email, acc.name)}
                    className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-all text-left cursor-pointer"
                  >
                    <img src={acc.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-gray-100 border" />
                    <div>
                      <p className="text-xs font-bold text-gray-800 leading-none">{acc.name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{acc.email}</p>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-gray-400" />
                  </button>
                ))}
              </div>

              <div className="relative flex py-2 items-center text-xs text-gray-300">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink mx-4 font-bold text-gray-400 uppercase text-[9px]">Custom Identity</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              {/* Custom Identity Inputs */}
              <div className="pt-3 space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl py-3 px-4 text-xs placeholder-gray-400 outline-none focus:border-blue-500 transition-all text-black font-semibold"
                />
                <input
                  type="email"
                  placeholder="Google Email Address"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl py-3 px-4 text-xs placeholder-gray-400 outline-none focus:border-blue-500 transition-all text-black font-semibold"
                />
                <button
                  type="button"
                  onClick={() => handleSimulatedGoogleLogin(customGoogleEmail, customGoogleName)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors mt-2"
                >
                  Sign In Custom Identity
                </button>
              </div>

              {/* Footer Policy */}
              <p className="text-[9px] text-gray-400 text-center mt-6 leading-relaxed">
                To simulate Google's single sign-on experience. This saves data to the secure MongoDB Box & Cross database, matching Google's user profile schema.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────── MY BOOKINGS DRAWER / MODAL ──────────────── */}
      <AnimatePresence>
        {showMyBookings && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMyBookings(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#0a0a0b] border-l border-white/10 h-full p-6 md:p-8 flex flex-col justify-between z-10 shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
                  <div className="flex items-center gap-2">
                    <Ticket size={20} className="text-[#defb02]" />
                    <h4 className="text-lg font-black uppercase tracking-wider text-white">Event Bookings</h4>
                  </div>
                  <button
                    onClick={() => setShowMyBookings(false)}
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Booking list */}
                <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1.5 scrollbar-thin">
                  {loadingBookings ? (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                      <div className="w-8 h-8 border-2 border-[#defb02] border-t-transparent rounded-full animate-spin mb-3" />
                      <p className="text-xs uppercase font-bold tracking-widest">Loading bookings...</p>
                    </div>
                  ) : myBookings.length > 0 ? (
                    myBookings.map((b) => (
                      <div
                        key={b._id}
                        className="bg-[#121415] border border-white/5 rounded-2xl p-4 space-y-3 shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] text-[#defb02] font-black uppercase tracking-wider block">
                              Ticket Holder: {b.userName}
                            </span>
                            <h5 className="text-sm font-extrabold text-white uppercase tracking-tight mt-0.5">
                              {b.eventName}
                            </h5>
                          </div>
                          <span className="text-[9px] bg-green-500/10 border border-green-500/20 text-green-400 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                            {b.paymentStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 pt-2 border-t border-white/[0.04]">
                          <div>
                            <span className="block text-[8px] font-bold text-gray-500 uppercase">Show Date</span>
                            <span className="font-semibold text-white">{b.eventDate}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-bold text-gray-500 uppercase">Showtime</span>
                            <span className="font-semibold text-[#defb02]">{b.eventTime}</span>
                          </div>
                        </div>

                        <div className="text-[10px] text-gray-400">
                          <span className="block text-[8px] font-bold text-gray-500 uppercase">Venue</span>
                          <span className="font-medium text-gray-300">{b.venue}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 border-t border-white/[0.04] text-xs">
                          <span className="text-gray-500 font-bold uppercase text-[9px]">
                            {b.personCount} Person(s)
                          </span>
                          <span className="text-white font-extrabold">₹{b.totalAmount}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-16 text-center text-gray-500 border border-dashed border-white/5 rounded-2xl">
                      <TicketPercent size={32} className="mx-auto mb-2 text-gray-700" />
                      <p className="text-xs uppercase font-bold tracking-widest">No Pass Bookings Yet</p>
                      <p className="text-[10px] text-gray-500 mt-1 max-w-[200px] mx-auto leading-normal">
                        Your purchased event passes will show up here after checkout.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Panel */}
              <div className="pt-6 border-t border-white/5">
                <button
                  onClick={() => setShowMyBookings(false)}
                  className="w-full py-4 bg-white/5 border border-white/10 hover:bg-[#defb02] hover:text-black hover:border-[#defb02] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer text-center"
                  style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                >
                  Back to Events
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Eventpages;