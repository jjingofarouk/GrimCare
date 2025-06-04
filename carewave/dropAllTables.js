const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function dropAllTables() {
  try {
    console.log('Dropping all tables...');
    await prisma.$executeRaw`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `;
    console.log('All tables dropped successfully.');
  } catch (error) {
    console.error('Error dropping tables:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

dropAllTables();