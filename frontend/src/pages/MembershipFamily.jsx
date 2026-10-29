import React from "react";
import MembershipTierDetail from "../Components/MembershipTierDetail";
import familyFatherSonImg from "../assets/family_father_son.jpg";
import { Dumbbell, ShieldCheck, Trophy, Users } from "lucide-react";

const familyTierData = {
  id: "family",
  title: "BXC FAMILY FIT",
  badge: "ALL AGES • PARENT + YOUTH INTEGRATED PASS",
  metaTitle: "BXC Family Fit Membership | All Ages Family Fitness | Box & Cross",
  metaDescription:
    "All-in-one family fitness membership at Box & Cross. Full arena access for parents (Boxing, HYROX, Strength) plus coached youth athletics for kids (up to 4 family members).",
  subtitle: "ACTIVE PARENTS. RESILIENT KIDS. ONE SHARED TRAINING GROUND.",
  desc: "One consolidated membership covering up to 4 family members (parents + children). While parents train across Boxing, HYROX, or Strength Training, kids master Olympic youth boxing and agility with certified youth coaches simultaneously. No split schedules, no scattered memberships.",
  image: familyFatherSonImg,
  disciplineCount: "Family Pass (Up to 4 Members)",
  starterPrice: "11,900",
  dailyRate: "₹390",
  dailyRateLabel: "A DAY FOR THE WHOLE FAMILY (12-MONTH PLAN)",
  dailyComparison: "One casual weekend family dinner.",
  pathwaySectionDesc:
    "Family Fit integrates adult athletic mastery with youth development, allowing parents and children to train during synchronized class slots or enjoy open floor together.",
  pathways: [
    {
      name: "Adult Performance Suite (For Parents)",
      tag: "PARENTS • BOXING, HYROX & STRENGTH",
      description:
        "Full access to all adult pathways. Choose from Olympic boxing, functional strength hypertrophy, or high-tempo HYROX endurance with dedicated coaches.",
      highlights: [
        "5 weekly coached sessions per adult",
        "Full choice of Boxing, HYROX & Strength",
        "Open gym floor & premium locker rooms",
        "Quarterly InBody body composition scan",
      ],
    },
    {
      name: "Junior Youth Coaching (For Children)",
      tag: "KIDS (AGES 6-13) • BOXING & AGILITY",
      description:
        "Coached youth boxing fundamentals, agility ladder drills, and postural exercises in a 100% supervised environment with zero head contact.",
      highlights: [
        "5 weekly coached youth sessions per child",
        "Speed, Agility & Quickness (SAQ) ladders",
        "Postural correction & screen-free fitness",
        "Quarterly junior milestone report cards",
      ],
    },
    {
      name: "Family Tribe & Weekend Arena Access",
      tag: "SHARED FAMILY TIME",
      description:
        "Concurrent weekend training hours and family fitness challenges. Build lifelong healthy habits as a family under one roof.",
      highlights: [
        "Concurrent schedules (train at the same time)",
        "Weekend family open-floor workout sessions",
        "One single billing account for up to 4 members",
        "VIP family access to BXC community events",
      ],
    },
  ],
  plans: [
    {
      months: "1 MONTH",
      subtitle: "STANDARD",
      price: "15,000",
      totalPrice: "15,000",
      perMonth: "15,000",
      originalPrice: "",
      highlights: [
        "Coached sessions for up to 4 members",
        "Adult pathways + Junior youth boxing",
        "Synchronized session schedule slots",
        "Full arena facilities access",
      ],
      tag: "STANDARD",
      buttonText: "STANDARD",
    },
    {
      months: "3 MONTHS",
      subtitle: "SAVE ₹3,000",
      price: "42,000",
      totalPrice: "42,000",
      perMonth: "14,000",
      originalPrice: "45,000",
      highlights: [
        "Coached sessions for all 4 members",
        "Quarterly family fitness benchmark",
        "Junior skill milestone evaluations",
        "Locked quarterly family rate",
      ],
      tag: "SAVE ₹3,000",
      buttonText: "SAVE ₹3,000",
    },
    {
      months: "6 MONTHS",
      subtitle: "SAVE ₹12,000",
      price: "78,000",
      totalPrice: "78,000",
      perMonth: "13,000",
      originalPrice: "90,000",
      isPopular: true,
      highlights: [
        "Coached sessions for all 4 members",
        "Technique & athletic milestone tracking",
        "VIP guest passes for family friends",
        "Complimentary BXC family gear kit",
      ],
      tag: "MOST POPULAR",
      buttonText: "SAVE ₹12,000",
    },
    {
      months: "12 MONTHS",
      subtitle: "SAVE ₹37,200",
      price: "142,800",
      totalPrice: "142,800",
      perMonth: "11,900",
      originalPrice: "180,000",
      highlights: [
        "Coached sessions for all 4 members",
        "Maximum discount (only ₹390/day for all)",
        "Founding Wall family recognition plaque",
        "Complimentary InBody scans & guest passes",
      ],
      tag: "BEST VALUE",
      buttonText: "SAVE ₹37,200",
    },
    {
      months: "24 MONTHS",
      subtitle: "SAVE ₹122,400",
      price: "237,600",
      totalPrice: "237,600",
      perMonth: "9,900",
      originalPrice: "360,000",
      highlights: [
        "Coached sessions for all 4 members",
        "2-Year family rate freeze guarantee",
        "Priority arena locker allocations",
        "VIP invitations to all BXC events",
      ],
      tag: "2-YEAR LOCK",
      buttonText: "SAVE ₹122,400",
    },
  ],
  benefits: [
    {
      boldText: "Active role models inspire children.",
      normalText:
        "Kids emulate what they see. When parents train hard with discipline, healthy habits and grit become second nature for the next generation.",
    },
    {
      boldText: "Screen-free family time with genuine purpose.",
      normalText:
        "Replace weekend screen marathons with punches, agility ladders, and shared sweat. High-energy weekends that leave everyone feeling recharged.",
    },
    {
      boldText: "Concurrent schedules that save your weekend.",
      normalText:
        "Drop off junior for boxing while you hit the HYROX or Strength floor simultaneously. Zero double trips, zero wasted hours waiting in parking lots.",
    },
    {
      boldText: "One simple plan for everyone.",
      normalText:
        "Unrestricted arena access for the entire family under a single, unified membership without four disjointed gym bills.",
    },
  ],
  allInclusions: [
    "Coached sessions for up to 4 family members (Parents + Children)",
    "Adult access to Boxing, HYROX, and Strength pathways",
    "Supervised Junior boxing, agility, and motor skill curriculum",
    "Synchronized weekend family open gym hours",
    "Quarterly adult InBody scans & junior milestone tracking",
    "Dedicated family equipment guidance & pro shop perks",
    "Comfortable lounge with high-speed Wi-Fi for work or homework",
    "Complimentary BXC Family starter pack & gear vouchers",
  ],
  otherTiers: [
    {
      id: "core",
      title: "CORE",
      badge: "ONE PATHWAY • ADULT",
      price: "2,800",
      path: "/membership/core",
      icon: <Dumbbell size={24} />,
    },
    {
      id: "athlete",
      title: "ATHLETE",
      badge: "TWO PATHWAYS • MOST POPULAR",
      price: "4,000",
      path: "/membership/athlete",
      icon: <ShieldCheck size={24} />,
    },
    {
      id: "junior",
      title: "JUNIOR CORE",
      badge: "UNDER 13 • YOUTH ATHLETICS",
      price: "1,958",
      path: "/membership/junior",
      icon: <Trophy size={24} />,
    },
  ],
  faqs: [
    {
      q: "How many family members are included in BXC Family Fit?",
      a: "BXC Family Fit covers up to 4 immediate family members (e.g., 2 parents + 2 children, or 1 parent + 3 children). Additional family members can be added with an easy add-on fee.",
    },
    {
      q: "Can parents and children train at the same time?",
      a: "Yes! Our timetable is specifically crafted with concurrent session slots so children can attend Junior Boxing while parents participate in adult Strength or HYROX sessions simultaneously.",
    },
    {
      q: "What if our children are different ages?",
      a: "Children between ages 6 and 13 participate in our Junior Core curriculum. Older teenagers (14+) can join adult foundation pathways under coach supervision.",
    },
    {
      q: "Can we freeze the membership during family vacations?",
      a: "Yes, 6-month, 12-month, and 24-month family passes include official freeze allowances during school holidays or family travel upon prior email notice.",
    },
  ],
};

const MembershipFamily = () => {
  return <MembershipTierDetail tierData={familyTierData} />;
};

export default MembershipFamily;

