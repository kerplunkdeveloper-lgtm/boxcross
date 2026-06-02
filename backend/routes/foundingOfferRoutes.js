const express = require('express');
const router = express.Router();
const {
  getFoundingOffer,
  updateFoundingOffer,
} = require('../controllers/foundingOfferController');

router.route('/').get(getFoundingOffer);
router.route('/:id').put(updateFoundingOffer);

module.exports = router;
