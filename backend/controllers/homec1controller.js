const Homec1 = require("../models/Homec1");

// Create Contact
exports.createContact = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      program,
      message,
    } = req.body;

    if (!fullName || !email || !phoneNumber || !program) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const contact = await Homec1.create({
      fullName,
      email,
      phoneNumber,
      program,
      message,
    });

    if (req.io) {
      req.io.emit("data_updated", { type: "homec1", action: "create", data: contact });
    }

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Contacts (Admin)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Homec1.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Homec1.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await Homec1.findByIdAndDelete(req.params.id);

    if (req.io) {
      req.io.emit("data_updated", { type: "homec1", action: "delete", id: req.params.id });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};