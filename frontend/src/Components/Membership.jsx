import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Users,
  ChevronDown,
  Star,
  Lock,
} from "lucide-react";
import RazorpayMembershipModal from "./RazorpayMembershipModal";
import { motion, AnimatePresence } from "framer-motion";
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
    subtitle: "2 PERSON PASS • CORE, ATHLETE & ARENA",
    desc: "Five coached sessions a week for 2 members across Boxing, HYROX or Strength Training. Choose Core, Athlete, or Arena with partner accountability.",
    price: "6,800",
    image: duoCoupleImg,
  },
  {
    id: "duo_athlete",
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
    title: "BXC DUO - ATHLETE",
    subtitle: "2 PERSON PASS • TWO PATHWAYS",
    desc: "Five coached sessions a week for 2 members across two disciplines (Boxing + HYROX or Boxing + Strength Training).",
    price: "9,600",
    image: duoCoupleImg,
  },
  {
    id: "duo_arena",
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
    title: "BXC DUO - ARENA",
    subtitle: "2 PERSON PASS • EVERYTHING",
    desc: "Five coached sessions a week for 2 members, every pathway, every class (Boxing + HYROX + Strength Training).",
    price: "13,600",
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
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#ccf141]"
      >
        <circle cx="12" cy="7" r="3" />
        <path d="M5 21v-1a4 4 0 0 1 7-2.6" />
        <circle cx="6" cy="8" r="2.5" />
        <path d="M19 21v-1a4 4 0 0 0-7-2.6" />
        <circle cx="18" cy="8" r="2.5" />
        <path d="M8.5 21v-1a3.5 3.5 0 0 1 7 0v1" />
      </svg>
    ),
    title: "BXC FAMILY FIT",
    subtitle: "ALL AGES FAMILY",
    desc: "PARENT + KID MEMBERSHIP",
    price: "3,999",
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
      "Boxing Training",
      "Certified Coach Guidance",
      "Boxing Fundamentals",
      "Discipline & Confidence",
      "Agility & Coordination",
      "Supervised Training",
      "Progress Assessments",
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
        mobileFeatures: [
          "Boxing Training",
          "Certified Coach Guidance",
          "Boxing Fundamentals",
          "Discipline & Confidence",
          "Agility & Coordination",
          "Supervised Training",
          "Progress Assessments",
        ],
        highlights: [
          "Boxing Training",
          "Certified Coach Guidance",
          "Boxing Fundamentals",
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
        mobileFeatures: [
          "Boxing Training",
          "Certified Coach Guidance",
          "Boxing Fundamentals",
          "Discipline & Confidence",
          "Agility & Coordination",
          "Supervised Training",
          "Progress Assessments",
        ],
        highlights: [
          "Boxing Training",
          "Certified Coach Guidance",
          "Boxing Fundamentals",
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
        mobileFeatures: [
          "Boxing Training",
          "Certified Coach Guidance",
          "Boxing Fundamentals",
          "Discipline & Confidence",
          "Agility & Coordination",
          "Supervised Training",
          "Progress Assessments",
        ],
        highlights: [
          "Boxing Training",
          "Certified Coach Guidance",
          "Boxing Fundamentals",
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
        mobileFeatures: [
          "Boxing Training",
          "Certified Coach Guidance",
          "Boxing Fundamentals",
          "Discipline & Confidence",
          "Agility & Coordination",
          "Supervised Training",
          "Progress Assessments",
        ],
        highlights: [
          "Boxing Training",
          "Certified Coach Guidance",
          "Boxing Fundamentals",
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
        mobileFeatures: [
          "Boxing Training",
          "Certified Coach Guidance",
          "Boxing Fundamentals",
          "Discipline & Confidence",
          "Agility & Coordination",
          "Supervised Training",
          "Progress Assessments",
        ],
        highlights: [
          "Boxing Training",
          "Certified Coach Guidance",
          "Boxing Fundamentals",
        ],
        tag: "SAVE ₹32,400",
        buttonText: "SAVE ₹32,400",
      },
    ],
    starterPrice: "3,000",
  },
  duo: {
    title: "BXC DUO",
    subtitle: "2 PERSON PASS • CORE, ATHLETE & ARENA",
    sessionInfo: "Five coached sessions a week for 2 members across one chosen pathway (Boxing, HYROX or Strength Training)",
    dailyRate: "₹224",
    dailyRateLabel: "A DAY FOR 2 ON 12-MONTH PLAN",
    dailyComparison: "Two coffees & breakfast for two.",
    features: [
      "Membership for Two",
      "Boxing / Strength Training",
      "Individual Training Pathways",
      "Structured Coaching",
      "Performance Assessment",
      "Workout Progress Tracking",
      "BXC Tribe Access",
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
        mobileFeatures: [
          "Membership for Two",
          "Boxing / Strength Training",
          "Individual Training Pathways",
          "Structured Coaching",
          "Performance Assessment",
          "Workout Progress Tracking",
          "BXC Tribe Access",
        ],
        highlights: [
          "Membership for Two",
          "Boxing / Strength Training",
          "Structured Coaching",
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
        mobileFeatures: [
          "Membership for Two",
          "Boxing / Strength Training",
          "Individual Training Pathways",
          "Structured Coaching",
          "Performance Assessment",
          "Workout Progress Tracking",
          "BXC Tribe Access",
        ],
        highlights: [
          "Membership for Two",
          "Boxing / Strength Training",
          "Structured Coaching",
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
        mobileFeatures: [
          "Membership for Two",
          "Boxing / Strength Training",
          "Individual Training Pathways",
          "Structured Coaching",
          "Performance Assessment",
          "Workout Progress Tracking",
          "BXC Tribe Access",
        ],
        highlights: [
          "Membership for Two",
          "Boxing / Strength Training",
          "Structured Coaching",
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
        mobileFeatures: [
          "Membership for Two",
          "Boxing / Strength Training",
          "Individual Training Pathways",
          "Structured Coaching",
          "Performance Assessment",
          "Workout Progress Tracking",
          "BXC Tribe Access",
        ],
        highlights: [
          "Membership for Two",
          "Boxing / Strength Training",
          "Structured Coaching",
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
        mobileFeatures: [
          "Membership for Two",
          "Boxing / Strength Training",
          "Individual Training Pathways",
          "Structured Coaching",
          "Performance Assessment",
          "Workout Progress Tracking",
          "BXC Tribe Access",
        ],
        highlights: [
          "Membership for Two",
          "Boxing / Strength Training",
          "Structured Coaching",
        ],
        tag: "SAVE ₹64,800",
        buttonText: "SAVE ₹64,800",
      },
    ],
    starterPrice: "6,800",
  },
  duo_athlete: {
    title: "BXC DUO - ATHLETE",
    subtitle: "2 PERSON PASS • TWO PATHWAYS",
    sessionInfo: "Five coached sessions a week for 2 members across two disciplines (Boxing + HYROX or Boxing + Strength Training)",
    dailyRate: "₹315",
    dailyRateLabel: "A DAY FOR 2 ON 12-MONTH PLAN",
    dailyComparison: "Lunch for two.",
    features: [
      "Membership for Two",
      "Two disciplines / pathways (Boxing + HYROX or Boxing + Strength Training)",
      "Structured Coaching for Both",
      "Partner Hybrid Benchmarks",
      "Workout Progress Tracking",
      "BXC Tribe & Lounge Access",
    ],
    benefits: [
      {
        boldText: "Two pathways, twice the motivation.",
        normalText: "Combine Boxing and Strength or HYROX side by side.",
      },
      {
        boldText: "Break plateaus together.",
        normalText: "Complementary disciplines keep both partners progressing consistently.",
      },
      {
        boldText: "Coached side-by-side.",
        normalText: "Train as a team with dedicated coaches pushing you both.",
      },
      {
        boldText: "Better value, together.",
        normalText: "Complete two-pathway arena access priced for two athletes.",
      },
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "12,000",
        perMonth: "12,000",
        originalPrice: "",
        totalPrice: "12,000",
        highlights: [
          "Five coached sessions a week",
          "Two disciplines access for 2",
          "Full arena facilities",
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹2,000",
        price: "34,000",
        perMonth: "11,333",
        originalPrice: "36,000",
        totalPrice: "34,000",
        highlights: [
          "Five coached sessions a week",
          "Held rate for full term",
          "Joint coach assessment",
        ],
        tag: "SAVE ₹2,000",
        buttonText: "SAVE ₹2,000",
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹8,000",
        price: "64,000",
        perMonth: "10,667",
        originalPrice: "72,000",
        totalPrice: "64,000",
        highlights: [
          "Five coached sessions a week",
          "Locked rate for both members",
          "Partner progress card",
        ],
        tag: "SAVE ₹8,000",
        buttonText: "SAVE ₹8,000",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹28,800",
        price: "115,200",
        perMonth: "9,600",
        originalPrice: "144,000",
        totalPrice: "115,200",
        highlights: [
          "Five coached sessions a week",
          "Maximum partner discount",
          "Founding Wall duo recognition",
        ],
        tag: "SAVE ₹28,800",
        buttonText: "SAVE ₹28,800",
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹91,200",
        price: "196,800",
        perMonth: "8,200",
        originalPrice: "288,000",
        totalPrice: "196,800",
        highlights: [
          "Five coached sessions a week",
          "2-Year rate freeze for both partners",
          "Founding Wall duo recognition",
        ],
        tag: "SAVE ₹91,200",
        buttonText: "SAVE ₹91,200",
      },
    ],
    starterPrice: "9,600",
  },
  duo_arena: {
    title: "BXC DUO - ARENA",
    subtitle: "2 PERSON PASS • EVERYTHING",
    sessionInfo: "Five coached sessions a week for 2 members, every pathway, every class (Boxing + HYROX + Strength Training)",
    dailyRate: "₹447",
    dailyRateLabel: "A DAY FOR 2 ON 12-MONTH PLAN",
    dailyComparison: "Dinner for two.",
    features: [
      "Membership for Two",
      "Every pathway, every class (Boxing + HYROX + Strength Training)",
      "Priority Ring & Arena Floor",
      "VIP Duo Member Perks",
      "Comprehensive Progress Tracking",
      "Unrestricted Arena Facilities",
    ],
    benefits: [
      {
        boldText: "Train without limits together.",
        normalText: "Five days, every discipline, nothing held back for both partners.",
      },
      {
        boldText: "Your shared second home.",
        normalText: "After home and work, your arena community awaits.",
      },
      {
        boldText: "Priority on everything.",
        normalText: "Classes, the ring, the open floor, together.",
      },
      {
        boldText: "Peak partner performance.",
        normalText: "Unrestricted arena mastery built together.",
      },
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "17,000",
        perMonth: "17,000",
        originalPrice: "",
        totalPrice: "17,000",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines for 2",
          "Unrestricted arena access",
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹3,000",
        price: "48,000",
        perMonth: "16,000",
        originalPrice: "51,000",
        totalPrice: "48,000",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "Joint coach assessment",
        ],
        tag: "SAVE ₹3,000",
        buttonText: "SAVE ₹3,000",
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹12,000",
        price: "90,000",
        perMonth: "15,000",
        originalPrice: "102,000",
        totalPrice: "90,000",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "Guest passes included",
        ],
        tag: "SAVE ₹12,000",
        buttonText: "SAVE ₹12,000",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹40,800",
        price: "163,200",
        perMonth: "13,600",
        originalPrice: "204,000",
        totalPrice: "163,200",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "VIP Wall & passes for two",
        ],
        tag: "SAVE ₹40,800",
        buttonText: "SAVE ₹40,800",
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹129,600",
        price: "278,400",
        perMonth: "11,600",
        originalPrice: "408,000",
        totalPrice: "278,400",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "2-Year rate freeze for both",
        ],
        tag: "SAVE ₹129,600",
        buttonText: "SAVE ₹129,600",
      },
    ],
    starterPrice: "13,600",
  },
  family: {
    title: "BXC FAMILY FIT",
    subtitle: "ALL AGES FAMILY",
    sessionInfo: "Full arena access for parents + Junior coaching for kids (up to 4 members)",
    dailyRate: "₹390",
    dailyRateLabel: "A DAY FOR THE WHOLE FAMILY",
    dailyComparison: "One weekend family dinner.",
    features: [
      "Parent + Child Membership",
      "Strength / Boxing for Parent",
      "Junior Boxing for Child",
      "Coach-Guided Sessions",
      "Progress Tracking",
      "BXC Tribe Access",
      "Family Fitness Experience",
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
        mobileFeatures: [
          "Parent + Child Membership",
          "Strength / Boxing for Parent",
          "Junior Boxing for Child",
          "Coach-Guided Sessions",
          "Progress Tracking",
          "BXC Tribe Access",
          "Family Fitness Experience",
        ],
        highlights: [
          "Parent + Child Membership",
          "Strength / Boxing for Parent",
          "Coach-Guided Sessions",
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
        mobileFeatures: [
          "Parent + Child Membership",
          "Strength / Boxing for Parent",
          "Junior Boxing for Child",
          "Coach-Guided Sessions",
          "Progress Tracking",
          "BXC Tribe Access",
          "Family Fitness Experience",
        ],
        highlights: [
          "Parent + Child Membership",
          "Strength / Boxing for Parent",
          "Coach-Guided Sessions",
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
        mobileFeatures: [
          "Parent + Child Membership",
          "Strength / Boxing for Parent",
          "Junior Boxing for Child",
          "Coach-Guided Sessions",
          "Progress Tracking",
          "BXC Tribe Access",
          "Family Fitness Experience",
        ],
        highlights: [
          "Parent + Child Membership",
          "Strength / Boxing for Parent",
          "Coach-Guided Sessions",
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
        mobileFeatures: [
          "Parent + Child Membership",
          "Strength / Boxing for Parent",
          "Junior Boxing for Child",
          "Coach-Guided Sessions",
          "Progress Tracking",
          "BXC Tribe Access",
          "Family Fitness Experience",
        ],
        highlights: [
          "Parent + Child Membership",
          "Strength / Boxing for Parent",
          "Coach-Guided Sessions",
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
        mobileFeatures: [
          "Parent + Child Membership",
          "Strength / Boxing for Parent",
          "Junior Boxing for Child",
          "Coach-Guided Sessions",
          "Progress Tracking",
          "BXC Tribe Access",
          "Family Fitness Experience",
        ],
        highlights: [
          "Parent + Child Membership",
          "Strength / Boxing for Parent",
          "Coach-Guided Sessions",
        ],
        tag: "SAVE ₹122,400",
        buttonText: "SAVE ₹122,400",
      },
    ],
    starterPrice: "3,999",
  },
};

const Membership = () => {
  const navigate = useNavigate();
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
            if (["core", "athlete", "arena", "junior", "duo", "duo_core", "duo_athlete", "duo_arena", "family"].includes(keyLower)) {
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

  const primaryPrograms = dynamicPrograms.filter(
    (p) => ["core", "athlete", "arena"].includes(p.id?.toLowerCase())
  );
  const morePrograms = dynamicPrograms.filter(
    (p) => p.id?.toLowerCase() === "duo" || p.id?.toLowerCase() === "family"
  );
  const juniorProgram = dynamicPrograms.find((p) => p.id === "junior");

  const [showMorePrograms, setShowMorePrograms] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan");
      if (
        plan &&
        (plan.toLowerCase().includes("duo") ||
          plan.toLowerCase().includes("family"))
      ) {
        return true;
      }
    }
    return false;
  });

  // Auto-expand dropdown when duo or family plan is selected
  useEffect(() => {
    if (activeTab?.toLowerCase().includes("duo") || activeTab === "family") {
      setShowMorePrograms(true);
    }
  }, [activeTab]);

  const handlePlanSelect = (planName, price, durationStr) => {
    const monthsVal = durationStr ? parseInt(durationStr) : 1;
    setSelectedPlan({ name: planName, price: price, monthsVal: monthsVal });
    setIsModalOpen(true);
  };

  const handleScrollToPlans = (e, id) => {
    e.stopPropagation();
    if (["core", "athlete", "arena"].includes(id.toLowerCase())) {
      navigate(`/membership/${id.toLowerCase()}`);
      return;
    }
    if (id.toLowerCase() === "duo" || id.toLowerCase().includes("duo")) { navigate("/duo"); return; }
    if (id.toLowerCase() === "family" || id.toLowerCase().includes("family")) {
      navigate("/family");
      return;
    }
    if (id.toLowerCase() === "junior") {
      navigate("/junior");
      return;
    }
    setActiveTab(id);
    // Smooth scroll to the pricing section
    if (pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderProgramCard = (prog, index = 0) => {
    const isWideCard =
      prog.id === "duo" ||
      prog.id === "family" ||
      prog.id?.includes("duo") ||
      prog.id?.includes("family") ||
      prog.title?.toLowerCase().includes("duo") ||
      prog.title?.toLowerCase().includes("family");

    return (
      <motion.div
        key={prog.id}
        initial={{ opacity: 0, y: isWideCard ? 20 : 35 }}
        {...(isWideCard
          ? {
              animate: {
                opacity: 1,
                y: 0,
                scale: activeTab === prog.id ? 1.02 : 1,
              },
            }
          : {
              whileInView: { opacity: 1, y: 0 },
              animate: { scale: activeTab === prog.id ? 1.02 : 1 },
              viewport: { once: true, margin: "-50px" },
            })}
        whileHover={{ y: -6, transition: { type: "spring", stiffness: 350, damping: 25 } }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => {
          if (["core", "athlete", "arena"].includes(prog.id.toLowerCase())) {
            navigate(`/membership/${prog.id.toLowerCase()}`);
          } else if (prog.id.toLowerCase() === "duo" || prog.id.toLowerCase().includes("duo")) {
            navigate("/duo");
          } else if (prog.id.toLowerCase() === "family" || prog.id.toLowerCase().includes("family")) {
            navigate("/family");
          } else if (prog.id.toLowerCase() === "junior") {
            navigate("/junior");
          } else {
            setActiveTab(prog.id);
          }
        }}
        className={`w-full md:w-[calc(50%-14px)] ${
          isWideCard ? "lg:w-[calc(50%-14px)]" : "lg:w-[calc(33.333%-19px)]"
        } max-w-md lg:max-w-none relative rounded-2xl md:rounded-xl p-5 sm:p-6 md:p-8 min-h-[350px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[440px] flex flex-col cursor-pointer transition-all duration-300 border group overflow-hidden ${
          activeTab === prog.id
            ? "border-[#ccf141] shadow-[0_0_25px_rgba(204,241,65,0.25)] z-10"
            : "border-zinc-800 hover:border-zinc-700"
        }`}
      >
        {/* Background Image Container with Targeted Scrim */}
        <div className="absolute inset-0 z-0 bg-[#070709] overflow-hidden">
          <div
            className={`absolute inset-0 scale-100 group-hover:scale-105 transition-all duration-700 ease-out filter grayscale ${
              prog.id === "duo"
                ? "opacity-75 group-hover:opacity-90 brightness-95 contrast-125"
                : prog.id === "family"
                ? "opacity-75 group-hover:opacity-90 brightness-95 contrast-125"
                : "opacity-85 group-hover:opacity-100 brightness-105 contrast-120"
            }`}
            style={{
              backgroundImage: `url(${prog.image})`,
              backgroundSize: "cover",
              filter: "grayscale(100%)",
              WebkitFilter: "grayscale(100%)",
              backgroundPosition:
                prog.id === "duo"
                  ? "65% center"
                  : prog.id === "family"
                  ? "75% center"
                  : "center",
            }}
          />
          {/* Layer 1: Left-to-right scrim (protects text while keeping athletes on right clearly visible) */}
          <div
            className={`absolute inset-0 ${
              isWideCard
                ? "bg-gradient-to-r from-[#070709]/95 via-[#070709]/70 via-45% to-transparent"
                : "bg-gradient-to-r from-[#070709]/95 via-[#070709]/60 via-45% to-transparent"
            }`}
          />
          {/* Layer 2: Bottom-to-top scrim (anchors price and button) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/70 via-35% to-transparent" />
          {/* Layer 3: Soft top vignette */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#070709]/60 to-transparent pointer-events-none" />
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

        <div className="relative z-10 flex flex-col flex-grow text-left justify-between h-full">
          <div>
            {/* Top Icon - Clean presentation matching reference image for wide cards */}
            {isWideCard ? (
              <div className="mb-4 sm:mb-5 text-[#ccf141] flex items-center">
                {prog.icon}
              </div>
            ) : (
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-center mb-4 sm:mb-5 text-[#ccf141] shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:border-[#ccf141]/50 group-hover:bg-[#ccf141]/10 group-hover:shadow-[0_0_20px_rgba(204,241,65,0.2)] transition-all duration-300">
                <div className="scale-75 sm:scale-85 flex items-center justify-center">
                  {prog.icon}
                </div>
              </div>
            )}

            {/* Title */}
            <h3
              className="font-black mb-1.5 tracking-tight uppercase text-2xl sm:text-3xl lg:text-[34px] text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
              style={{
                fontFamily: '"BrutalTypeBold", Impact, sans-serif',
              }}
            >
              {prog.title}
            </h3>

            {/* Subtitle Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-[#ccf141]/40 backdrop-blur-md mb-3 sm:mb-4 shadow-sm w-fit">
              <span className="w-2 h-2 rounded-full bg-[#ccf141] shadow-[0_0_6px_#ccf141]" />
              <span
                className="text-[#ccf141] tracking-wider uppercase text-xs sm:text-[13px] font-bold"
                style={{
                  fontFamily: '"BrutalTypeBold", sans-serif',
                }}
              >
                {prog.subtitle}
              </span>
            </div>

            {/* Description */}
            <p
              className={`text-zinc-300 mb-4 leading-relaxed text-xs sm:text-sm lg:text-[15px] font-medium max-w-[95%] ${
                isWideCard ? "lg:max-w-[420px] uppercase font-semibold text-zinc-300/90 tracking-wide" : ""
              } drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]`}
              style={{
                fontFamily: '"Brutal Font Light", sans-serif',
              }}
            >
              {prog.desc}
            </p>
          </div>

          {/* Bottom Pricing & Action Section */}
          <div className="mt-auto pt-4 sm:pt-5 w-full border-t border-zinc-800/80">
            <div className={isWideCard ? "flex items-center justify-between gap-3" : ""}>
              <div>
                <p
                  className="text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-widest font-bold mb-0.5"
                  style={{
                    fontFamily: '"BrutalTypeBold", sans-serif',
                  }}
                >
                  FROM
                </p>

                <div className="flex items-baseline flex-wrap gap-2 my-1">
                  <span
                    className="text-[#ccf141] font-black text-2xl sm:text-3xl lg:text-[34px] tracking-tight drop-shadow-[0_2px_12px_rgba(204,241,65,0.25)]"
                    style={{
                      fontFamily: '"BrutalTypeBold", Impact, sans-serif',
                    }}
                  >
                    ₹{prog.price || (prog.id === "family" ? "3,999" : "4,999")}
                  </span>
                  {prog.originalPrice && (
                    <span className="line-through text-zinc-500 font-bold text-xs sm:text-sm">
                      ₹{prog.originalPrice}
                    </span>
                  )}
                  <span className="text-zinc-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    / MONTH
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => handleScrollToPlans(e, prog.id)}
                className={`group/btn mt-4 sm:mt-0 ${
                  isWideCard ? "rounded-full px-5 sm:px-7 py-2.5 sm:py-2.5 text-xs" : "w-full rounded-xl py-3 sm:py-2.5 text-xs sm:text-[11px]"
                } font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center border cursor-pointer ${
                  prog.isComingSoon
                    ? "border-amber-500/60 bg-amber-500/15 text-amber-300 hover:bg-amber-500 hover:text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : activeTab === prog.id
                    ? "bg-[#ccf141] border-[#ccf141] text-black shadow-[0_0_20px_rgba(204,241,65,0.35)]"
                    : "border-zinc-700/80 bg-black/60 backdrop-blur-md text-white hover:border-[#ccf141] hover:bg-[#ccf141]/10 hover:text-[#ccf141]"
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
        </div>
      </motion.div>
    );
  };

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
                OUR PROGRAMS
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

          {/* PRIMARY PATHWAYS (CORE, ATHLETE, ARENA) */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-7 mt-8 md:mt-15">
            {primaryPrograms.map((prog, index) => renderProgramCard(prog, index))}
          </div>

          {/* MORE PROGRAMS BUTTON / DROPDOWN */}
          {morePrograms.length > 0 && (
            <div className="w-full mt-10 md:mt-14 flex flex-col items-center">
              {/* Divider & Centered Toggle Button */}
              <div className="flex items-center gap-3 sm:gap-4 w-full mb-6 px-1 max-w-5xl">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-zinc-700 flex-1" />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowMorePrograms((prev) => !prev)}
                  className="group relative p-[2px] rounded-full overflow-hidden cursor-pointer select-none transition-shadow duration-500 shadow-[0_4px_25px_rgba(0,0,0,0.8),0_0_20px_rgba(204,241,65,0.2)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.9),0_0_35px_rgba(204,241,65,0.45)] focus:outline-none"
                  aria-expanded={showMorePrograms}
                  aria-label="Toggle More Programs"
                >
                  {/* CONTINUOUS 360° SPINNING BORDER BEAM ANIMATION */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                    {/* Ambient Neon Glow Underlayer */}
                    <div
                      className="w-[420px] h-[420px] shrink-0 rounded-full animate-spin-border blur-[8px] opacity-85"
                      style={{
                        background:
                          "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 40deg, #ccf141 90deg, #ffffff 120deg, #ccf141 145deg, transparent 180deg, transparent 220deg, #ccf141 270deg, #ffffff 300deg, #ccf141 325deg, transparent 360deg)",
                      }}
                    />
                    {/* Razor-Sharp Laser Border Beam */}
                    <div
                      className="absolute w-[420px] h-[420px] shrink-0 rounded-full animate-spin-border"
                      style={{
                        background:
                          "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 40deg, #ccf141 90deg, #ffffff 120deg, #ccf141 145deg, transparent 180deg, transparent 220deg, #ccf141 270deg, #ffffff 300deg, #ccf141 325deg, transparent 360deg)",
                      }}
                    />
                  </div>

                  {/* Button Core Body */}
                  <div
                    className={`relative z-10 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full flex items-center gap-2.5 sm:gap-3 transition-colors duration-300 ${
                      showMorePrograms
                        ? "bg-[#0b0f05]"
                        : "bg-[#0c0c0e] group-hover:bg-[#121215]"
                    }`}
                  >
                    {/* Users Pod Icon */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        showMorePrograms
                          ? "bg-[#ccf141] text-black shadow-[0_0_15px_#ccf141]"
                          : "bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/35 group-hover:border-[#ccf141]/60"
                      }`}
                    >
                      <Users size={15} />
                    </div>

                    {/* Button Text */}
                    <span
                      className="text-xs sm:text-sm font-black uppercase tracking-wider text-white"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      {showMorePrograms ? "Hide More Programs" : "More Programs"}
                    </span>

                    {/* Duo & Family Badge with Pulse Indicator */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono font-bold rounded-full bg-[#ccf141]/20 text-[#ccf141] border border-[#ccf141]/45 tracking-widest shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141] animate-pulse" />
                      <span>DUO &amp; FAMILY</span>
                    </span>

                    {/* Animated Rotating Chevron */}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-500 ease-out ${
                        showMorePrograms
                          ? "rotate-180 text-[#ccf141]"
                          : "text-zinc-400 group-hover:text-white"
                      }`}
                    />
                  </div>
                </motion.button>
                <div className="h-[1px] bg-gradient-to-l from-transparent via-zinc-800 to-zinc-700 flex-1" />
              </div>

              {/* SMOOTH COLLAPSIBLE DROPDOWN TRANSITION */}
              <AnimatePresence initial={false}>
                {showMorePrograms && (
                  <motion.div
                    key="more-programs-collapsible"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        height: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.4, delay: 0.1 },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: {
                        height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.25 },
                      },
                    }}
                    className="overflow-hidden w-full"
                  >
                    <div className="pt-2 pb-6 flex flex-wrap justify-center gap-6 md:gap-7 w-full">
                      {morePrograms.map((prog, index) =>
                        renderProgramCard(prog, index)
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

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
                onClick={() => navigate("/junior")}
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

                {/* Background Image Container - Full Cover on Right Wing */}
                <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[52%] lg:w-[48%] xl:w-[46%] overflow-hidden pointer-events-none z-0 opacity-60 sm:opacity-100 transition-opacity">
                  <div
                    className="absolute inset-0 bg-cover bg-no-repeat filter grayscale brightness-110 contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${juniorProgram.image})`,
                      backgroundPosition: "center 34%",
                    }}
                  />
                  {/* Clean left-edge fade into solid card background (protects text while keeping full image crisp) */}
                  <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#0b0b0d] via-[#0b0b0d]/60 to-transparent z-10" />
                </div>

                {/* Sleek Floating Live Badge at Top-Right of Card - aligned with card inner padding */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-7 lg:top-8 lg:right-9 z-20 bg-black/85 backdrop-blur-md border border-[#ccf141]/35 text-[#ccf141] text-[9px] sm:text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141] shadow-[0_0_8px_#ccf141] animate-ping" />
                  <span className="hidden sm:inline">BOX &amp; CROSS YOUTH</span>
                  <span className="sm:hidden">YOUTH</span>
                </div>

                {/* Content Area: Highly refined on mobile, spacious and perfectly balanced on desktop */}
                <div className="relative z-10 p-4 sm:p-7 md:p-8 lg:p-9 flex flex-col justify-between h-full w-full max-w-[85%] sm:max-w-[70%] lg:max-w-[62%] xl:max-w-[58%]">
                  <div>
                    {/* Top Row: Icon + Badge + Age tag */}
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-black/80 border border-white/15 backdrop-blur-md flex items-center justify-center text-[#ccf141] shadow-md shrink-0 group-hover:border-[#ccf141]/50 group-hover:bg-[#ccf141]/10 transition-all duration-300">
                        <div className="scale-75 sm:scale-85 flex items-center justify-center">
                          {juniorProgram.icon}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ccf141]/15 border border-[#ccf141]/35 text-[#ccf141] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141] shadow-[0_0_6px_#ccf141]" />
                          <span>YOUTH &amp; ATHLETIC</span>
                        </div>
                        {juniorProgram.isComingSoon && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[9px] font-black uppercase tracking-wider">
                            COMING SOON
                          </span>
                        )}
                        <span className="text-zinc-400 text-[10px] sm:text-xs font-medium">
                          Ages 7–13 · All Levels
                        </span>
                      </div>
                    </div>

                    {/* Main Title & Tagline */}
                    <div>
                      <div className="flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
                        <h3
                          className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                          style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                        >
                          {juniorProgram.title}
                        </h3>
                        <span
                          className="text-sm sm:text-lg md:text-xl font-bold text-[#ccf141] tracking-wider uppercase"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          {juniorProgram.subtitle}
                        </span>
                      </div>

                      <p
                        className="text-zinc-300 text-[11px] sm:text-xs md:text-[13.5px] mt-1.5 sm:mt-2 leading-relaxed max-w-lg lg:max-w-xl font-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                        style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
                      >
                        Three coached sessions a week. Boxing fundamentals, footwork, screen-free focus &amp; lifelong discipline.
                      </p>
                    </div>

                    {/* Quick Value Highlights Mini-Chips */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2.5 sm:mt-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 text-[10px] sm:text-[11px] font-medium backdrop-blur-sm">
                        <Check size={11} className="text-[#ccf141] shrink-0" />
                        <span>3 Sessions / Wk</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 text-[10px] sm:text-[11px] font-medium backdrop-blur-sm">
                        <Check size={11} className="text-[#ccf141] shrink-0" />
                        <span>Screen-Free</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 text-[10px] sm:text-[11px] font-medium backdrop-blur-sm">
                        <Check size={11} className="text-[#ccf141] shrink-0" />
                        <span>Non-Contact Basics</span>
                      </span>
                    </div>
                  </div>

                  {/* Compact Bottom Pricing & CTA Row: Perfectly aligned on desktop and mobile */}
                  <div className="mt-3.5 sm:mt-5 pt-3 sm:pt-4 border-t border-zinc-800/80 flex items-center justify-between sm:justify-start sm:gap-6 md:gap-8 flex-wrap">
                    <div>
                      <span className="block text-zinc-400 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest">
                        STARTS FROM
                      </span>
                      <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5">
                        <span
                          className="text-2xl sm:text-3xl font-black text-[#ccf141] leading-none tracking-tight drop-shadow-[0_2px_10px_rgba(204,241,65,0.25)]"
                          style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                        >
                          ₹{juniorProgram.price || "2,999"}
                        </span>
                        {juniorProgram.originalPrice && (
                          <span
                            className="line-through text-zinc-500 text-xs sm:text-sm font-bold leading-none"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            ₹{juniorProgram.originalPrice}
                          </span>
                        )}
                        <span className="text-zinc-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                          / MONTH
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleScrollToPlans(e, juniorProgram.id)}
                      className={`group/btn px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 shadow-md active:scale-95 shrink-0 ${
                        juniorProgram.isComingSoon
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500 hover:text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                          : activeTab === juniorProgram.id
                            ? "bg-[#ccf141] text-black shadow-[0_0_20px_rgba(204,241,65,0.4)] hover:bg-[#bfe635]"
                            : "bg-white text-black hover:bg-[#ccf141] hover:text-black shadow-[0_4px_15px_rgba(255,255,255,0.15)]"
                      }`}
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      <span>
                        {juniorProgram.isComingSoon
                          ? "VIEW DETAILS · COMING SOON"
                          : "VIEW JUNIOR PLANS"}
                      </span>
                      <ArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* STEP 2: CHOOSE PLAN - Hidden on main membership page as requested */}

        <ChoosePlan
          hideAll={true}
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
