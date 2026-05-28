const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary");

// Helper function to upload file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "boxcross_events",
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

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error.message);
  }
};

// @desc    Get all events (Public)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get Events Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch events.",
    });
  }
};

// @desc    Get all events (Admin)
// @route   GET /api/events/admin
// @access  Private/Admin
const getAllEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get Admin Events Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch events.",
    });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { title, location, description, originalPrice, price, bookingLink, schedules } = req.body;

    if (!title || !location || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, location, and price are required fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an event image",
      });
    }

    // Parse schedules array
    let parsedSchedules = [];
    if (schedules) {
      try {
        parsedSchedules = typeof schedules === "string" ? JSON.parse(schedules) : schedules;
      } catch (err) {
        console.error("Schedules parsing error:", err);
      }
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

    const event = await Event.create({
      title,
      location,
      description: description || "",
      originalPrice: originalPrice ? Number(originalPrice) : null,
      price: Number(price),
      imageUrl: result.secure_url,
      publicId: result.public_id,
      bookingLink: bookingLink || "#",
      schedules: parsedSchedules,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Create Event Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not create event.",
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, description, originalPrice, price, bookingLink, schedules } = req.body;

    let event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Parse schedules array
    let parsedSchedules = undefined;
    if (schedules !== undefined) {
      try {
        parsedSchedules = typeof schedules === "string" ? JSON.parse(schedules) : schedules;
      } catch (err) {
        console.error("Schedules parsing error:", err);
      }
    }

    // Prepare update data
    const updateData = {
      title: title !== undefined ? title : event.title,
      location: location !== undefined ? location : event.location,
      description: description !== undefined ? description : event.description,
      originalPrice: originalPrice !== undefined ? (originalPrice ? Number(originalPrice) : null) : event.originalPrice,
      price: price !== undefined ? Number(price) : event.price,
      bookingLink: bookingLink !== undefined ? bookingLink : event.bookingLink,
    };

    if (parsedSchedules !== undefined) {
      updateData.schedules = parsedSchedules;
    }

    // If new image is uploaded, replace existing image in Cloudinary
    if (req.file) {
      // 1. Delete old image from Cloudinary
      await deleteFromCloudinary(event.publicId);

      // 2. Upload new image
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

      updateData.imageUrl = result.secure_url;
      updateData.publicId = result.public_id;
    }

    event = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("Update Event Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not update event.",
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Delete image from Cloudinary
    await deleteFromCloudinary(event.publicId);

    // Delete document from database
    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete Event Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not delete event.",
    });
  }
};

const EventBooking = require("../models/EventBooking");

// @desc    Book an event
// @route   POST /api/events/book
// @access  Public
const bookEvent = async (req, res) => {
  try {
    const { eventId, date, timeSlot, seats, name, email, phone } = req.body;

    if (!eventId || !date || !timeSlot || !seats || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to complete booking",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Find the schedule and slot
    const schedule = event.schedules.find((s) => s.date === date);
    if (!schedule) {
      return res.status(400).json({
        success: false,
        message: `Date ${date} is not available for this event`,
      });
    }

    const slot = schedule.timeSlots.find((t) => t.time === timeSlot);
    if (!slot) {
      return res.status(400).json({
        success: false,
        message: `Time slot ${timeSlot} is not available on ${date}`,
      });
    }

    const availableSeats = slot.slots - slot.booked;
    if (availableSeats < Number(seats)) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableSeats} seats left for this slot`,
      });
    }

    // Calculate total amount
    const totalAmount = event.price * Number(seats);

    // Book seats (increment booked seats)
    slot.booked += Number(seats);
    
    // We mark schedules as modified to make sure Mongoose saves updates in nested arrays
    event.markModified("schedules");
    await event.save();

    // Create event booking
    const booking = await EventBooking.create({
      event: eventId,
      date,
      timeSlot,
      seats: Number(seats),
      totalAmount,
      name,
      email,
      phone,
      status: "confirmed",
    });

    res.status(201).json({
      success: true,
      message: "Event booking confirmed successfully!",
      data: booking,
    });
  } catch (error) {
    console.error("Book Event Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not place booking.",
    });
  }
};

module.exports = {
  getEvents,
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
  bookEvent,
};
