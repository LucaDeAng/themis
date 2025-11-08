// ============================================================================
// Project & Workspace Types
// ============================================================================

export interface Project {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  intent?: ProjectIntent;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectIntent {
  goal: string;
  launch: string;
  objectives: string[];
}

export interface Criterion {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  weight: number; // 0-1
  type: 'hard' | 'soft';
  minThreshold?: number;
  category?: string;
  displayOrder: number;
}

export interface Requirement {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  expression: string;
  isHardGate: boolean;
  displayOrder: number;
}

export interface Initiative {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  source: 'manual' | 'csv' | 'llm_generated' | 'enriched';
  tags: string[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  settings?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  userId: string;
  workspaceId: string;
  role: 'owner' | 'reviewer' | 'viewer';
  joinedAt: Date;
}
