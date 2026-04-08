/**
 * Script to seed test users into the database
 * Run with: node src/scripts/seedTestUsers.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const testUsers = require('../data/testUsers');

const prisma = new PrismaClient();

async function seedTestUsers() {
  console.log('Starting to seed test users...');
  
  try {
    // First, check if users already exist to avoid duplicates
    const existingEmails = (await prisma.user.findMany({
      where: {
        email: {
          in: testUsers.map(user => user.email)
        }
      },
      select: { email: true }
    })).map(user => user.email);
    
    console.log(`Found ${existingEmails.length} existing test users.`);
    
    // Filter out users that already exist
    const usersToCreate = testUsers.filter(user => !existingEmails.includes(user.email));
    
    if (usersToCreate.length === 0) {
      console.log('All test users already exist in the database. No new users created.');
      return;
    }
    
    // Create the new users
    const createdUsers = await Promise.all(
      usersToCreate.map(userData => 
        prisma.user.create({
          data: userData
        })
      )
    );
    
    console.log(`Successfully created ${createdUsers.length} test users:`);
    createdUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log('\nAll test users have the same password: Password123!');
    
  } catch (error) {
    console.error('Error seeding test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedTestUsers()
  .then(() => {
    console.log('Seeding completed.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
