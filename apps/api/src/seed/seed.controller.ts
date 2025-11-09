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
      // Drop and recreate schema with TEXT IDs instead of UUID
      const schema = `
        DROP TABLE IF EXISTS "activity_logs" CASCADE;
        DROP TABLE IF EXISTS "scores" CASCADE;
        DROP TABLE IF EXISTS "rank_lists" CASCADE;
        DROP TABLE IF EXISTS "initiatives" CASCADE;
        DROP TABLE IF EXISTS "requirements" CASCADE;
        DROP TABLE IF EXISTS "criteria" CASCADE;
        DROP TABLE IF EXISTS "briefs" CASCADE;
        DROP TABLE IF EXISTS "projects" CASCADE;
        DROP TABLE IF EXISTS "workspace_members" CASCADE;
        DROP TABLE IF EXISTS "workspaces" CASCADE;
        DROP TABLE IF EXISTS "users" CASCADE;

        CREATE TABLE "users" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "email" TEXT NOT NULL UNIQUE,
          "name" TEXT,
          "avatar_url" TEXT,
          "role" TEXT NOT NULL DEFAULT 'USER',
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL
        );

        CREATE TABLE "workspaces" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL UNIQUE,
          "settings" JSONB DEFAULT '{}',
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL
        );

        CREATE TABLE "projects" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "workspace_id" TEXT NOT NULL,
          "owner_id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT,
          "intent" JSONB,
          "status" TEXT NOT NULL DEFAULT 'DRAFT',
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL,
          FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
          FOREIGN KEY ("owner_id") REFERENCES "users"("id")
        );
      `;
      
      await this.prisma.$executeRawUnsafe(schema);
      console.log('✅ Schema recreated');

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
