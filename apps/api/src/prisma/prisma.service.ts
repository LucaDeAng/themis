import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // FORCE Supabase connection - Railway keeps injecting postgres.railway.internal
    const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('❌ No database URL configured. Set SUPABASE_DATABASE_URL or DATABASE_URL environment variable.');
    }
    
    // Detect if we're in serverless environment (Vercel)
    const isServerless = !!process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    // Check if using pooled connection (required for serverless)
    const isPooled = databaseUrl.includes('pooler.supabase.com') || databaseUrl.includes(':6543');
    
    // Log which database source is being used
    if (process.env.SUPABASE_DATABASE_URL) {
      console.log('🔍 Using database URL: Supabase ✅ (SUPABASE_DATABASE_URL)');
    } else if (databaseUrl.includes('supabase')) {
      console.log('🔍 Using database URL: Supabase ✅ (DATABASE_URL)');
    } else if (databaseUrl.includes('railway')) {
      console.log('🔍 Using database URL: Railway 🚂 (DATABASE_URL)');
    } else {
      console.log('🔍 Using database URL: Custom database (DATABASE_URL)');
    }
    
    // Warn if serverless without pooling
    if (isServerless && !isPooled && databaseUrl.includes('supabase')) {
      console.warn('⚠️  WARNING: Running in serverless environment without connection pooling!');
      console.warn('⚠️  This may cause "too many connections" errors.');
      console.warn('⚠️  Use Supabase pooled connection (port 6543) for serverless deployments.');
    }
    
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      // Optimize for serverless: reduce connection pool size
      ...(isServerless && {
        // For serverless, we want minimal connections since functions are stateless
        // and will create new connections frequently
      }),
    });
  }

  async onModuleInit() {
    // Skip auto-connect in serverless environments - connect on-demand instead
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      console.log('⚡ Serverless environment detected - skipping auto-connect');
      return;
    }
    
    try {
      await this.$connect();
      console.log('✅ Database connected');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      // Log more helpful error messages for common issues
      if (error.message.includes('too many connections')) {
        console.error('💡 Tip: Use Supabase connection pooling (port 6543) for serverless deployments');
      } else if (error.message.includes('timeout')) {
        console.error('💡 Tip: Check your database URL and network connectivity');
      } else if (error.message.includes('authentication failed')) {
        console.error('💡 Tip: Verify your database password is correct');
      }
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
  
  // Helper method to check database health
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}
