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
      // First, try to run migrations
      const { execSync } = require('child_process');
      try {
        console.log('Running migrations...');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('Migrations completed');
      } catch (migError) {
        console.log('Migration warning:', migError.message);
        // Try db push as fallback
        try {
          console.log('Trying db push...');
          execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit' });
        } catch (pushError) {
          console.log('DB push failed:', pushError.message);
        }
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
