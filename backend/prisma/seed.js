const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('test123', 10);

  await prisma.user.create({
    data: {
      email: 'researcher@test.com',
      password_hash: hashedPassword,
      role: 'researcher'
    }
  });

  console.log('✅ Test user created: researcher@test.com / test123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());