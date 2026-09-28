const Athlete = require("../models/Athlete");
const jwt = require("jsonwebtoken");

// Helper function to calculate next auto-generated memberId like BOXCROSS-001
const generateNextMemberId = async () => {
  try {
    const athletes = await Athlete.find({}, "memberId").lean();

    let maxNum = 0;
    const regex = /^BOXCROSS-(\d+)$/i;

    athletes.forEach((a) => {
      if (a.memberId) {
        const match = a.memberId.match(regex);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) {
            maxNum = num;
          }
        }
      }
    });

    const nextNum = maxNum + 1;
    return `BOXCROSS-${String(nextNum).padStart(3, "0")}`;
  } catch (err) {
    console.error("Error generating next member ID:", err);
    return "BOXCROSS-001";
  }
};

// @desc    Get next auto-generated member ID
// @route   GET /api/athletes/next-id
// @access  Public or Admin
exports.getNextMemberId = async (req, res) => {
  try {
    const nextMemberId = await generateNextMemberId();
    res.status(200).json({
      success: true,
      nextMemberId,
    });
  } catch (error) {
    console.error("Error generating next member ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Athlete / Member Login with MemberID & Password
// @route   POST /api/athletes/login
// @access  Public
exports.loginAthlete = async (req, res) => {
  try {
    const { memberId, password } = req.body;

    if (!memberId || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both Member ID and Password",
      });
    }

    const cleanMemberId = memberId.trim().toUpperCase();
    const athlete = await Athlete.findOne({ memberId: cleanMemberId });

    if (!athlete) {
      return res.status(401).json({
        success: false,
        message: `No athlete found with Member ID: ${cleanMemberId}`,
      });
    }

    if (athlete.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message: "This athlete account is inactive. Please contact gym administration.",
      });
    }

    // Check password
    const isMatch = await athlete.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please verify and try again.",
      });
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: athlete._id, memberId: athlete.memberId, role: "athlete" },
      process.env.JWT_SECRET || "supersecretkey12345",
      { expiresIn: "14d" }
    );

    res.status(200).json({
      success: true,
      message: `Welcome, ${athlete.athleteName}!`,
      token,
      athlete: {
        _id: athlete._id,
        memberId: athlete.memberId,
        athleteName: athlete.athleteName,
        age: athlete.age,
        gender: athlete.gender,
        dateOfJoining: athlete.dateOfJoining,
        coach: athlete.coach,
        phone: athlete.phone,
        email: athlete.email,
        status: athlete.status,
        notes: athlete.notes,
        role: "athlete",
      },
    });
  } catch (error) {
    console.error("Athlete Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get currently logged-in Athlete profile
// @route   GET /api/athletes/me
// @access  Private (Athlete)
exports.getAthleteMe = async (req, res) => {
  try {
    let token = "";
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "No authentication token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey12345");
    const athlete = await Athlete.findById(decoded.id);

    if (!athlete) {
      return res.status(404).json({ success: false, message: "Athlete not found" });
    }

    res.status(200).json({
      success: true,
      athlete,
    });
  } catch (error) {
    console.error("Error fetching athlete me:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// @desc    Get all athletes with optional search & filters
// @route   GET /api/athletes
// @access  Public or Admin
exports.getAthletes = async (req, res) => {
  try {
    const { search, gender, coach, status } = req.query;

    const query = {};

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { athleteName: { $regex: s, $options: "i" } },
        { memberId: { $regex: s, $options: "i" } },
        { phone: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { coach: { $regex: s, $options: "i" } },
      ];
    }

    if (gender && gender !== "All") {
      query.gender = gender;
    }

    if (coach && coach !== "All") {
      query.coach = coach;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    const athletes = await Athlete.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: athletes.length,
      data: athletes,
    });
  } catch (error) {
    console.error("Error fetching athletes:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single athlete by ID
// @route   GET /api/athletes/:id
// @access  Public or Admin
exports.getAthleteById = async (req, res) => {
  try {
    const athlete = await Athlete.findById(req.params.id);
    if (!athlete) {
      return res.status(404).json({ success: false, message: "Athlete not found" });
    }
    res.status(200).json({ success: true, data: athlete });
  } catch (error) {
    console.error("Error fetching athlete by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new athlete / user
// @route   POST /api/athletes
// @access  Public or Admin
exports.createAthlete = async (req, res) => {
  try {
    let {
      athleteName,
      name,
      userName,
      memberId,
      password,
      age,
      gender,
      dateOfJoining,
      coach,
      phone,
      email,
      status,
      notes,
    } = req.body;

    const resolvedName = athleteName || name || userName;

    if (!resolvedName) {
      return res.status(400).json({ success: false, message: "Athlete / User Name is required" });
    }

    if (!age) {
      return res.status(400).json({ success: false, message: "Age is required" });
    }

    if (!gender) {
      return res.status(400).json({ success: false, message: "Gender is required (Male, Female, or Others)" });
    }

    if (!coach) {
      return res.status(400).json({ success: false, message: "Coach is required" });
    }

    // Auto-generate memberId if not provided or requested auto
    if (!memberId || memberId.trim() === "" || memberId.toLowerCase() === "auto") {
      memberId = await generateNextMemberId();
    } else {
      memberId = memberId.trim().toUpperCase();
      const existing = await Athlete.findOne({ memberId });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Member ID ${memberId} is already in use. Please use another or let it auto-generate.`,
        });
      }
    }

    const setPassword = password && password.trim() ? password.trim() : "bxc12345";

    const newAthlete = await Athlete.create({
      athleteName: resolvedName,
      memberId,
      password: setPassword,
      initialPassword: setPassword,
      age: Number(age),
      gender,
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
      coach: coach.trim(),
      phone: phone ? phone.trim() : "",
      email: email ? email.trim() : "",
      status: status || "Active",
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Athlete registered successfully",
      data: newAthlete,
    });
  } catch (error) {
    console.error("Error creating athlete:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update athlete details
// @route   PUT /api/athletes/:id
// @access  Public or Admin
exports.updateAthlete = async (req, res) => {
  try {
    const { id } = req.params;

    const athlete = await Athlete.findById(id);
    if (!athlete) {
      return res.status(404).json({ success: false, message: "Athlete not found" });
    }

    const {
      athleteName,
      name,
      userName,
      memberId,
      password,
      age,
      gender,
      dateOfJoining,
      coach,
      phone,
      email,
      status,
      notes,
    } = req.body;

    const resolvedName = athleteName || name || userName;
    if (resolvedName !== undefined) athlete.athleteName = resolvedName;
    if (age !== undefined) athlete.age = Number(age);
    if (gender !== undefined) athlete.gender = gender;
    if (dateOfJoining !== undefined) athlete.dateOfJoining = new Date(dateOfJoining);
    if (coach !== undefined) athlete.coach = coach.trim();
    if (phone !== undefined) athlete.phone = phone.trim();
    if (email !== undefined) athlete.email = email.trim();
    if (status !== undefined) athlete.status = status;
    if (notes !== undefined) athlete.notes = notes;

    if (password && password.trim()) {
      athlete.password = password.trim();
      athlete.initialPassword = password.trim();
    }

    if (memberId && memberId.trim().toUpperCase() !== athlete.memberId) {
      const cleanMemberId = memberId.trim().toUpperCase();
      const existing = await Athlete.findOne({ memberId: cleanMemberId, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Member ID ${cleanMemberId} is already in use by another athlete.`,
        });
      }
      athlete.memberId = cleanMemberId;
    }

    await athlete.save();

    res.status(200).json({
      success: true,
      message: "Athlete updated successfully",
      data: athlete,
    });
  } catch (error) {
    console.error("Error updating athlete:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete athlete
// @route   DELETE /api/athletes/:id
// @access  Public or Admin
exports.deleteAthlete = async (req, res) => {
  try {
    const { id } = req.params;
    const athlete = await Athlete.findByIdAndDelete(id);

    if (!athlete) {
      return res.status(404).json({ success: false, message: "Athlete not found" });
    }

    res.status(200).json({
      success: true,
      message: "Athlete removed successfully",
    });
  } catch (error) {
    console.error("Error deleting athlete:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get athlete statistics
// @route   GET /api/athletes/stats
// @access  Public or Admin
exports.getAthleteStats = async (req, res) => {
  try {
    const totalAthletes = await Athlete.countDocuments();
    const activeAthletes = await Athlete.countDocuments({ status: "Active" });
    const maleAthletes = await Athlete.countDocuments({ gender: "Male" });
    const femaleAthletes = await Athlete.countDocuments({ gender: "Female" });
    const otherAthletes = await Athlete.countDocuments({ gender: "Others" });
    const coaches = await Athlete.distinct("coach");
    res.status(200).json({
      success: true,
      stats: {
        total: totalAthletes,
        active: activeAthletes,
        male: maleAthletes,
        female: femaleAthletes,
        others: otherAthletes,
        coachesCount: coaches.length,
        coachesList: coaches,
      },
    });
  } catch (error) {
    console.error("Error fetching athlete stats:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Impersonate Athlete (Admin only)
// @route   POST /api/athletes/impersonate/:id
// @access  Private (Admin)
exports.impersonateAthlete = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = (id || "").trim();

    const isMongoId = cleanId.match(/^[0-9a-fA-F]{24}$/);
    const athlete = await Athlete.findOne({
      $or: [
        ...(isMongoId ? [{ _id: cleanId }] : []),
        { memberId: cleanId.toUpperCase() },
      ],
    });

    if (!athlete) {
      return res.status(404).json({
        success: false,
        message: `Athlete not found with ID/Member ID: ${cleanId}`,
      });
    }

    // Sign athlete token with impersonation metadata
    const token = jwt.sign(
      {
        id: athlete._id,
        memberId: athlete.memberId,
        role: "athlete",
        isImpersonated: true,
        impersonatedBy: req.user ? req.user._id : "admin",
      },
      process.env.JWT_SECRET || "supersecretkey12345",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: `Impersonation active for ${athlete.athleteName}`,
      token,
      athlete: {
        _id: athlete._id,
        memberId: athlete.memberId,
        athleteName: athlete.athleteName,
        age: athlete.age,
        gender: athlete.gender,
        dateOfJoining: athlete.dateOfJoining,
        coach: athlete.coach,
        phone: athlete.phone,
        email: athlete.email,
        status: athlete.status,
        notes: athlete.notes,
        role: "athlete",
      },
    });
  } catch (error) {
    console.error("Error impersonating athlete:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

