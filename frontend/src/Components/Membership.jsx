import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import {
  Check,
  Calendar,
  ArrowRight,
  Activity,
  Zap,
  ShieldHalf,
  Flame,
  Medal,
  Dumbbell,
  Trophy,
  Shield,
  User,
  Star,
  Lock,
} from "lucide-react";
import RazorpayMembershipModal from "./RazorpayMembershipModal";
import { motion } from "framer-motion";
import box1 from "../assets/box1.png";
import box2 from "../assets/box2.png";
import box3 from "../assets/box3.png";
import juniorBoxer from "../assets/junior_boxer.jpg";
import duoCoupleImg from "../assets/duo_couple.jpg";
import familyFatherSonImg from "../assets/family_father_son.jpg";
import BCMonogram from "./BCMonogram";

import ChoosePlan from "./ChoosePlan";
import { getMembershipPlans } from "../api/api";

const programs = [
  {
    id: "core",
    icon: (
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#ccf141]"
      >
        <circle cx="12" cy="13" r="8" />
        <path d="M12 13v-4" />
        <path d="M12 2v3" />
        <path d="M9 2h6" />
        <path d="M18 5.5l-1.5 1.5" />
        <path d="M6 5.5l1.5 1.5" />
      </svg>
    ),
    title: "CORE",
    subtitle: "ONE PATHWAY",
    desc: "Five Coached sessions a week — Boxing Or Hyrox or Strength Training.",
    price: "2,800",
    image: box1,
  },
  {
    id: "athlete",
    icon: <Dumbbell size={45} strokeWidth={1.5} className="text-[#ccf141]" />,
    title: "ATHLETE",
    subtitle: "TWO PATHWAYS",
    desc: "Five coached sessions a week across two disciplines. (Boxing + Hyrox or Boxing +Strength Training)",
    price: "4,000",
    popular: true,
    image: box2,
  },
  {
    id: "arena",
    icon: (
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-[#ccf141]"
      >
        <circle cx="12" cy="6" r="2" />
        <path d="M21 16v-2c-2.24 0-4.16-.96-5.6-2.68l-1.34-1.6A1.98 1.98 0 0 0 12.53 9h-1.05c-.59 0-1.15.26-1.53.72l-1.34 1.6C7.16 13.04 5.24 14 3 14v2c2.77 0 5.19-1.17 7-3.25V15l-3.88 1.55c-.67.27-1.12.93-1.12 1.66C5 19.2 5.8 20 6.79 20H9v-.5a2.5 2.5 0 0 1 2.5-2.5h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.83 0-1.5.67-1.5 1.5v.5h7.21c.99 0 1.79-.8 1.79-1.79c0-.73-.45-1.39-1.12-1.66L14 15v-2.25c1.81 2.08 4.23 3.25 7 3.25" />
      </svg>
    ),
    title: "ARENA",
    subtitle: "EVERYTHING",
    desc: "Five coached sessions a week- (Boxing + Hyrox + Strength Training)",
    price: "5,600",
    image: box3,
  },
  {
    id: "duo",
    icon: (
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ccf141"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#ccf141]"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "BXC DUO",
    subtitle: "2 PERSON PASS",
    desc: "Five coached sessions a week for 2 members across your chosen pathways.",
    price: "6,800",
    image: duoCoupleImg,
  },
  {
    id: "family",
    icon: (
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ccf141"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#ccf141]"
      >
        <circle cx="6" cy="6" r="3" />
        <path d="M2 18v-1a4 4 0 0 1 7-2.6" />
        <circle cx="18" cy="6" r="3" />
        <path d="M22 18v-1a4 4 0 0 0-7-2.6" />
        <circle cx="12" cy="11" r="2.5" />
        <path d="M8.5 21v-1a3.5 3.5 0 0 1 7 0v1" />
      </svg>
    ),
    title: "BXC FAMILY FIT",
    subtitle: "ALL AGES FAMILY",
    desc: "Full arena access for parents + Junior coaching for kids (up to 4 members).",
    price: "11,900",
    image: familyFatherSonImg,
  },
  {
    id: "junior",
    icon: (
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ccf141"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#ccf141]"
      >
        <circle cx="12" cy="7" r="3.5" />
        <path d="M6 21v-1.5a5.5 5.5 0 0 1 12 0V21" />
        <path d="M4 11l-2.5 2.5 2.5 2.5" />
        <path d="M20 11l2.5 2.5-2.5 2.5" />
      </svg>
    ),
    title: "JUNIOR",
    subtitle: "UNDER 13",
    desc: "Five Coached sessions a week",
    price: "1,958",
    image: juniorBoxer,
  },
];

const pricingData = {
  core: {
    title: "CORE",
    subtitle: "ONE PATHWAY",
    sessionInfo: "Five Coached sessions a week — Boxing, HYROX or Strength Training",
    dailyRate: "₹92",
    dailyRateLabel: "A DAY ON THE 12-MONTH PLAN",
    dailyComparison: "Two coffees and a vada.",
    features: [
      "Five Coached sessions a week",
      "One pathway (Boxing, HYROX or Strength Training)",
      "Open gym access",
      "Community Access",
    ],
    benefits: [
      {
        boldText: "You can defend yourself.",
        normalText: "Quietly knowing that changes how you walk down a street at night.",
      },
      {
        boldText: "The bad day goes into the bag.",
        normalText: "Not into your family, not into your sleep.",
      },
      {
        boldText: "Sharper at work.",
        normalText: "Boxing is a thinking sport — you read, decide and move in the same second.",
      },
      {
        boldText: "A coach who knows your name and your weakness.",
        normalText: "Nobody improves alone on a gym floor.",
      },
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "3,500",
        perMonth: "3,500",
        originalPrice: "",
        totalPrice: "3,500",
        highlights: [
          "Five Coached sessions a week",
          "One pathway focus",
          "Open gym & community access",
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹500",
        price: "10,000",
        perMonth: "3,333",
        originalPrice: "10,500",
        totalPrice: "10,000",
        highlights: [
          "Five Coached sessions a week",
          "Held rate for full term",
          "Coach assessment",
        ],
        tag: "SAVE ₹500",
        buttonText: "SAVE ₹500",
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹2,100",
        price: "18,900",
        perMonth: "3,150",
        originalPrice: "21,000",
        totalPrice: "18,900",
        highlights: [
          "Five Coached sessions a week",
          "Locked rate for full term",
          "Coach 1-on-1 check-ins",
        ],
        tag: "SAVE ₹2,100",
        buttonText: "SAVE ₹2,100",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹8,400",
        price: "33,600",
        perMonth: "2,800",
        originalPrice: "42,000",
        totalPrice: "33,600",
        highlights: [
          "Five Coached sessions a week",
          "Maximum discount",
          "Founding Wall recognition",
        ],
        tag: "SAVE ₹8,400",
        buttonText: "SAVE ₹8,400",
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹26,400",
        price: "57,600",
        perMonth: "2,400",
        originalPrice: "84,000",
        totalPrice: "57,600",
        highlights: [
          "Five Coached sessions a week",
          "2-Year rate freeze guarantee",
          "Founding Elite Wall badge",
        ],
        tag: "SAVE ₹26,400",
        buttonText: "SAVE ₹26,400",
      },
    ],
    starterPrice: "2,800",
  },
  athlete: {
    title: "ATHLETE",
    subtitle: "TWO PATHWAYS",
    sessionInfo: "Five coached sessions a week across two disciplines (Boxing + HYROX or Boxing + Strength Training)",
    dailyRate: "₹132",
    dailyRateLabel: "A DAY ON THE 12-MONTH PLAN",
    dailyComparison: "One burger.",
    features: [
      "Five coached sessions a week",
      "Two disciplines / pathways (Boxing + HYROX or Boxing + Strength Training)",
      "All arena facilities",
      "Progress tracking",
    ],
    benefits: [
      {
        boldText: "Strong and not out of breath.",
        normalText: "Most people get one. Two pathways gets you both.",
      },
      {
        boldText: "You stop plateauing.",
        normalText: "Four sessions, two disciplines, nothing goes stale.",
      },
      {
        boldText: "Visible change by week twelve.",
        normalText: "Measured on your card, not guessed in the mirror.",
      },
      {
        boldText: "The body you had at twenty-five,",
        normalText: "built the way an athlete builds it.",
      },
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "5,000",
        perMonth: "5,000",
        originalPrice: "",
        totalPrice: "5,000",
        highlights: [
          "Five coached sessions a week",
          "Two disciplines access",
          "Full arena access",
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹800",
        price: "14,200",
        perMonth: "4,733",
        originalPrice: "15,000",
        totalPrice: "14,200",
        highlights: [
          "Four coached sessions a week",
          "Two disciplines access",
          "Coach assessment",
        ],
        tag: "SAVE ₹800",
        buttonText: "SAVE ₹800",
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹3,000",
        price: "27,000",
        perMonth: "4,500",
        originalPrice: "30,000",
        totalPrice: "27,000",
        highlights: [
          "Four coached sessions a week",
          "Two disciplines access",
          "Guest passes included",
        ],
        tag: "SAVE ₹3,000",
        buttonText: "SAVE ₹3,000",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹12,000",
        price: "48,000",
        perMonth: "4,000",
        originalPrice: "60,000",
        totalPrice: "48,000",
        highlights: [
          "Five coached sessions a week",
          "Two disciplines access",
          "Priority booking & perks",
        ],
        tag: "SAVE ₹12,000",
        buttonText: "SAVE ₹12,000",
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹36,000",
        price: "84,000",
        perMonth: "3,500",
        originalPrice: "120,000",
        totalPrice: "84,000",
        highlights: [
          "Four coached sessions a week",
          "Two disciplines access",
          "2-Year rate freeze guarantee",
        ],
        tag: "SAVE ₹36,000",
        buttonText: "SAVE ₹36,000",
      },
    ],
    starterPrice: "4,000",
  },
  arena: {
    title: "ARENA",
    subtitle: "EVERYTHING",
    sessionInfo: "Five coached sessions a week, every pathway, every class (Boxing + HYROX + Strength Training)",
    dailyRate: "₹184",
    dailyRateLabel: "A DAY ON THE 12-MONTH PLAN",
    dailyComparison: "One pizza.",
    features: [
      "Five coached sessions a week",
      "Every pathway, every class (Boxing + HYROX + Strength Training)",
      "Priority ring & arena floor",
      "VIP member perks",
    ],
    benefits: [
      {
        boldText: "Train the way fighters train.",
        normalText: "Five days, every discipline, nothing held back.",
      },
      {
        boldText: "This becomes your second place.",
        normalText: "After home, before everywhere else.",
      },
      {
        boldText: "Priority on everything.",
        normalText: "Classes, the ring, the open floor.",
      },
      {
        boldText: "You stop thinking about fitness.",
        normalText: "It is simply what you do now.",
      },
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "7,000",
        perMonth: "7,000",
        originalPrice: "",
        totalPrice: "7,000",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "Unrestricted arena access",
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹1,000",
        price: "20,000",
        perMonth: "6,667",
        originalPrice: "21,000",
        totalPrice: "20,000",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "Coach assessment",
        ],
        tag: "SAVE ₹1,000",
        buttonText: "SAVE ₹1,000",
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹4,200",
        price: "37,800",
        perMonth: "6,300",
        originalPrice: "42,000",
        totalPrice: "37,800",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "Guest passes included",
        ],
        tag: "SAVE ₹4,200",
        buttonText: "SAVE ₹4,200",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹16,800",
        price: "67,200",
        perMonth: "5,600",
        originalPrice: "84,000",
        totalPrice: "67,200",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "VIP Wall & passes",
        ],
        tag: "SAVE ₹16,800",
        buttonText: "SAVE ₹16,800",
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹52,800",
        price: "115,200",
        perMonth: "4,800",
        originalPrice: "168,000",
        totalPrice: "115,200",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "2-Year rate freeze guarantee",
        ],
        tag: "SAVE ₹52,800",
        buttonText: "SAVE ₹52,800",
      },
    ],
    starterPrice: "5,600",
  },
  junior: {
    title: "JUNIOR",
    subtitle: "UNDER 13",
    sessionInfo: "Five Coached sessions a week",
    dailyRate: "₹64",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "One masala dosa.",
    features: [
      "Five Coached sessions a week",
      "Youth boxing & athletic discipline",
      "Confidence building",
      "Screen-free fitness",
    ],
    benefits: [
      {
        boldText: "Confidence that shows up at school.",
        normalText:
          "A child who can hold a stance stops shrinking in a crowd.",
      },
      {
        boldText: "They learn to handle themselves — and when not to.",
        normalText: "Discipline is taught before the punch is.",
      },
      {
        boldText: "Focus that carries into homework.",
        normalText: "Three rounds of concentration, three evenings a week.",
      },
      {
        boldText: "Off the screen, on their feet.",
        normalText: "Tired in the right way by 7pm.",
      },
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "3,000",
        perMonth: "3,000",
        originalPrice: "",
        totalPrice: "3,000",
        highlights: [
          "Five Coached sessions a week",
          "Youth boxing fundamentals",
          "Arena training space",
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
      },
      {
        months: "3 MONTHS",
        subtitle: "FOUNDING RATE",
        price: "7,500",
        perMonth: "2,500",
        originalPrice: "8,600",
        totalPrice: "7,500",
        highlights: [
          "Five Coached sessions a week",
          "Youth boxing fundamentals",
          "Skill milestone card",
        ],
        tag: "SAVE ₹1,100",
        buttonText: "SAVE ₹1,100",
      },
      {
        months: "6 MONTHS",
        subtitle: "BEST PROGRESS",
        price: "13,500",
        perMonth: "2,250",
        originalPrice: "16,200",
        totalPrice: "13,500",
        highlights: [
          "Five Coached sessions a week",
          "Technique & fitness growth",
          "Coach assessment",
        ],
        tag: "SAVE ₹2,700",
        buttonText: "SAVE ₹2,700",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "BEST VALUE",
        price: "23,500",
        perMonth: "1,958",
        originalPrice: "28,800",
        totalPrice: "23,500",
        highlights: [
          "Five Coached sessions a week",
          "Maximum founding discount",
          "Founding Wall youth recognition",
        ],
        tag: "SAVE ₹5,300",
        buttonText: "SAVE ₹5,300",
      },
      {
        months: "24 MONTHS",
        subtitle: "BEST VALUE",
        price: "39,600",
        perMonth: "1,650",
        originalPrice: "72,000",
        totalPrice: "39,600",
        highlights: [
          "Five Coached sessions a week",
          "Long-term youth athletic mastery",
          "2-Year rate freeze guarantee",
        ],
        tag: "SAVE ₹32,400",
        buttonText: "SAVE ₹32,400",
      },
    ],
    starterPrice: "3,000",
  },
  duo: {
    title: "BXC DUO",
    subtitle: "2 PERSON PASS",
    sessionInfo: "Five coached sessions a week for 2 members across your chosen pathways",
    dailyRate: "₹224",
    dailyRateLabel: "A DAY FOR 2 ON 12-MONTH PLAN",
    dailyComparison: "Two coffees & breakfast for two.",
    features: [
      "Two memberships under one account",
      "Five coached sessions a week for both members",
      "Partner workout programming & benchmarks",
      "Full open gym & recovery lounge access",
    ],
    benefits: [
      {
        boldText: "You never skip when someone waits.",
        normalText: "Partner accountability cuts skipped sessions by over 70%.",
      },
      {
        boldText: "Shared grind builds stronger bonds.",
        normalText: "Sweat together in the ring, conquer HYROX benchmarks together.",
      },
      {
        boldText: "Coached side-by-side.",
        normalText: "Train as a team with dedicated coaches pushing you both.",
      },
      {
        boldText: "Better value, together.",
        normalText: "Complete premium arena access priced for two athletes.",
      },
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "8,500",
        perMonth: "8,500",
        originalPrice: "",
        totalPrice: "8,500",
        highlights: [
          "Five coached sessions a week",
          "Access for 2 partners",
          "Full arena facilities",
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹1,500",
        price: "24,000",
        perMonth: "8,000",
        originalPrice: "25,500",
        totalPrice: "24,000",
        highlights: [
          "Five coached sessions a week",
          "Held rate for full term",
          "Joint coach assessment",
        ],
        tag: "SAVE ₹1,500",
        buttonText: "SAVE ₹1,500",
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹6,000",
        price: "45,000",
        perMonth: "7,500",
        originalPrice: "51,000",
        totalPrice: "45,000",
        highlights: [
          "Five coached sessions a week",
          "Locked rate for both members",
          "Partner progress card",
        ],
        tag: "SAVE ₹6,000",
        buttonText: "SAVE ₹6,000",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹20,400",
        price: "81,600",
        perMonth: "6,800",
        originalPrice: "102,000",
        totalPrice: "81,600",
        highlights: [
          "Five coached sessions a week",
          "Maximum partner discount",
          "Founding Wall duo recognition",
        ],
        tag: "SAVE ₹20,400",
        buttonText: "SAVE ₹20,400",
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹64,800",
        price: "139,200",
        perMonth: "5,800",
        originalPrice: "204,000",
        totalPrice: "139,200",
        highlights: [
          "Five coached sessions a week",
          "2-Year rate freeze for both partners",
          "Founding Wall duo recognition",
        ],
        tag: "SAVE ₹64,800",
        buttonText: "SAVE ₹64,800",
      },
    ],
    starterPrice: "6,800",
  },
  family: {
    title: "BXC FAMILY FIT",
    subtitle: "ALL AGES FAMILY",
    sessionInfo: "Full arena access for parents + Junior coaching for kids (up to 4 members)",
    dailyRate: "₹390",
    dailyRateLabel: "A DAY FOR THE WHOLE FAMILY",
    dailyComparison: "One weekend family dinner.",
    features: [
      "Access for up to 4 family members (Adults + Juniors)",
      "Adult pathways (Boxing, HYROX, Strength) + Junior Youth classes",
      "Synchronized weekend session slots & open gym",
      "Family fitness assessment & quarterly milestones",
    ],
    benefits: [
      {
        boldText: "Active role models inspire children.",
        normalText: "Kids do what they see. When parents train, healthy habits become second nature.",
      },
      {
        boldText: "Screen-free family time with purpose.",
        normalText: "Replace screen time with punches, agility ladders, and shared sweat.",
      },
      {
        boldText: "Concurrent schedules that save your weekend.",
        normalText: "Drop off junior for boxing while you hit the HYROX floor simultaneously.",
      },
      {
        boldText: "One simple plan for everyone.",
        normalText: "Unrestricted arena access for the whole family without four separate bills.",
      },
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "15,000",
        perMonth: "15,000",
        originalPrice: "",
        totalPrice: "15,000",
        highlights: [
          "Coached sessions for up to 4 members",
          "Adult pathways + Junior boxing",
          "Arena weekend open access",
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹3,000",
        price: "42,000",
        perMonth: "14,000",
        originalPrice: "45,000",
        totalPrice: "42,000",
        highlights: [
          "Coached sessions for all members",
          "Held rate for full term",
          "Family fitness card",
        ],
        tag: "SAVE ₹3,000",
        buttonText: "SAVE ₹3,000",
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹12,000",
        price: "78,000",
        perMonth: "13,000",
        originalPrice: "90,000",
        totalPrice: "78,000",
        highlights: [
          "Coached sessions for all members",
          "Technique & athletic milestone tracking",
          "Guest passes for friends",
        ],
        tag: "SAVE ₹12,000",
        buttonText: "SAVE ₹12,000",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹37,200",
        price: "142,800",
        perMonth: "11,900",
        originalPrice: "180,000",
        totalPrice: "142,800",
        highlights: [
          "Full year complete family arena access",
          "Maximum savings for 4 athletes",
          "Founding Family wall recognition",
        ],
        tag: "SAVE ₹37,200",
        buttonText: "SAVE ₹37,200",
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹122,400",
        price: "237,600",
        perMonth: "9,900",
        originalPrice: "360,000",
        totalPrice: "237,600",
        highlights: [
          "Coached sessions for up to 4 members",
          "2-Year rate freeze for entire family",
          "Founding Family permanent recognition",
        ],
        tag: "SAVE ₹122,400",
        buttonText: "SAVE ₹122,400",
      },
    ],
    starterPrice: "11,900",
  },
};

const Membership = () => {
  const [activeTab, setActiveTab] = useState("core");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawPlan = params.get("plan");

    if (rawPlan) {
      const clean = rawPlan.toLowerCase().replace(/[-_\s]/g, "");
      let resolvedPlan = null;

      if (clean === "core") resolvedPlan = "core";
      else if (clean === "athlete") resolvedPlan = "athlete";
      else if (clean === "arena") resolvedPlan = "arena";
      else if (clean === "junior") resolvedPlan = "junior";
      else if (clean.includes("duo")) resolvedPlan = "duo";
      else if (clean.includes("family")) resolvedPlan = "family";

      if (resolvedPlan) {
        setActiveTab(resolvedPlan);

        setTimeout(() => {
          const pricingSection = document.getElementById("pricing");
          if (pricingSection) {
            pricingSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 800);
      }
    }
  }, []);

  const getInitialPricingData = () => {
    try {
      const cached = localStorage.getItem("boxcross_membership_plans_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          return { ...pricingData, ...parsed };
        }
      }
    } catch (e) { }
    return pricingData;
  };

  const getInitialPrograms = () => {
    try {
      const cached = localStorage.getItem("boxcross_membership_programs_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return programs.map((prog) => {
            const cachedProg = parsed.find((cp) => cp.id === prog.id);
            if (cachedProg) {
              return {
                ...prog,
                title: cachedProg.title || prog.title,
                subtitle: cachedProg.subtitle || prog.subtitle,
                desc: cachedProg.desc || prog.desc,
                price: cachedProg.price || prog.price,
                isComingSoon: !!cachedProg.isComingSoon,
              };
            }
            return prog;
          });
        }
      }
    } catch (e) { }
    return programs;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const pricingRef = useRef(null);

  const [dynamicPrograms, setDynamicPrograms] = useState(getInitialPrograms);
  const [dynamicPricingData, setDynamicPricingData] = useState(getInitialPricingData);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getMembershipPlans();
        if (response.data && response.data.success) {
          const plans = response.data.data;

          // Rebuild pricingData dynamically
          const newPricingData = { ...pricingData };
          plans.forEach((plan) => {
            const keyLower = plan.key?.toLowerCase();
            if (["core", "athlete", "arena", "junior", "duo", "family"].includes(keyLower)) {
              newPricingData[keyLower] = {
                ...newPricingData[keyLower],
                _id: plan._id,
                key: keyLower,
                title: plan.title || newPricingData[keyLower]?.title,
                subtitle: plan.subtitle || newPricingData[keyLower]?.subtitle,
                sessionInfo: plan.sessionInfo || newPricingData[keyLower]?.sessionInfo,
                dailyRate: plan.dailyRate || newPricingData[keyLower]?.dailyRate,
                dailyRateLabel: plan.dailyRateLabel || newPricingData[keyLower]?.dailyRateLabel,
                dailyComparison: plan.dailyComparison || newPricingData[keyLower]?.dailyComparison,
                features: plan.features?.length ? plan.features : newPricingData[keyLower]?.features,
                benefits: plan.benefits?.length ? plan.benefits : newPricingData[keyLower]?.benefits,
                plans: plan.plans?.length ? plan.plans : newPricingData[keyLower]?.plans,
                starterPrice: plan.starterPrice || newPricingData[keyLower]?.starterPrice,
                isComingSoon: !!plan.isComingSoon,
              };
            }
          });
          setDynamicPricingData(newPricingData);

          // Update programs prices from DB plans
          const updatedPrograms = programs.map((prog) => {
            const dbPlan = plans.find((p) => p.key?.toLowerCase() === prog.id.toLowerCase());
            if (dbPlan) {
              return {
                ...prog,
                title: dbPlan.title || prog.title,
                subtitle: dbPlan.subtitle || prog.subtitle,
                desc: dbPlan.sessionInfo || prog.desc,
                price: dbPlan.starterPrice || prog.price,
                isComingSoon: !!dbPlan.isComingSoon,
              };
            }
            return prog;
          });
          setDynamicPrograms(updatedPrograms);

          // Cache to localStorage
          try {
            localStorage.setItem("boxcross_membership_plans_cache", JSON.stringify(newPricingData));
            localStorage.setItem(
              "boxcross_membership_programs_cache",
              JSON.stringify(
                updatedPrograms.map((p) => ({
                  id: p.id,
                  title: p.title,
                  subtitle: p.subtitle,
                  desc: p.desc,
                  price: p.price,
                  isComingSoon: !!p.isComingSoon,
                }))
              )
            );
          } catch (e) { }
        }
      } catch (err) {
        console.error("Error loading membership plans from API:", err);
      }
    };
    fetchPlans();

    let channel = null;
    try {
      channel = new BroadcastChannel("membership_plan_updates");
      channel.onmessage = (event) => {
        if (event.data === "PLAN_UPDATED") {
          fetchPlans();
        }
      };
    } catch (e) { }

    const handleStorage = (e) => {
      if (e.key === "boxcross_membership_plans_updated") {
        fetchPlans();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      if (channel) {
        try {
          channel.close();
        } catch (e) { }
      }
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const activeData = dynamicPricingData[activeTab] || pricingData[activeTab];

  const adultPrograms = dynamicPrograms.filter((p) => p.id !== "junior");
  const juniorProgram = dynamicPrograms.find((p) => p.id === "junior");

  const handlePlanSelect = (planName, price, durationStr) => {
    const monthsVal = durationStr ? parseInt(durationStr) : 1;
    setSelectedPlan({ name: planName, price: price, monthsVal: monthsVal });
    setIsModalOpen(true);
  };

  const handleScrollToPlans = (e, id) => {
    e.stopPropagation();
    setActiveTab(id);
    // Smooth scroll to the pricing section
    if (pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderProgramCard = (prog, index = 0) => (
    <motion.div
      key={prog.id}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 350, damping: 25 } }}
      whileTap={{ scale: 0.98 }}
      animate={{ scale: activeTab === prog.id ? 1.02 : 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setActiveTab(prog.id)}
      className={`w-full md:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)] max-w-md lg:max-w-none relative rounded-2xl md:rounded-xl p-5 sm:p-6 md:p-8 min-h-[350px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[440px] flex flex-col cursor-pointer transition-all duration-300 border group overflow-hidden ${activeTab === prog.id
        ? "border-[#ccf141] shadow-[0_0_25px_rgba(204,241,65,0.25)] z-10"
        : "border-zinc-800 hover:border-zinc-700"
        }`}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <div
          className="absolute inset-0 opacity-70 group-hover:opacity-90 scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
          style={{
            backgroundImage: `url(${prog.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-[#0a0a0a]/10"></div>
      </div>

      {prog.isComingSoon ? (
        /* FULL BLUR COMING SOON OVERLAY */
        <div className="absolute inset-0 z-30 backdrop-blur-md bg-black/80 flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-300">
          {/* Subtle Ambient Glow */}
          <div className="absolute w-44 h-44 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          {/* Pathway Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10.5px] font-mono font-black uppercase tracking-widest shadow-sm mb-3">
            <span>{prog.title} · {prog.subtitle}</span>
          </div>

          {/* Heading */}
          <h3
            className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2 leading-none drop-shadow-md"
            style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
          >
            COMING SOON
          </h3>

          <p
            className="text-zinc-300 text-xs sm:text-[13px] leading-relaxed max-w-[240px] mb-6 font-medium"
            style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
          >
            This pathway is currently preparing for launch. Online registrations will open shortly.
          </p>

          <div
            className="px-5 py-2.5 rounded-xl border border-amber-500/60 bg-amber-500/15 text-amber-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:bg-amber-500 group-hover:text-black transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)]"
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
          >
            <span>STAY TUNED</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ) : prog.popular ? (
        <div className="absolute top-0 right-0 bg-[#ccf141] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl tracking-wider uppercase z-20">
          MOST POPULAR
        </div>
      ) : null}

      <div className="relative z-10 flex flex-col flex-grow text-left justify-between">
        <div>
          <div className="w-14 h-12 sm:w-16 sm:h-14 flex items-center justify-center mb-3 sm:mb-5">
            {prog.icon}
          </div>

          <h3
            className="font-black mb-1 tracking-wide uppercase text-2xl sm:text-3xl lg:text-[35px]"
            style={{
              fontFamily: '"BrutalTypeBold", Impact, sans-serif',
            }}
          >
            {prog.title}
          </h3>
          <p
            className="text-[#ccf141] tracking-widest uppercase mb-2 sm:mb-3 text-sm sm:text-base lg:text-[19px] font-bold"
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
            }}
          >
            {prog.subtitle}
          </p>
          <p
            className="text-gray-200 mb-3 sm:mb-4 leading-relaxed max-w-[95%] text-xs sm:text-sm lg:text-[16px]"
            style={{
              fontFamily: '"Brutal Font Light", sans-serif',
            }}
          >
            {prog.desc}
          </p>
        </div>

        <div className="mt-auto pt-3 sm:pt-4 w-full">
          <p
            className="text-xs sm:text-[14px] text-gray-300 uppercase tracking-widest font-bold flex items-center"
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
            }}
          >
            FROM
          </p>

          <div className="flex items-baseline flex-wrap gap-2 my-1">
            <span
              className="text-[#ccf141] font-black text-2xl sm:text-3xl lg:text-[34px]"
              style={{
                fontFamily: '"BrutalTypeBold", Impact, sans-serif',
              }}
            >
              ₹{prog.price || "3,500"}
            </span>
            {prog.originalPrice && (
              <span className="line-through text-zinc-400 font-bold text-xs sm:text-sm">
                ₹{prog.originalPrice}
              </span>
            )}
            <span className="text-gray-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
              / MONTH
            </span>
          </div>

          <button
            onClick={(e) => handleScrollToPlans(e, prog.id)}
            className={`group/btn mt-5 sm:mt-8 w-full py-3 sm:py-2.5 text-xs sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center rounded-xl border ${prog.isComingSoon
                ? "border-amber-500/60 bg-amber-500/15 text-amber-300 hover:bg-amber-500 hover:text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                : activeTab === prog.id
                  ? "bg-[#ccf141] border-[#ccf141] text-black shadow-[0_0_15px_rgba(204,241,65,0.3)]"
                  : "border-gray-600 text-white hover:border-[#ccf141] bg-transparent"
              }`}
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
            }}
          >
            <span className="flex items-center gap-2">
              {prog.isComingSoon ? "VIEW DETAILS · COMING SOON" : "VIEW PLANS"}{" "}
              <ArrowRight
                size={14}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <section
        id="membership-plans"
        className="w-full bg-[#0a0a0a] py-8 md:py-12 px-2 md:px-6 flex flex-col items-center justify-center font-sans text-white"
      >
        {/* STEP 1: CHOOSE PROGRAM */}
        <div className="w-full max-w-7xl mx-auto mb-12 p-3 md:p-0">
          {/*................................................................. Membership Plans heading start.............................. */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 flex flex-col items-center justify-start  gap-4"
          >
            <div>
              <span
                className="px-4 py-2 rounded-md  border border-[#ccf141]/30 bg-[#ccf141] text-[#1e1111] uppercase"
                style={{
                  fontFamily: '"BrutalTypeBold", sans-serif',
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                STEP 1
              </span>
            </div>

            <div>
              <h2
                className="mt-2 md:mt-4 mb-0 text-[32px] md:text-[48px] leading-[40px] md:leading-[55px]"
                style={{
                  fontFamily: '"BrutalTypeBold", sans-serif',
                  fontWeight: "700",
                }}
              >
                CHOOSE YOUR <span className="text-[#ccf141]">PROGRAM</span>
              </h2>
            </div>
          </motion.div>

          {/* STEP 1: 5 ADULT PATHWAYS (CORE, ATHLETE, ARENA, BXC DUO, BXC FAMILY FIT) */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-7 mt-8 md:mt-15">
            {adultPrograms.map((prog, index) => renderProgramCard(prog, index))}
          </div>

          {/* HORIZONTAL FULL-WIDTH JUNIOR PROGRAM BANNER (UNDER 13) */}
          {juniorProgram && (
            <div className="mt-12 md:mt-16 w-full">
              {/* Section Header & Divider */}
              <div className="flex items-center gap-3 sm:gap-4 w-full mb-6 px-1">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-zinc-700 flex-1" />
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-[#121214] text-zinc-300 text-xs font-bold uppercase tracking-widest shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#ccf141] shadow-[0_0_8px_#ccf141] animate-pulse" />
                  <span>JUNIOR PROGRAM · UNDER 13</span>
                </div>
                <div className="h-[1px] bg-gradient-to-l from-transparent via-zinc-800 to-zinc-700 flex-1" />
              </div>

              {/* Full Width Horizontal Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onClick={() => setActiveTab(juniorProgram.id)}
                className={`relative w-full rounded-2xl md:rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.8)] ${activeTab === juniorProgram.id
                  ? "border-[#ccf141] shadow-[0_0_30px_rgba(204,241,65,0.25)]"
                  : "border-zinc-800 hover:border-zinc-700"
                  } bg-[#0b0b0d]`}
              >
                {/* Background Glow Overlay */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ccf141]/5 rounded-full blur-3xl pointer-events-none -z-0" />

                {/* JUNIOR COMING SOON FULL BLUR OVERLAY */}
                {juniorProgram.isComingSoon && (
                  <div className="absolute inset-0 z-30 backdrop-blur-md bg-black/85 flex flex-col items-center justify-center p-6 sm:p-10 text-center select-none">
                    <div className="relative w-20 h-16 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-black/90 border border-[#ccf141]/50 flex items-center justify-center px-2 py-1 shadow-[0_0_30px_rgba(204,241,65,0.3)] mb-4">
                      <BCMonogram className="w-16 h-10" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ccf141] shadow-[0_0_8px_#ccf141] animate-ping" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase mb-3">
                      <span>JUNIOR ATHLETE · UNDER 13</span>
                    </div>
                    <h3
                      className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-2 leading-none"
                      style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                    >
                      COMING SOON
                    </h3>
                    <p
                      className="text-zinc-300 text-xs sm:text-sm max-w-md mb-6 font-medium"
                      style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
                    >
                      Our youth boxing fundamentals and athletic development program is opening soon.
                    </p>
                    <div
                      className="px-6 py-2.5 rounded-xl border border-amber-500/60 bg-amber-500/15 text-amber-300 text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      <span>STAY TUNED</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between">
                  {/* Left & Center: Rich Program Content */}
                  <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between">
                    <div>
                      {/* Top Row: Icon + Subtitle Badge */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-[#ccf141] shadow-inner shrink-0">
                          {juniorProgram.icon}
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccf141]/10 border border-[#ccf141]/30 text-[#ccf141] text-[11px] font-mono font-bold tracking-widest uppercase">
                            YOUTH &amp; ATHLETIC DEVELOPMENT
                          </div>
                          {juniorProgram.isComingSoon && (
                            <span className="inline-flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                              COMING SOON
                            </span>
                          )}
                          <p className="text-zinc-400 text-xs mt-1 font-mono">
                            Ages 7 to 13 · All Experience Levels
                          </p>
                        </div>
                      </div>

                      {/* Main Title & Tagline */}
                      <div className="mt-2">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <h3
                            className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            {juniorProgram.title}
                          </h3>
                          <span
                            className="text-lg sm:text-2xl font-bold text-[#ccf141] tracking-widest uppercase"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            {juniorProgram.subtitle}
                          </span>
                        </div>

                        <p
                          className="text-zinc-300 text-sm sm:text-base md:text-lg mt-3 leading-relaxed max-w-2xl font-normal"
                          style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
                        >
                          {juniorProgram.desc}. Built specifically to develop boxing fundamentals, agile footwork, screen-free focus, and lifelong discipline.
                        </p>
                      </div>

                    </div>

                    {/* Bottom Pricing & CTA Row */}
                    <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="block text-zinc-400 text-xs uppercase font-bold tracking-widest">
                          MEMBERSHIP STARTS FROM
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span
                            className="text-3xl  font-black text-[#ccf141] leading-none"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            ₹3,000  <span className="line-through"> ₹ 4,500</span>
                          </span>

                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleScrollToPlans(e, juniorProgram.id)}
                        className={`group/btn px-6 sm:px-8 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 shadow-lg active:scale-95 ${juniorProgram.isComingSoon
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500 hover:text-black"
                            : activeTab === juniorProgram.id
                              ? "bg-[#ccf141] text-black shadow-[0_0_20px_rgba(204,241,65,0.4)] hover:bg-[#bfe635]"
                              : "bg-white text-black hover:bg-[#ccf141] hover:text-black"
                          }`}
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        <span>
                          {juniorProgram.isComingSoon
                            ? "VIEW DETAILS · COMING SOON"
                            : "VIEW JUNIOR PLANS"}
                        </span>
                        <ArrowRight
                          size={16}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Right Side: The Boxer Photo (Hero Visual with Cinematic Fade) */}
                  <div className="w-full lg:w-[420px] xl:w-[480px] min-h-[300px] sm:min-h-[360px] lg:min-h-[460px] relative overflow-hidden bg-black shrink-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${juniorProgram.image})`,
                      }}
                    />
                    {/* Left overlay gradient to blend seamlessly into card */}
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0b0b0d] via-transparent to-transparent z-10" />
                    {/* Subtle top/bottom vignette */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />

                    {/* Badge on Photo */}
                    <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md border border-zinc-800 text-[#ccf141] text-[10px] font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141] animate-ping" />
                      BOX &amp; CROSS YOUTH
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* STEP 2: CHOOSE PLAN */}
        <ChoosePlan
          ref={pricingRef}
          activeData={activeData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handlePlanSelect={handlePlanSelect}
          programs={dynamicPrograms}
        />
      </section>
      {createPortal(
        <RazorpayMembershipModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planDetails={selectedPlan}
        />,
        document.body,
      )}
    </>
  );
};

export default Membership;
