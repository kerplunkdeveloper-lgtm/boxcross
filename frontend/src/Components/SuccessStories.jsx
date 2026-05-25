import React from 'react';

const QuoteIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-[#a3ff00] mb-6">
    <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#a3ff00" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const SuccessStories = () => {
  const stories = [
    {
      quote: "I came to WooHoo for fitness. What I didn't expect was my cholesterol dropping and my fatty liver levels improving. My trainer Bilal's approach goes beyond workouts. This is the only gym I've seen that genuinely cares about your long term health.",
      name: "ANKUR S"
    },
    {
      quote: "I've been training around the city for over a decade, juggling 4-5 gym memberships every year before finally landing at WooHoo. This place is the full package. You actually see the founders on the floor any time of the day, saying hi, asking for feedback. That kind of ownership is rare. You've built something special here.",
      name: "KARTHIK R"
    },
    {
      quote: "I moved back to India after more than a decade in the US. Was very disappointed with the gym scene in India. When I think of WooHoo I think of equipment and cleanliness levels like that of The Bay Club in San Francisco. Amazing job.",
      name: "DEVDUTTA N"
    },
    {
      quote: "As a non-resident Indian new to Bangalore, I wanted a gym where I'd feel safe, comfortable and still get a serious workout. The equipment is international standard, trainers are professional and speak fluent English. It's one of the few gyms in India that feels truly global.",
      name: "ELAHE T"
    },
    {
      quote: "Kudos to the management for doing justice to calling this a premium gym. The machines are super smooth and you can clearly feel the difference in quality compared to anywhere in Bangalore.",
      name: "MOHAMMED J"
    },
    {
      quote: "The best fitness space I've ever trained at. The recovery facilities are exceptional and the equipment is world-class. If you're looking for the perfect blend of recovery, equipment and guidance — WooHoo is unbeatable.",
      name: "FARVATH A"
    }
  ];

  return (
    <section className="w-full bg-[#050505] py-24 px-4 md:px-8 flex flex-col items-center justify-center font-sans relative overflow-hidden">
      
      {/* Background Abstract Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 flex items-center justify-center overflow-hidden">
        <div 
          className="text-[300px] md:text-[500px] font-black transform -rotate-12 whitespace-nowrap leading-none select-none" 
          style={{ 
            WebkitTextStroke: '6px #a3ff00', 
            color: 'transparent',
            fontFamily: '"Bebas Neue", sans-serif'
          }}>
          WOO HOO WOO HOO
        </div>
      </div>

      <div className="w-full max-w-7xl z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h4 className="text-[#a3ff00] font-bold tracking-[0.2em] text-sm mb-4 uppercase">SUCCESS STORIES</h4>
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-widest" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
            THE CHAMPIONS' CIRCLE
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {stories.map((story, index) => (
            <div 
              key={index} 
              className="bg-[#111111]/40 backdrop-blur-sm border border-[#222] rounded-2xl p-8 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300"
            >
              <QuoteIcon />
              <p className="text-[15px] text-gray-300 italic flex-grow font-sans leading-relaxed tracking-wide">
                "{story.quote}"
              </p>
              
              <div className="w-full h-px bg-[#2a2a2a] my-6"></div>
              
              <div className="flex flex-col gap-1.5 mt-auto">
                <span className="text-white font-black tracking-widest text-sm font-sans uppercase">
                  {story.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 font-bold text-xs">G</span>
                  <span className="text-[11px] text-gray-500 font-sans font-medium tracking-wide">Google Review</span>
                </div>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default SuccessStories;
