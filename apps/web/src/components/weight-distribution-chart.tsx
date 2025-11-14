'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Criterion } from '@/types'

interface WeightDistributionChartProps {
  criteria: Criterion[]
}

const categoryColors: Record<string, string> = {
  Strategic: 'bg-blue-500',
  Financial: 'bg-emerald-500',
  Operational: 'bg-violet-500',
  Risk: 'bg-red-500',
  Customer: 'bg-amber-500',
  Innovation: 'bg-pink-500',
}

export function WeightDistributionChart({ criteria }: WeightDistributionChartProps) {
  const distribution = useMemo(() => {
    const softCriteria = criteria.filter((c) => c.type === 'SOFT')
    
    const byCategory = softCriteria.reduce((acc, criterion) => {
      const category = criterion.category || 'Uncategorized'
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += criterion.weight || 0
      return acc
    }, {} as Record<string, number>)

    return Object.entries(byCategory)
      .map(([category, weight]) => ({
        category,
        weight,
        percentage: Math.round(weight * 100),
      }))
      .sort((a, b) => b.weight - a.weight)
  }, [criteria])

  const totalWeight = distribution.reduce((sum, item) => sum + item.weight, 0)
  const hasOverweight = distribution.some((item) => item.percentage > 50)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Distribution</CardTitle>
        <CardDescription>By category (SOFT criteria only)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {distribution.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No SOFT criteria yet
          </p>
        ) : (
          <>
            {hasOverweight && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  One category exceeds 50% weight. Consider balancing across categories.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {distribution.map(({ category, percentage }) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          categoryColors[category] || 'bg-gray-500'
                        }`}
                      />
                      <span className="font-medium">{category}</span>
                    </div>
                    <span className="text-muted-foreground">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Total Weight</span>
                <span
                  className={
                    Math.abs(totalWeight - 1) < 0.01
                      ? 'text-green-600'
                      : 'text-destructive'
                  }
                >
                  {Math.round(totalWeight * 100)}%
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
