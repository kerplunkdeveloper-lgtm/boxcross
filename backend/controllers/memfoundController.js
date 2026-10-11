const Memfound = require("../models/Memfound");

// @desc    Register interest (Create Memfound submission)
// @route   POST /api/memfound
// @access  Public
const createMemfound = async (req, res) => {
  try {
    const {
      name,
      whatsappNumber,
      boxcrossConnection,
      trainedBefore,
      whoIsThisFor,
      mainGoal,
      plan,
      bestTimeToCall,
      agreedToContact,
    } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Your name is required",
      });
    }

    if (!whatsappNumber || !whatsappNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp number is required",
      });
    }

    // Clean phone number (strip whitespace, hyphens)
    const cleanedPhone = whatsappNumber.replace(/\D/g, "");
    if (cleanedPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit WhatsApp number",
      });
    }

    const standardPhone = cleanedPhone.slice(-10);

    // Check if WhatsApp number is already registered in database
    const existingRecord = await Memfound.findOne({
      whatsappNumber: standardPhone,
    });
    if (existingRecord) {
      return res.status(400).json({
        success: false,
        alreadyRegistered: true,
        message: `This WhatsApp number (+91 ${standardPhone}) is already registered under Member ID ${
          existingRecord.memberId || existingRecord.assignedNumber || "#001"
        }. We already have your interest on file!`,
        memberId: existingRecord.memberId || existingRecord.assignedNumber,
      });
    }

    if (!boxcrossConnection && !trainedBefore) {
      return res.status(400).json({
        success: false,
        message: "Your connection with Box & Cross is required",
      });
    }

    // Determine sequential member number (#001, #002, etc.)
    const lastRecord = await Memfound.findOne({
      memberNumber: { $exists: true, $ne: null },
    }).sort({ memberNumber: -1 });

    let nextNumber = 1;
    if (lastRecord && typeof lastRecord.memberNumber === "number" && lastRecord.memberNumber > 0) {
      nextNumber = lastRecord.memberNumber + 1;
    } else {
      const totalCount = await Memfound.countDocuments();
      nextNumber = totalCount + 1;
    }

    const formattedMemberId = `#${String(nextNumber).padStart(3, "0")}`;

    // Derive backward-compatible trainedBefore
    let computedTrainedBefore = trainedBefore || "NO";
    if (
      boxcrossConnection === "I'm a current member" ||
      boxcrossConnection === "I've trained here before"
    ) {
      computedTrainedBefore = "YES";
    } else if (boxcrossConnection === "I'm new to Box & Cross") {
      computedTrainedBefore = "NO";
    }

    const memfound = await Memfound.create({
      name: name.trim(),
      whatsappNumber: cleanedPhone.slice(-10), // Store standard 10 digits
      boxcrossConnection: boxcrossConnection || "",
      trainedBefore: computedTrainedBefore,
      whoIsThisFor: whoIsThisFor || "MYSELF",
      mainGoal: mainGoal || "",
      plan: plan || "NOT SURE YET",
      bestTimeToCall: bestTimeToCall || "",
      agreedToContact: agreedToContact !== undefined ? Boolean(agreedToContact) : true,
      status: "Pending",
      memberNumber: nextNumber,
      memberId: formattedMemberId,
      assignedNumber: formattedMemberId,
    });

    res.status(201).json({
      success: true,
      message: "Interest registered successfully! We call you back within 24 hours.",
      data: memfound,
    });
  } catch (error) {
    console.error("Create Memfound Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit interest. Please try again.",
    });
  }
};

// @desc    Get all Memfound registrations
// @route   GET /api/memfound
// @access  Public / Admin
const getMemfounds = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    // Auto-backfill any legacy records missing memberNumber/memberId chronologically
    const missingDocsCount = await Memfound.countDocuments({
      $or: [
        { memberNumber: { $exists: false } },
        { memberNumber: null },
        { memberId: { $in: ["", null] } },
      ],
    });

    if (missingDocsCount > 0) {
      const allChronological = await Memfound.find().sort({ createdAt: 1 });
      for (let i = 0; i < allChronological.length; i++) {
        const item = allChronological[i];
        if (!item.memberNumber || !item.memberId) {
          const num = i + 1;
          const formatted = `#${String(num).padStart(3, "0")}`;
          item.memberNumber = num;
          item.memberId = formatted;
          if (!item.assignedNumber) item.assignedNumber = formatted;
          await item.save();
        }
      }
    }

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { whatsappNumber: { $regex: search, $options: "i" } },
        { memberId: { $regex: search, $options: "i" } },
        { assignedNumber: { $regex: search, $options: "i" } },
        { boxcrossConnection: { $regex: search, $options: "i" } },
        { mainGoal: { $regex: search, $options: "i" } },
      ];
    }

    const list = await Memfound.find(query).sort({ memberNumber: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error("Get Memfound Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
    });
  }
};

// @desc    Get single Memfound record by ID
// @route   GET /api/memfound/:id
// @access  Public / Admin
const getMemfoundById = async (req, res) => {
  try {
    const item = await Memfound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get Memfound By Id Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update Memfound record (status, rate, assigned number, notes, etc.)
// @route   PUT /api/memfound/:id
// @access  Admin
const updateMemfound = async (req, res) => {
  try {
    const item = await Memfound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    const {
      status,
      notes,
      assignedNumber,
      memberId,
      quotedRate,
      boxcrossConnection,
      trainedBefore,
      whoIsThisFor,
      mainGoal,
      plan,
      bestTimeToCall,
    } = req.body;

    if (status) item.status = status;
    if (notes !== undefined) item.notes = notes;
    if (assignedNumber !== undefined) item.assignedNumber = assignedNumber;
    if (memberId !== undefined) item.memberId = memberId;
    if (quotedRate !== undefined) item.quotedRate = quotedRate;
    if (boxcrossConnection !== undefined) {
      item.boxcrossConnection = boxcrossConnection;
      if (
        boxcrossConnection === "I'm a current member" ||
        boxcrossConnection === "I've trained here before"
      ) {
        item.trainedBefore = "YES";
      } else if (boxcrossConnection === "I'm new to Box & Cross") {
        item.trainedBefore = "NO";
      }
    }
    if (trainedBefore !== undefined && boxcrossConnection === undefined) {
      item.trainedBefore = trainedBefore;
    }
    if (whoIsThisFor !== undefined) item.whoIsThisFor = whoIsThisFor;
    if (mainGoal !== undefined) item.mainGoal = mainGoal;
    if (plan !== undefined) item.plan = plan;
    if (bestTimeToCall !== undefined) item.bestTimeToCall = bestTimeToCall;

    const updated = await item.save();

    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Memfound Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update record",
    });
  }
};

// @desc    Delete Memfound record
// @route   DELETE /api/memfound/:id
// @access  Admin
const deleteMemfound = async (req, res) => {
  try {
    const item = await Memfound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await Memfound.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("Delete Memfound Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete record",
    });
  }
};

// @desc    Check if WhatsApp number is already registered
// @route   GET /api/memfound/check/:phone
// @access  Public
const checkPhoneExists = async (req, res) => {
  try {
    const rawPhone = req.params.phone || "";
    const clean = rawPhone.replace(/\D/g, "").slice(-10);
    if (clean.length < 10) {
      return res.status(200).json({ exists: false });
    }
    const existing = await Memfound.findOne({ whatsappNumber: clean });
    if (existing) {
      return res.status(200).json({
        exists: true,
        message: `Already registered with Member ID ${
          existing.memberId || existing.assignedNumber || "#001"
        }`,
        memberId: existing.memberId || existing.assignedNumber || "#001",
      });
    }
    return res.status(200).json({ exists: false });
  } catch (error) {
    return res.status(500).json({ exists: false });
  }
};

// @desc    Get Memfound total registrations & remaining spots out of 100
// @route   GET /api/memfound/stats
// @access  Public
const getMemfoundStats = async (req, res) => {
  try {
    const totalSpots = 100;
    const registeredCount = await Memfound.countDocuments();
    const remainingSpots = Math.max(0, totalSpots - registeredCount);
    res.status(200).json({
      success: true,
      totalSpots,
      registeredCount,
      remainingSpots,
    });
  } catch (error) {
    console.error("Get Memfound Stats Error:", error);
    res.status(500).json({
      success: false,
      totalSpots: 100,
      registeredCount: 0,
      remainingSpots: 100,
    });
  }
};

module.exports = {
  createMemfound,
  getMemfounds,
  getMemfoundById,
  updateMemfound,
  deleteMemfound,
  checkPhoneExists,
  getMemfoundStats,
};
