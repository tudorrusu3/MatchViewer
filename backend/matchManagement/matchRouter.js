const express = require('express');
const router = express.Router();

const { addMatch, getMatches, getMatchById, deleteMatch } = require('../matchManagement/matchService');

router.get('/matches', getMatches);
router.get('/matches/:matchId', getMatchById);

module.exports = router;