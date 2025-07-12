console.log('Script started');

const generateFakeUsers = require('./generateFakeUsers');
const generateFakeMatches = require('./generateFakeMatches');
const generateFakeTickets = require('./generateFakeTickets.js');

const generateFakeData = async () => {
  try {
    console.log('Generating fake users...');
    await generateFakeUsers(10);

    console.log('Generating fake matches...');
    await generateFakeMatches(20);

    console.log('Generating fake tickets...');
    await generateFakeTickets(50);

    console.log('Fake data generation completed successfully!');
  } catch (error) {
    console.error("Error generating fake data:", error.message);
  }
};

generateFakeData();
