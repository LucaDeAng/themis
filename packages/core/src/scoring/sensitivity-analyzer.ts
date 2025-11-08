/**
 * Sensitivity Analyzer
 * 
 * Analyzes how changes to criteria weights affect initiative rankings.
 * Provides what-if analysis and identifies key decision factors.
 */

import type { InitiativeScore, SensitivityAnalysis } from '@themis/types';
import { Ranker } from './ranker';

export class SensitivityAnalyzer {
  private ranker: Ranker;

  constructor(ranker: Ranker) {
    this.ranker = ranker;
  }

  /**
   * Analyze sensitivity of an initiative's score to weight changes
   */
  analyze(
    initiativeScore: InitiativeScore,
    allScores: InitiativeScore[],
  ): SensitivityAnalysis {
    const currentRanking = this.ranker.rank(allScores);
    const currentRank =
      currentRanking.find((r) => r.initiativeId === initiativeScore.initiativeId)?.rank ?? 0;

    const sensitivities = initiativeScore.criterionScores.map((cs) => {
      // Calculate ∂S/∂w = normalized_value (partial derivative)
      const scoreChange = cs.normalizedValue;

      // Estimate rank change probability by testing weight perturbations
      const rankChangeProbability = this.estimateRankChangeProbability(
        initiativeScore,
        allScores,
        cs.criterionId,
        currentRank,
      );

      return {
        criterionId: cs.criterionId,
        criterionName: cs.criterionName,
        currentWeight: cs.weight,
        scoreChange,
        rankChangeProbability,
      };
    });

    // Sort by impact (score change * weight)
    sensitivities.sort((a, b) => {
      const impactA = Math.abs(a.scoreChange * a.currentWeight);
      const impactB = Math.abs(b.scoreChange * b.currentWeight);
      return impactB - impactA;
    });

    return {
      initiativeId: initiativeScore.initiativeId,
      baseScore: initiativeScore.overallScore,
      baseRank: currentRank,
      sensitivities,
    };
  }

  /**
   * Perform comprehensive sensitivity analysis for all initiatives
   */
  analyzeAll(scores: InitiativeScore[]): SensitivityAnalysis[] {
    return scores.map((score) => this.analyze(score, scores));
  }

  /**
   * Find initiatives most sensitive to specific criterion
   */
  findMostSensitiveToCriterion(
    analyses: SensitivityAnalysis[],
    criterionId: string,
  ): Array<{
    initiativeId: string;
    sensitivity: number;
  }> {
    return analyses
      .map((analysis) => {
        const sensitivity = analysis.sensitivities.find(
          (s) => s.criterionId === criterionId,
        );

        return {
          initiativeId: analysis.initiativeId,
          sensitivity: sensitivity?.scoreChange ?? 0,
        };
      })
      .sort((a, b) => Math.abs(b.sensitivity) - Math.abs(a.sensitivity));
  }

  /**
   * Identify critical decision points (where small weight changes affect ranking)
   */
  findCriticalDecisionPoints(
    analyses: SensitivityAnalysis[],
    threshold: number = 0.3,
  ): Array<{
    initiativeId: string;
    criterionId: string;
    criterionName: string;
    rankChangeProbability: number;
  }> {
    const criticalPoints: Array<{
      initiativeId: string;
      criterionId: string;
      criterionName: string;
      rankChangeProbability: number;
    }> = [];

    for (const analysis of analyses) {
      for (const sensitivity of analysis.sensitivities) {
        if (sensitivity.rankChangeProbability >= threshold) {
          criticalPoints.push({
            initiativeId: analysis.initiativeId,
            criterionId: sensitivity.criterionId,
            criterionName: sensitivity.criterionName,
            rankChangeProbability: sensitivity.rankChangeProbability,
          });
        }
      }
    }

    return criticalPoints.sort((a, b) => b.rankChangeProbability - a.rankChangeProbability);
  }

  /**
   * Estimate probability of rank change with weight perturbation
   */
  private estimateRankChangeProbability(
    initiative: InitiativeScore,
    allScores: InitiativeScore[],
    criterionId: string,
    currentRank: number,
  ): number {
    const perturbations = [-0.1, -0.05, 0.05, 0.1]; // ±5%, ±10%
    let changedCount = 0;

    for (const delta of perturbations) {
      const newWeights = new Map<string, number>();

      // Adjust target criterion weight
      const targetCriterion = initiative.criterionScores.find(
        (cs) => cs.criterionId === criterionId,
      );
      if (!targetCriterion) continue;

      const newWeight = Math.max(0, Math.min(1, targetCriterion.weight + delta));
      const weightDelta = newWeight - targetCriterion.weight;

      // Distribute delta proportionally to other criteria
      const otherCriteria = initiative.criterionScores.filter(
        (cs) => cs.criterionId !== criterionId,
      );
      const totalOtherWeight = otherCriteria.reduce((sum, cs) => sum + cs.weight, 0);

      newWeights.set(criterionId, newWeight);

      for (const cs of otherCriteria) {
        const adjustedWeight =
          totalOtherWeight > 0
            ? cs.weight - (weightDelta * cs.weight) / totalOtherWeight
            : cs.weight;
        newWeights.set(cs.criterionId, Math.max(0, adjustedWeight));
      }

      // Recalculate ranking
      const newRanking = this.ranker.whatIf(allScores, newWeights);
      const newRank = newRanking.find((r) => r.initiativeId === initiative.initiativeId);

      if (newRank && newRank.newRank !== currentRank) {
        changedCount++;
      }
    }

    return changedCount / perturbations.length;
  }

  /**
   * Generate textual explanation of sensitivity
   */
  explainSensitivity(analysis: SensitivityAnalysis): string {
    const topSensitive = analysis.sensitivities.slice(0, 3);

    const explanations = topSensitive.map((s) => {
      const impact = Math.abs(s.scoreChange * s.currentWeight);
      const impactLevel = impact > 0.15 ? 'high' : impact > 0.08 ? 'medium' : 'low';

      return `- ${s.criterionName}: ${impactLevel} impact (${(s.scoreChange * 100).toFixed(1)}% score change per weight unit)`;
    });

    return `Rank ${analysis.baseRank} (score: ${analysis.baseScore.toFixed(3)})
Most sensitive to:
${explanations.join('\n')}`;
  }
}
