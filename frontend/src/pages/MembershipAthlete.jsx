import React from "react";
import MembershipTierDetail from "../Components/MembershipTierDetail";
import box2 from "../assets/box2.png";
import { Zap, Trophy } from "lucide-react";

const athleteTierData = {
  id: "athlete",
  title: "ATHLETE",
  badge: "TWO PATHWAYS • MOST POPULAR",
  metaTitle: "Athlete Membership | Two Pathways | Box & Cross",
  metaDescription:
    "Train like a complete athlete with five coached sessions a week across two pathways at Box & Cross. Combine Boxing + HYROX or Boxing + Strength Training.",
  subtitle: "TWO DISCIPLINES. COMPLETE HYBRID CONDITIONING.",
  desc: "Five coached sessions a week balanced across two disciplines — Boxing + HYROX or Boxing + Strength Training. Built for individuals who refuse to be one-dimensional: powerful, lean, and possessing real athletic cardiovascular capacity.",
  image: box2,
  disciplineCount: "2 Pathways",
  starterPrice: "4,000",
  dailyRate: "₹132",
  dailyRateLabel: "A DAY ON THE 12-MONTH PLAN",
  dailyComparison: "One burger.",
  pathwaySectionDesc:
    "Athlete members combine two complementary pathways to unlock hybrid conditioning, elite stamina, and avoid training plateaus.",
  pathways: [
    {
      name: "Boxing + HYROX",
      tag: "THE FIGHT ENGINE",
      description:
        "Pairs technical striking, speed, and reaction drills with high-output HYROX endurance intervals. Builds a relentless gas tank and lean athletic physique.",
      highlights: [
        "Unbeatable aerobic & anaerobic stamina",
        "Fast-twitch speed paired with long-haul endurance",
        "Sled drives, ergs, and heavy bag conditioning",
        "High calorie burn and rapid body recomposition",
      ],
    },
    {
      name: "Boxing + Strength",
      tag: "THE POWER STRIKER",
      description:
        "Combines heavy barbell lifts and hypertrophy with rotational boxing power, footwork, and core defense. For those who want strength with knockout agility.",
      highlights: [
        "Kinetic chain rotational power generation",
        "Compound lifts (deadlifts, squats, bench press)",
        "Shoulder stability, punch endurance & armor",
        "Muscular definition without losing agility",
      ],
    },
    {
      name: "HYROX + Strength",
      tag: "HYBRID PERFORMANCE",
      description:
        "Dual focus on functional strength and race-day endurance. Perfect for HYROX competitors, obstacle course racers, and pure athletic performance.",
      highlights: [
        "Lactate threshold management & pacing",
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
      price: "5,000",
      totalPrice: "5,000",
      perMonth: "5,000",
      originalPrice: "",
      highlights: [
        "Five coached sessions a week",
        "Two disciplines access",
        "Full arena facilities access",
        "Initial coach assessment",
      ],
      tag: "STANDARD",
      buttonText: "STANDARD",
    },
    {
      months: "3 MONTHS",
      subtitle: "SAVE ₹800",
      price: "14,200",
      totalPrice: "14,200",
      perMonth: "4,733",
      originalPrice: "15,000",
      highlights: [
        "Five coached sessions a week",
        "Two disciplines access",
        "Bi-weekly coach check-ins",
        "Full baseline performance profile",
      ],
      tag: "SAVE ₹800",
      buttonText: "SAVE ₹800",
    },
    {
      months: "6 MONTHS",
      subtitle: "SAVE ₹3,000",
      price: "27,000",
      totalPrice: "27,000",
      perMonth: "4,500",
      originalPrice: "30,000",
      isPopular: true,
      highlights: [
        "Five coached sessions a week",
        "Two disciplines access",
        "Monthly InBody scans & body metrics",
        "2 Free guest passes included",
      ],
      tag: "MOST POPULAR",
      buttonText: "SAVE ₹3,000",
    },
    {
      months: "12 MONTHS",
      subtitle: "SAVE ₹12,000",
      price: "48,000",
      totalPrice: "48,000",
      perMonth: "4,000",
      originalPrice: "60,000",
      highlights: [
        "Five coached sessions a week",
        "Two disciplines access",
        "Priority event & workshop booking",
        "Founding Wall recognition + BXC gear",
      ],
      tag: "BEST VALUE",
      buttonText: "SAVE ₹12,000",
    },
    {
      months: "24 MONTHS",
      subtitle: "SAVE ₹36,000",
      price: "84,000",
      totalPrice: "84,000",
      perMonth: "3,500",
      originalPrice: "120,000",
      highlights: [
        "Five coached sessions a week",
        "Two disciplines access",
        "2-Year price freeze protection",
        "VIP guest passes & masterclasses",
      ],
      tag: "2-YEAR LOCK",
      buttonText: "SAVE ₹36,000",
    },
  ],
  benefits: [
    {
      boldText: "Strong and not out of breath.",
      normalText:
        "Most gym goers get one or the other. Two pathways gives you both real lifting power and a marathon gas tank.",
    },
    {
      boldText: "You stop plateauing.",
      normalText:
        "Five sessions across two disciplines ensures your central nervous system and muscles never grow stale or bored.",
    },
    {
      boldText: "Visible change by week twelve.",
      normalText:
        "Measured on your athletic benchmark card and InBody analysis, not guessed in the mirror.",
    },
    {
      boldText: "The body you had at twenty-five,",
      normalText:
        "Built the way real athletes build it: athletic resilience, mobile joints, and functional muscle.",
    },
  ],
  allInclusions: [
    "5 Coached sessions weekly across 2 chosen disciplines",
    "Freedom to combine Boxing with HYROX or Strength",
    "Full access to open gym floor and strength cages",
    "Quarterly InBody biometric composition tracking",
    "Athlete readiness and progress baseline scoring",
    "Shower, locker, and change room access",
    "Invitation to BXC community competitions & sparring",
    "Access to visiting coach seminars and specialty clinics",
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
      id: "arena",
      title: "ARENA",
      badge: "ALL ACCESS • VIP",
      price: "5,600",
      path: "/membership/arena",
      icon: <Trophy size={24} />,
    },
  ],
  faqs: [
    {
      q: "How do I split my 5 weekly sessions across the two pathways?",
      a: "You have flexibility! A popular split is 3 days of Boxing + 2 days of Strength/HYROX, or 3 days of HYROX + 2 days of Boxing. Your coach will help structure a weekly cadence that matches your target.",
    },
    {
      q: "Can I do both Boxing and Strength on the same day?",
      a: "Yes, you can schedule back-to-back blocks or split them throughout the week according to our master timetable slots.",
    },
    {
      q: "Do I need to be in athletic shape before starting the Athlete tier?",
      a: "Not at all. The Athlete tier is where athletic conditioning is forged. We meet you at your current level and progressively elevate your strength and aerobic engine.",
    },
    {
      q: "What if I decide to upgrade to Arena later?",
      a: "You can seamlessly upgrade to the Arena tier anytime. Your remaining balance will be adjusted toward the new tier.",
    },
  ],
};

const MembershipAthlete = () => {
  return <MembershipTierDetail tierData={athleteTierData} />;
};

export default MembershipAthlete;
