// Seeds the database with development data. Run with: npm run db:seed
const prisma = require('../src/config/db');

async function main() {
  // Add seed data here once models exist, e.g.:
  // await prisma.category.createMany({ data: [...], skipDuplicates: true });
  console.log('Seeding complete');
}

main()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
