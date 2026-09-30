const express = require('express');
const router = express.Router();
const {
  getHyroxLabs,
  getHyroxLab,
  createHyroxLab,
  updateHyroxLab,
  deleteHyroxLab,
} = require('../controllers/hyroxLabController');

router.route('/').get(getHyroxLabs).post(createHyroxLab);
router.route('/:id').get(getHyroxLab).put(updateHyroxLab).delete(deleteHyroxLab);

module.exports = router;
