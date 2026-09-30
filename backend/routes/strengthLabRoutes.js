const express = require('express');
const router = express.Router();
const {
  getStrengthLabs,
  getStrengthLab,
  createStrengthLab,
  updateStrengthLab,
  deleteStrengthLab,
} = require('../controllers/strengthLabController');

router.route('/').get(getStrengthLabs).post(createStrengthLab);
router.route('/:id').get(getStrengthLab).put(updateStrengthLab).delete(deleteStrengthLab);

module.exports = router;
