import { PrismaClient } from '@prisma/client';

const DATABASE_URL = "postgresql://postgres.zxiaqttgxttcerqupjll:Therightside@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function runMigrations() {
  console.log('🚀 Creating database tables...\n');

  try {
    // Create all tables using Prisma's migration SQL
    console.log('⏳ Creating tables...');
    
    await prisma.$executeRawUnsafe(`
      -- CreateTable
      CREATE TABLE IF NOT EXISTS "users" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "name" TEXT,
          "avatar_url" TEXT,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ users table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "workspaces" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "owner_id" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ workspaces table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "workspace_members" (
          "id" TEXT NOT NULL,
          "workspace_id" TEXT NOT NULL,
          "user_id" TEXT NOT NULL,
          "role" TEXT NOT NULL DEFAULT 'member',
          "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ workspace_members table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "projects" (
          "id" TEXT NOT NULL,
          "workspace_id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "business_context" TEXT,
          "strategic_goals" TEXT[],
          "created_by" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ projects table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "criteria" (
          "id" TEXT NOT NULL,
          "project_id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
          "scale_min" INTEGER NOT NULL DEFAULT 1,
          "scale_max" INTEGER NOT NULL DEFAULT 5,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "criteria_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ criteria table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "requirements" (
          "id" TEXT NOT NULL,
          "project_id" TEXT NOT NULL,
          "criterion_id" TEXT,
          "type" TEXT NOT NULL,
          "operator" TEXT NOT NULL,
          "value" DOUBLE PRECISION NOT NULL,
          "gate_expression" JSONB,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "requirements_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ requirements table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "initiatives" (
          "id" TEXT NOT NULL,
          "project_id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT,
          "rationale" TEXT,
          "tags" TEXT[],
          "risks" TEXT[],
          "related_concepts" TEXT[],
          "embedding" vector(1536),
          "ai_generated" BOOLEAN NOT NULL DEFAULT false,
          "created_by" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "initiatives_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ initiatives table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "scores" (
          "id" TEXT NOT NULL,
          "initiative_id" TEXT NOT NULL,
          "criterion_id" TEXT NOT NULL,
          "reviewer_id" TEXT NOT NULL,
          "score" DOUBLE PRECISION NOT NULL,
          "confidence" DOUBLE PRECISION,
          "time_to_value_weeks" INTEGER,
          "justification" TEXT,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ scores table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "aggregate_scores" (
          "id" TEXT NOT NULL,
          "initiative_id" TEXT NOT NULL,
          "weighted_score" DOUBLE PRECISION NOT NULL,
          "normalized_score" DOUBLE PRECISION NOT NULL,
          "risk_adjusted_score" DOUBLE PRECISION,
          "contribution_breakdown" JSONB NOT NULL,
          "aggregation_method" TEXT NOT NULL DEFAULT 'median',
          "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "aggregate_scores_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ aggregate_scores table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "requirement_gate_results" (
          "id" TEXT NOT NULL,
          "initiative_id" TEXT NOT NULL,
          "requirement_id" TEXT NOT NULL,
          "passed" BOOLEAN NOT NULL,
          "computed_value" DOUBLE PRECISION,
          "details" TEXT,
          "evaluated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "requirement_gate_results_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ requirement_gate_results table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "rank_lists" (
          "id" TEXT NOT NULL,
          "project_id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "filter_criteria" JSONB,
          "sort_strategy" TEXT NOT NULL DEFAULT 'weighted_score',
          "created_by" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "rank_lists_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ rank_lists table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ranked_items" (
          "id" TEXT NOT NULL,
          "rank_list_id" TEXT NOT NULL,
          "initiative_id" TEXT NOT NULL,
          "rank" INTEGER NOT NULL,
          "explanation" TEXT,
          CONSTRAINT "ranked_items_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ ranked_items table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "briefs" (
          "id" TEXT NOT NULL,
          "initiative_id" TEXT NOT NULL,
          "executive_summary" TEXT NOT NULL,
          "rationale" TEXT NOT NULL,
          "risks" TEXT,
          "success_metrics" TEXT,
          "image_prompts" TEXT[],
          "version" INTEGER NOT NULL DEFAULT 1,
          "created_by" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "briefs_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ briefs table created');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "activity_logs" (
          "id" TEXT NOT NULL,
          "workspace_id" TEXT NOT NULL,
          "user_id" TEXT NOT NULL,
          "action" TEXT NOT NULL,
          "entity_type" TEXT NOT NULL,
          "entity_id" TEXT NOT NULL,
          "metadata" JSONB,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ activity_logs table created');

    // Create unique indexes
    console.log('\n⏳ Creating indexes...');
    
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "workspaces_slug_key" ON "workspaces"("slug");`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "workspace_members_workspace_id_user_id_key" ON "workspace_members"("workspace_id", "user_id");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "initiatives_embedding_idx" ON "initiatives" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);`);
    
    console.log('✅ Indexes created');

    // Add foreign keys
    console.log('\n⏳ Creating foreign keys...');
    
    await prisma.$executeRawUnsafe(`ALTER TABLE "workspaces" ADD CONSTRAINT IF NOT EXISTS "workspaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "workspace_members" ADD CONSTRAINT IF NOT EXISTS "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "workspace_members" ADD CONSTRAINT IF NOT EXISTS "workspace_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "projects" ADD CONSTRAINT IF NOT EXISTS "projects_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "projects" ADD CONSTRAINT IF NOT EXISTS "projects_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "criteria" ADD CONSTRAINT IF NOT EXISTS "criteria_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "requirements" ADD CONSTRAINT IF NOT EXISTS "requirements_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "requirements" ADD CONSTRAINT IF NOT EXISTS "requirements_criterion_id_fkey" FOREIGN KEY ("criterion_id") REFERENCES "criteria"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "initiatives" ADD CONSTRAINT IF NOT EXISTS "initiatives_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "initiatives" ADD CONSTRAINT IF NOT EXISTS "initiatives_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "scores" ADD CONSTRAINT IF NOT EXISTS "scores_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "scores" ADD CONSTRAINT IF NOT EXISTS "scores_criterion_id_fkey" FOREIGN KEY ("criterion_id") REFERENCES "criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "scores" ADD CONSTRAINT IF NOT EXISTS "scores_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "aggregate_scores" ADD CONSTRAINT IF NOT EXISTS "aggregate_scores_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "requirement_gate_results" ADD CONSTRAINT IF NOT EXISTS "requirement_gate_results_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "requirement_gate_results" ADD CONSTRAINT IF NOT EXISTS "requirement_gate_results_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "rank_lists" ADD CONSTRAINT IF NOT EXISTS "rank_lists_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "rank_lists" ADD CONSTRAINT IF NOT EXISTS "rank_lists_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "ranked_items" ADD CONSTRAINT IF NOT EXISTS "ranked_items_rank_list_id_fkey" FOREIGN KEY ("rank_list_id") REFERENCES "rank_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "ranked_items" ADD CONSTRAINT IF NOT EXISTS "ranked_items_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "briefs" ADD CONSTRAINT IF NOT EXISTS "briefs_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "briefs" ADD CONSTRAINT IF NOT EXISTS "briefs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "activity_logs" ADD CONSTRAINT IF NOT EXISTS "activity_logs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "activity_logs" ADD CONSTRAINT IF NOT EXISTS "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    
    console.log('✅ Foreign keys created');

    console.log('\n✨ Database setup complete!');
    console.log('\n📊 Tables created:');
    console.log('  - users');
    console.log('  - workspaces');
    console.log('  - workspace_members');
    console.log('  - projects');
    console.log('  - criteria');
    console.log('  - requirements');
    console.log('  - initiatives (with vector embeddings)');
    console.log('  - scores');
    console.log('  - aggregate_scores');
    console.log('  - requirement_gate_results');
    console.log('  - rank_lists');
    console.log('  - ranked_items');
    console.log('  - briefs');
    console.log('  - activity_logs');

  } catch (error) {
    console.error('\n❌ Error creating tables:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

runMigrations();
