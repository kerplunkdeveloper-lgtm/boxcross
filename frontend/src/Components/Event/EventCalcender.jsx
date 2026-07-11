import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, Timer, ArrowRight } from 'lucide-react';

const EventCalender = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust so Monday is 0 (0 = Mon, 1 = Tue ... 6 = Sun)
  const firstDayOfMonth = firstDay === 0 ? 6 : firstDay - 1; 

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Group events by day for the current month
  const eventMap = {};
  events.forEach(ev => {
    if (!ev.schedules) return;
    ev.schedules.forEach(sch => {
      const d = new Date(sch.date);
      if (!isNaN(d.getTime()) && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate();
        if (!eventMap[day]) eventMap[day] = [];
        eventMap[day].push({ ...ev, activeSchedule: sch });
      }
    });
  });

  // Automatically select the first day with an event if current selectedDate has no events
  useEffect(() => {
    const daysWithEvents = Object.keys(eventMap).map(Number).sort((a, b) => a - b);
    if (daysWithEvents.length > 0 && !eventMap[selectedDate]) {
      setSelectedDate(daysWithEvents[0]);
    }
  }, [currentMonth, currentYear, events]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const selectedEvents = eventMap[selectedDate] || [];
  
  // Format selected full date
  const selectedFullDate = new Date(currentYear, currentMonth, selectedDate);
  const weekday = selectedFullDate.toLocaleDateString('en-GB', { weekday: 'short' });
  const month = selectedFullDate.toLocaleDateString('en-GB', { month: 'short' });

  return (
    <div className="w-full py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-stretch">
        
        {/* Left Side: Premium Calendar UI */}
        <div className="w-full lg:w-[50%] bg-[#0a0a0a] rounded-[2rem] p-6 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden h-fit">
           {/* Subtle background glow */}
           <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#e5ff00]/10 rounded-full blur-[80px] pointer-events-none" />

           {/* Calendar Header */}
           <div className="flex items-center justify-between mb-8 relative z-10">
             <button onClick={handlePrevMonth} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all border border-white/5 hover:border-white/10 group cursor-pointer">
               <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
             </button>
             <h3 className="text-xl md:text-2xl font-black text-white tracking-wider uppercase" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
               {monthName} {currentYear}
             </h3>
             <button onClick={handleNextMonth} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all border border-white/5 hover:border-white/10 group cursor-pointer">
               <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
             </button>
           </div>
           
           {/* Calendar Grid */}
           <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center relative z-10">
             {days.map(day => (
               <div key={day} className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
                 {day}
               </div>
             ))}
             
             {Array.from({ length: firstDayOfMonth }).map((_, i) => (
               <div key={`empty-${i}`} />
             ))}
             
             {Array.from({ length: daysInMonth }).map((_, i) => {
               const date = i + 1;
               const hasEvents = eventMap[date]?.length > 0;
               const isSelected = selectedDate === date;
               
               let bgClass = "bg-transparent";
               let borderClass = "border-transparent";
               let textClass = "text-gray-400 hover:text-white";
               let dotColor = null;

               if (isSelected && hasEvents) {
                 bgClass = "bg-[#e5ff00]/10";
                 borderClass = "border-[#e5ff00]/50";
                 textClass = "text-[#e5ff00] font-black";
                 dotColor = "bg-[#e5ff00]";
               } else if (hasEvents) {
                 bgClass = "bg-white/[0.03]";
                 borderClass = "border-white/10";
                 textClass = "text-white font-bold";
                 dotColor = "bg-[#e5ff00]";
               } else if (isSelected) {
                 bgClass = "bg-white/10";
                 borderClass = "border-white/20";
                 textClass = "text-white font-bold";
               }

               return (
                 <div key={date} className="flex justify-center">
                   <button 
                     onClick={() => setSelectedDate(date)}
                     className={`relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border transition-all duration-300 ${bgClass} ${borderClass} ${textClass} hover:scale-110 active:scale-95 cursor-pointer`}
                     style={hasEvents || isSelected ? { fontFamily: '"BrutalTypeBold", sans-serif' } : {}}
                   >
                     <span className="text-sm md:text-base">{date}</span>
                     {dotColor && (
                       <span className={`absolute bottom-1.5 md:bottom-2 w-1 h-1 rounded-full ${dotColor} shadow-[0_0_8px_currentColor]`} />
                     )}
                   </button>
                 </div>
               );
             })}
           </div>
        </div>

        {/* Right Side: Event Details Card */}
        <div className="w-full lg:w-[50%] flex flex-col justify-start">
           <div className="flex items-center gap-3 mb-6 px-2">
             <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#e5ff00]">
               <Calendar size={24} strokeWidth={2.5} />
             </div>
             <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
               {weekday} {month} <span className="text-[#e5ff00]">{selectedDate}</span> {currentYear}
             </h2>
           </div>

           <div className="space-y-6">
             {selectedEvents.length > 0 ? (
               selectedEvents.map((event, idx) => {
                 const schedule = event.activeSchedule;
                 const timeSlot = schedule.timeSlots?.[0];

                 return (
                   <div key={idx} className="bg-[#0a0a0a] rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors duration-500">
                     <div className="absolute inset-0 bg-gradient-to-br from-[#e5ff00]/0 via-[#e5ff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                     
                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 relative z-10">
                       <h3 className="text-xl md:text-2xl font-black text-white leading-tight sm:pr-4" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                         {event.title}
                       </h3>
                       {event.price !== null && event.price !== undefined && (
                         <div className="bg-[#e5ff00]/10 border border-[#e5ff00]/30 px-4 py-2 rounded-xl shrink-0">
                           <span className="text-xl font-black text-[#e5ff00]">₹{event.price}</span>
                         </div>
                       )}
                     </div>

                     <div className="space-y-5 relative z-10 mb-8">
                       {timeSlot && (
                         <div className="flex items-start gap-4 text-gray-300 group/item">
                           <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover/item:text-[#e5ff00] group-hover/item:bg-[#e5ff00]/10 transition-colors">
                             <Timer size={18} />
                           </div>
                           <div className="flex flex-col mt-0.5">
                             <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Time</span>
                             <span className="text-sm font-semibold tracking-wide text-gray-200">{timeSlot.time}</span>
                           </div>
                         </div>
                       )}

                       <div className="flex items-start gap-4 text-gray-300 group/item">
                         <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover/item:text-[#e5ff00] group-hover/item:bg-[#e5ff00]/10 transition-colors">
                           <MapPin size={18} />
                         </div>
                         <div className="flex flex-col mt-0.5">
                           <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Location</span>
                           <span className="text-sm font-semibold tracking-wide text-gray-200 leading-relaxed">{event.location}</span>
                         </div>
                       </div>

                       {timeSlot && (
                         <div className="flex items-start gap-4 text-gray-300 group/item">
                           <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover/item:text-[#e5ff00] group-hover/item:bg-[#e5ff00]/10 transition-colors">
                             <Users size={18} />
                           </div>
                           <div className="flex flex-col mt-0.5">
                             <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Availability</span>
                             <span className="text-sm font-semibold tracking-wide text-gray-200">
                               {timeSlot.slots - (timeSlot.booked || 0)} spots available
                             </span>
                           </div>
                         </div>
                       )}
                     </div>

                     <button className="w-full relative z-10 bg-[#e5ff00] text-black font-black uppercase tracking-widest text-[13px] py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 group/btn cursor-pointer">
                       Book This Session
                       <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                   </div>
                 );
               })
             ) : (
               <div className="bg-[#0a0a0a] rounded-[2rem] p-12 border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center transition-all">
                  <Calendar size={48} className="text-gray-700 mb-4" strokeWidth={1} />
                  <p className="text-gray-400 font-medium">No events scheduled for this day.</p>
               </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default EventCalender;