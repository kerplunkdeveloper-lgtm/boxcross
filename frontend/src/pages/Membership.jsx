import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import MembershipPlans from "../Components/Membership";
import Founding30Section from "../Components/Founding30Section";
import AOS from "aos";
import "aos/dist/aos.css";
import bannerImg from "../assets/banner.png";
import WhatWeOffer from "../Components/WhatWeOffer";
import TrainingZones from "../Components/TrainingZones";
// import BuildProgress from "../Components/BuildProgress";
import BookForm from "../Components/BookForm";

const BASE_URL = "https://membership.boxandcross.com";

const Membership = () => {
  useEffect(() => {
    const initAOS = () => {
      AOS.init({ duration: 1000, once: true });
      AOS.refresh();
    };

    if (window.isPreloaderDone) {
      initAOS();
    } else {
      window.addEventListener("preloaderComplete", initAOS);
      return () => window.removeEventListener("preloaderComplete", initAOS);
    }
  }, []);

  return (
    <div className="w-full bg-[#050505]  flex flex-col  overflow-hidden ">
      <Helmet>
        <title>Membership Plans | Box &amp; Cross – Performance Arena</title>
        <meta
          name="description"
          content="At Box &amp; Cross (BXC), every plan is designed to give you access to our premium performance arena, structured coaching, and the BXC community. Choose the plan that suits your goals and timeline."
        />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Box &amp; Cross" />
        <meta property="og:url" content={`${BASE_URL}/`} />
        <meta
          property="og:title"
          content="Membership Plans | Box &amp; Cross – Performance Arena"
        />
        <meta
          property="og:description"
          content="At Box &amp; Cross (BXC), every plan is designed to give you access to our premium performance arena, structured coaching, and the BXC community. Choose the plan that suits your goals and timeline."
        />
        <meta property="og:image" content={`${BASE_URL}/og-membership.png`} />
        <meta property="og:image:secure_url" content={`${BASE_URL}/og-membership.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="675" />
        <meta property="og:image:alt" content="Box and Cross Membership Plans" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`${BASE_URL}/`} />
        <meta
          name="twitter:title"
          content="Membership Plans | Box &amp; Cross – Performance Arena"
        />
        <meta
          name="twitter:description"
          content="At Box &amp; Cross (BXC), every plan is designed to give you access to our premium performance arena, structured coaching, and the BXC community."
        />
        <meta name="twitter:image" content={`${BASE_URL}/og-membership.png`} />
      </Helmet>
      {/* HERO SECTION */}
      <section className="relative mt-[80px] md:mt-0 w-full h-[40vh] md:h-[70vh]   flex items-center justify-center overflow-hidden mb-10">
        {/* IMAGE BACKGROUND */}
        <img
          src={bannerImg}
          alt="Membership Background"
          className="absolute inset-0 w-full h-full object-cover scale-105 filter grayscale-[50%]"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50 z-[1]"></div>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#050505] z-[2]"></div>

        {/* HUGE BACKGROUND TEXT (Outline) */}
        <div className="absolute inset-x-0 top-10 md:top-30  flex justify-center pointer-events-none z-[5] overflow-hidden">
          <span
            className="text-transparent font-black uppercase text-[50px] md:text-[150px] whitespace-nowrap select-none tracking-widest leading-none"
            style={{
              WebkitTextStroke: "1px rgba(255, 255, 255, 0.25)",
              fontFamily: '"BrutalTypeBold", Arial, sans-serif',
            }}
          >
            MEMBERSHIP
          </span>
        </div>

        {/* CONTENT */}
        <div className="relative md:mt-[90px] z-10 w-full h-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between md:gap-16 pt-20 md:pt-0">
          {/* LEFT SIDE: HEADING */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full flex flex-col justify-center text-center md:text-left z-10"
          >
            <h1
              className="
                text-white
                font-black
                mt-8 md:mt-20
                uppercase
                leading-[0.95]
                tracking-tight
                drop-shadow-[0_5px_20px_rgba(0,0,0,0.9)]
              "
              style={{
                fontFamily: '"BrutalTypeBold", Impact, sans-serif',
              }}
            >
              <motion.span
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="block text-[44px] sm:text-[60px] md:text-[85px] whitespace-normal md:whitespace-nowrap"
              >
                BXC
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block text-[44px] sm:text-[60px] md:text-[85px] text-[#ccf141] whitespace-normal md:whitespace-nowrap"
              >
                MEMBERSHIP
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block text-[44px] sm:text-[60px] md:text-[85px] whitespace-normal md:whitespace-nowrap"
              >
                PLANS
              </motion.span>
            </h1>
          </motion.div>

          {/* RIGHT SIDE: SUBTITLE & BUTTONS */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full flex flex-col justify-center items-start md:max-w-lg z-10"
          >
            <p
              className="
                text-[#c9c9c9]
                text-base md:text-[17px]
                mt-[-3px] md:mt-25
                leading-relaxed
                hidden md:block
                mb-5
              "
              style={{
                fontFamily: '"Brutal Font Light", sans-serif',
                fontWeight: 700,
              }}
            >
              At BXC, every plan is designed to give you access to our premium
              performance arena, structured coaching, and the BXC community.
              Choose the plan that suits your goals and timeline.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="
                flex
                flex-row
                items-center
                justify-center
                md:justify-start
                gap-3 sm:gap-4
                w-full
                max-w-[700px]
              "
              style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontWeight: 700,
              }}
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const el = document.getElementById("book-your-free-gym-tour");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="
                  group relative overflow-hidden
                  px-4 py-3 md:px-8 md:py-3.5
                  bg-[#ccf141] text-black
                  uppercase tracking-wider md:tracking-[0.05em]
                  rounded-lg
                  transition-all duration-300
                  cursor-pointer
                  flex justify-center items-center
                  shadow-[0_0_20px_rgba(229,255,0,0.25)]
                "
              >
                <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 text-[11px] sm:text-[13px] md:text-[15px] whitespace-nowrap"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 800,
                  }}
                >
                  Book Your Free Gym Tour
                </span>
              </motion.button>

              {/* PLANS BUTTON */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const el = document.getElementById("membership-plans");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="
                  group relative overflow-hidden
                  px-4 py-3 md:px-8 md:py-3.5
                  bg-white
                  text-black
                  uppercase tracking-wider md:tracking-[0.05em]
                  rounded-lg
                  transition-all duration-300
                  cursor-pointer
                  flex justify-center items-center
                "
              >
                <span className="absolute inset-0 bg-[#ccf141] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 text-[11px] sm:text-[13px] md:text-[15px] whitespace-nowrap"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 800,
                  }}
                >
                  Membership Plans
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* marquee */}
      {/* Infinite Text Marquee */}
      <div className="w-full bg-black py-4 md:py-6 border-y border-zinc-900/60 overflow-hidden select-none pointer-events-none">
        <div className="marquee-experience-wrapper">
          <div className="marquee-experience-track">
            {Array(8)
              .fill([
                { text: "BOXING.", outline: false },
                { text: "STRENGTH.", outline: true },
                { text: "HYROX.", outline: false },
                { text: "FIGHT CLUB.", outline: true },
              ])
              .flat()
              .map((item, idx) => (
                <span
                  key={idx}
                  className="text-[40px] sm:text-[55px] md:text-[75px] lg:text-[80px] font-black uppercase tracking-tight mx-4 sm:mx-6 md:mx-8 inline-block"
                  style={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    color: item.outline ? "transparent" : "#ffffff",
                    WebkitTextStroke: item.outline
                      ? "1px rgba(255, 255, 255, 0.75)"
                      : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.text}
                </span>
              ))}
          </div>
        </div>
        <style>{`
          .marquee-experience-wrapper {
            width: 100%;
            overflow: hidden;
            display: flex;
          }
          .marquee-experience-track {
            display: flex;
            white-space: nowrap;
            width: max-content;
            animation: scrollLeftExperienceMarquee 95s linear infinite;
          }
          @keyframes scrollLeftExperienceMarquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>

      {/* FOUNDING 30 EXCLUSIVE SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Founding30Section />
      </motion.div>

      {/* MEMBERSHIP SECTION */}
      <div className="relative z-20">
        {/* Membership Plans section (Step 1 & Step 2) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <MembershipPlans />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <WhatWeOffer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <TrainingZones />
        </motion.div>

        {/* <BuildProgress /> */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <BookForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Membership;
