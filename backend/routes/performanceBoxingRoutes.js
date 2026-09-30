const express = require('express');
const router = express.Router();
const {
  getPerformanceBoxings,
  getPerformanceBoxing,
  createPerformanceBoxing,
  updatePerformanceBoxing,
  deletePerformanceBoxing,
} = require('../controllers/performanceBoxingController');

router.route('/').get(getPerformanceBoxings).post(createPerformanceBoxing);
router.route('/:id').get(getPerformanceBoxing).put(updatePerformanceBoxing).delete(deletePerformanceBoxing);

module.exports = router;
