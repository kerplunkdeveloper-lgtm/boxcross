const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// Helper to generate JWT and set HttpOnly Cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membership: user.membership,
        profileImage: user.profileImage || "",
        username: user.username || "",
        dob: user.dob || "",
        contactNumber: user.contactNumber || "",
      },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all details" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }

    // Check user
    const user = await User.findOne({ email }).select("+password"); // In case select is false, but we didn't specify select: false in schema.
    // Let's retrieve user and make sure it has password
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Match password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check if admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized. Admin access only.",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000), // expires in 10s
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user membership
// @route   PUT /api/auth/membership
// @access  Private
exports.updateMembership = async (req, res) => {
  try {
    const { planName, price, durationMonths } = req.body;

    if (!planName || price === undefined || !durationMonths) {
      return res.status(400).json({ success: false, message: "Please provide plan details" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        membership: {
          status: "active",
          planName,
          price,
          startDate,
          endDate,
        },
      },
      { new: true, runValidators: true }
    );

    } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to upload file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "boxcross_profiles",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// @desc    Update user profile details and/or profile image
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, username, dob, contactNumber } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (dob !== undefined) user.dob = dob;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      user.profileImage = result.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membership: user.membership,
        profileImage: user.profileImage || "",
        username: user.username || "",
        dob: user.dob || "",
        contactNumber: user.contactNumber || "",
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
