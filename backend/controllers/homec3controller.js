const Homec3 = require("../models/homec3");

// Create Contact
exports.createContact = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      aboutus,
      subject,
      message,
    } = req.body;

    if (!fullName || !email || !phoneNumber || !subject || !message || !aboutus) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const contact = await Homec3.create({
      fullName,
      email,
      phoneNumber,
    });

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
    const contacts = await Homec3.find().sort({
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
    const contact = await Homec3.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await Homec3.findByIdAndDelete(req.params.id);

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