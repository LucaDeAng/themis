// Base types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  workspaceId: string;
  ownerId: string;
  name: string; // Backend uses 'name' field
  title: string;
  description: string | null;
  intent: Record<string, any> | null;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
  criteria?: Criterion[];
  initiatives?: Initiative[];
  _count?: {
    initiatives: number;
    criteria: number;
  };
}

export interface Criterion {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  weight: number;
  type: 'HARD' | 'SOFT';
  minThreshold: number | null;
  category: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Initiative {
  id: string;
  projectId: string;
  title: string;
  name?: string;
  description: string | null;
  source: 'MANUAL' | 'CSV' | 'LLM_GENERATED' | 'ENRICHED';
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  scores?: Score[];
  aggregateScores?: AggregateScore;
  brief?: Brief;
}

export interface Score {
  id: string;
  initiativeId: string;
  criterionId: string;
  reviewerId: string;
  value: number;
  confidence: number | null;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  criterion?: Criterion;
  reviewer?: User;
}

export interface AggregateScore {
  id: string;
  initiativeId: string;
  overallScore: number;
  byCriterion: Record<string, number>;
  riskAdjusted: number | null;
  aggregationMethod: string;
  calculatedAt: Date;
  updatedAt: Date;
}

export interface Brief {
  id: string;
  initiativeId: string;
  createdBy: string;
  executiveSummary: string | null;
  rationale: string | null;
  risks: string | null;
  metrics: string | null;
  imagePrompt: string | null;
  imageUrl: string | null;
  sections: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RankList {
  id: string;
  projectId: string;
  parameters: Record<string, any>;
  createdAt: Date;
  rankedItems?: RankedItem[];
}

export interface RankedItem {
  id: string;
  rankListId: string;
  initiativeId: string;
  rank: number;
  score: number;
  explanation: Record<string, any>;
  initiative?: Initiative;
}

// API request/response types
export interface CreateProjectDto {
  workspaceId: string;
  name: string;
  description?: string;
  createdBy: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export interface CreateInitiativeDto {
  projectId: string;
  title: string;
  description?: string;
  tags?: string[];
  createdBy: string;
}

export interface UpdateInitiativeDto {
  title?: string;
  description?: string;
  tags?: string[];
}

export interface CreateCriterionDto {
  name: string;
  description?: string;
  weight?: number;
}

export interface AddScoreDto {
  initiativeId: string;
  criterionId: string;
  reviewerId: string;
  value: number;
  confidence?: number;
  comment?: string;
}

export interface GenerateInitiativesDto {
  projectId: string;
  workspaceId: string;
  businessContext: string;
  strategicGoals?: string[];
  count?: number;
  createdBy: string;
}

export interface GenerateBriefDto {
  initiativeId: string;
  createdBy: string;
}

// UI State types
export interface DashboardStats {
  totalProjects: number;
  totalInitiatives: number;
  totalScores: number;
  avgScore: number;
}

export interface ProjectWithStats extends Project {
  initiativeCount: number;
  completedInitiatives: number;
  avgScore: number;
}
