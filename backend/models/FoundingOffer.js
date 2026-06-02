const mongoose = require('mongoose');

const foundingOfferSchema = mongoose.Schema(
  {
    col1_badge: { type: String, default: 'Founding Member Offer' },
    col1_heading1: { type: String, default: 'THE FIRST 100.' },
    col1_heading2: { type: String, default: 'THE FOUNDERS.' },

    col2_price: { type: String, default: '12,000' },
    col2_duration: { type: String, default: 'FOR 1 YEAR' },
    col2_saveAmount: { type: String, default: 'UP TO ₹6,000' },

    col3_offerEndDate: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // Default to 7 days from now
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FoundingOffer', foundingOfferSchema);
