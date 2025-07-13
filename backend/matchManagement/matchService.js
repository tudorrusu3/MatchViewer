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
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Match ID is required.' });

    const doc = await db.collection('matches').doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Match not found.' });

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error getting match by ID:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};

const buyTicket = async (req, res) => {
  const matchId = req.params.id;
  const userId = req.user.id;  // presupunem că middleware-ul de autentificare setează req.user

  try {
    const matchRef = db.collection('matches').doc(matchId);

    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(matchRef);

      if (!doc.exists) {
        throw { status: 404, message: 'Match not found' };
      }

      const data = doc.data();

      if (!data.ticketsAvailable || data.ticketsAvailable <= 0) {
        throw { status: 400, message: 'No tickets available' };
      }

      transaction.update(matchRef, {
        ticketsAvailable: data.ticketsAvailable - 1,
      });
    });

    // Salvează biletul cumpărat în colecția tickets
    await db.collection('tickets').add({
      userId,
      matchId,
      purchaseDate: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Ticket bought successfully' });
  } catch (error) {
    console.error('Error buying ticket:', error);

    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

const getMyMatches = async (req, res) => {
  const userId = req.user.id;

  try {
    const ticketsSnapshot = await db.collection('tickets').where('userId', '==', userId).get();

    if (ticketsSnapshot.empty) {
      return res.status(200).json({ data: [] });
    }

    const tickets = ticketsSnapshot.docs.map(doc => doc.data());

    // Preia datele meciurilor cumpărate
    const matchesPromises = tickets.map(ticket =>
      db.collection('matches').doc(ticket.matchId).get()
        .then(doc => doc.exists ? { id: doc.id, ...doc.data(), purchaseDate: ticket.purchaseDate } : null)
    );

    const matches = (await Promise.all(matchesPromises)).filter(Boolean);

    res.status(200).json({ data: matches });
  } catch (error) {
    console.error('Error fetching my matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { getMatches, getMatchById, buyTicket, getMyMatches };