import React from "react";
import MembershipTierDetail from "../Components/MembershipTierDetail";
import box3 from "../assets/box3.png";
import { Zap, Dumbbell } from "lucide-react";

const arenaTierData = {
  id: "arena",
  title: "ARENA",
  badge: "UNRESTRICTED ALL-ACCESS • EVERYTHING",
  metaTitle: "Arena Membership | All Access Everything | Box & Cross",
  metaDescription:
    "Unrestricted all-access membership at Box & Cross. Five coached sessions a week across all pathways (Boxing, HYROX, Strength), open gym floor, VIP perks, and coach mentorship.",
  subtitle: "EVERY PATHWAY. EVERY CLASS. NO LIMITS.",
  desc: "Five coached sessions a week with total freedom across every pathway — Boxing, HYROX, and Strength Training. Complete arena access, priority ring time, and comprehensive coach mentorship for individuals committed to peak physical capability.",
  image: box3,
  disciplineCount: "All 3 Pathways (Unrestricted)",
  starterPrice: "5,600",
  dailyRate: "₹184",
  dailyRateLabel: "A DAY ON THE 12-MONTH PLAN",
  dailyComparison: "One pizza.",
  pathwaySectionDesc:
    "Arena members have unlimited access across all three training pillars. You train with complete freedom without restrictions or discipline boundaries.",
  pathways: [
    {
      name: "The Boxing Ring & Combat Lab",
      tag: "TECHNICAL COMBAT",
      description:
        "Full access to specialized boxing classes, pad sessions, heavy bag conditioning, footwork ladders, and coached technical sparring clinics.",
      highlights: [
        "Priority ring time & advanced sparring clinics",
        "Technical coach pad work & combination drills",
        "Reaction timing, slipping & head defense",
        "Fighter conditioning and mental composure",
      ],
    },
    {
      name: "The HYROX Arena",
      tag: "RACE READY ENGINE",
      description:
        "Official simulated race workouts, pacing strategy, sled pushes, ski ergs, rowers, and running tracks. Train alongside seasoned HYROX athletes and coaches.",
      highlights: [
        "Competition simulation workouts",
        "Advanced pacing & transition strategy",
        "Full cardio ergometer station access",
        "High-density hybrid physical stamina",
      ],
    },
    {
      name: "The Heavy Iron Strength Lab",
      tag: "MAXIMUM FUNCTIONAL STRENGTH",
      description:
        "Olympic barbells, custom power racks, kettlebells, dumbbells, and functional turf. Master heavy compound lifts and unilateral power generation.",
      highlights: [
        "Elite power rack & platform access",
        "Strength periodization & peak testing",
        "Rotational athletic strength work",
        "Joint integrity & active recovery coaching",
      ],
    },
  ],
  plans: [
    {
      months: "1 MONTH",
      subtitle: "STANDARD",
      price: "7,000",
      totalPrice: "7,000",
      perMonth: "7,000",
      originalPrice: "",
      highlights: [
        "Five coached sessions a week",
        "All pathways & disciplines included",
        "Unrestricted arena access",
        "Full locker & amenities use",
      ],
      tag: "STANDARD",
      buttonText: "STANDARD",
    },
    {
      months: "3 MONTHS",
      subtitle: "SAVE ₹1,000",
      price: "20,000",
      totalPrice: "20,000",
      perMonth: "6,667",
      originalPrice: "21,000",
      highlights: [
        "Five coached sessions a week",
        "All pathways & disciplines included",
        "Coach 1-on-1 assessment",
        "InBody scan report included",
      ],
      tag: "SAVE ₹1,000",
      buttonText: "SAVE ₹1,000",
    },
    {
      months: "6 MONTHS",
      subtitle: "SAVE ₹4,200",
      price: "37,800",
      totalPrice: "37,800",
      perMonth: "6,300",
      originalPrice: "42,000",
      isPopular: true,
      highlights: [
        "Five coached sessions a week",
        "All pathways & disciplines included",
        "VIP guest passes (4 passes)",
        "Priority slot reservation",
      ],
      tag: "MOST POPULAR",
      buttonText: "SAVE ₹4,200",
    },
    {
      months: "12 MONTHS",
      subtitle: "SAVE ₹16,800",
      price: "67,200",
      totalPrice: "67,200",
      perMonth: "5,600",
      originalPrice: "84,000",
      highlights: [
        "Five coached sessions a week",
        "All pathways & disciplines included",
        "Best daily rate (₹184/day)",
        "Founding Wall recognition + VIP Box",
      ],
      tag: "BEST VALUE",
      buttonText: "SAVE ₹16,800",
    },
    {
      months: "24 MONTHS",
      subtitle: "SAVE ₹48,000",
      price: "120,000",
      totalPrice: "120,000",
      perMonth: "5,000",
      originalPrice: "168,000",
      highlights: [
        "Five coached sessions a week",
        "2-Year complete price freeze",
        "Founding Elite Wall permanent badge",
        "Complimentary full gear & apparel bundle",
      ],
      tag: "2-YEAR LOCK",
      buttonText: "SAVE ₹48,000",
    },
  ],
  benefits: [
    {
      boldText: "Train the way fighters train.",
      normalText:
        "Five days, every discipline, nothing held back. Total athletic immersion without artificial limits.",
    },
    {
      boldText: "This becomes your second place.",
      normalText:
        "After home, before everywhere else. A culture of hard work, discipline, and high-energy camaraderie.",
    },
    {
      boldText: "Priority on everything.",
      normalText:
        "Classes, the ring, the open floor, and special masterclasses. Arena members get first pick.",
    },
    {
      boldText: "You stop thinking about fitness.",
      normalText:
        "It is no longer a chore on a to-do list. It is simply who you are and what you do every day.",
    },
  ],
  allInclusions: [
    "5 Coached sessions weekly across Boxing, HYROX & Strength",
    "Unrestricted freedom to mix any discipline on any day",
    "Open gym floor and recovery zone access all day",
    "Monthly InBody Body Composition & metabolic tracking",
    "Priority booking for prime time morning & evening slots",
    "Complimentary guest passes on multi-month plans",
    "Exclusive invitations to VIP seminars & athlete workshops",
    "Full access to lockers, towel service & hot showers",
  ],
  otherTiers: [
    {
      id: "core",
      title: "CORE",
      badge: "ONE PATHWAY",
      price: "2,800",
      path: "/membership/core",
      icon: <Zap size={24} />,
    },
    {
      id: "athlete",
      title: "ATHLETE",
      badge: "TWO PATHWAYS • POPULAR",
      price: "4,000",
      path: "/membership/athlete",
      icon: <Dumbbell size={24} />,
    },
  ],
  faqs: [
    {
      q: "Can I attend multiple classes in a single day?",
      a: "Yes! Arena members can attend a coached boxing class followed by open gym lifting or HYROX conditioning as long as it fits safe training limits approved by coaches.",
    },
    {
      q: "What makes Arena different from Athlete?",
      a: "Athlete allows you to choose two disciplines (e.g. Boxing + HYROX). Arena unlocks all three (Boxing, HYROX, and Strength) simultaneously, plus priority booking and VIP perks.",
    },
    {
      q: "Can I bring a training partner or friend?",
      a: "Yes, multi-month Arena plans come with complimentary guest passes so you can bring a friend or partner to experience the arena with you.",
    },
    {
      q: "What support do I get from coaches?",
      a: "Arena members receive ongoing coach reviews, baseline scoring, movement screening, and technique audits across every pathway.",
    },
  ],
};

const MembershipArena = () => {
  return <MembershipTierDetail tierData={arenaTierData} />;
};

export default MembershipArena;
