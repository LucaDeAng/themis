-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "projects" ADD COLUMN "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "briefs" 
ADD COLUMN "implementation" TEXT,
ADD COLUMN "timeline" TEXT;
