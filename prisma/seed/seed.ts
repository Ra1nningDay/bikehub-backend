import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seeder สำหรับ roles
  await prisma.roles.createMany({
    data: [{ title: 'admin' }, { title: 'user' }],
  });
  console.log('Roles seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
