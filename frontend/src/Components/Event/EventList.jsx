import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Loader2,
  X,
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  Ticket,
  CheckCircle,
  XCircle,
  Dumbbell,
  Timer,
  Flame,
} from "lucide-react";
import {
  getEventsList,
  bookEventItem,
  verifyEventPayment,
} from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Booking Flow states
  const [bookingEvent, setBookingEvent] = useState(null);
  const [activeDateIndex, setActiveDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [seatsCount, setSeatsCount] = useState(1);
  const [showSeatsDrawer, setShowSeatsDrawer] = useState(false);

  // Checkout states
  const [showContactForm, setShowContactForm] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const fetchEvents = async () => {
    try {
      const { data } = await getEventsList();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEvents();

    // Auto refresh every 10 sec to synchronize seats live
    const interval = setInterval(() => {
      fetchEvents();
    }, 10000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  const displayEvents = events;

  // Sync details modal / booking modal if background refresh updates seats
  useEffect(() => {
    if (selectedEvent) {
      const updated = displayEvents.find((e) => e._id === selectedEvent._id);
      if (updated) setSelectedEvent(updated);
    }
    if (bookingEvent) {
      const updated = displayEvents.find((e) => e._id === bookingEvent._id);
      if (updated) setBookingEvent(updated);
    }
  }, [displayEvents]);

  // Lock body scroll when any modal is open (this also triggers FloatingActions to hide)
  useEffect(() => {
    if (selectedEvent || bookingEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedEvent, bookingEvent]);

  // Framer motion variants for cards list stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 110,
        damping: 15,
      },
    },
  };

  // Open booking screen
  const handleOpenBooking = (event) => {
    setBookingEvent(event);
    setActiveDateIndex(0);
    setSelectedSlot(null);
    setSeatsCount(1);
    setShowSeatsDrawer(false);
    setShowContactForm(false);

    // Clear user info and reset checkout state
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setCheckoutStep(1);
    setTermsAccepted(false);
    setCreatedBooking(null);
  };

  // Utility to dynamically inject checkout.js script of Razorpay
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Step 1: Save details to database as "not payment"
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !customerPhone.trim()
    ) {
      toast.error("Please fill in all contact fields");
      return;
    }

    setSubmittingBooking(true);
    const toastId = toast.loading("Saving contact details...");

    try {
      const { data } = await bookEventItem({
        eventId: bookingEvent._id,
        date: bookingEvent.schedules[activeDateIndex].date,
        timeSlot: selectedSlot.time,
        seats: Number(seatsCount),
        name: customerName.trim(),
        email: customerEmail.trim(),
        phone: customerPhone.trim(),
      });

      if (data.success) {
        toast.success("Contact details saved!", { id: toastId });
        setCreatedBooking(data); // Stores bookingId and Razorpay order info
        setCheckoutStep(2); // Move to Step 2 (Review & Pay)
      } else {
        toast.error(data.message || "Failed to save details", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving contact details", { id: toastId });
    } finally {
      setSubmittingBooking(false);
    }
  };

  // Step 2: Proceed to Pay (Razorpay checkout)
  const handleProceedToPay = async () => {
    if (!createdBooking) {
      toast.error(
        "Booking details missing. Please go back and save details again.",
      );
      return;
    }

    setSubmittingBooking(true);
    const toastId = toast.loading("Initiating payment...");

    try {
      // Check if we are running sandbox/mock mode
      if (createdBooking.razorpayOrderId.startsWith("order_mock_")) {
        toast.success("Running sandbox mock payment simulation...", {
          id: toastId,
        });

        setTimeout(async () => {
          const verifyToastId = toast.loading(
            "Verifying simulator transaction...",
          );
          try {
            const { data: verifyData } = await verifyEventPayment({
              bookingId: createdBooking.bookingId,
              razorpayOrderId: createdBooking.razorpayOrderId,
              status: "success",
            });

            if (verifyData.success) {
              toast.success("Payment successfully!", { id: verifyToastId });
              await fetchEvents();
              setShowContactForm(false);
              setShowSeatsDrawer(false);
              setBookingEvent(null);
              setSelectedEvent(null);
            } else {
              toast.error("Mock verification failed", { id: verifyToastId });
            }
          } catch (err) {
            console.error(err);
            toast.error("Simulator verification error", { id: verifyToastId });
          } finally {
            setSubmittingBooking(false);
          }
        }, 1500);
        return;
      }

      // Real Razorpay Integration
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?", {
          id: toastId,
        });
        setSubmittingBooking(false);
        return;
      }

      toast.dismiss(toastId);

      const options = {
        key: createdBooking.keyId,
        amount: createdBooking.amount,
        currency: createdBooking.currency,
        name: "BoxCross",
        description: `Booking for ${bookingEvent.title}`,
        order_id: createdBooking.razorpayOrderId,
        handler: async function (response) {
          const verifyToastId = toast.loading("Verifying payment...");
          try {
            const { data: verifyData } = await verifyEventPayment({
              bookingId: createdBooking.bookingId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              status: "success",
            });

            if (verifyData.success) {
              toast.success("Payment successfully!", { id: verifyToastId });
              await fetchEvents();
              setShowContactForm(false);
              setShowSeatsDrawer(false);
              setBookingEvent(null);
              setSelectedEvent(null);
            } else {
              toast.error("Payment verification failed", { id: verifyToastId });
            }
          } catch (err) {
            console.error(err);
            toast.error("Payment verification error", { id: verifyToastId });
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#e5ff00",
        },
        modal: {
          ondismiss: function () {
            setSubmittingBooking(false);
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", async function (response) {
        toast.error("Payment failed!");
        try {
          await verifyEventPayment({
            bookingId: createdBooking.bookingId,
            status: "failed",
          });
        } catch (err) {
          console.error("Failed to update status", err);
        }
      });
      rzp1.open();
    } catch (error) {
      console.error(error);
      toast.error("Error processing payment", { id: toastId });
      setSubmittingBooking(false);
    }
  };

  // Calculate maximum seats selector count based on availability (capped at 8)
  const getMaximumSeats = () => {
    if (!selectedSlot) return 8;
    const remaining = selectedSlot.slots - selectedSlot.booked;
    return Math.min(8, remaining);
  };

  return (
    <section id="event-list" className="py-16 md:py-24 px-6 md:px-16 lg:px-24 bg-[#030303] relative overflow-hidden select-none">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#e5ff00]/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#ff9e00]/2 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto  relative z-10">
        {/* Title Block */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[2px] w-8 bg-[#e5ff00]"></span>
            <span
              className="text-[#e5ff00] text-[14px] md:text-xl font-black uppercase tracking-widest"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              Special Schedules
            </span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mt-3"
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
          >
           Events & Workshops
          </h2>
          <p
            className="text-gray-200 text-md md:text-xl mt-5 max-w-xl text-center"
            style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
          >
            Click on any card to view detailed schedules, descriptions, and
            booking information for our upcoming fitness events.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-[#e5ff00]" size={36} />
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
              Loading Event Listings...
            </p>
          </div>
        ) : displayEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="flex flex-col items-center justify-center py-24 px-4 text-center bg-[#0c0c0c] border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden group"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#e5ff00]/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-[#e5ff00]/10" />

            <div className="w-24 h-24 mb-6 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center shadow-inner shadow-black/50 rotate-3 group-hover:-rotate-3 transition-transform duration-500 relative z-10">
              <Calendar
                size={36}
                className="text-gray-500 group-hover:text-[#e5ff00] transition-colors duration-500"
              />
            </div>

            <h3
              className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-3 relative z-10"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              No Events Available Right Now
            </h3>

            <p
              className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed relative z-10"
              style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
            >
              We are currently engineering our next high-octane fitness events
              and workshops. Stay tuned and check back soon for our upcoming
              schedules!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {displayEvents.map((event) => (
              <motion.div
                key={event._id}
                variants={itemVariants}
                onClick={() => setSelectedEvent(event)}
                className="group relative p-[1.5px] rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-black/70 card-border-spin-container"
              >
                <div className="card-border-spin-inner">
                  {/* Media Image Wrap */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black shrink-0">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Subtle Top-Bottom Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                  </div>

                  {/* Card Content details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Event Title */}
                      <h3
                        className="text-xl font-bold text-white tracking-wide leading-snug group-hover:text-[#e5ff00] transition-colors line-clamp-1 mb-2"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        {event.title}
                      </h3>

                      {/* Location venue */}
                      <div className="flex items-start gap-1.5 text-gray-200 hover:text-gray-300 transition-colors mb-4">
                        <MapPin
                          size={16}
                          className="text-gray-200 shrink-0 mt-0.5"
                        />
                        <span
                          className="text-sm font-semibold leading-relaxed line-clamp-1"
                          style={{
                            fontFamily: '"Brutal Font Light", sans-serif',
                          }}
                        >
                          {event.location}
                        </span>
                      </div>

                      {/* Mini Badges on Card */}
                      {(event.category || event.duration || event.calories) && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {event.category && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[14px] font-black uppercase text-[#e5ff00]"
                              style={{
                                fontFamily: '"BrutalTypeBold", sans-serif',
                              }}
                            >
                              <Dumbbell size={9} strokeWidth={2.5} />
                              {event.category}
                            </span>
                          )}
                          {event.duration && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[14px] font-black uppercase text-gray-400"
                              style={{
                                fontFamily: '"BrutalTypeBold", sans-serif',
                              }}
                            >
                              <Timer size={9} strokeWidth={2.5} />
                              {event.duration}
                            </span>
                          )}
                          {event.calories && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[14px] font-black uppercase text-gray-400"
                              style={{
                                fontFamily: '"BrutalTypeBold", sans-serif',
                              }}
                            >
                              <Flame size={9} strokeWidth={2.5} />
                              {event.calories}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Pricing and Action Panel */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                      <div className="flex flex-col">
                        {event.originalPrice && (
                          <span className="text-xl text-gray-500 line-through font-semibold leading-none mb-1">
                            ₹{event.originalPrice}
                          </span>
                        )}
                        <span
                          className="text-4xl mt-1 font-black text-gray-200 leading-none"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          ₹{event.price}{" "}
                          <span className="text-[15px] text-gray-400 font-normal ml-0.5 lowercase">
                            onwards
                          </span>
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBooking(event);
                        }}
                        className="inline-flex items-center gap-1.5 bg-[#e5ff00] text-black font-black uppercase tracking-wider text-[11px] px-5 py-2.5 rounded-full shadow-md hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden group/btn book-now-btn"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                          Book Now
                        </span>
                        <ArrowRight
                          size={12}
                          strokeWidth={3}
                          className="relative z-10 transform transition-transform duration-300 group-hover/btn:translate-x-2"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Dynamic Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-0 md:p-4 bg-black/85 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div
              className="absolute inset-0 z-0"
              onClick={() => setSelectedEvent(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-[#0a0a0a] border-0 md:border md:border-white/10 rounded-none md:rounded-3xl w-full h-full md:h-auto max-h-screen md:max-h-[90vh] md:max-w-9xl overflow-y-auto md:overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row animate-in fade-in zoom-in duration-200"
            >
              {/* Left side: Image banner section */}
              <div className="relative w-full md:w-1/2 aspect-[16/10] md:aspect-auto md:min-h-[450px] overflow-hidden bg-black shrink-0 border-b md:border-b-0 md:border-r border-white/5">
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover md:absolute md:inset-0"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-black/10 to-transparent pointer-events-none" />

                {/* Premium Back Arrow Button on mobile */}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 left-4 p-2.5 bg-black/60 hover:bg-black/90 hover:scale-105 text-white backdrop-blur-md border border-white/10 rounded-full transition-all cursor-pointer z-30 md:hidden flex items-center justify-center shadow-lg"
                  aria-label="Go back"
                >
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Right side: Details + Footer wrapper */}
              <div className="w-full md:w-1/2 flex flex-col md:overflow-hidden flex-grow md:max-h-[90vh] relative">
                {/* Close Button on desktop */}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-3 bg-white/5 hover:bg-white/15 hover:scale-105 text-white border border-white/10 rounded-full transition-all cursor-pointer z-30 hidden md:block"
                  aria-label="Close details"
                >
                  <X size={19} />
                </button>

                {/* Scrollable details wrapper */}
                <div className="p-6 md:overflow-y-auto space-y-4 flex-grow md:custom-scrollbar">
                  {/* Event Location Pin */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[14px] font-black uppercase tracking-wider mb-1">
                    <MapPin size={14} className="text-[#e5ff00]" />
                    <span>
                      {selectedEvent.location.split(",").pop() || "Venue"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-4xl  font-black uppercase tracking-tight text-white leading-tight pr-8 text-left"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {selectedEvent.title}
                  </h3>

                 

                  {/* Premium Badges */}
                  {(selectedEvent.category ||
                    selectedEvent.duration ||
                    selectedEvent.calories) && (
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-4 my-2">
                      {selectedEvent.category && (
                        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-center">
                          <Dumbbell
                            size={16}
                            className="text-[#e5ff00] mb-1.5 shrink-0"
                          />
                          <span
                            className="text-[15px] font-black uppercase tracking-wider text-gray-400"
                            style={{
                              fontFamily: '"BrutalTypeBold", sans-serif',
                            }}
                          >
                            {selectedEvent.category}
                          </span>
                        </div>
                      )}
                      {selectedEvent.duration && (
                        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-center">
                          <Timer
                            size={16}
                            className="text-[#e5ff00] mb-1.5 shrink-0"
                          />
                          <span
                            className="text-[15px] font-black uppercase tracking-wider text-gray-400"
                            style={{
                              fontFamily: '"BrutalTypeBold", sans-serif',
                            }}
                          >
                            {selectedEvent.duration}
                          </span>
                        </div>
                      )}
                      {selectedEvent.calories && (
                        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-center">
                          <Flame
                            size={16}
                            className="text-[#e5ff00] mb-1.5 shrink-0"
                          />
                          <span
                            className="text-[15px] font-black uppercase tracking-wider text-gray-400"
                            style={{
                              fontFamily: '"BrutalTypeBold", sans-serif',
                            }}
                          >
                            {selectedEvent.calories}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description Box */}
                  <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 sm:p-5 text-left">
                    <h4
                      className="text-[20px] font-black uppercase tracking-wider text-[#e5ff00] mb-2"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      About The Event
                    </h4>
                    <p
                      className="text-[15px] text-gray-300 font-medium leading-relaxed whitespace-pre-line"
                      style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
                    >
                      {selectedEvent.description ||
                        "No additional description details available for this event yet. Stay tuned for special schedules."}
                    </p>
                  </div>

                  {/* Benefits Section */}
                  {selectedEvent.benefits?.length > 0 && (
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 sm:p-5 text-left">
                      <h4
                        className="text-[20px] font-black uppercase tracking-wider text-[#e5ff00] mb-3"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        Benefits
                      </h4>
                      <ul className="space-y-2.5">
                        {selectedEvent.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-[15px] text-gray-300 font-medium leading-relaxed"
                          >
                            <CheckCircle
                              size={15}
                              className="text-green-500 shrink-0 mt-0.5"
                            />
                            <span
                              style={{
                                fontFamily: '"Brutal Font Light", sans-serif',
                              }}
                            >
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Session Agenda Section */}
                  {selectedEvent.agenda?.length > 0 && (
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 sm:p-5 text-left space-y-4">
                      <div className="flex items-baseline justify-between">
                        <h4
                          className="text-[15px] font-black uppercase tracking-wider text-[#e5ff00]"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          A typical {selectedEvent.title} Session
                        </h4>
                        {selectedEvent.duration && (
                          <span
                            className="text-[15px] text-gray-400 font-bold"
                            style={{
                              fontFamily: '"Brutal Font Light", sans-serif',
                            }}
                          >
                            {selectedEvent.duration}
                          </span>
                        )}
                      </div>

                      {/* Segments progress bar */}
                      <div className="flex h-2 w-full rounded-full overflow-hidden bg-white/5 gap-0.5">
                        {selectedEvent.agenda.map((step, idx) => {
                          let bgClass = "bg-green-500";
                          if (step.color === "orange") bgClass = "bg-[#ff9e00]";
                          if (step.color === "blue") bgClass = "bg-[#00d2ff]";
                          if (step.color === "red") bgClass = "bg-[#ff4b72]";
                          if (step.color === "purple") bgClass = "bg-[#9b51e0]";
                          return (
                            <div
                              key={idx}
                              className={`h-full flex-1 ${bgClass} opacity-90 transition-opacity hover:opacity-100`}
                              title={`${step.title} (${step.duration})`}
                            />
                          );
                        })}
                      </div>

                      {/* Agenda list mapping */}
                      <div className="space-y-2">
                        {selectedEvent.agenda.map((step, idx) => {
                          let borderClass =
                            "border-green-500/30 hover:border-green-500/50";
                          let bulletBg = "bg-green-500";
                          if (step.color === "orange") {
                            borderClass =
                              "border-[#ff9e00]/30 hover:border-[#ff9e00]/50";
                            bulletBg = "bg-[#ff9e00]";
                          }
                          if (step.color === "blue") {
                            borderClass =
                              "border-[#00d2ff]/30 hover:border-[#00d2ff]/50";
                            bulletBg = "bg-[#00d2ff]";
                          }
                          if (step.color === "red") {
                            borderClass =
                              "border-[#ff4b72]/30 hover:border-[#ff4b72]/50";
                            bulletBg = "bg-[#ff4b72]";
                          }
                          if (step.color === "purple") {
                            borderClass =
                              "border-[#9b51e0]/30 hover:border-[#9b51e0]/50";
                            bulletBg = "bg-[#9b51e0]";
                          }

                          return (
                            <div
                              key={idx}
                              className={`flex items-center justify-between p-3 bg-white/[0.01] border ${borderClass} rounded-xl transition-all`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-2.5 h-2.5 rounded-full ${bulletBg} shrink-0`}
                                />
                                <span
                                  className="text-xs sm:text-sm text-gray-200 font-semibold leading-none"
                                  style={{
                                    fontFamily:
                                      '"Brutal Font Light", sans-serif',
                                  }}
                                >
                                  {step.title}
                                </span>
                              </div>
                              <span
                                className="text-xs font-bold text-gray-400 tracking-wider whitespace-nowrap"
                                style={{
                                  fontFamily: '"BrutalTypeBold", sans-serif',
                                }}
                              >
                                {step.duration} <span className="text-gray-500 font-normal">mins</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Venue Inclusions / Exclusions / Terms */}
                  {(selectedEvent.inclusions?.length > 0 ||
                    selectedEvent.exclusions?.length > 0 ||
                    selectedEvent.termsAndConditions?.length > 0) && (
                    <div className="space-y-4">
                      {selectedEvent.inclusions?.length > 0 && (
                        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 sm:p-5 text-left">
                          <h4
                            className="text-[20px] font-black tracking-wider text-[#e5ff00] mb-4 flex items-center justify-between"
                            style={{
                              fontFamily: '"BrutalTypeBold", sans-serif',
                            }}
                          >
                            Venue Inclusions
                          </h4>
                          <ul className="space-y-4">
                            {selectedEvent.inclusions.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 text-[15px] text-gray-300 font-medium leading-relaxed"
                              >
                                <CheckCircle
                                  size={16}
                                  className="text-green-500 shrink-0 mt-0.5"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedEvent.exclusions?.length > 0 && (
                        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 sm:p-5 text-left">
                          <h4
                            className="text-[20px] font-black tracking-wider text-[#e5ff00] mb-4 flex items-center justify-between"
                            style={{
                              fontFamily: '"BrutalTypeBold", sans-serif',
                            }}
                          >
                            Venue Exclusions
                          </h4>
                          <ul className="space-y-4">
                            {selectedEvent.exclusions.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 text-[15px] text-gray-300 font-medium leading-relaxed"
                              >
                                <XCircle
                                  size={16}
                                  className="text-red-500 shrink-0 mt-0.5"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedEvent.termsAndConditions?.length > 0 && (
                        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 sm:p-5 text-left">
                          <h4
                            className="text-[20px] font-black tracking-wider text-[#e5ff00] mb-4 flex items-center justify-between"
                            style={{
                              fontFamily: '"BrutalTypeBold", sans-serif',
                            }}
                          >
                            Terms & Conditions
                          </h4>
                          <ul className="space-y-4">
                            {selectedEvent.termsAndConditions.map(
                              (item, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3 text-[15px] text-gray-300 font-medium leading-relaxed"
                                >
                                  <span className="w-1.5 h-1.5 bg-[#7a7a7a] transform rotate-45 inline-block shrink-0 mt-1.5"></span>
                                  <span>{item}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer Pricing + Call To Action */}
                <div className="p-6 border-t border-white/5 bg-[#080808] flex items-center justify-between gap-4 shrink-0 mt-auto">
                  <div className="flex flex-col text-left">
                    {selectedEvent.originalPrice && (
                      <span className="text-[20px] text-gray-500 line-through font-semibold leading-none mb-1">
                        ₹{selectedEvent.originalPrice}
                      </span>
                    )}
                    <span
                      className="text-[30px] font-black text-gray-200 leading-none"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      ₹{selectedEvent.price}
                      <span className="text-[20px] text-gray-400 font-normal ml-0.5 lowercase">
                        onwards
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(selectedEvent)}
                    className="inline-flex items-center justify-center gap-2 bg-[#e5ff00] hover:scale-[1.02] active:scale-95 text-black font-extrabold uppercase tracking-wider text-[11px] sm:text-xs px-6 py-3.5 rounded-full shadow-lg shadow-[#e5ff00]/10 transition-all duration-300 cursor-pointer relative overflow-hidden group/btn book-now-btn"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                      Book Now
                    </span>
                    <ArrowRight
                      size={12}
                      strokeWidth={3}
                      className="relative z-10 transform transition-transform duration-300 group-hover/btn:translate-x-2"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Date & Slot Booking Modal (Mimicking Image 1, 2, 3) */}
      <AnimatePresence>
        {bookingEvent && (
          <div className="fixed inset-0 z-[9999] flex flex-col md:items-center md:justify-center  bg-black p-0 md:p-4 overflow-y-auto">
            {/* Header Block */}
            <div className="w-full max-w-5xl  bg-[#d2ec07] border-b md:border border-white/10 md:rounded-t-3xl h-16 flex items-center gap-3 px-4 shrink-0">
              <button
                onClick={() => setBookingEvent(null)}
                className="p-2 bg-white/5 hover:bg-white/10 text-black  rounded-xl transition-all border border-white/5 cursor-pointer"
                title="Go Back"
              >
                <ChevronLeft size={19} />
              </button>
              <h3
                className="font-bold text-sm md:text-2xl tracking-tight text-black font-bold  truncate max-w-[280px]"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                {bookingEvent.title}
              </h3>
            </div>

            {/* Main Interactive Screen */}
            <div className="w-full  max-w-5xl bg-[#000] md:bg-[#070707] md:border-x border-white/10 flex-grow md:flex-grow-0 p-4 space-y-6 flex flex-col">
              {/* Date Horizontal Selectors */}
              <div className="space-y-2">
                <label
                  className="block text-[10px] font-black uppercase tracking-wider text-gray-500"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  Select Date
                </label>
                <div className="flex gap-3 overflow-x-auto pb-1.5 scroll-smooth custom-scrollbar">
                  {!bookingEvent.schedules ||
                  bookingEvent.schedules.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">
                      No available dates.
                    </p>
                  ) : (
                    bookingEvent.schedules.map((schedule, idx) => {
                      const isActive = idx === activeDateIndex;

                      let dayName = "";
                      let dateNum = "";
                      let monthName = "";

                      if (/^\d{4}-\d{2}-\d{2}$/.test(schedule.date)) {
                        // Parse safely to avoid timezone shift
                        const [year, month, day] = schedule.date
                          .split("-")
                          .map(Number);
                        const d = new Date(year, month - 1, day);
                        const days = [
                          "SUN",
                          "MON",
                          "TUE",
                          "WED",
                          "THU",
                          "FRI",
                          "SAT",
                        ];
                        const months = [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ];
                        dayName = days[d.getDay()];
                        dateNum = d.getDate();
                        monthName = months[d.getMonth()];
                      } else {
                        // Legacy support for "SAT 30 May"
                        const parts = schedule.date.split(" ");
                        dayName = parts[0] || "";
                        dateNum = parts[1] || "";
                        monthName = parts[2] || "";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveDateIndex(idx);
                            setSelectedSlot(null);
                            setShowSeatsDrawer(false);
                          }}
                          className={`w-20 h-20 flex flex-col items-center justify-center rounded-2xl border transition-all shrink-0 cursor-pointer ${
                            isActive
                              ? "bg-white text-black border-white shadow-lg shadow-white/5"
                              : "bg-[#0f0f0f] text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
                          }`}
                        >
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wide mb-1 ${isActive ? "text-black/60" : "text-gray-500"}`}
                          >
                            {dayName}
                          </span>
                          <span className="text-xl font-black leading-none mb-1">
                            {dateNum}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wide ${isActive ? "text-black/60" : "text-gray-500"}`}
                          >
                            {monthName}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Event Card Info (Mimicking card preview) */}
              <div className="bg-[#121212] border border-white/5 rounded-2xl p-3 flex gap-3 items-center">
                <img
                  src={bookingEvent.imageUrl}
                  alt={bookingEvent.title}
                  className="w-14 h-14 object-cover rounded-xl border border-white/5"
                />
                <div className="flex-grow">
                  <h4 className="font-bold text-xs leading-snug line-clamp-1">
                    {bookingEvent.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    {bookingEvent.originalPrice && (
                      <span className="text-[10px] text-gray-500 line-through">
                        ₹{bookingEvent.originalPrice}
                      </span>
                    )}
                    <span className="text-xs font-bold text-[#ff9e00]">
                      ₹{bookingEvent.price} onwards
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Slots Area */}
              <div className="space-y-3 flex-grow">
                <label
                  className="block text-[10px] font-black uppercase tracking-wider text-gray-500"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  Select Time Slot
                </label>

                {!bookingEvent.schedules ||
                bookingEvent.schedules.length === 0 ||
                !bookingEvent.schedules[activeDateIndex] ? (
                  <p className="text-xs text-gray-500 italic">
                    No available schedules.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
                    {bookingEvent.schedules[activeDateIndex].timeSlots.map(
                      (slot, sIdx) => {
                        const isSoldOut = slot.booked >= slot.slots;
                        const isSelected = selectedSlot?.time === slot.time;

                        return (
                          <button
                            key={sIdx}
                            onClick={() => {
                              if (isSoldOut) return;
                              setSelectedSlot(slot);
                              setSeatsCount(1);
                              setShowSeatsDrawer(true);
                            }}
                            className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-center h-16 ${
                              isSoldOut
                                ? "bg-black/50 text-gray-600 border-white/5 cursor-not-allowed opacity-40"
                                : isSelected
                                  ? "bg-[#e5ff00]/10 border-[#e5ff00] text-white"
                                  : "bg-[#0f0f0f] border-white/5 hover:border-white/10 text-white cursor-pointer"
                            }`}
                          >
                            {/* Left indicator accent */}
                            {!isSoldOut && (
                              <span
                                className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-md ${isSelected ? "bg-[#e5ff00]" : "bg-green-500"}`}
                              />
                            )}

                            <span className="flex items-center gap-1.5 text-xs font-bold pl-2">
                              <span
                                className={`w-1 h-1 rounded-full ${isSoldOut ? "bg-red-500" : "bg-green-500"}`}
                              />
                              {slot.time}
                            </span>

                            <span
                              className={`text-[10px] pl-2 mt-1 ${isSoldOut ? "text-red-500 font-semibold" : "text-gray-500"}`}
                            >
                              {isSoldOut
                                ? "Sold out"
                                : `${slot.slots - slot.booked} slot(s) left`}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* seats count drawer overlay (mimicking Image 4) */}
            <AnimatePresence>
              {showSeatsDrawer && selectedSlot && (
                <div className="fixed inset-0 z-50 flex items-end  justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm">
                  {/* Backdrop close */}
                  <div
                    className="absolute inset-0 z-0"
                    onClick={() => setShowSeatsDrawer(false)}
                  />

                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 280 }}
                    className="w-full max-w-lg bg-[#0c0c0c] border-t border-white/10 md:border border-white/10 rounded-t-3xl md:rounded-3xl p-6 space-y-6 relative z-10 flex flex-col shrink-0"
                  >
                    {/* Horizontal pull line / close button */}
                    <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-2 shrink-0" />
                    <button
                      onClick={() => setShowSeatsDrawer(false)}
                      className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all cursor-pointer"
                    >
                      <X size={14} />
                    </button>

                    {/* Header title */}
                    <div className="text-center space-y-1">
                      <h4
                        className="text-lg font-black uppercase text-white tracking-wide"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        How many seats?
                      </h4>
                      <p
                        className="text-xs text-gray-500 font-semibold uppercase tracking-wider"
                        style={{
                          fontFamily: '"Brutal Font Light", sans-serif',
                        }}
                      >
                        Select count to book
                      </p>
                    </div>

                    {/* Small avatar/image preview */}
                    <div className="flex justify-center">
                      <img
                        src={bookingEvent.imageUrl}
                        alt="Event Avatar"
                        className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg shadow-black"
                      />
                    </div>

                    {/* Horizontal pills count */}
                    <div className="flex justify-start sm:justify-center gap-2.5 overflow-x-auto py-2 px-4 custom-scrollbar">
                      {Array.from(
                        { length: getMaximumSeats() },
                        (_, idx) => idx + 1,
                      ).map((num) => {
                        const isSelected = seatsCount === num;
                        return (
                          <button
                            key={num}
                            onClick={() => setSeatsCount(num)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all shrink-0 cursor-pointer ${
                              isSelected
                                ? "bg-white text-black scale-110 shadow-lg shadow-white/10"
                                : "bg-[#181818] text-gray-400 border border-white/5 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>

                    {/* Calculation block */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>
                          {seatsCount} Seats x ₹{bookingEvent.price}
                        </span>
                        <span className="font-bold text-white">
                          ₹{(seatsCount * bookingEvent.price).toFixed(2)}
                        </span>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="flex items-center justify-between text-sm font-black">
                        <span className="text-gray-300">Total Amount</span>
                        <span className="text-[#ff9e00] text-base">
                          ₹{(seatsCount * bookingEvent.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="w-full py-4 bg-white hover:bg-[#e5ff00] text-black font-black uppercase tracking-wider text-xs rounded-full shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      Continue
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* session details */}
            <AnimatePresence>
              {showContactForm && (
                <div className="fixed inset-0  z-50 flex md:items-center md:justify-center  p-0 md:p-2  bg-black/60 backdrop-blur-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#0c0c0c] border-0 md:border md:border-white/10 rounded-none md:rounded-3xl w-full h-full max-h-screen md:h-auto md:max-h-[90vh] md:max-w-5xl overflow-hidden shadow-2xl relative flex flex-col"
                  >
                    <div className="h-16 flex items-center justify-between bg-[#e5ff00] px-6 border-b border-white/5">
                      <div className="flex items-center gap-3 ">
                        <button
                          type="button"
                          onClick={() => setShowDiscardConfirmation(true)}
                          className="p-1 text-black  rounded-lg transition-all cursor-pointer"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <h3
                          className="font-bold uppercase text-xl tracking-wider  text-black"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          Session Details
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="p-1 text-black rounded-lg transition-all cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex flex-col lg:flex-row max-h-[calc(100vh-64px)] lg:max-h-[85vh] overflow-y-auto custom-scrollbar flex-grow">
                      {/* Left: Event Details Overview */}
                      <div className="w-full lg:w-5/12 p-2 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#050505]">
                        <div className="relative rounded-2xl overflow-hidden mb-6 group shadow-lg shadow-black/60">
                          <img
                            src={bookingEvent.imageUrl}
                            alt={bookingEvent.title}
                            className="w-full h-48 lg:h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className="px-3 py-1 bg-[#e5ff00] text-black text-[10px] font-black uppercase tracking-widest rounded-md shadow-md mb-2 inline-block">
                              Selected Event
                            </span>
                            <h4
                              className="text-xl md:text-2xl font-black uppercase text-white leading-tight drop-shadow-xl"
                              style={{
                                fontFamily: '"BrutalTypeBold", sans-serif',
                              }}
                            >
                              {bookingEvent.title}
                            </h4>
                          </div>
                        </div>

                        <div className="space-y-4 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                          {/* Date */}
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-[#e5ff00] shadow-inner shadow-white/5">
                              <Calendar size={18} />
                            </div>
                            <div>
                              <p
                                className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5"
                                style={{
                                  fontFamily: '"BrutalTypeBold", sans-serif',
                                }}
                              >
                                Booking Date
                              </p>
                              <p
                                className="text-sm font-bold text-gray-200"
                                style={{
                                  fontFamily: '"Brutal Font Light", sans-serif',
                                }}
                              >
                                {bookingEvent.schedules[activeDateIndex].date}
                              </p>
                            </div>
                          </div>

                          {/* Time */}
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-[#e5ff00] shadow-inner shadow-white/5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                            </div>
                            <div>
                              <p
                                className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5"
                                style={{
                                  fontFamily: '"BrutalTypeBold", sans-serif',
                                }}
                              >
                                Time Slot
                              </p>
                              <p
                                className="text-sm font-bold text-gray-200"
                                style={{
                                  fontFamily: '"Brutal Font Light", sans-serif',
                                }}
                              >
                                {selectedSlot.time}
                              </p>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-[#e5ff00] shadow-inner shadow-white/5">
                              <MapPin size={18} />
                            </div>
                            <div>
                              <p
                                className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5"
                                style={{
                                  fontFamily: '"BrutalTypeBold", sans-serif',
                                }}
                              >
                                Location
                              </p>
                              <p
                                className="text-xs md:text-sm font-bold text-gray-200 leading-snug"
                                style={{
                                  fontFamily: '"Brutal Font Light", sans-serif',
                                }}
                              >
                                {bookingEvent.location}
                              </p>
                            </div>
                          </div>

                          {/* Seats */}
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#e5ff00]/10 flex items-center justify-center shrink-0 text-[#e5ff00] shadow-inner shadow-[#e5ff00]/20">
                              <Ticket size={18} />
                            </div>
                            <div>
                              <p
                                className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5"
                                style={{
                                  fontFamily: '"BrutalTypeBold", sans-serif',
                                }}
                              >
                                Reserved Seats
                              </p>
                              <p
                                className="text-sm font-black text-[#e5ff00]"
                                style={{
                                  fontFamily: '"BrutalTypeBold", sans-serif',
                                }}
                              >
                                {seatsCount} Seat{seatsCount > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Contact Form */}
                      <div className="w-full lg:w-7/12 flex flex-col justify-center">
                        {checkoutStep === 1 ? (
                          <form
                            onSubmit={handleSaveDetails}
                            className="p-6 lg:p-10 space-y-6"
                          >
                            <div>
                              <h4
                                className="text-lg font-black uppercase text-white tracking-wide mb-1"
                                style={{
                                  fontFamily: '"BrutalTypeBold", sans-serif',
                                }}
                              >
                                Primary Contact
                              </h4>
                              <p
                                className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4"
                                style={{
                                  fontFamily: '"Brutal Font Light", sans-serif',
                                }}
                              >
                                Enter attendee details for confirmation
                              </p>
                            </div>

                            {/* Name */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Full Name
                              </label>
                              <div className="relative group">
                                <User
                                  size={16}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e5ff00] transition-colors"
                                />
                                <input
                                  type="text"
                                  value={customerName}
                                  onChange={(e) =>
                                    setCustomerName(e.target.value)
                                  }
                                  placeholder="Enter your name"
                                  className="w-full bg-[#050505] border border-white/10 focus:border-[#e5ff00]/50 focus:bg-white/[0.02] outline-none rounded-xl pl-11 pr-4 py-4 text-sm text-white transition-all shadow-inner shadow-black/50"
                                  required
                                />
                              </div>
                            </div>

                            {/* Email & Phone Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {/* Email */}
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                  Email Address
                                </label>
                                <div className="relative group">
                                  <Mail
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e5ff00] transition-colors"
                                  />
                                  <input
                                    type="email"
                                    value={customerEmail}
                                    onChange={(e) =>
                                      setCustomerEmail(e.target.value)
                                    }
                                    placeholder="Enter your email"
                                    className="w-full bg-[#050505] border border-white/10 focus:border-[#e5ff00]/50 focus:bg-white/[0.02] outline-none rounded-xl pl-11 pr-4 py-4 text-sm text-white transition-all shadow-inner shadow-black/50"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Phone */}
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                  Phone Number
                                </label>
                                <div className="relative group">
                                  <Phone
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e5ff00] transition-colors"
                                  />
                                  <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) =>
                                      setCustomerPhone(e.target.value)
                                    }
                                    placeholder="Enter your phone number"
                                    className="w-full bg-[#050505] border border-white/10 focus:border-[#e5ff00]/50 focus:bg-white/[0.02] outline-none rounded-xl pl-11 pr-4 py-4 text-sm text-white transition-all shadow-inner shadow-black/50"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Form action buttons */}
                            <div className="pt-6">
                              <button
                                type="submit"
                                disabled={submittingBooking}
                                className="w-full py-4.5 bg-white hover:bg-[#e5ff00] text-black font-black uppercase tracking-widest text-sm rounded-xl shadow-xl shadow-white/5 hover:shadow-[#e5ff00]/20 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 disabled:opacity-50 cursor-pointer"
                                style={{
                                  fontFamily: '"BrutalTypeBold", sans-serif',
                                }}
                              >
                                {submittingBooking ? (
                                  <>
                                    <Loader2
                                      size={18}
                                      className="animate-spin"
                                    />
                                    Saving Details...
                                  </>
                                ) : (
                                  <>
                                    Save Details & Continue
                                    <ArrowRight size={18} strokeWidth={3} />
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="p-6 lg:p-10 space-y-6 flex flex-col h-full justify-center">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4
                                  className="text-lg font-black uppercase text-white tracking-wide"
                                  style={{
                                    fontFamily: '"BrutalTypeBold", sans-serif',
                                  }}
                                >
                                  Review & Pay
                                </h4>
                                <button
                                  onClick={() => setCheckoutStep(1)}
                                  className="text-[10px] uppercase font-bold text-gray-400 hover:text-white underline decoration-white/20 hover:decoration-white transition-all cursor-pointer"
                                >
                                  Edit Contact
                                </button>
                              </div>

                              {/* Readonly contact details */}
                              <div className="bg-white/5 border border-white/5 rounded-xl p-3 mb-4 flex items-center gap-3 shadow-inner shadow-black/20">
                                <div className="w-8 h-8 rounded-full bg-[#e5ff00]/10 flex items-center justify-center text-[#e5ff00] shrink-0">
                                  <User size={14} />
                                </div>
                                <div className="truncate">
                                  <p className="text-xs font-bold text-white truncate">
                                    {customerName}
                                  </p>
                                  <p className="text-[10px] text-gray-400 truncate">
                                    {customerEmail} • {customerPhone}
                                  </p>
                                </div>
                              </div>

                              {/* Price Breakdown */}
                              <div className="bg-[#050505] border border-white/10 rounded-2xl p-5 text-sm space-y-3 mt-4 relative overflow-hidden shadow-inner shadow-black/50">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#e5ff00]"></div>

                                <h5 className="text-white font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                                  <Ticket
                                    size={14}
                                    className="text-[#e5ff00]"
                                  />
                                  Order Breakdown
                                </h5>

                                {bookingEvent.originalPrice &&
                                  bookingEvent.originalPrice >
                                    bookingEvent.price && (
                                    <div className="flex justify-between items-center text-gray-500 text-xs">
                                      <span>
                                        Original Price ({seatsCount} x ₹
                                        {bookingEvent.originalPrice})
                                      </span>
                                      <span className="font-semibold line-through">
                                        ₹
                                        {(
                                          seatsCount *
                                          bookingEvent.originalPrice
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  )}

                                <div className="flex justify-between items-center text-gray-300">
                                  <span>
                                    Ticket Price ({seatsCount} x ₹
                                    {bookingEvent.price})
                                  </span>
                                  <span className="font-semibold text-white">
                                    ₹
                                    {(seatsCount * bookingEvent.price).toFixed(
                                      2,
                                    )}
                                  </span>
                                </div>

                                {bookingEvent.originalPrice &&
                                  bookingEvent.originalPrice >
                                    bookingEvent.price && (
                                    <div className="flex justify-between items-center text-[#e5ff00]/90 text-xs">
                                      <span>Special Discount</span>
                                      <span className="font-bold">
                                        - ₹
                                        {(
                                          seatsCount *
                                          (bookingEvent.originalPrice -
                                            bookingEvent.price)
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  )}

                                <div className="flex justify-between items-center text-gray-400 text-xs">
                                  <span>Taxes & Platform Fees</span>
                                  <span className="font-semibold text-green-400">
                                    Included
                                  </span>
                                </div>

                                <div className="h-px bg-white/10 w-full my-3"></div>

                                <div className="flex justify-between items-center">
                                  <span className="uppercase text-xs tracking-wider text-gray-300 font-bold">
                                    Total Payable
                                  </span>
                                  <span className="text-2xl font-black text-[#e5ff00] tracking-tight">
                                    ₹
                                    {(seatsCount * bookingEvent.price).toFixed(
                                      2,
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Terms and conditions */}
                              <label className="flex items-start gap-3 cursor-pointer group mt-6">
                                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                                  <input
                                    type="checkbox"
                                    className="appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-[#050505] checked:bg-[#e5ff00] checked:border-[#e5ff00] transition-colors cursor-pointer peer"
                                    checked={termsAccepted}
                                    onChange={(e) =>
                                      setTermsAccepted(e.target.checked)
                                    }
                                  />
                                  <svg
                                    className="absolute w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-black stroke-current"
                                    viewBox="0 0 14 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M1 5L4.5 8.5L13 1"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                                <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed select-none group-hover:text-gray-300 transition-colors">
                                  I accept the{" "}
                                  <a
                                    href="#"
                                    className="text-white hover:text-[#e5ff00] underline decoration-white/20 transition-colors"
                                  >
                                    Terms and Conditions
                                  </a>
                                  , including the cancellation policy and
                                  facility rules.
                                </p>
                              </label>
                            </div>

                            <div className="pt-6">
                              <button
                                onClick={handleProceedToPay}
                                disabled={submittingBooking || !termsAccepted}
                                className="w-full py-4.5 bg-white hover:bg-[#e5ff00] text-black font-black uppercase tracking-widest text-sm rounded-xl shadow-xl shadow-white/5 hover:shadow-[#e5ff00]/20 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed cursor-pointer"
                                style={{
                                  fontFamily: '"BrutalTypeBold", sans-serif',
                                }}
                              >
                                {submittingBooking ? (
                                  <>
                                    <Loader2
                                      size={18}
                                      className="animate-spin"
                                    />
                                    Processing Payment...
                                  </>
                                ) : (
                                  <>
                                    Proceed to Pay
                                    <ArrowRight size={18} strokeWidth={3} />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Discard Confirmation Dropup */}
            <AnimatePresence>
              {showDiscardConfirmation && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm">
                  <div
                    className="absolute inset-0 z-0"
                    onClick={() => setShowDiscardConfirmation(false)}
                  />
                  <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                    className="relative z-10 w-full max-w-md bg-[#0a0a0a] border-t border-white/10 md:border md:rounded-3xl rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]"
                  >
                    {/* Top drag handle (Mobile only) */}
                    <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-2 md:hidden" />

                    {/* Top Right Close Button */}
                    <button
                      type="button"
                      onClick={() => setShowDiscardConfirmation(false)}
                      className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer z-10"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>

                    <div className="flex flex-col items-center text-center mt-2 md:mt-0">
                      {/* Emoji Icon */}
                      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-5 text-3xl shadow-lg shadow-red-500/5">
                        🚨
                      </div>

                      <h4
                        className="text-xl md:text-2xl font-black uppercase text-white mb-2"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        Discard Booking?
                      </h4>
                      <p
                        className="text-xs md:text-sm text-gray-400 mb-8 leading-relaxed max-w-[280px] md:max-w-sm"
                        style={{
                          fontFamily: '"Brutal Font Light", sans-serif',
                        }}
                      >
                        Are you sure you want to discard your selected seats?
                        Your session details will be lost. 🛑
                      </p>

                      <div className="flex flex-col w-full gap-3">
                        <button
                          onClick={() => {
                            setShowDiscardConfirmation(false);
                            setShowContactForm(false);
                            setShowSeatsDrawer(false);
                            setBookingEvent(null);
                          }}
                          className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 hover:border-red-500/30 font-bold uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>🗑️</span> Discard Booking
                        </button>
                        <button
                          onClick={() => setShowDiscardConfirmation(false)}
                          className="w-full py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 font-bold uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>✨</span> Continue Booking
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventList;
