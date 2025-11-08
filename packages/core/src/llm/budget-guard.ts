/**
 * Budget Guard
 * 
 * Monitors and enforces token budget limits per workspace and globally.
 */

import type { BudgetGuard as IBudgetGuard, UsageMetrics } from '@themis/types';

export interface BudgetConfig {
  dailyTokenBudget: number;
  workspaceTokenBudget: number;
}

interface UsageRecord {
  tokens: number;
  timestamp: Date;
}

export class BudgetGuard implements IBudgetGuard {
  private config: BudgetConfig;
  private globalUsage: UsageRecord[] = [];
  private workspaceUsage: Map<string, UsageRecord[]> = new Map();

  constructor(config: BudgetConfig) {
    this.config = config;
  }

  /**
   * Check if workspace has sufficient budget for estimated tokens
   */
  async checkBudget(workspaceId: string, estimatedTokens: number): Promise<boolean> {
    this.cleanOldRecords();

    const dailyGlobal = this.getDailyUsage();
    const dailyWorkspace = this.getWorkspaceUsage(workspaceId, 'daily');

    return (
      dailyGlobal + estimatedTokens <= this.config.dailyTokenBudget &&
      dailyWorkspace + estimatedTokens <= this.config.workspaceTokenBudget
    );
  }

  /**
   * Record actual usage
   */
  async recordUsage(workspaceId: string, usage: UsageMetrics): Promise<void> {
    const record: UsageRecord = {
      tokens: usage.totalTokens,
      timestamp: usage.timestamp,
    };

    this.globalUsage.push(record);

    if (!this.workspaceUsage.has(workspaceId)) {
      this.workspaceUsage.set(workspaceId, []);
    }
    this.workspaceUsage.get(workspaceId)!.push(record);
  }

  /**
   * Get usage for a workspace within a period
   */
  async getUsage(workspaceId: string, period: 'daily' | 'monthly'): Promise<number> {
    this.cleanOldRecords();
    return this.getWorkspaceUsage(workspaceId, period);
  }

  /**
   * Get remaining budget
   */
  getRemainingBudget(workspaceId: string): {
    global: number;
    workspace: number;
  } {
    this.cleanOldRecords();

    const dailyGlobal = this.getDailyUsage();
    const dailyWorkspace = this.getWorkspaceUsage(workspaceId, 'daily');

    return {
      global: Math.max(0, this.config.dailyTokenBudget - dailyGlobal),
      workspace: Math.max(0, this.config.workspaceTokenBudget - dailyWorkspace),
    };
  }

  /**
   * Calculate daily global usage
   */
  private getDailyUsage(): number {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.globalUsage
      .filter((r) => r.timestamp >= oneDayAgo)
      .reduce((sum, r) => sum + r.tokens, 0);
  }

  /**
   * Calculate workspace usage for period
   */
  private getWorkspaceUsage(workspaceId: string, period: 'daily' | 'monthly'): number {
    const records = this.workspaceUsage.get(workspaceId) ?? [];
    const cutoff =
      period === 'daily'
        ? new Date(Date.now() - 24 * 60 * 60 * 1000)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    return records.filter((r) => r.timestamp >= cutoff).reduce((sum, r) => sum + r.tokens, 0);
  }

  /**
   * Remove records older than 30 days
   */
  private cleanOldRecords(): void {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    this.globalUsage = this.globalUsage.filter((r) => r.timestamp >= thirtyDaysAgo);

    for (const [workspaceId, records] of this.workspaceUsage.entries()) {
      const filtered = records.filter((r) => r.timestamp >= thirtyDaysAgo);
      if (filtered.length === 0) {
        this.workspaceUsage.delete(workspaceId);
      } else {
        this.workspaceUsage.set(workspaceId, filtered);
      }
    }
  }
}
