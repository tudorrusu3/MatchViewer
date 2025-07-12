const { faker } = require('@faker-js/faker');
const db = require('../db_config/dbInit');

const generateFakeMatches = async (numMatches = 10) => {
  const stadiums = [
    'Arena Nationala',
    'Stefan cel Mare Arena',
    'Cluj Arena',
    'Ilie Oana',
    'Dr. Constantin Radulescu',
  ];

  const images = [
    'https://images.unsplash.com/photo-1506626637585-0802df0d0269?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1675684512606-a6333b7531fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1675684512606-a6333b7531fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1565483276107-8a1fbf01ab03?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  try {
    for (let i = 0; i < numMatches; i++) {
      const homeTeam = faker.location.city() + ' FC';
      let awayTeam;
      
      do {
        awayTeam = faker.location.city() + ' FC';
      } while (awayTeam === homeTeam);

      const matchDate = faker.date.soon(60);

      const match = {
        homeTeam,
        awayTeam,
        stadium: faker.helpers.arrayElement(stadiums),
        date: matchDate.toISOString(),
        ticketsAvailable: faker.number.int({ min: 5000, max: 40000 }),
        ticketsSold: 0,
        price: faker.number.float({ min: 10, max: 100, precision: 0.1 }),
        imageUrl: faker.helpers.arrayElement(images),
        createdAt: new Date().toISOString(),
      };

      await db.collection('matches').add(match);
    }

    console.log('Matches generated successfully!');
  } catch (error) {
    console.error('Error generating matches:', error.message);
  }
};

module.exports = generateFakeMatches;
