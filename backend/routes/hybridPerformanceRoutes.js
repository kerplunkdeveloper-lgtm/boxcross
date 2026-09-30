const express = require('express');
const router = express.Router();
const {
  getHybridPerformances,
  getHybridPerformance,
  createHybridPerformance,
  updateHybridPerformance,
  deleteHybridPerformance,
} = require('../controllers/hybridPerformanceController');

router.route('/').get(getHybridPerformances).post(createHybridPerformance);
router.route('/:id').get(getHybridPerformance).put(updateHybridPerformance).delete(deleteHybridPerformance);

module.exports = router;
