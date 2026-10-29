import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MembershipTierDetail from "../Components/MembershipTierDetail";
import duoCoupleImg from "../assets/duo_couple.jpg";
import { Target, Dumbbell, Trophy, Shield, Users, ArrowRight } from "lucide-react";

// 1. DUO CORE DATA (1 PATHWAY FOR TWO)
const duoCoreData = {
  id: "duo",
  title: "BXC DUO - CORE",
  badge: "2 PERSON PASS • ONE PATHWAY",
  metaTitle: "BXC Duo Core Membership | 2 Person Pass | Box & Cross",
  metaDescription:
    "Partner training with five coached sessions a week for two in one discipline (Boxing, HYROX, or Strength Training) at Box & Cross.",
  subtitle: "ONE DISCIPLINE TOGETHER. DOUBLE THE ACCOUNTABILITY.",
  desc: "Five coached sessions a week for two members dedicated entirely to one chosen pathway — Boxing, HYROX, or Strength Training. Training with a partner boosts consistency by over 70% while keeping motivation and energy peak high.",
  image: duoCoupleImg,
  disciplineCount: "1 Pathway for Two",
  starterPrice: "6,800",
  dailyRate: "₹224",
  dailyRateLabel: "A DAY FOR 2 ON 12-MONTH PLAN",
  dailyComparison: "Two coffees and morning breakfast for two.",
  pathwaySectionDesc:
    "Duo Core partners dedicate their weekly coached sessions to mastering one chosen discipline together.",
  pathways: [
    {
      name: "Performance Boxing for Two",
      tag: "FIGHT DISCIPLINE FOR PARTNERS",
      description:
        "Learn authentic boxing mechanics together: jab-cross combos, footwork sync, slip and roll defense, heavy bag rounds, and partner mitt drills under elite coaches.",
      highlights: [
        "Synchronized stance & footwork fundamentals",
        "Partner heavy bag and mitt work rounds",
        "Defensive head movement & partner reactions",
        "High-calorie fight conditioning & cardio",
      ],
    },
    {
      name: "HYROX Lab for Two",
      tag: "RACE & ENDURANCE FOR PARTNERS",
      description:
        "Engineered for partner cardiovascular output, stamina, and team endurance. High-tempo sled pushes, ski erg pacing, wall balls, and interval running.",
      highlights: [
        "Official HYROX partner relay standards",
        "Ergometer & sprint interval team pacing",
        "Aerobic capacity & shared mental grit",
        "High-density metabolic partner conditioning",
      ],
    },
    {
      name: "Strength Lab for Two",
      tag: "POWER & HYPERTROPHY FOR PARTNERS",
      description:
        "Structured compound strength training with barbells, dumbbells, and partner spotting. Focus on correct biomechanics and progressive overload together.",
      highlights: [
        "Squat, deadlift, and bench press mechanics",
        "Partner spotting & safety execution",
        "Progressive overload periodization",
        "Core stability & rotational power",
      ],
    },
  ],
  plans: [
    {
      months: "1 MONTH",
      subtitle: "STANDARD",
      price: "8,500",
      totalPrice: "8,500",
      perMonth: "8,500",
      originalPrice: "",
      highlights: [
        "Five coached sessions a week for 2",
        "One pathway focus for both",
        "Full open gym & recovery lounge",
        "Coach baseline check for two",
      ],
      tag: "STANDARD",
      buttonText: "STANDARD",
    },
    {
      months: "3 MONTHS",
      subtitle: "SAVE ₹1,500",
      price: "24,000",
      totalPrice: "24,000",
      perMonth: "8,000",
      originalPrice: "25,500",
      highlights: [
        "Five coached sessions a week for 2",
        "Held rate for full quarter",
        "Joint coach assessment review",
        "InBody scan included for both",
      ],
      tag: "SAVE ₹1,500",
      buttonText: "SAVE ₹1,500",
    },
    {
      months: "6 MONTHS",
      subtitle: "SAVE ₹6,000",
      price: "45,000",
      totalPrice: "45,000",
      perMonth: "7,500",
      originalPrice: "51,000",
      isPopular: true,
      highlights: [
        "Five coached sessions a week for 2",
        "Locked rate for both members",
        "Partner benchmark card",
        "Free locker allocation for two",
      ],
      tag: "MOST POPULAR",
      buttonText: "SAVE ₹6,000",
    },
    {
      months: "12 MONTHS",
      subtitle: "SAVE ₹20,400",
      price: "81,600",
      totalPrice: "81,600",
      perMonth: "6,800",
      originalPrice: "102,000",
      highlights: [
        "Five coached sessions a week for 2",
        "Maximum partner discount (₹224/day for two)",
        "Founding Wall duo recognition plaque",
        "Complimentary BXC Duo starter kit",
      ],
      tag: "BEST VALUE",
      buttonText: "SAVE ₹20,400",
    },
    {
      months: "24 MONTHS",
      subtitle: "SAVE ₹64,800",
      price: "139,200",
      totalPrice: "139,200",
      perMonth: "5,800",
      originalPrice: "204,000",
      highlights: [
        "Five coached sessions a week for 2",
        "2-Year duo rate freeze guarantee",
        "Founding Wall duo recognition",
        "VIP guest passes included for friends",
      ],
      tag: "2-YEAR LOCK",
      buttonText: "SAVE ₹64,800",
    },
  ],
  benefits: [
    {
      boldText: "You never skip when someone is waiting.",
      normalText:
        "Partner accountability cuts skipped sessions by over 70%. When your workout partner is showing up, you show up too.",
    },
    {
      boldText: "Shared grind builds unbreakable bonds.",
      normalText:
        "Sweat together on the canvas, push sleds together, and celebrate every physical milestone side by side.",
    },
    {
      boldText: "Coached side-by-side by elite trainers.",
      normalText:
        "Both partners receive personalized technique correction, load scaling, and motivation from certified coaches.",
    },
    {
      boldText: "Better value, together.",
      normalText:
        "Two complete, premium coached memberships packaged under one affordable plan with maximum partner savings.",
    },
  ],
  allInclusions: [
    "5 Coached group sessions every week for two members",
    "Choice of Boxing, HYROX or Strength pathway",
    "Open gym floor access during operational hours",
    "InBody Body Composition analysis check-ins for both",
    "Partner progressive technique evaluations",
    "Clean locker rooms and hot showers",
    "Community workouts and duo challenge masterclasses",
    "Access to BXC performance workshops",
  ],
  otherTiers: [
    {
      id: "core",
      title: "INDIVIDUAL CORE",
      badge: "ONE PATHWAY • SINGLE",
      price: "2,800",
      path: "/membership/core",
      icon: <Target size={24} />,
    },
    {
      id: "family",
      title: "FAMILY FIT",
      badge: "ALL AGES • UP TO 4",
      price: "11,900",
      path: "/membership/family",
      icon: <Users size={24} />,
    },
    {
      id: "junior",
      title: "JUNIOR CORE",
      badge: "UNDER 13 • YOUTH",
      price: "1,958",
      path: "/membership/junior",
      icon: <Trophy size={24} />,
    },
  ],
  faqs: [
    {
      q: "Can my partner and I choose different pathways on Duo Core?",
      a: "On Duo Core, both partners share the same chosen pathway (Boxing, HYROX, or Strength Training) so you can train together in the same coached sessions. If you want multi-pathway flexibility, choose Duo Athlete or Duo Arena!",
    },
    {
      q: "What if one partner is a beginner and the other is advanced?",
      a: "Every session is led by a coach who scales individual weights, intensity, and combinations to each person's specific fitness level. You train in the same class while working at your own optimal pace.",
    },
    {
      q: "Can we transfer the pass if my partner relocates?",
      a: "Yes! You can transfer the second member slot to a friend, colleague, or family member upon written email notice with zero penalty.",
    },
    {
      q: "Can we freeze our membership if we travel?",
      a: "Yes, 6-month, 12-month, and 24-month memberships include official hold allowances for both members.",
    },
  ],
};

// 2. DUO ATHLETE DATA (2 PATHWAYS FOR TWO)
const duoAthleteData = {
  id: "duo_athlete",
  title: "BXC DUO - ATHLETE",
  badge: "2 PERSON PASS • TWO PATHWAYS • MOST POPULAR",
  metaTitle: "BXC Duo Athlete Membership | Two Pathways for Two | Box & Cross",
  metaDescription:
    "Train like complete hybrid athletes together with 5 coached sessions a week across two pathways for two members at Box & Cross.",
  subtitle: "TWO DISCIPLINES TOGETHER. COMPLETE HYBRID TEAMWORK.",
  desc: "Five coached sessions a week for two members balanced across two disciplines — Boxing + HYROX or Boxing + Strength Training. Built for partners who refuse to be one-dimensional: powerful, lean, and possessing relentless athletic cardiovascular capacity.",
  image: duoCoupleImg,
  disciplineCount: "2 Pathways for Two",
  starterPrice: "9,600",
  dailyRate: "₹315",
  dailyRateLabel: "A DAY FOR 2 ON 12-MONTH PLAN",
  dailyComparison: "One casual lunch for two.",
  pathwaySectionDesc:
    "Duo Athlete partners combine two complementary pathways to unlock hybrid conditioning, elite stamina, and avoid training plateaus.",
  pathways: [
    {
      name: "Boxing + HYROX for Two",
      tag: "THE FIGHT ENGINE",
      description:
        "Pairs technical striking, speed, and reaction drills with high-output HYROX endurance intervals for both partners. Builds a relentless gas tank and lean athletic physique.",
      highlights: [
        "Unbeatable aerobic & anaerobic team stamina",
        "Fast-twitch speed paired with long-haul endurance",
        "Sled drives, ergs, and heavy bag conditioning",
        "High calorie burn and rapid body recomposition",
      ],
    },
    {
      name: "Boxing + Strength for Two",
      tag: "THE POWER STRIKERS",
      description:
        "Combines heavy barbell lifts and hypertrophy with rotational boxing power, footwork, and core defense for both partners. Strength with knockout agility.",
      highlights: [
        "Kinetic chain rotational power generation",
        "Compound lifts (deadlifts, squats, bench press)",
        "Shoulder stability, punch endurance & armor",
        "Muscular definition without losing agility",
      ],
    },
    {
      name: "HYROX + Strength for Two",
      tag: "HYBRID PERFORMANCE",
      description:
        "Dual focus on functional strength and race-day endurance. Perfect for HYROX doubles competitors, obstacle racers, and pure athletic teamwork.",
      highlights: [
        "Lactate threshold management & team pacing",
        "Strength-endurance under heavy heart rates",
        "Grip, carry, and sled push strength",
        "Cardiorespiratory VO2 Max optimization",
      ],
    },
  ],
  plans: [
    {
      months: "1 MONTH",
      subtitle: "STANDARD",
      price: "12,000",
      totalPrice: "12,000",
      perMonth: "12,000",
      originalPrice: "",
      highlights: [
        "Five coached sessions a week for 2",
        "Two disciplines access for both",
        "Full arena facilities access",
        "Dual coach baseline assessment",
      ],
      tag: "STANDARD",
      buttonText: "STANDARD",
    },
    {
      months: "3 MONTHS",
      subtitle: "SAVE ₹2,000",
      price: "34,000",
      totalPrice: "34,000",
      perMonth: "11,333",
      originalPrice: "36,000",
      highlights: [
        "Five coached sessions a week for 2",
        "Held rate for full term",
        "Joint coach hybrid assessment",
        "InBody scan review for both",
      ],
      tag: "SAVE ₹2,000",
      buttonText: "SAVE ₹2,000",
    },
    {
      months: "6 MONTHS",
      subtitle: "SAVE ₹8,000",
      price: "64,000",
      totalPrice: "64,000",
      perMonth: "10,667",
      originalPrice: "72,000",
      isPopular: true,
      highlights: [
        "Five coached sessions a week for 2",
        "Locked rate for both members",
        "Partner hybrid progress card",
        "Free locker allocation for two",
      ],
      tag: "MOST POPULAR",
      buttonText: "SAVE ₹8,000",
    },
    {
      months: "12 MONTHS",
      subtitle: "SAVE ₹28,800",
      price: "115,200",
      totalPrice: "115,200",
      perMonth: "9,600",
      originalPrice: "144,000",
      highlights: [
        "Five coached sessions a week for 2",
        "Maximum partner discount (₹315/day for two)",
        "Founding Wall duo recognition plaque",
        "Complimentary BXC Duo athlete gear kit",
      ],
      tag: "BEST VALUE",
      buttonText: "SAVE ₹28,800",
    },
    {
      months: "24 MONTHS",
      subtitle: "SAVE ₹91,200",
      price: "196,800",
      totalPrice: "196,800",
      perMonth: "8,200",
      originalPrice: "288,000",
      highlights: [
        "Five coached sessions a week for 2",
        "2-Year duo rate freeze guarantee",
        "Founding Wall duo recognition",
        "VIP guest passes included for friends",
      ],
      tag: "2-YEAR LOCK",
      buttonText: "SAVE ₹91,200",
    },
  ],
  benefits: [
    {
      boldText: "Two pathways, twice the motivation.",
      normalText:
        "Combine Boxing and Strength or HYROX side by side without boredom or hitting progress plateaus.",
    },
    {
      boldText: "Break performance barriers as a team.",
      normalText:
        "Complementary disciplines keep both partners progressing consistently in cardio, power, and muscle tone.",
    },
    {
      boldText: "Train for hybrid races together.",
      normalText:
        "Ideal for HYROX doubles, road races, or competitive sporting goals that demand teamwork and endurance.",
    },
    {
      boldText: "Complete hybrid athleticism.",
      normalText:
        "Never choose between lifting heavy and running fast. You and your partner master both.",
    },
  ],
  allInclusions: [
    "5 Coached group sessions every week for two members",
    "Choice of any 2 pathways (Boxing + HYROX or Boxing + Strength)",
    "Open gym floor access during operational hours",
    "InBody Body Composition analysis check-ins for both",
    "Partner progressive hybrid benchmarks",
    "Clean locker rooms and hot showers",
    "Community workouts and partner masterclasses",
    "Access to BXC performance workshops",
  ],
  otherTiers: [
    {
      id: "core",
      title: "INDIVIDUAL ATHLETE",
      badge: "TWO PATHWAYS • SINGLE",
      price: "4,000",
      path: "/membership/athlete",
      icon: <Dumbbell size={24} />,
    },
    {
      id: "family",
      title: "FAMILY FIT",
      badge: "ALL AGES • UP TO 4",
      price: "11,900",
      path: "/membership/family",
      icon: <Users size={24} />,
    },
    {
      id: "junior",
      title: "JUNIOR CORE",
      badge: "UNDER 13 • YOUTH",
      price: "1,958",
      path: "/membership/junior",
      icon: <Trophy size={24} />,
    },
  ],
  faqs: [
    {
      q: "Can we switch our 2 chosen pathways?",
      a: "Yes! At the start of any new training phase, you and your coach can adjust your pathway pairing (e.g. from Boxing + Strength to Boxing + HYROX).",
    },
    {
      q: "Are the partner sessions synchronized?",
      a: "Yes, you can book into the same coached session slots to train right next to each other on the arena floor.",
    },
    {
      q: "What if one partner wants to do Strength while the other does Boxing?",
      a: "With Duo Athlete, each member can independently attend their chosen pathway sessions at scheduled class times!",
    },
  ],
};

// 3. DUO ARENA DATA (ALL PATHWAYS FOR TWO)
const duoArenaData = {
  id: "duo_arena",
  title: "BXC DUO - ARENA",
  badge: "2 PERSON PASS • ALL ACCESS VIP",
  metaTitle: "BXC Duo Arena Membership | All Access for Two | Box & Cross",
  metaDescription:
    "Unrestricted arena access for two members with five coached sessions a week across all disciplines (Boxing + HYROX + Strength) plus VIP perks at Box & Cross.",
  subtitle: "EVERY PATHWAY. ALL CLASSES. ZERO LIMITS FOR TWO.",
  desc: "Five coached sessions a week for two members with complete, unrestricted access to all disciplines — Boxing + HYROX + Strength Training. Includes priority ring & floor booking, VIP partner lockers, and exclusive community masterclasses.",
  image: duoCoupleImg,
  disciplineCount: "All Access for Two",
  starterPrice: "13,600",
  dailyRate: "₹447",
  dailyRateLabel: "A DAY FOR 2 ON 12-MONTH PLAN",
  dailyComparison: "A shared dinner for two.",
  pathwaySectionDesc:
    "Duo Arena unlocks every corner of the arena for both partners with complete scheduling freedom across all 3 disciplines.",
  pathways: [
    {
      name: "All Three Disciplines for Two",
      tag: "UNRESTRICTED ACCESS",
      description:
        "Rotate between Boxing, HYROX, and Strength Training without limitations. Train whatever you feel like, whenever your schedule allows.",
      highlights: [
        "Unrestricted booking across Boxing, HYROX & Strength",
        "Priority ring time & heavy bag reservation",
        "5 Coached sessions per week for both members",
        "Open gym access anytime during operating hours",
      ],
    },
    {
      name: "Priority Arena Floor & Ring Privileges",
      tag: "VIP PRIVILEGES",
      description:
        "Priority lane access, ring sparring slots, partner recovery amenities, and dedicated coaching attention from senior head coaches.",
      highlights: [
        "Priority class reservation window",
        "Dedicated partner locker allocation",
        "Complimentary monthly InBody scans for both",
        "VIP guest passes for visiting friends",
      ],
    },
    {
      name: "Masterclasses & Tribe Community",
      tag: "EXCLUSIVE EVENTS",
      description:
        "VIP invitations to closed-door masterclasses, visiting athlete workshops, and BXC community fight nights for both partners.",
      highlights: [
        "Closed-door technique clinics with guest champions",
        "VIP invitations to community fight nights",
        "Quarterly private coach strategy reviews",
        "Exclusive BXC Arena merchandise discounts",
      ],
    },
  ],
  plans: [
    {
      months: "1 MONTH",
      subtitle: "STANDARD",
      price: "17,000",
      totalPrice: "17,000",
      perMonth: "17,000",
      originalPrice: "",
      highlights: [
        "Five coached sessions a week for 2",
        "All pathways & disciplines for both",
        "Unrestricted arena access",
        "Priority ring & floor access",
      ],
      tag: "STANDARD",
      buttonText: "STANDARD",
    },
    {
      months: "3 MONTHS",
      subtitle: "SAVE ₹3,000",
      price: "48,000",
      totalPrice: "48,000",
      perMonth: "16,000",
      originalPrice: "51,000",
      highlights: [
        "Five coached sessions a week for 2",
        "All pathways & disciplines",
        "Joint coach assessment",
        "VIP guest passes included",
      ],
      tag: "SAVE ₹3,000",
      buttonText: "SAVE ₹3,000",
    },
    {
      months: "6 MONTHS",
      subtitle: "SAVE ₹12,000",
      price: "90,000",
      totalPrice: "90,000",
      perMonth: "15,000",
      originalPrice: "102,000",
      isPopular: true,
      highlights: [
        "Five coached sessions a week for 2",
        "All pathways & disciplines",
        "Guest passes included for friends",
        "Dedicated partner locker allocation",
      ],
      tag: "MOST POPULAR",
      buttonText: "SAVE ₹12,000",
    },
    {
      months: "12 MONTHS",
      subtitle: "SAVE ₹40,800",
      price: "163,200",
      totalPrice: "163,200",
      perMonth: "13,600",
      originalPrice: "204,000",
      highlights: [
        "Five coached sessions a week for 2",
        "All pathways & disciplines",
        "Founding Wall duo recognition plaque",
        "VIP passes & complimentary gear kit for two",
      ],
      tag: "BEST VALUE",
      buttonText: "SAVE ₹40,800",
    },
    {
      months: "24 MONTHS",
      subtitle: "SAVE ₹129,600",
      price: "278,400",
      totalPrice: "278,400",
      perMonth: "11,600",
      originalPrice: "408,000",
      highlights: [
        "Five coached sessions a week for 2",
        "All pathways & disciplines",
        "2-Year duo rate freeze guarantee",
        "Founding Wall duo recognition",
      ],
      tag: "2-YEAR LOCK",
      buttonText: "SAVE ₹129,600",
    },
  ],
  benefits: [
    {
      boldText: "Train without limits, together.",
      normalText:
        "Five days a week, every discipline, nothing held back for both partners.",
    },
    {
      boldText: "Your shared athletic sanctuary.",
      normalText:
        "After work and home, Box & Cross becomes your shared arena to disconnect, sweat, and level up together.",
    },
    {
      boldText: "Priority privileges on everything.",
      normalText:
        "Classes, the ring, the open floor, and community events — always first in line.",
    },
    {
      boldText: "Peak partner performance.",
      normalText:
        "Unrestricted arena mastery built side by side with the ultimate VIP partner experience.",
    },
  ],
  allInclusions: [
    "5 Coached group sessions every week for two members",
    "Complete access to ALL pathways (Boxing + HYROX + Strength)",
    "Priority ring and open gym access during operating hours",
    "Monthly InBody Body Composition analysis check-ins for both",
    "Dedicated partner lockers & VIP amenities",
    "Clean locker rooms and hot showers",
    "VIP invites to guest masterclasses and fight nights",
    "Full access to BXC performance workshops",
  ],
  otherTiers: [
    {
      id: "core",
      title: "INDIVIDUAL ARENA",
      badge: "ALL ACCESS • SINGLE",
      price: "5,600",
      path: "/membership/arena",
      icon: <Trophy size={24} />,
    },
    {
      id: "family",
      title: "FAMILY FIT",
      badge: "ALL AGES • UP TO 4",
      price: "11,900",
      path: "/membership/family",
      icon: <Users size={24} />,
    },
    {
      id: "junior",
      title: "JUNIOR CORE",
      badge: "UNDER 13 • YOUTH",
      price: "1,958",
      path: "/membership/junior",
      icon: <Target size={24} />,
    },
  ],
  faqs: [
    {
      q: "What makes Duo Arena different from Duo Athlete?",
      a: "Duo Athlete includes 2 pathways, while Duo Arena grants complete, unlimited access to all 3 disciplines (Boxing, HYROX, and Strength) along with VIP locker allocations, priority ring reservation, and masterclass invitations.",
    },
    {
      q: "Can both partners take different classes simultaneously?",
      a: "Yes! One partner can participate in Strength Training while the other attends Boxing or HYROX during the same time slot.",
    },
    {
      q: "Are guest passes included in Duo Arena?",
      a: "Yes! 6-month, 12-month, and 24-month Duo Arena plans include complimentary guest passes so you can bring friends or family along.",
    },
  ],
};

const MembershipDuo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("core"); // "core" | "athlete" | "arena"

  // URL query sync: ?tier=core | athlete | arena
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tier = (params.get("tier") || params.get("plan") || "").toLowerCase();
    if (tier === "athlete" || tier.includes("athlete")) {
      setActiveTab("athlete");
    } else if (tier === "arena" || tier.includes("arena")) {
      setActiveTab("arena");
    } else if (tier === "core" || tier.includes("core")) {
      setActiveTab("core");
    }
  }, [location.search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/duo?tier=${tab}`, { replace: true });
  };

  const currentData =
    activeTab === "athlete"
      ? duoAthleteData
      : activeTab === "arena"
      ? duoArenaData
      : duoCoreData;

  // Custom high-tech tab switcher component passed to MembershipTierDetail
  const renderCustomTabs = () => (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl bg-neutral-900/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 px-1 sm:px-3 self-start md:self-auto">
        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ccf141] shadow-[0_0_8px_#ccf141] animate-pulse" />
        <span
          className="text-[11px] sm:text-sm font-black uppercase tracking-wider text-white"
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          SELECT BXC DUO TIER:
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full md:w-auto">
        <button
          type="button"
          onClick={() => handleTabChange("core")}
          className={`px-2 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
            activeTab === "core"
              ? "bg-[#ccf141] text-black shadow-[0_0_20px_rgba(204,241,65,0.4)] scale-[1.02]"
              : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          <Target size={13} className="shrink-0" />
          <span>CORE</span>
          <span className="text-[9px] opacity-75 font-mono hidden sm:inline">1 PATH</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("athlete")}
          className={`px-2 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
            activeTab === "athlete"
              ? "bg-[#ccf141] text-black shadow-[0_0_20px_rgba(204,241,65,0.4)] scale-[1.02]"
              : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          <Dumbbell size={13} className="shrink-0" />
          <span>ATHLETE</span>
          <span className="text-[9px] opacity-75 font-mono hidden sm:inline">2 PATHS</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("arena")}
          className={`px-2 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
            activeTab === "arena"
              ? "bg-[#ccf141] text-black shadow-[0_0_20px_rgba(204,241,65,0.4)] scale-[1.02]"
              : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          <Trophy size={13} className="shrink-0" />
          <span>ARENA</span>
          <span className="text-[9px] opacity-75 font-mono hidden sm:inline">ALL ACCESS</span>
        </button>
      </div>
    </div>
  );

  return (
    <MembershipTierDetail
      key={activeTab}
      tierData={currentData}
      customTabs={renderCustomTabs()}
    />
  );
};

export default MembershipDuo;

