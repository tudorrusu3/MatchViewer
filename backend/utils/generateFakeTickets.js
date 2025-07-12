const { faker } = require('@faker-js/faker');
const db = require('../db_config/dbInit');

const generateFakeTickets = async (numTickets = 20) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const matchesSnapshot = await db.collection('matches').get();

    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const matches = matchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (users.length === 0 || matches.length === 0) {
      throw new Error('No users or matches found in the database.');
    }

    for (let i = 0; i < numTickets; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomMatch = matches[Math.floor(Math.random() * matches.length)];

      if (randomMatch.ticketsSold >= randomMatch.ticketsAvailable) {
        // Skip if no tickets available
        continue;
      }

      const ticket = {
        userId: randomUser.id,
        matchId: randomMatch.id,
        purchaseDate: new Date().toISOString(),
        pricePaid: randomMatch.price,
        seatNumber: `Section ${faker.number.int({ min: 1, max: 10 })} - Seat ${faker.number.int({ min: 1, max: 100 })}`,
      };

      await db.collection('tickets').add(ticket);

      // Update ticketsSold count on match
      await db.collection('matches').doc(randomMatch.id).update({
        ticketsSold: randomMatch.ticketsSold + 1,
      });
    }
    console.log("Tickets generated successfully!");
  } catch (error) {
    console.error("Error generating tickets:", error.message);
  }
};

module.exports = generateFakeTickets;
