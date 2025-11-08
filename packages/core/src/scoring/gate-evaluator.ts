/**
 * Gate Evaluator
 * 
 * Evaluates hard and soft requirements (gates) for initiatives.
 * Implements JSON Logic and simple expression evaluation.
 */

import type { GateResult, RequirementGate } from '@themis/types';

export class GateEvaluator {
  /**
   * Evaluate a single requirement gate
   */
  evaluate(
    gate: RequirementGate,
    context: Record<string, unknown>,
  ): GateResult {
    try {
      const passed = this.evaluateExpression(gate.expression, context);

      return {
        requirementId: gate.requirementId,
        passed,
        reason: passed ? undefined : `Failed requirement: ${gate.name}`,
      };
    } catch (error) {
      return {
        requirementId: gate.requirementId,
        passed: false,
        reason: `Evaluation error: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Evaluate multiple gates
   */
  evaluateAll(
    gates: RequirementGate[],
    context: Record<string, unknown>,
  ): GateResult[] {
    return gates.map((gate) => this.evaluate(gate, context));
  }

  /**
   * Check if initiative passes all hard gates
   */
  passesHardGates(results: GateResult[], gates: RequirementGate[]): boolean {
    const hardGateResults = results.filter((result) => {
      const gate = gates.find((g) => g.requirementId === result.requirementId);
      return gate?.isHard;
    });

    return hardGateResults.every((result) => result.passed);
  }

  /**
   * Simple expression evaluator
   * Supports: AND, OR, NOT, comparisons
   */
  private evaluateExpression(
    expression: string,
    context: Record<string, unknown>,
  ): boolean {
    // Try to parse as JSON Logic first
    try {
      const logic = JSON.parse(expression);
      return this.evaluateJsonLogic(logic, context);
    } catch {
      // Fall back to simple boolean evaluation
      return this.evaluateSimple(expression, context);
    }
  }

  /**
   * Evaluate JSON Logic expression
   * Simplified implementation - expand as needed
   */
  private evaluateJsonLogic(
    logic: Record<string, unknown>,
    context: Record<string, unknown>,
  ): boolean {
    const [operator] = Object.keys(logic);
    const args = logic[operator];

    switch (operator) {
      case 'and':
        return (args as unknown[]).every((arg) =>
          typeof arg === 'object' ? this.evaluateJsonLogic(arg as Record<string, unknown>, context) : arg
        );

      case 'or':
        return (args as unknown[]).some((arg) =>
          typeof arg === 'object' ? this.evaluateJsonLogic(arg as Record<string, unknown>, context) : arg
        );

      case 'not':
        return !this.evaluateJsonLogic(args as Record<string, unknown>, context);

      case 'var': {
        const path = args as string;
        return this.getNestedValue(context, path) as boolean;
      }

      case '==':
      case '===': {
        const [left, right] = args as unknown[];
        return left === right;
      }

      case '!=':
      case '!==': {
        const [left, right] = args as unknown[];
        return left !== right;
      }

      case '>': {
        const [left, right] = args as [number, number];
        return left > right;
      }

      case '>=': {
        const [left, right] = args as [number, number];
        return left >= right;
      }

      case '<': {
        const [left, right] = args as [number, number];
        return left < right;
      }

      case '<=': {
        const [left, right] = args as [number, number];
        return left <= right;
      }

      case 'in': {
        const [value, array] = args as [unknown, unknown[]];
        return array.includes(value);
      }

      default:
        throw new Error(`Unsupported JSON Logic operator: ${operator}`);
    }
  }

  /**
   * Evaluate simple boolean expression
   */
  private evaluateSimple(
    expression: string,
    context: Record<string, unknown>,
  ): boolean {
    // Replace variable references with actual values
    let evaluated = expression;

    for (const [key, value] of Object.entries(context)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      evaluated = evaluated.replace(regex, JSON.stringify(value));
    }

    // Evaluate the expression
    // WARNING: Using eval - in production, use a proper expression parser
    try {
      // eslint-disable-next-line no-eval
      return eval(evaluated) as boolean;
    } catch {
      return false;
    }
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((current: unknown, key) => {
      return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined;
    }, obj);
  }

  /**
   * Create a simple gate expression
   */
  static createSimpleGate(
    field: string,
    operator: '==' | '!=' | '>' | '>=' | '<' | '<=',
    value: string | number | boolean,
  ): string {
    return JSON.stringify({
      [operator]: [{ var: field }, value],
    });
  }

  /**
   * Create an AND gate
   */
  static createAndGate(conditions: Record<string, unknown>[]): string {
    return JSON.stringify({ and: conditions });
  }

  /**
   * Create an OR gate
   */
  static createOrGate(conditions: Record<string, unknown>[]): string {
    return JSON.stringify({ or: conditions });
  }
}
