const express = require("express");
const router = express.Router();

const {
    createContact,
    getAllContacts,
    deleteContact,
} = require("../controllers/homec1controller");

router.post("/", createContact);
router.get("/", getAllContacts);
router.delete("/:id", deleteContact);

module.exports = router;