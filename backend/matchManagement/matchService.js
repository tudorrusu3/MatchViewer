const db = require('../db_config/dbInit');

const getMatches = async (req, res) => {
  try {
    const snapshot = await db.collection('matches').get();
    if (snapshot.empty) {
      return res.status(200).json({ message: 'No matches found.', data: [] });
    }
    const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error getting matches:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};

const getMatchById = async (req, res) => {
  try {
    const { matchId } = req.params;
    if (!matchId) return res.status(400).json({ error: 'Match ID is required.' });

    const doc = await db.collection('matches').doc(matchId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Match not found.' });

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error getting match by ID:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};

module.exports = { getMatches, getMatchById, addMatch, deleteMatch };