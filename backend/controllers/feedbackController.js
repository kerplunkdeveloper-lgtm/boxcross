const Feedback = require("../models/Feedback");
const { FEEDBACK_OPTIONS } = require("../models/Feedback");

const { CONNECTIONS, PROGRAMMES, IMPROVEMENT_AREAS, SAFETY_ANSWERS, STATUSES } = FEEDBACK_OPTIONS;
const RATING_KEYS = ["overall", "coaching", "equipment", "cleanliness", "timings"];
const TEXT_KEYS = ["lovedMost", "changeOne", "newIdeas", "anythingElse"];
const MAX_TEXT = 5000;

const pick = (val, allowed) => (allowed.includes(val) ? val : "");
const cleanText = (val) => String(val ?? "").trim().slice(0, MAX_TEXT);
const cleanRating = (val) => {
  const n = Number(val);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
};
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------------------------------------------------------------------------
// Light in-memory rate limit for the public endpoint. Keyed by IP only in
// memory for 10 minutes; the IP is never written to the database or logs.
// ---------------------------------------------------------------------------
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const recentSubmissions = new Map();

const isRateLimited = (key) => {
  const now = Date.now();
  const hits = (recentSubmissions.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recentSubmissions.set(key, hits);
    return true;
  }
  hits.push(now);
  recentSubmissions.set(key, hits);
  return false;
};

setInterval(() => {
  const now = Date.now();
  for (const [key, hits] of recentSubmissions) {
    if (hits.every((t) => now - t >= WINDOW_MS)) recentSubmissions.delete(key);
  }
}, WINDOW_MS).unref();

// @desc    Submit anonymous feedback
// @route   POST /api/feedback
// @access  Public
const submitFeedback = async (req, res) => {
  try {
    const body = req.body || {};

    // Honeypot: real users never see or fill this field
    if (body.website) {
      return res.status(201).json({ success: true, message: "Feedback received" });
    }

    // Behind a proxy req.ip is the proxy's address, so prefer the forwarded client IP.
    const clientKey =
      String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.ip || "unknown";
    if (isRateLimited(clientKey)) {
      return res.status(429).json({
        success: false,
        message: "You've sent several responses just now. Please try again in a few minutes.",
      });
    }

    const ratings = {};
    RATING_KEYS.forEach((k) => {
      ratings[k] = cleanRating(body.ratings?.[k]);
    });

    const doc = {
      connection: pick(body.connection, CONNECTIONS),
      programme: pick(body.programme, PROGRAMMES),
      ratings,
      improvementArea: pick(body.improvementArea, IMPROVEMENT_AREAS),
      safetyConcern: pick(body.safetyConcern, SAFETY_ANSWERS),
      safetyDetails: body.safetyConcern === "Yes" ? cleanText(body.safetyDetails) : "",
    };
    TEXT_KEYS.forEach((k) => {
      doc[k] = cleanText(body[k]);
    });

    const hasAnswer =
      doc.connection ||
      doc.programme ||
      doc.improvementArea ||
      doc.safetyConcern ||
      RATING_KEYS.some((k) => ratings[k]) ||
      TEXT_KEYS.some((k) => doc[k]);

    if (!hasAnswer) {
      return res.status(400).json({ success: false, message: "Please answer at least one question before submitting." });
    }

    await Feedback.create(doc);

    res.status(201).json({ success: true, message: "Feedback received" });
  } catch (error) {
    console.error("Submit Feedback Error:", error.message);
    res.status(500).json({ success: false, message: "Could not submit feedback. Please try again." });
  }
};

// Builds the Mongo filter shared by the list endpoint
const buildFilter = (q) => {
  const filter = {};
  if (q.status && STATUSES.includes(q.status)) filter.status = q.status;
  if (q.area && IMPROVEMENT_AREAS.includes(q.area)) filter.improvementArea = q.area;
  if (q.connection && CONNECTIONS.includes(q.connection)) filter.connection = q.connection;
  if (q.programme && PROGRAMMES.includes(q.programme)) filter.programme = q.programme;
  if (q.safety === "yes") filter.safetyConcern = "Yes";
  if (q.rating) {
    const r = cleanRating(q.rating);
    if (r) filter["ratings.overall"] = r;
  }
  if (q.from || q.to) {
    filter.createdAt = {};
    if (q.from && !isNaN(new Date(q.from))) filter.createdAt.$gte = new Date(q.from);
    if (q.to && !isNaN(new Date(q.to))) {
      const end = new Date(q.to);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
    if (!Object.keys(filter.createdAt).length) delete filter.createdAt;
  }
  if (q.search && String(q.search).trim()) {
    const rx = new RegExp(escapeRegex(String(q.search).trim().slice(0, 100)), "i");
    filter.$or = [...TEXT_KEYS, "safetyDetails", "adminNotes"].map((k) => ({ [k]: rx }));
  }
  return filter;
};

// @desc    List feedback (newest first)
// @route   GET /api/feedback
// @access  Private/Admin
const getFeedback = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 500, 1), 2000);
    const data = await Feedback.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error("Get Feedback Error:", error.message);
    res.status(500).json({ success: false, message: "Could not load feedback." });
  }
};

// @desc    Summary numbers for the management dashboard
// @route   GET /api/feedback/stats
// @access  Private/Admin
const getFeedbackStats = async (req, res) => {
  try {
    const all = await Feedback.find({}, { ratings: 1, improvementArea: 1, status: 1, safetyConcern: 1, createdAt: 1, ...Object.fromEntries(TEXT_KEYS.map((k) => [k, 1])) }).lean();

    const avg = (key) => {
      const vals = all.map((f) => f.ratings?.[key]).filter((v) => v >= 1);
      return vals.length ? Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10 : null;
    };

    const byArea = {};
    IMPROVEMENT_AREAS.forEach((a) => (byArea[a] = 0));
    const byStatus = { Open: 0, "In Progress": 0, Resolved: 0 };
    const byMonth = {};
    let suggestions = 0;
    let safetyFlags = 0;

    all.forEach((f) => {
      if (f.improvementArea) byArea[f.improvementArea] = (byArea[f.improvementArea] || 0) + 1;
      byStatus[f.status] = (byStatus[f.status] || 0) + 1;
      if (TEXT_KEYS.some((k) => f[k])) suggestions += 1;
      if (f.safetyConcern === "Yes") safetyFlags += 1;
      const d = new Date(f.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        total: all.length,
        averages: Object.fromEntries(RATING_KEYS.map((k) => [k, avg(k)])),
        suggestions,
        safetyFlags,
        byArea,
        byStatus,
        byMonth,
      },
    });
  } catch (error) {
    console.error("Feedback Stats Error:", error.message);
    res.status(500).json({ success: false, message: "Could not load feedback stats." });
  }
};

// @desc    Update status / admin notes
// @route   PATCH /api/feedback/:id
// @access  Private/Admin
const updateFeedback = async (req, res) => {
  try {
    const update = {};
    if (req.body.status !== undefined) {
      if (!STATUSES.includes(req.body.status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }
      update.status = req.body.status;
    }
    if (req.body.adminNotes !== undefined) update.adminNotes = cleanText(req.body.adminNotes);

    const doc = await Feedback.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ success: false, message: "Feedback not found" });

    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error("Update Feedback Error:", error.message);
    res.status(500).json({ success: false, message: "Could not update feedback." });
  }
};

// @desc    Delete a feedback entry
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
const deleteFeedback = async (req, res) => {
  try {
    const doc = await Feedback.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Feedback not found" });
    res.status(200).json({ success: true, message: "Feedback deleted" });
  } catch (error) {
    console.error("Delete Feedback Error:", error.message);
    res.status(500).json({ success: false, message: "Could not delete feedback." });
  }
};

module.exports = { submitFeedback, getFeedback, getFeedbackStats, updateFeedback, deleteFeedback };
