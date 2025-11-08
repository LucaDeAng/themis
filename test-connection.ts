import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  console.log('Connection string:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

  try {
    console.log('\n⏳ Attempting to connect...');
    await prisma.$connect();
    console.log('✅ Connected successfully!');

    console.log('\n⏳ Running test query...');
    const result = await prisma.$queryRaw`SELECT version(), current_database(), current_user;`;
    console.log('✅ Query successful!');
    console.log('\n📋 Database info:');
    console.log(result);

    return true;
  } catch (error: any) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes("Can't reach database server")) {
      console.log('\n💡 Troubleshooting suggestions:');
      console.log('1. Check if your Supabase project is ACTIVE (not paused)');
      console.log('2. Verify the connection string in Supabase dashboard');
      console.log('3. Try using the Pooler connection string instead:');
      console.log('   Settings → Database → Connection Pooling → Transaction mode');
      console.log('4. Check your firewall/network settings');
      console.log('5. Ensure password does not contain special characters that need escaping');
    }
    
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
