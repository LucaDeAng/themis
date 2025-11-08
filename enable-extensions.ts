import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function enableExtensions() {
  console.log('🔧 Enabling PostgreSQL extensions in Supabase...\n');

  try {
    // Enable pgvector extension
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('✅ pgvector extension enabled');

    // Enable uuid extension
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('✅ uuid-ossp extension enabled');

    // Verify extensions
    const extensions = await prisma.$queryRawUnsafe(`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname IN ('vector', 'uuid-ossp');
    `);

    console.log('\n📋 Installed extensions:');
    console.log(extensions);

    console.log('\n✨ Extensions enabled successfully!');
  } catch (error) {
    console.error('❌ Error enabling extensions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

enableExtensions();
