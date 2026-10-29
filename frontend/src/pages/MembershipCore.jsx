import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MembershipTierDetail from "../Components/MembershipTierDetail";
import box1 from "../assets/box1.png";
import { Dumbbell, Trophy } from "lucide-react";

const coreTierData = {
  id: "core",
  title: "CORE",
  badge: "ONE PATHWAY • ESSENTIAL FOUNDATION",
  metaTitle: "Core Membership | One Pathway | Box & Cross",
  metaDescription:
    "Master one discipline with five coached sessions a week at Box & Cross. Choose Boxing, HYROX, or Strength Training with personal coach guidance and arena access.",
  subtitle: "ONE DISCIPLINE. ZERO DISTRACTIONS. MAXIMUM PROGRESSION.",
  desc: "Five coached sessions a week dedicated entirely to one chosen pathway — Boxing, HYROX, or Strength Training. Perfect for those who want structured skill building, accountability, and physical transformation without compromise.",
  image: box1,
  disciplineCount: "1 Pathway",
  starterPrice: "2,800",
  dailyRate: "₹92",
  dailyRateLabel: "A DAY ON THE 12-MONTH PLAN",
  dailyComparison: "Two coffees and a vada.",
  pathwaySectionDesc:
    "With Core, you dedicate your 5 weekly coached sessions to your chosen craft. You can focus deeply and build elite form.",
  pathways: [
    {
      name: "Performance Boxing",
      tag: "FIGHT DISCIPLINE",
      description:
        "Learn authentic boxing mechanics: jab-cross combos, footwork drills, slip and roll defense, heavy bag rounds, and pad work under elite coaches.",
      highlights: [
        "Stance & footwork fundamentals",
        "Heavy bag and mitt work rounds",
        "Defensive head movement & guard",
        "Fight conditioning & endurance",
      ],
    },
    {
      name: "HYROX Lab",
      tag: "RACE & ENDURANCE",
      description:
        "Engineered for cardiovascular output, stamina, and functional endurance. High-tempo sled pushes, ski erg, wall balls, rowing, and running drills.",
      highlights: [
        "Official HYROX movement standards",
        "Ergometer & sprint interval pacing",
        "Aerobic capacity & mental grit",
        "High-density metabolic conditioning",
      ],
    },
    {
      name: "Strength Lab",
      tag: "POWER & HYPERTROPHY",
      description:
        "Structured compound strength training with barbells, kettlebells, and dumbbells. Focus on correct biomechanics, progressive overload, and functional strength.",
      highlights: [
        "Squat, deadlift, and press mechanics",
        "Progressive overload periodization",
        "Core stability & rotational power",
        "Injury prevention & mobility",
      ],
    },
  ],
  plans: [
    {
      months: "1 MONTH",
      subtitle: "STANDARD",
      price: "3,500",
      totalPrice: "3,500",
      perMonth: "3,500",
      originalPrice: "",
      highlights: [
        "Five Coached sessions a week",
        "One pathway focus",
        "Open gym & community access",
        "Coach baseline check",
      ],
      tag: "STANDARD",
      buttonText: "STANDARD",
    },
    {
      months: "3 MONTHS",
      subtitle: "SAVE ₹500",
      price: "10,000",
      totalPrice: "10,000",
      perMonth: "3,333",
      originalPrice: "10,500",
      highlights: [
        "Five Coached sessions a week",
        "Held rate for full quarter",
        "Coach assessment review",
        "InBody scan included",
      ],
      tag: "SAVE ₹500",
      buttonText: "SAVE ₹500",
    },
    {
      months: "6 MONTHS",
      subtitle: "SAVE ₹2,100",
      price: "18,900",
      totalPrice: "18,900",
      perMonth: "3,150",
      originalPrice: "21,000",
      isPopular: true,
      highlights: [
        "Five Coached sessions a week",
        "Locked rate for 6 months",
        "1-on-1 coach check-ins",
        "Free locker allocation",
      ],
      tag: "MOST POPULAR",
      buttonText: "SAVE ₹2,100",
    },
    {
      months: "12 MONTHS",
      subtitle: "SAVE ₹8,400",
      price: "33,600",
      totalPrice: "33,600",
      perMonth: "2,800",
      originalPrice: "42,000",
      highlights: [
        "Five Coached sessions a week",
        "Maximum discount (₹92/day)",
        "Founding Wall recognition",
        "Complimentary BXC starter pack",
      ],
      tag: "BEST VALUE",
      buttonText: "SAVE ₹8,400",
    },
    {
      months: "24 MONTHS",
      subtitle: "SAVE ₹26,400",
      price: "57,600",
      totalPrice: "57,600",
      perMonth: "2,400",
      originalPrice: "84,000",
      highlights: [
        "Five Coached sessions a week",
        "2-Year rate freeze guarantee",
        "Founding Elite Wall badge",
        "VIP guest passes included",
      ],
      tag: "2-YEAR LOCK",
      buttonText: "SAVE ₹26,400",
    },
  ],
  benefits: [
    {
      boldText: "You can defend yourself.",
      normalText:
        "Quietly knowing that changes how you walk down a street at night. You develop real, tested body competence.",
    },
    {
      boldText: "The bad day goes into the bag.",
      normalText:
        "Not into your family, not into your sleep. Leave everyday friction on the canvas floor.",
    },
    {
      boldText: "Sharper at work.",
      normalText:
        "Boxing is a thinking sport — you read, decide and move in the same second. Brain and reflexes sync.",
    },
    {
      boldText: "A coach who knows your name and your weakness.",
      normalText:
        "Nobody improves alone wandering an uncoached gym floor. Here, someone has eyes on every rep.",
    },
  ],
  allInclusions: [
    "5 Coached group sessions every week",
    "Choice of Boxing, HYROX or Strength pathway",
    "Open gym floor access during operational hours",
    "InBody Body Composition analysis check-ins",
    "Progressive technique evaluations",
    "Clean locker rooms and hot showers",
    "Community workouts and masterclasses",
    "Access to BXC performance workshops",
  ],
  otherTiers: [
    {
      id: "athlete",
      title: "ATHLETE",
      badge: "TWO PATHWAYS • MOST POPULAR",
      price: "4,000",
      path: "/membership/athlete",
      icon: <Dumbbell size={24} />,
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
      q: "Can I switch my chosen pathway after joining Core?",
      a: "Yes! While Core covers one pathway at a time, you can consult with your head coach and switch your primary pathway at the end of a training block (e.g., from Strength to Boxing).",
    },
    {
      q: "Are the sessions beginner friendly?",
      a: "Absolutely. Every session is led by a certified coach who scales movement patterns, weight loads, and complexity to your current fitness level.",
    },
    {
      q: "What equipment do I need to bring?",
      a: "Standard athletic training attire and clean training shoes. For boxing, hand wraps and 14oz/16oz boxing gloves are recommended (starter gear available at the arena).",
    },
    {
      q: "Can I freeze my membership if I travel?",
      a: "Yes, 6-month, 12-month and 24-month memberships include official hold/freeze allowances upon prior email notice.",
    },
  ],
};

const MembershipCore = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = (params.get("plan") || params.get("type") || "").toLowerCase();
    if (params.get("junior") === "true" || plan === "junior") {
      navigate("/junior", { replace: true });
    } else if (params.get("family") === "true" || plan === "family" || plan.includes("family")) {
      navigate("/family", { replace: true });
    }
  }, [location.search, navigate]);

  return <MembershipTierDetail tierData={coreTierData} />;
};

export default MembershipCore;
