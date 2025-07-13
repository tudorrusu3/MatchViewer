const express = require('express');
const router = express.Router();

const { getMatches, getMatchById, buyTicket, getMyMatches } = require('../matchManagement/matchService');
const authMiddleware = require("../middlewares/auth.js")

router.get('/matches', getMatches);
router.get('/matches/:id', getMatchById);
router.post('/matches/:id/buy-ticket', authMiddleware, buyTicket);
router.get('/myMatches', authMiddleware, getMyMatches);

module.exports = router;