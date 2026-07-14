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
    const { 
      title, 
      location, 
      description, 
      originalPrice, 
      price, 
      bookingLink, 
      schedules, 
      inclusions, 
      exclusions, 
      termsAndConditions,
      category,
      duration,
      calories,
      benefits,
      agenda
    } = req.body;

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

    let parsedInclusions = [];
    if (inclusions) {
      try { parsedInclusions = typeof inclusions === "string" ? JSON.parse(inclusions) : inclusions; } catch(e) {}
    }
    
    let parsedExclusions = [];
    if (exclusions) {
      try { parsedExclusions = typeof exclusions === "string" ? JSON.parse(exclusions) : exclusions; } catch(e) {}
    }
    
    let parsedTerms = [];
    if (termsAndConditions) {
      try { parsedTerms = typeof termsAndConditions === "string" ? JSON.parse(termsAndConditions) : termsAndConditions; } catch(e) {}
    }

    let parsedBenefits = [];
    if (benefits) {
      try { parsedBenefits = typeof benefits === "string" ? JSON.parse(benefits) : benefits; } catch(e) {}
    }

    let parsedAgenda = [];
    if (agenda) {
      try { parsedAgenda = typeof agenda === "string" ? JSON.parse(agenda) : agenda; } catch(e) {}
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
      inclusions: parsedInclusions,
      exclusions: parsedExclusions,
      termsAndConditions: parsedTerms,
      category: category || "",
      duration: duration || "",
      calories: calories || "",
      benefits: parsedBenefits,
      agenda: parsedAgenda,
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
    const { 
      title, 
      location, 
      description, 
      originalPrice, 
      price, 
      bookingLink, 
      schedules, 
      inclusions, 
      exclusions, 
      termsAndConditions,
      category,
      duration,
      calories,
      benefits,
      agenda
    } = req.body;

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
      category: category !== undefined ? category : event.category,
      duration: duration !== undefined ? duration : event.duration,
      calories: calories !== undefined ? calories : event.calories,
    };

    if (parsedSchedules !== undefined) {
      updateData.schedules = parsedSchedules;
    }
    
    if (inclusions !== undefined) {
      try { updateData.inclusions = typeof inclusions === "string" ? JSON.parse(inclusions) : inclusions; } catch(e) {}
    }
    
    if (exclusions !== undefined) {
      try { updateData.exclusions = typeof exclusions === "string" ? JSON.parse(exclusions) : exclusions; } catch(e) {}
    }
    
    if (termsAndConditions !== undefined) {
      try { updateData.termsAndConditions = typeof termsAndConditions === "string" ? JSON.parse(termsAndConditions) : termsAndConditions; } catch(e) {}
    }

    if (benefits !== undefined) {
      try { updateData.benefits = typeof benefits === "string" ? JSON.parse(benefits) : benefits; } catch(e) {}
    }

    if (agenda !== undefined) {
      try { updateData.agenda = typeof agenda === "string" ? JSON.parse(agenda) : agenda; } catch(e) {}
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

// @desc    Book an event (creates pending booking + Razorpay order)
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

    if (totalAmount === 0) {
      // Free Event booking: confirm immediately
      const booking = await EventBooking.create({
        event: eventId,
        date,
        timeSlot,
        seats: Number(seats),
        totalAmount: 0,
        name,
        email,
        phone,
        status: "payment successfully",
        razorpayOrderId: `free_event_${Date.now()}`,
        razorpayPaymentId: `free_pay_${Date.now()}`,
        razorpaySignature: "free_sig",
      });

      // Increment booked seats count in Event schedule slot
      const schedule = event.schedules.find((s) => s.date === date);
      if (schedule) {
        const slot = schedule.timeSlots.find((t) => t.time === timeSlot);
        if (slot) {
          slot.booked += Number(seats);
          event.markModified("schedules");
          await event.save();
        }
      }

      return res.status(201).json({
        success: true,
        message: "Free event booking registered successfully!",
        isFree: true,
        bookingId: booking._id,
        data: booking,
      });
    }

    // Initialize Razorpay and create order
    let order;
    try {
      const Razorpay = require("razorpay");
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_BoxCross2026",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "supersecretrazorpaysecret2026",
      });

      const amountInPaise = Math.round(totalAmount * 100);
      order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `event_${Date.now()}`,
      });
    } catch (rzpErr) {
      console.error("Razorpay Order Creation Failed, generating mock order:", rzpErr);
      order = {
        id: `order_mock_${Date.now()}`,
        amount: totalAmount * 100,
        currency: "INR",
      };
    }

    // Create event booking with "not payment" status
    const booking = await EventBooking.create({
      event: eventId,
      date,
      timeSlot,
      seats: Number(seats),
      totalAmount,
      name,
      email,
      phone,
      status: "not payment",
      razorpayOrderId: order.id,
    });

    res.status(201).json({
      success: true,
      message: "Order initiated successfully!",
      bookingId: booking._id,
      razorpayOrderId: order.id,
      amount: order.amount || (totalAmount * 100),
      currency: order.currency || "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_BoxCross2026",
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

// @desc    Verify event payment & confirm booking
// @route   POST /api/events/verify
// @access  Public
const verifyEventPayment = async (req, res) => {
  try {
    const { bookingId, razorpayPaymentId, razorpayOrderId, razorpaySignature, status } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await EventBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking record not found",
      });
    }

    const event = await Event.findById(booking.event);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Associated event not found",
      });
    }

    if (status === "failed") {
      booking.status = "failed";
      await booking.save();
      return res.status(200).json({
        success: false,
        message: "Payment marked as failed",
      });
    }

    // Verify signature (if signature is provided and not mocked)
    if (razorpaySignature && razorpayOrderId && !razorpayOrderId.startsWith("order_mock_")) {
      const crypto = require("crypto");
      const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "supersecretrazorpaysecret2026");
      shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const digest = shasum.digest("hex");

      if (digest !== razorpaySignature) {
        booking.status = "failed";
        await booking.save();
        return res.status(400).json({
          success: false,
          message: "Payment signature verification failed. Transaction marked as failed.",
        });
      }
    }

    // Update Booking status
    booking.status = "payment successfully";
    booking.razorpayPaymentId = razorpayPaymentId || `pay_mock_${Date.now()}`;
    booking.razorpayOrderId = razorpayOrderId;
    booking.razorpaySignature = razorpaySignature || "sig_mock";
    await booking.save();

    // Increment booked seats count in Event schedule slot
    const schedule = event.schedules.find((s) => s.date === booking.date);
    if (schedule) {
      const slot = schedule.timeSlots.find((t) => t.time === booking.timeSlot);
      if (slot) {
        slot.booked += Number(booking.seats);
        event.markModified("schedules");
        await event.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment verified and booking confirmed successfully!",
      data: booking,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error verifying payment status.",
    });
  }
};

// @desc    Get all event bookings
// @route   GET /api/events/bookings
// @access  Private/Admin
const getEventBookings = async (req, res) => {
  try {
    const bookings = await EventBooking.find()
      .populate("event", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get Event Bookings Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve bookings.",
    });
  }
};

// @desc    Delete an event booking
// @route   DELETE /api/events/bookings/:id
// @access  Private/Admin
const deleteEventBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await EventBooking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Restore slots if confirmed/successful
    const event = await Event.findById(booking.event);
    if (event && (booking.status === "payment successfully" || booking.status === "confirmed")) {
      const schedule = event.schedules.find((s) => s.date === booking.date);
      if (schedule) {
        const slot = schedule.timeSlots.find((t) => t.time === booking.timeSlot);
        if (slot) {
          slot.booked = Math.max(0, slot.booked - booking.seats);
          event.markModified("schedules");
          await event.save();
        }
      }
    }

    await EventBooking.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Booking record deleted successfully",
    });
  } catch (error) {
    console.error("Delete Event Booking Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not delete booking.",
    });
  }
};

// @desc    Serve minimal standalone HTML with dynamic OG meta tags for crawlers
// @route   GET /api/events/:id/og
// @access  Public
const getEventOGMeta = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[OG META REQUEST] Fetched for event ID: ${id} | User-Agent: ${req.headers["user-agent"]}`);

    // Validate MongoDB ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send("Invalid Event ID");
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    const frontendUrl = "https://membership.boxandcross.com";
    const targetUrl = `${frontendUrl}/events/${event._id}`;

    const title = `${event.title} | Box & Cross`;

    // Clean description - strip any HTML tags, limit to 150 chars
    const rawDesc = event.description || "";
    const plainDesc = rawDesc.replace(/<[^>]*>/g, "").trim();
    const description = plainDesc.length > 0
      ? (plainDesc.length > 150 ? plainDesc.substring(0, 147) + "..." : plainDesc)
      : `Join the ${event.title} event at Box & Cross. View schedule and book your slot now!`;

    const imageUrl = event.imageUrl || `${frontendUrl}/og-events.jpg`;

    // Build a standalone HTML page — social crawlers only read static HTML, no JS
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Box &amp; Cross" />
  <meta property="og:url" content="${targetUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${event.title}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${targetUrl}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <!-- Redirect real users to the SPA page immediately -->
  <meta http-equiv="refresh" content="0; url=${targetUrl}" />
  <link rel="canonical" href="${targetUrl}" />
  <script>window.location.replace("${targetUrl}");</script>
</head>
<body>
  <p>Redirecting to <a href="${targetUrl}">${title}</a>...</p>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Get Event OG Meta Error:", error.message);
    return res.status(500).send("Server Error");
  }
};

module.exports = {
  getEvents,
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
  bookEvent,
  verifyEventPayment,
  getEventBookings,
  deleteEventBooking,
  getEventOGMeta,
};
