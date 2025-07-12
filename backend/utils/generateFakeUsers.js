const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const db = require('../db_config/dbInit');

const generateFakeUsers = async (numUsers = 10) => {
  try {
    const usersCredentials = [];

    for (let i = 0; i < numUsers; i++) {
      const password = faker.internet.password();
      const user = {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: await bcrypt.hash(password, 10),
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      await db.collection('users').add(user);

      usersCredentials.push({ email: user.email, password });
    }

    const filePath = path.join(__dirname, 'credentials.json');
    fs.writeFileSync(filePath, JSON.stringify(usersCredentials, null, 2), 'utf-8');

    console.log("Users generated successfully and credentials saved to credentials.json!");
  } catch (error) {
    console.error("Error generating users:", error.message);
  }
};

module.exports = generateFakeUsers;
