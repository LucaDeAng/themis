'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Save, AlertCircle, TrendingUp, CheckCircle2, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { exportScoringToCSV } from '@/lib/export'
import { useProject } from '@/hooks/use-projects'
import { useCriteria } from '@/hooks/use-criteria'
import { useInitiatives } from '@/hooks/use-initiatives'
import { useScores, useUpdateScore } from '@/hooks/use-scores'
import { ScoringCell } from '@/components/scoring-cell'
import type { Criterion, Initiative, Score } from '@/types'
import { ProjectTabs } from '@/components/project-tabs'

export default function ScoringPage() {
  const params = useParams()
  const projectId = params.id as string
  
  const { data: project } = useProject(projectId)
  const { data: criteria = [] } = useCriteria(projectId)
  const { data: initiatives = [] } = useInitiatives(projectId)
  const { data: scores = [] } = useScores(projectId)
  
  const [hasUnsaved, setHasUnsaved] = useState(false)

  // Filter only SOFT criteria for scoring
  const softCriteria = criteria.filter((c: Criterion) => c.type === 'SOFT')
  const hardCriteria = criteria.filter((c: Criterion) => c.type === 'HARD')

  // Calculate weighted scores for each initiative
  const calculateWeightedScore = (initiativeId: string) => {
    const initiativeScores = scores.filter((s: Score) => s.initiativeId === initiativeId)
    let totalWeighted = 0
    let totalWeight = 0

    softCriteria.forEach((criterion: Criterion) => {
      const score = initiativeScores.find((s: Score) => s.criterionId === criterion.id)
      if (score && score.value) {
        totalWeighted += score.value * (criterion.weight || 0)
        totalWeight += criterion.weight || 0
      }
    })

    return totalWeight > 0 ? (totalWeighted / totalWeight) : 0
  }

  // Check if initiative passes all HARD gates
  const passesHardGates = (initiativeId: string) => {
    if (hardCriteria.length === 0) return true
    
    const initiativeScores = scores.filter((s: Score) => s.initiativeId === initiativeId)
    return hardCriteria.every((criterion: Criterion) => {
      const score = initiativeScores.find((s: Score) => s.criterionId === criterion.id)
      return score && score.value >= 3 // Pass threshold for HARD gates
    })
  }

  // Check if initiative meets minimum thresholds
  const meetsThresholds = (initiativeId: string) => {
    const initiativeScores = scores.filter((s: Score) => s.initiativeId === initiativeId)
    
    return softCriteria.every((criterion: Criterion) => {
      if (!criterion.minThreshold) return true
      const score = initiativeScores.find((s: Score) => s.criterionId === criterion.id)
      return score && score.value >= criterion.minThreshold
    })
  }

  // Get color for score value (VAS style)
  const getScoreColor = (value: number) => {
    if (value >= 4.5) return 'text-green-600 font-semibold'
    if (value >= 3.5) return 'text-green-500'
    if (value >= 2.5) return 'text-yellow-600'
    if (value >= 1.5) return 'text-orange-600'
    return 'text-red-600'
  }

  if (!project) {
    return <div className="p-6">Loading...</div>
  }

  if (softCriteria.length === 0) {
    return (
      <div className="space-y-0">
        <ProjectTabs />
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient">{project.name} - Scoring</h1>
            <p className="text-muted-foreground mt-2">Score initiatives against criteria</p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No SOFT criteria defined yet. Please add criteria in the{' '}
              <a href={`/dashboard/projects/${projectId}/criteria`} className="underline">
                Criteria Management
              </a>{' '}
              page first.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (initiatives.length === 0) {
    return (
      <div className="space-y-0">
        <ProjectTabs />
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient">{project.name} - Scoring</h1>
            <p className="text-muted-foreground mt-2">Score initiatives against criteria</p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No initiatives to score. Please add initiatives first.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      <ProjectTabs />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">{project.name} - Scoring Matrix</h1>
          <p className="text-muted-foreground mt-2">
            Rate each initiative on a scale of 1-5 for each criterion
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {hasUnsaved && (
            <Alert className="w-auto p-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">Scores auto-save on blur</AlertDescription>
            </Alert>
          )}
          <Button
            variant="outline"
            onClick={() => exportScoringToCSV(initiatives, criteria, scores, project.name)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scoring Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-muted-foreground">Very Poor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-muted-foreground">Poor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-muted-foreground">Fair</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">4</div>
              <div className="text-sm text-muted-foreground">Good</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-muted-foreground">Excellent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Matrix */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left p-3 sticky left-0 bg-background z-10 min-w-[200px]">
                    Initiative
                  </th>
                  {softCriteria.map((criterion: Criterion) => (
                    <th
                      key={criterion.id}
                      className="text-center p-3 min-w-[120px] max-w-[180px]"
                    >
                      <div className="font-semibold text-sm">{criterion.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Weight: {Math.round((criterion.weight || 0) * 100)}%
                      </div>
                      {criterion.minThreshold && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Min: {criterion.minThreshold}
                        </Badge>
                      )}
                    </th>
                  ))}
                  {hardCriteria.length > 0 && (
                    <th className="text-center p-3 min-w-[120px]">
                      <div className="font-semibold text-sm">HARD Gates</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {hardCriteria.length} gate(s)
                      </div>
                    </th>
                  )}
                  <th className="text-center p-3 min-w-[120px] bg-muted/50">
                    <div className="font-semibold">Weighted Score</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Auto-calculated
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {initiatives.map((initiative: Initiative, idx: number) => {
                  const weightedScore = calculateWeightedScore(initiative.id)
                  const passesGates = passesHardGates(initiative.id)
                  const meetsMin = meetsThresholds(initiative.id)

                  return (
                    <tr
                      key={initiative.id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${
                        idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                      }`}
                    >
                      <td className="p-3 sticky left-0 bg-inherit z-10">
                        <div className="font-medium">{initiative.name || initiative.title}</div>
                        {initiative.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {initiative.description}
                          </div>
                        )}
                      </td>
                      {softCriteria.map((criterion: Criterion) => (
                        <ScoringCell
                          key={`${initiative.id}-${criterion.id}`}
                          initiativeId={initiative.id}
                          criterionId={criterion.id}
                          projectId={projectId}
                          scores={scores}
                          minThreshold={criterion.minThreshold}
                          onScoreChange={() => setHasUnsaved(true)}
                        />
                      ))}
                      {hardCriteria.length > 0 && (
                        <td className="p-3 text-center">
                          {passesGates ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <Badge variant="destructive">Blocked</Badge>
                          )}
                        </td>
                      )}
                      <td className="p-3 text-center bg-muted/50">
                        <div className={`text-xl font-bold ${getScoreColor(weightedScore)}`}>
                          {weightedScore.toFixed(2)}
                        </div>
                        {!meetsMin && (
                          <Badge variant="outline" className="mt-1 text-xs text-orange-600">
                            Below threshold
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                initiatives.reduce(
                  (sum: number, init: Initiative) => sum + calculateWeightedScore(init.id),
                  0
                ) / initiatives.length || 0
              ).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all initiatives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Passing Gates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {initiatives.filter((init: Initiative) => passesHardGates(init.id)).length} /{' '}
              {initiatives.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hardCriteria.length} HARD gate(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Meeting Thresholds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {initiatives.filter((init: Initiative) => meetsThresholds(init.id)).length} /{' '}
              {initiatives.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Minimum score requirements</p>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
