import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiOperation({ summary: 'Seed database with initial data (dev only)' })
  async seed() {
    try {
      // Read and execute schema SQL
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await this.prisma.$executeRawUnsafe(schema);
      
      console.log('✅ Schema created');

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
