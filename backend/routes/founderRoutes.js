const express = require('express');
const router = express.Router();
const {
  getFounders,
  createFounder,
  verifyFounderPayment,
  updateFounder,
  deleteFounder,
} = require('../controllers/founderController');

// Define routes
router.route('/').get(getFounders).post(createFounder);
router.post('/verify', verifyFounderPayment);
router.route('/:id').put(updateFounder).delete(deleteFounder);

module.exports = router;
