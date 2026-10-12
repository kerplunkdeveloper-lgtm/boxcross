import React from "react";
import { Helmet } from "react-helmet-async";

const FounderMembersOffers = () => {
  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 py-20 bg-black text-white selection:bg-[#ccf141] selection:text-black">
      <Helmet>
        <title>Founder Members Offers | BOX & CROSS</title>
        <meta
          name="description"
          content="Exclusive founder members offers at BOX & CROSS."
        />
      </Helmet>

      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#ccf141]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#ff4655]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-md w-full mx-auto p-8 sm:p-12 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl shadow-2xl text-center group">
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-[#ccf141]/20 via-transparent to-transparent opacity-75 pointer-events-none" />

        {/* Badge */}
        <div className="inline-block mb-5">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#ccf141] bg-[#ccf141]/10 px-3.5 py-1.5 rounded-full border border-[#ccf141]/20">
            Founder Members Offers
          </span>
        </div>

        {/* Requested 'hi' Message */}
        <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-white uppercase drop-shadow-md">
          hi
        </h1>

        <p className="mt-4 text-sm text-neutral-400">
          Welcome to the founder members offers portal.
        </p>
      </div>
    </div>
  );
};

export default FounderMembersOffers;
