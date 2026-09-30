const express = require('express');
const router = express.Router();
const {
  getJuniorProfiles,
  getJuniorProfile,
  createJuniorProfile,
  updateJuniorProfile,
  deleteJuniorProfile,
} = require('../controllers/juniorAthleteProfileController');

router.route('/').get(getJuniorProfiles).post(createJuniorProfile);
router.route('/:id').get(getJuniorProfile).put(updateJuniorProfile).delete(deleteJuniorProfile);

module.exports = router;
