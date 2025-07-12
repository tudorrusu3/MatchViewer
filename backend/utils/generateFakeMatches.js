const { faker } = require('@faker-js/faker');
const db = require('../db_config/dbInit');

const generateFakeMatches = async (numMatches = 10) => {
  const stadiums = ['Arena Nationala', 'Stefan cel Mare Arena', 'Cluj Arena', 'Ilie Oana', 'Dr. Constantin Radulescu'];

  try {
    for (let i = 0; i < numMatches; i++) {
      const matchDate = faker.date.soon(60); // Within 60 days
      const match = {
        homeTeam: faker.location.city() + ' FC',
        stadium: faker.location.city() + ' United',
        date: matchDate.toISOString(),
        stadium: faker.helpers.arrayElement(stadiums),
        ticketsAvailable: faker.number.int({ min: 5000, max: 40000 }),
        ticketsSold: 0,
        price: faker.number.float({ min: 10, max: 100, precision: 0.1 }),
        createdAt: new Date().toISOString(),
      };
      await db.collection('matches').add(match);
    }
    console.log("Matches generated successfully!");
  } catch (error) {
    console.error("Error generating matches:", error.message);
  }
};

module.exports = generateFakeMatches;
