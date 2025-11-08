// ============================================================================
// Scoring & Ranking Types
// ============================================================================

export interface ScoringConfig {
  normalizationMethod: 'linear' | 'exponential';
  aggregationMethod: 'mean' | 'median' | 'trimmed_mean';
  riskAdjustment: boolean;
  tieBreakOrder: ('impact' | 'feasibility' | 'time_to_value' | 'confidence')[];
}

export interface CriterionScore {
  criterionId: string;
  criterionName: string;
  value: number; // 1-5
  normalizedValue: number; // 0-1
  weight: number; // 0-1
  contribution: number; // weighted normalized value
}

export interface InitiativeScore {
  initiativeId: string;
  overallScore: number;
  criterionScores: CriterionScore[];
  riskAdjusted?: number;
  confidence?: number;
}

export interface RankingResult {
  initiativeId: string;
  rank: number;
  score: number;
  tieBreakValues?: Record<string, number>;
  explanation: {
    criterionContributions: Record<string, number>;
    topFactors: string[];
  };
}

export interface SensitivityAnalysis {
  initiativeId: string;
  baseScore: number;
  baseRank: number;
  sensitivities: Array<{
    criterionId: string;
    criterionName: string;
    currentWeight: number;
    scoreChange: number; // ∂S/∂w
    rankChangeProbability: number;
  }>;
}

export interface RequirementGate {
  requirementId: string;
  name: string;
  expression: string;
  isHard: boolean;
}

export interface GateResult {
  requirementId: string;
  passed: boolean;
  reason?: string;
}

export interface ScoringInput {
  initiativeId: string;
  scores: Array<{
    criterionId: string;
    value: number;
    confidence?: number;
    reviewerId: string;
  }>;
  gateResults?: GateResult[];
}
