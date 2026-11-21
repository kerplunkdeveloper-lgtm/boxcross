// Shared option lists for the member feedback form and the admin dashboard.
// Keep in sync with backend/models/Feedback.js

export const CONNECTIONS = [
  "Existing member",
  "Trial visitor",
  "Former member",
  "Guest / Event participant",
];

export const PROGRAMMES = [
  "Boxing",
  "Strength Training",
  "Hybrid / Conditioning",
  "Personal Training",
  "Other / Not applicable",
];

export const AREA_RATINGS = [
  { key: "coaching", label: "Coaching quality and attention" },
  { key: "equipment", label: "Equipment and training space" },
  { key: "cleanliness", label: "Arena cleanliness and washrooms" },
  { key: "timings", label: "Training timings and class management" },
];

export const IMPROVEMENT_AREAS = [
  "Coaching and trainer support",
  "Equipment availability and maintenance",
  "Cleanliness and washrooms",
  "Air conditioning, ventilation and music",
  "Class timings and overcrowding",
  "Front desk and communication",
  "Membership plans and value",
  "Nothing specific",
];

export const WRITTEN_QUESTIONS = [
  { key: "lovedMost", label: "What do you love most about Box & Cross?" },
  { key: "changeOne", label: "If you could change ONE thing about our arena, what would it be?" },
  { key: "newIdeas", label: "What new facilities, classes or experiences would you like BXC to introduce?" },
  { key: "anythingElse", label: "Is there anything else you'd like management to know?" },
];

export const SAFETY_ANSWERS = ["Yes", "No", "Prefer not to say"];

export const FEEDBACK_STATUSES = ["Open", "In Progress", "Resolved"];

// Management WhatsApp shown for urgent safety concerns
export const MANAGEMENT_WHATSAPP = "918925556900";

// Public URL members reach by scanning the QR code
export const feedbackUrl = () =>
  `${typeof window !== "undefined" ? window.location.origin : "https://membership.boxandcross.com"}/feedback`;
