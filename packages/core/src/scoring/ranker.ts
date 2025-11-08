/**
 * Ranker
 * 
 * Ranks initiatives based on their scores with configurable tie-breaking rules.
 */

import type { InitiativeScore, RankingResult } from '@themis/types';

export interface TieBreakCriteria {
  criterionId: string;
  order: 'asc' | 'desc';
}

export class Ranker {
  private tieBreakCriteria: TieBreakCriteria[];

  constructor(tieBreakCriteria: TieBreakCriteria[] = []) {
    this.tieBreakCriteria = tieBreakCriteria;
  }

  /**
   * Rank initiatives by score
   */
  rank(scores: InitiativeScore[]): RankingResult[] {
    // Sort by overall score (descending)
    const sorted = [...scores].sort((a, b) => {
      // Primary: overall score
      if (Math.abs(b.overallScore - a.overallScore) > 0.001) {
        return b.overallScore - a.overallScore;
      }

      // Tie-breaker: apply configured criteria
      for (const criteria of this.tieBreakCriteria) {
        const aScore = a.criterionScores.find((cs) => cs.criterionId === criteria.criterionId);
        const bScore = b.criterionScores.find((cs) => cs.criterionId === criteria.criterionId);

        if (!aScore || !bScore) continue;

        const diff = bScore.contribution - aScore.contribution;
        if (Math.abs(diff) > 0.001) {
          return criteria.order === 'desc' ? diff : -diff;
        }
      }

      // Final tie-breaker: confidence
      if (a.confidence !== undefined && b.confidence !== undefined) {
        return b.confidence - a.confidence;
      }

      return 0;
    });

    // Assign ranks
    return sorted.map((score, index) => {
      const explanation = this.explainScore(score);

      return {
        initiativeId: score.initiativeId,
        rank: index + 1,
        score: score.overallScore,
        explanation,
      };
    });
  }

  /**
   * Generate explanation for a score
   */
  private explainScore(score: InitiativeScore): {
    criterionContributions: Record<string, number>;
    topFactors: string[];
  } {
    const contributions: Record<string, number> = {};
    
    for (const cs of score.criterionScores) {
      contributions[cs.criterionName] = cs.contribution;
    }

    // Find top 3 contributing factors
    const sorted = [...score.criterionScores].sort((a, b) => b.contribution - a.contribution);
    const topFactors = sorted.slice(0, 3).map((cs) => cs.criterionName);

    return {
      criterionContributions: contributions,
      topFactors,
    };
  }

  /**
   * Calculate rank changes if weights were adjusted
   */
  whatIf(
    scores: InitiativeScore[],
    newWeights: Map<string, number>,
  ): Array<{
    initiativeId: string;
    currentRank: number;
    newRank: number;
    change: number;
  }> {
    const currentRanking = this.rank(scores);

    // Recalculate scores with new weights
    const newScores = scores.map((score) => {
      const newCriterionScores = score.criterionScores.map((cs) => ({
        ...cs,
        weight: newWeights.get(cs.criterionId) ?? cs.weight,
        contribution: cs.normalizedValue * (newWeights.get(cs.criterionId) ?? cs.weight),
      }));

      const newOverallScore = newCriterionScores.reduce(
        (sum, cs) => sum + cs.contribution,
        0,
      );

      return {
        ...score,
        overallScore: newOverallScore,
        criterionScores: newCriterionScores,
      };
    });

    const newRanking = this.rank(newScores);

    return currentRanking.map((current) => {
      const newRank = newRanking.find((n) => n.initiativeId === current.initiativeId);

      return {
        initiativeId: current.initiativeId,
        currentRank: current.rank,
        newRank: newRank?.rank ?? current.rank,
        change: current.rank - (newRank?.rank ?? current.rank),
      };
    });
  }

  /**
   * Filter initiatives by minimum score threshold
   */
  filterByThreshold(results: RankingResult[], minScore: number): RankingResult[] {
    return results
      .filter((r) => r.score >= minScore)
      .map((r, index) => ({ ...r, rank: index + 1 }));
  }

  /**
   * Get top N initiatives
   */
  top(results: RankingResult[], n: number): RankingResult[] {
    return results.slice(0, n);
  }
}
