const express = require('express');
const router = express.Router();
const {
  getFightClubs,
  getFightClub,
  createFightClub,
  updateFightClub,
  deleteFightClub,
} = require('../controllers/fightClubController');

router.route('/').get(getFightClubs).post(createFightClub);
router.route('/:id').get(getFightClub).put(updateFightClub).delete(deleteFightClub);

module.exports = router;
