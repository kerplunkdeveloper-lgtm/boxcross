import React from "react";
import { Check, Calendar, Shield } from "lucide-react";
import { motion } from "framer-motion";

const ChoosePlan = React.forwardRef(
  (
    { activeData, activeTab, subTabs, setSubTabs, handlePlanSelect, programs },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className="w-full max-w-7xl mx-auto border-t border-gray-800 pt-12 pb-8 scroll-mt-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span
            className="px-4 py-2 rounded-md  border border-[#e5ff00]/30 bg-[#e5ff00]/10 text-[#e5ff00] uppercase"
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            STEP 2
          </span>

          <h2
            className="mt-5 md:mt-10 font-black mb-5 md:mb-8 leading-tight "
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontWeight: "700",
                   fontSize: "48px",
            }}
          >
            CHOOSE YOUR <br />{" "}
            <span className="text-[#e5ff00]">{activeData.title}</span>
          </h2>
          <div
            className="flex  flex-wrap items-center justify-center gap-3 text-gray-400 text-[11px]"
            style={{
              fontSize: "16px",
              fontWeight: "500",
              fontFamily: '"Brutal Type Regular", sans-serif',
            }}
          >
            {activeData.features.map((feature, i) => (
              <React.Fragment key={i}>
                <span className="flex items-center gap-1">
                  <Check size={12} className="text-[#e5ff00]" /> {feature}
                </span>
                {i < activeData.features.length - 1 && <span>•</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Sub-Tabs for Step 2 */}
          {(() => {
            const activeProg = programs.find((p) => p.id === activeTab);
            if (activeProg && activeProg.tabs) {
              return (
                <div className="flex justify-center mt-8 relative z-20 mb-10">
                  <div className="inline-flex bg-black border border-gray-800 rounded-full p-1.5 shadow-2xl relative">
                    {activeProg.tabs.map((tab) => {
                      const isActive = subTabs[activeProg.id] === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() =>
                            setSubTabs((prev) => ({
                              ...prev,
                              [activeProg.id]: tab.id,
                            }))
                          }
                          className={`relative px-6 py-2.5 md:px-10 md:py-3 text-[10px] md:text-xs font-bold tracking-[0.1em] md:tracking-[0.15em] uppercase rounded-full transition-colors duration-300 z-10 ${
                            isActive
                              ? "text-black"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId={`active-tab-${activeProg.id}`}
                              className="absolute inset-0 bg-[#e5ff00] rounded-full shadow-[0_0_15px_rgba(222,251,2,0.2)]"
                              style={{ zIndex: -1 }}
                              transition={{
                                type: "spring",
                                bounce: 0.2,
                                duration: 0.6,
                              }}
                            />
                          )}
                          {tab.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </motion.div>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6">
          {/* PRICING CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 mt-8">
            {activeData.plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: plan.isPopular ? 1.03 : 1,
                }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`bg-[#111] rounded-xl flex flex-col relative border ${
                  plan.isPopular
                    ? "border-[#e5ff00] shadow-[0_0_15px_rgba(222,251,2,0.15)] z-10"
                    : "border-gray-800"
                }`}
              >
                {plan.tag && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e5ff00] text-black text-[10px] font-bold px-4 py-1 rounded-sm tracking-wider uppercase whitespace-nowrap z-10">
                    {plan.tag}
                  </div>
                )}

                <div className="p-6 flex flex-col items-center text-center border-b border-gray-800">
                  <h3
                    className="text-lg md:text-xl font-black tracking-wide mb-1.5"
                    style={{
                      fontFamily: '"Brutal Font", sans-serif',
                    }}
                  >
                    {plan.months}
                  </h3>
                  <p
                    className="text-[#e5ff00] text-[10px] md:text-[11px] font-extrabold tracking-widest uppercase mb-4"
                    style={{
                      fontFamily: '"Brutal Font", sans-serif',
                    }}
                  >
                    {plan.subtitle}
                  </p>
                  <div className="flex items-start justify-center gap-1 mb-1">
                    <span className="text-xl font-bold mt-1">₹</span>
                    <span
                      className="text-4xl md:text-5xl font-black tracking-tight"
                      style={{
                        fontFamily: '"Brutal Font", sans-serif',
                      }}
                    >
                      {plan.price}
                    </span>
                  </div>
                  <p
                    className="text-gray-400 text-xs md:text-sm font-medium"
                    style={{
                      fontFamily: '"Brutal Font", sans-serif',
                    }}
                  >
                    ₹{plan.perMonth} / month
                  </p>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-4 mb-6 flex-1">
                    {plan.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs md:text-sm text-gray-200"
                      >
                        <Check
                          size={16}
                          className="text-[#e5ff00] shrink-0 mt-0.5"
                        />
                        <span
                          className="leading-snug"
                          style={{
                            fontFamily: '"Brutal Font", sans-serif',
                          }}
                        >
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() =>
                      handlePlanSelect(
                        `${activeData.title} - ${plan.months}`,
                        plan.price,
                        plan.months,
                      )
                    }
                    className={`group/planbtn relative overflow-hidden w-full py-3.5 text-xs font-bold uppercase tracking-widest transition-colors rounded-lg ${
                      plan.isPopular
                        ? "bg-[#e5ff00] text-black"
                        : "border border-gray-600 text-white hover:border-white"
                    }`}
                  >
                    <div className="absolute inset-0 bg-white translate-x-[100%] group-hover/planbtn:translate-x-0 transition-transform duration-500 ease-out z-0"></div>
                    <span
                      className={`relative z-10 transition-colors duration-300 ${plan.isPopular ? "text-black" : "group-hover/planbtn:text-black"}`}
                      style={{
                        fontFamily: '"Brutal Font", sans-serif',
                      }}
                    >
                      {plan.buttonText}
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* STARTER ACCESS CARD */}
          <div className="w-full lg:w-[240px] flex flex-col gap-4 mt-6 lg:mt-0">
            <div className="bg-[#111] border border-gray-800 rounded-xl p-6 text-center flex flex-col items-center justify-center flex-1 hover:border-gray-600 transition-colors cursor-pointer group">
              <Calendar size={28} className="text-[#e5ff00] mb-3" />
              <p className="text-[11px] md:text-xs text-gray-400 uppercase tracking-widest font-bold mb-2 group-hover:text-gray-300">
                NOT SURE?
              </p>
              <h4 className="text-base font-black mb-3 leading-tight">
                Try 1 Month
                <br />
                Starter Access
              </h4>
              <p className="text-3xl font-black mb-5">
                ₹{activeData.starterPrice}
              </p>
              <button
                onClick={() =>
                  handlePlanSelect(
                    `1 Month Starter Access - ${activeData.title}`,
                    activeData.starterPrice,
                    "1 MONTH",
                  )
                }
                className="group/trybtn relative overflow-hidden w-full py-2.5 border border-gray-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:border-white transition-colors"
              >
                <div className="absolute inset-0 bg-white translate-x-[100%] group-hover/trybtn:translate-x-0 transition-transform duration-500 ease-out z-0"></div>
                <span className="relative z-10 transition-colors duration-300 group-hover/trybtn:text-black">
                  TRY NOW
                </span>
              </button>
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-xl p-6 text-center hover:border-gray-600 transition-colors">
              <Shield size={24} className="text-[#e5ff00] mx-auto mb-2" />
              <h4 className="text-sm font-black mb-1.5">
                Flexible
                <br />
                Membership
                <br />
                Support
              </h4>
              <p className="text-xs text-gray-400">
                We've got your back when life happens.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ChoosePlan.displayName = "ChoosePlan";

export default ChoosePlan;
