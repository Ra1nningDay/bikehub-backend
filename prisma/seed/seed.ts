import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.motorbike_brands.createMany({
    data: [
      { name: 'Honda', description: 'Japanese motorcycle brand' },
      { name: 'Yamaha', description: 'High-performance bikes' },
      { name: 'Kawasaki', description: 'Known for sport bikes' },
    ],
  });
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
