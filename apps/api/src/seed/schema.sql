-- Drop existing tables if they exist
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

-- Create Users table
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "avatar_url" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- Create Workspaces table
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "settings" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- Create Projects table
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
