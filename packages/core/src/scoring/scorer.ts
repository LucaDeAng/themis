/**
 * Scorer
 * 
 * Core scoring logic for initiatives based on criteria.
 * Implements normalization, weighted aggregation, and confidence handling.
 */

import type {
  ScoringConfig,
  InitiativeScore,
  CriterionScore,
} from '@themis/types';

export class Scorer {
  private config: ScoringConfig;

  constructor(config: ScoringConfig = {
    normalizationMethod: 'linear',
    aggregationMethod: 'median',
    riskAdjustment: false,
    tieBreakOrder: ['impact', 'time_to_value', 'confidence'],
  }) {
    this.config = config;
  }

  /**
   * Calculate score for a single initiative
   */
  calculateScore(
    scores: Array<{
      criterionId: string;
      criterionName: string;
      value: number;
      weight: number;
      confidence?: number;
    }>,
    riskIndex?: number,
  ): InitiativeScore {
    const criterionScores: CriterionScore[] = scores.map((s) => {
      const normalizedValue = this.normalize(s.value);
      const contribution = normalizedValue * s.weight;

      return {
        criterionId: s.criterionId,
        criterionName: s.criterionName,
        value: s.value,
        normalizedValue,
        weight: s.weight,
        contribution,
      };
    });

    // Calculate overall score as weighted sum
    const overallScore = criterionScores.reduce((sum, cs) => sum + cs.contribution, 0);

    // Apply risk adjustment if enabled
    const riskAdjusted = this.config.riskAdjustment && riskIndex !== undefined
      ? overallScore * (1 - Math.min(riskIndex, 0.5))
      : undefined;

    // Calculate overall confidence as weighted average
    const confidences = scores.filter((s) => s.confidence !== undefined);
    const confidence = confidences.length > 0
      ? confidences.reduce((sum, s, idx) => sum + (s.confidence! * scores[idx]!.weight), 0) /
        scores.reduce((sum, s) => sum + s.weight, 0)
      : undefined;

    return {
      initiativeId: '', // Will be set by caller
      overallScore,
      criterionScores,
      riskAdjusted,
      confidence,
    };
  }

  /**
   * Aggregate multiple reviewer scores
   */
  aggregateScores(
    reviewerScores: Array<{
      reviewerId: string;
      criterionId: string;
      criterionName: string;
      value: number;
      confidence?: number;
    }>,
    criteriaWeights: Map<string, number>,
  ): InitiativeScore {
    // Group scores by criterion
    const scoresByCriterion = new Map<string, Array<{ value: number; confidence?: number }>>();

    for (const score of reviewerScores) {
      if (!scoresByCriterion.has(score.criterionId)) {
        scoresByCriterion.set(score.criterionId, []);
      }
      scoresByCriterion.get(score.criterionId)!.push({
        value: score.value,
        confidence: score.confidence,
      });
    }

    // Aggregate scores per criterion
    const aggregatedScores = Array.from(scoresByCriterion.entries()).map(
      ([criterionId, scores]) => {
        const aggregatedValue = this.aggregate(scores.map((s) => s.value));
        const weight = criteriaWeights.get(criterionId) ?? 0;

        // Find criterion name from first score
        const criterionName =
          reviewerScores.find((s) => s.criterionId === criterionId)?.criterionName ?? '';

        return {
          criterionId,
          criterionName,
          value: aggregatedValue,
          weight,
          confidence: this.aggregate(
            scores.filter((s) => s.confidence !== undefined).map((s) => s.confidence!),
          ),
        };
      },
    );

    return this.calculateScore(aggregatedScores);
  }

  /**
   * Normalize a score value from 1-5 scale to 0-1
   */
  private normalize(value: number): number {
    if (this.config.normalizationMethod === 'linear') {
      // Linear: (value - 1) / 4
      return (value - 1) / 4;
    } else {
      // Exponential: emphasize higher scores
      const normalized = (value - 1) / 4;
      return Math.pow(normalized, 0.8);
    }
  }

  /**
   * Aggregate multiple values using configured method
   */
  private aggregate(values: number[]): number {
    if (values.length === 0) return 0;
    if (values.length === 1) return values[0]!;

    switch (this.config.aggregationMethod) {
      case 'mean':
        return values.reduce((sum, v) => sum + v, 0) / values.length;

      case 'median': {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
          ? (sorted[mid - 1]! + sorted[mid]!) / 2
          : sorted[mid]!;
      }

      case 'trimmed_mean': {
        // Remove top and bottom 10% and average
        const sorted = [...values].sort((a, b) => a - b);
        const trimCount = Math.floor(sorted.length * 0.1);
        const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
        return trimmed.reduce((sum, v) => sum + v, 0) / trimmed.length;
      }

      default:
        return values.reduce((sum, v) => sum + v, 0) / values.length;
    }
  }

  /**
   * Check if all weights sum to 1.0 (within tolerance)
   */
  validateWeights(weights: number[]): boolean {
    const sum = weights.reduce((s, w) => s + w, 0);
    return Math.abs(sum - 1.0) < 0.001;
  }

  /**
   * Normalize weights to sum to 1.0
   */
  normalizeWeights(weights: Map<string, number>): Map<string, number> {
    const sum = Array.from(weights.values()).reduce((s, w) => s + w, 0);
    const normalized = new Map<string, number>();

    for (const [key, weight] of weights.entries()) {
      normalized.set(key, weight / sum);
    }

    return normalized;
  }
}
