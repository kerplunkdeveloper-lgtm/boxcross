const FoundingOffer = require('../models/FoundingOffer');

// @desc    Get founding offer details (returns the first one or creates if none exists)
// @route   GET /api/founding-offer
// @access  Public
const getFoundingOffer = async (req, res) => {
  try {
    let offer = await FoundingOffer.findOne({});
    if (!offer) {
      offer = await FoundingOffer.create({});
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update founding offer details
// @route   PUT /api/founding-offer/:id
// @access  Private/Admin
const updateFoundingOffer = async (req, res) => {
  try {
    const offer = await FoundingOffer.findById(req.params.id);

    if (offer) {
      offer.col1_badge = req.body.col1_badge || offer.col1_badge;
      offer.col1_heading1 = req.body.col1_heading1 || offer.col1_heading1;
      offer.col1_heading2 = req.body.col1_heading2 || offer.col1_heading2;

      offer.col2_price = req.body.col2_price || offer.col2_price;
      offer.col2_duration = req.body.col2_duration || offer.col2_duration;
      offer.col2_saveAmount = req.body.col2_saveAmount || offer.col2_saveAmount;

      if (req.body.col3_offerEndDate) {
        offer.col3_offerEndDate = req.body.col3_offerEndDate;
      }

      const updatedOffer = await offer.save();
      res.json(updatedOffer);
    } else {
      res.status(404).json({ message: 'Offer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFoundingOffer,
  updateFoundingOffer,
};
