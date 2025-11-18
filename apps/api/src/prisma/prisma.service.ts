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
    
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
