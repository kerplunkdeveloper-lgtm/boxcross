import React from "react";
import MembershipTierDetail from "../Components/MembershipTierDetail";
import juniorBoxer from "../assets/junior_boxer.jpg";
import { Dumbbell, Trophy, ShieldCheck, Users } from "lucide-react";

const juniorTierData = {
  id: "junior",
  title: "JUNIOR CORE",
  badge: "UNDER 13 • YOUTH BOXING & ATHLETIC EXCELLENCE",
  metaTitle: "Junior Core Membership | Youth Boxing & Athletics | Box & Cross",
  metaDescription:
    "Youth boxing, discipline, agility, and athletic development for children under 13 at Box & Cross. Supervised by certified coaches with a focus on confidence and safety.",
  subtitle: "DISCIPLINE. CONFIDENCE. SCREEN-FREE ATHLETIC EXCELLENCE.",
  desc: "Five coached sessions a week for ages 6–13. Combining Olympic boxing fundamentals, agility ladder drills, reaction training, and functional posture correction on a 100% supervised arena floor. No full-contact head sparring — pure skill, discipline, and healthy confidence.",
  image: juniorBoxer,
  disciplineCount: "Youth Pathway (Ages 6–13)",
  starterPrice: "1,958",
  dailyRate: "₹64",
  dailyRateLabel: "A DAY ON THE 12-MONTH PLAN",
  dailyComparison: "One tender coconut or fresh juice.",
  pathwaySectionDesc:
    "Our youth curriculum balances authentic boxing mechanics with speed-agility-quickness (SAQ) drills and posture development in a safe, fun, and high-discipline setting.",
  pathways: [
    {
      name: "Junior Boxing Fundamentals",
      tag: "SKILL & DISCIPLINE",
      description:
        "Authentic boxing mechanics taught safely: balanced stance, footwork rhythm, jab-cross mechanics, defensive guard, and focus mitt work. Certified coaches ensure proper form with zero head contact.",
      highlights: [
        "Stance, balance & guard fundamentals",
        "Focus mitts & heavy bag rhythm rounds",
        "Slip, roll & reaction drills (100% safe)",
        "Respect, ring etiquette & sportsmanship",
      ],
    },
    {
      name: "Speed, Agility & Quickness (SAQ)",
      tag: "SPEED & COORDINATION",
      description:
        "High-energy footwork ladders, cone evasion courses, hurdle hops, and bilateral coordination drills. Channels youthful energy into sharp, explosive athletic speed.",
      highlights: [
        "Agility ladders & fast-twitch foot speed",
        "Reaction ball catching & hand-eye reflexes",
        "Balance, sprint mechanics & evasion",
        "Fun, engaging athletic obstacle challenges",
      ],
    },
    {
      name: "Youth Posture & Functional Strength",
      tag: "POSTURE & ENDURANCE",
      description:
        "Combats screen slouching and heavy schoolbags through natural bodyweight mechanics: bear crawls, plank holds, jump mechanics, and rotational core stability.",
      highlights: [
        "Postural correction & scapular alignment",
        "Safe bodyweight movement (squats, crawls, jumps)",
        "Core stability & athletic injury prevention",
        "Cardiovascular endurance & mental stamina",
      ],
    },
  ],
  plans: [
    {
      months: "1 MONTH",
      subtitle: "STANDARD",
      price: "3,000",
      totalPrice: "3,000",
      perMonth: "3,000",
      originalPrice: "",
      highlights: [
        "5 Coached youth sessions a week",
        "Certified youth coach supervision",
        "Youth boxing & agility curriculum",
        "100% safe arena environment",
      ],
      tag: "STANDARD",
      buttonText: "STANDARD",
    },
    {
      months: "3 MONTHS",
      subtitle: "SAVE ₹1,500",
      price: "7,500",
      totalPrice: "7,500",
      perMonth: "2,500",
      originalPrice: "9,000",
      highlights: [
        "5 Coached youth sessions a week",
        "Quarterly motor-skill milestone card",
        "Hand wrap & footwork evaluation",
        "Locked founding youth rate",
      ],
      tag: "SAVE ₹1,500",
      buttonText: "SAVE ₹1,500",
    },
    {
      months: "6 MONTHS",
      subtitle: "SAVE ₹4,500",
      price: "13,500",
      totalPrice: "13,500",
      perMonth: "2,250",
      originalPrice: "18,000",
      isPopular: true,
      highlights: [
        "5 Coached youth sessions a week",
        "Progressive boxing technique check-in",
        "Parent-coach feedback meeting",
        "Complimentary BXC youth gym bag",
      ],
      tag: "MOST POPULAR",
      buttonText: "SAVE ₹4,500",
    },
    {
      months: "12 MONTHS",
      subtitle: "SAVE ₹12,500",
      price: "23,500",
      totalPrice: "23,500",
      perMonth: "1,958",
      originalPrice: "36,000",
      highlights: [
        "5 Coached youth sessions a week",
        "Maximum discount (only ₹64/day)",
        "Founding Wall youth recognition badge",
        "Junior Athlete Certificate of Graduation",
      ],
      tag: "BEST VALUE",
      buttonText: "SAVE ₹12,500",
    },
    {
      months: "24 MONTHS",
      subtitle: "SAVE ₹32,400",
      price: "39,600",
      totalPrice: "39,600",
      perMonth: "1,650",
      originalPrice: "72,000",
      highlights: [
        "5 Coached youth sessions a week",
        "2-Year youth rate freeze guarantee",
        "Elite youth pathway progression",
        "VIP guest parent trial passes",
      ],
      tag: "2-YEAR LOCK",
      buttonText: "SAVE ₹32,400",
    },
  ],
  benefits: [
    {
      boldText: "Confidence that carries into the classroom.",
      normalText:
        "A child who learns to carry their stance with balanced posture stops shrinking in a crowd. Real physical capability changes how they carry themselves at school.",
    },
    {
      boldText: "They learn self-defense — and self-restraint.",
      normalText:
        "Discipline is taught before the punch is. Real martial arts instills profound calm, emotional control, and respect for others.",
    },
    {
      boldText: "Laser focus that carries into studies.",
      normalText:
        "Boxing is a thinking discipline — you read, decide, and move in the same second. Three rounds on the pads sharpen cognitive attention span and homework focus.",
    },
    {
      boldText: "Off the screens, sweat on the canvas.",
      normalText:
        "Replacing endless scrolling and gaming with high-energy physical output. They return home tired in the right way, eat well, and sleep soundly by 9 PM.",
    },
    {
      boldText: "Coaches who serve as positive mentors.",
      normalText:
        "Every child receives individual encouragement, firm guidance, and genuine belief from certified coaches dedicated to youth athletic development.",
    },
  ],
  allInclusions: [
    "5 Coached youth group sessions every week",
    "100% coach-supervised arena floor — zero head contact",
    "Olympic boxing mechanics & footwork training",
    "Speed, Agility & Quickness (SAQ) ladder courses",
    "Quarterly junior athletic milestone report card",
    "Parent observation lounge with Wi-Fi & refreshments",
    "Postural correction & screen-free conditioning",
    "Junior achievement graduation badge & certificate",
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
      id: "arena",
      title: "ARENA",
      badge: "ALL ACCESS • VIP",
      price: "5,600",
      path: "/membership/arena",
      icon: <Trophy size={24} />,
    },
    {
      id: "family",
      title: "FAMILY FIT",
      badge: "ALL AGES • PARENT + KID",
      price: "11,900",
      path: "/membership/family",
      icon: <Users size={24} />,
    },
  ],
  faqs: [
    {
      q: "Is junior boxing safe? Will my child get hurt or hit?",
      a: "Safety is our absolute #1 non-negotiable rule. Junior Core has ZERO full-contact head sparring. Training strictly focuses on pad work, heavy bags, shadowboxing, footwork drills, and defensive reaction games under 100% certified coach supervision.",
    },
    {
      q: "What is the age group for Junior Core?",
      a: "Junior Core welcomes children from ages 6 to 13. Kids are grouped by age and developmental stage to ensure safe, fun, and age-appropriate drills.",
    },
    {
      q: "Will boxing make my child aggressive or fight in school?",
      a: "Quite the opposite. Disciplined boxing training channels restless energy into self-control, humility, and calm focus. Children are taught that physical aggression outside the ring is unacceptable.",
    },
    {
      q: "Can parents watch the training sessions?",
      a: "Yes! We have a comfortable observation area overlooking the training floor where parents can relax, work on Wi-Fi, or have coffee while watching their child's progress.",
    },
    {
      q: "What should my child wear and bring to their first session?",
      a: "Standard athletic training attire (t-shirt/shorts) and clean indoor sports shoes. Hand wraps and gloves can be borrowed for trial sessions or purchased at our arena pro desk.",
    },
  ],
};

const MembershipJunior = () => {
  return <MembershipTierDetail tierData={juniorTierData} />;
};

export default MembershipJunior;

