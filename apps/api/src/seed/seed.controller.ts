import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiOperation({ summary: 'Seed database with initial data (dev only)' })
  async seed() {
    try {
      // First, DROP ALL TABLES to reset UUID types
      await this.prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE');
      await this.prisma.$executeRawUnsafe('CREATE SCHEMA public');
      
      // Now run db push to recreate tables with new schema
      const { execSync } = require('child_process');
      try {
        console.log('Creating new schema...');
        execSync('npx prisma db push --skip-generate --accept-data-loss --force-reset', { stdio: 'inherit' });
      } catch (pushError) {
        console.log('DB push error:', pushError.message);
      }

      // Create default user
      const user = await this.prisma.user.upsert({
        where: { id: '1' },
        update: {},
        create: {
          id: '1',
          email: 'admin@themis.local',
          name: 'Admin User',
          role: 'ADMIN',
        },
      });

      // Create default workspace
      const workspace = await this.prisma.workspace.upsert({
        where: { id: '1' },
        update: {},
        create: {
          id: '1',
          name: 'Default Workspace',
          slug: 'default',
        },
      });

      // Create sample project
      const project = await this.prisma.project.upsert({
        where: { id: '1' },
        update: {},
        create: {
          id: '1',
          workspaceId: '1',
          ownerId: '1',
          title: 'Digital Transformation 2025',
          description: 'Strategic digital transformation initiatives for 2025',
          status: 'DRAFT',
        },
      });

      return {
        success: true,
        message: 'Database seeded successfully',
        data: {
          user,
          workspace,
          project,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Seeding failed',
        error: error.message,
        stack: error.stack,
      };
    }
  }
}
