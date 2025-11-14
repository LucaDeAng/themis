'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowUp, ArrowDown, Award, TrendingUp, Target, AlertCircle, FileText, Lightbulb, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { exportRankingToCSV } from '@/lib/export'
import { useProject } from '@/hooks/use-projects'
import { useCriteria } from '@/hooks/use-criteria'
import { useInitiatives } from '@/hooks/use-initiatives'
import { useScores } from '@/hooks/use-scores'
import type { Criterion, Initiative, Score } from '@/types'
import { ProjectTabs } from '@/components/project-tabs'
import { FeasibilityCheckDialog } from '@/components/feasibility-check-dialog'
import { GenerateBriefDialog } from '@/components/generate-brief-dialog'

export default function RankingPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [selectedForFeasibility, setSelectedForFeasibility] = useState<any>(null)
  const [selectedForBrief, setSelectedForBrief] = useState<any>(null)

  const { data: project } = useProject(projectId)
  const { data: criteria = [] } = useCriteria(projectId)
  const { data: initiatives = [] } = useInitiatives(projectId)
  const { data: scores = [] } = useScores(projectId)

  // Filter SOFT criteria for weighted calculation
  const softCriteria = useMemo(
    () => criteria.filter((c: Criterion) => c.type === 'SOFT'),
    [criteria]
  )

  const hardCriteria = useMemo(
    () => criteria.filter((c: Criterion) => c.type === 'HARD'),
    [criteria]
  )

  // Calculate weighted score for an initiative
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

    return totalWeight > 0 ? totalWeighted / totalWeight : 0
  }

  // Check if passes all HARD gates
  const passesHardGates = (initiativeId: string) => {
    if (hardCriteria.length === 0) return true

    const initiativeScores = scores.filter((s: Score) => s.initiativeId === initiativeId)
    return hardCriteria.every((criterion: Criterion) => {
      const score = initiativeScores.find((s: Score) => s.criterionId === criterion.id)
      return score && score.value >= 3
    })
  }

  // Check minimum thresholds
  const meetsThresholds = (initiativeId: string) => {
    const initiativeScores = scores.filter((s: Score) => s.initiativeId === initiativeId)

    return softCriteria.every((criterion: Criterion) => {
      if (!criterion.minThreshold) return true
      const score = initiativeScores.find((s: Score) => s.criterionId === criterion.id)
      return score && score.value >= criterion.minThreshold
    })
  }

  // Calculate scores per criterion for breakdown
  const getCriterionScores = (initiativeId: string) => {
    const initiativeScores = scores.filter((s: Score) => s.initiativeId === initiativeId)
    return softCriteria.map((criterion: Criterion) => {
      const score = initiativeScores.find((s: Score) => s.criterionId === criterion.id)
      return {
        criterion: criterion.name,
        score: score?.value || 0,
        weight: criterion.weight || 0,
        weighted: (score?.value || 0) * (criterion.weight || 0),
      }
    })
  }

  // Rank initiatives
  const rankedInitiatives = useMemo(() => {
    return initiatives
      .map((init: Initiative) => ({
        ...init,
        weightedScore: calculateWeightedScore(init.id),
        passesGates: passesHardGates(init.id),
        meetsMin: meetsThresholds(init.id),
        criterionBreakdown: getCriterionScores(init.id),
      }))
      .sort((a, b) => {
        // First sort by HARD gates (passing gates come first)
        if (a.passesGates !== b.passesGates) {
          return a.passesGates ? -1 : 1
        }
        // Then by weighted score (descending)
        return b.weightedScore - a.weightedScore
      })
  }, [initiatives, scores, criteria])

  // Get color for score
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600'
    if (score >= 3.5) return 'text-green-500'
    if (score >= 2.5) return 'text-yellow-600'
    if (score >= 1.5) return 'text-orange-600'
    return 'text-red-600'
  }

  // Get rank badge color
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
    if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
    return 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
  }

  if (!project) {
    return <div className="p-6">Loading...</div>
  }

  if (softCriteria.length === 0 || initiatives.length === 0) {
    return (
      <div className="space-y-0">
        <ProjectTabs />
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient">{project.name} - Ranking</h1>
            <p className="text-muted-foreground mt-2">Prioritized list based on weighted scores</p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {softCriteria.length === 0
                ? 'No criteria defined. Please add criteria first.'
                : 'No initiatives to rank. Please add initiatives first.'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const topInitiative = rankedInitiatives[0]
  const avgScore =
    rankedInitiatives.reduce((sum, init) => sum + init.weightedScore, 0) /
    rankedInitiatives.length

  return (
    <div className="space-y-0">
      <ProjectTabs />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">{project.name} - Ranking</h1>
          <p className="text-muted-foreground mt-2">
            Initiatives ranked by weighted score and gate compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportRankingToCSV(rankedInitiatives, project.name)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/projects/${projectId}/scoring`)}
          >
            Edit Scores
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-600" />
              Top Initiative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{topInitiative.name || topInitiative.title}</div>
            <div className={`text-2xl font-bold mt-1 ${getScoreColor(topInitiative.weightedScore)}`}>
              {topInitiative.weightedScore.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {rankedInitiatives.length} initiatives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Passing Gates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {rankedInitiatives.filter((i) => i.passesGates).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hardCriteria.length} HARD gate(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Meeting Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {rankedInitiatives.filter((i) => i.meetsMin).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Minimum requirements</p>
          </CardContent>
        </Card>
      </div>

      {/* Ranked List */}
      <Card>
        <CardHeader>
          <CardTitle>Ranked Initiatives</CardTitle>
          <CardDescription>
            Sorted by HARD gate compliance and weighted score (descending)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rankedInitiatives.map((initiative, index) => {
              const rank = index + 1
              const isTop3 = rank <= 3

              return (
                <div
                  key={initiative.id}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    !initiative.passesGates ? 'border-red-300 bg-red-50/50 dark:bg-red-950/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`flex items-center justify-center rounded-full w-12 h-12 shrink-0 ${getRankBadgeColor(
                        rank
                      )}`}
                    >
                      <span className="text-lg font-bold">#{rank}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {initiative.name || initiative.title}
                          </h3>
                          {initiative.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {initiative.description}
                            </p>
                          )}
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getScoreColor(initiative.weightedScore)}`}>
                            {initiative.weightedScore.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Weighted Score</div>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex gap-2 mt-3">
                        {!initiative.passesGates && (
                          <Badge variant="destructive" className="text-xs">
                            ❌ Failed HARD Gates
                          </Badge>
                        )}
                        {!initiative.meetsMin && initiative.passesGates && (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                            ⚠️ Below Threshold
                          </Badge>
                        )}
                        {initiative.passesGates && initiative.meetsMin && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                            ✓ All Requirements Met
                          </Badge>
                        )}
                        {isTop3 && initiative.passesGates && (
                          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-xs">
                            ⭐ Top {rank}
                          </Badge>
                        )}
                      </div>

                      {/* Criterion Breakdown */}
                      <div className="mt-4 space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Score Breakdown:</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {initiative.criterionBreakdown.map((item: any) => (
                            <div key={item.criterion} className="flex items-center gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate">{item.criterion}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Progress
                                    value={(item.score / 5) * 100}
                                    className="h-1.5"
                                  />
                                  <span className={`text-xs font-semibold ${getScoreColor(item.score)}`}>
                                    {item.score.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {Math.round(item.weight * 100)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Actions */}
                      <div className="mt-4 flex gap-2 border-t pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedForFeasibility(initiative)}
                          className="flex-1"
                        >
                          <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
                          Feasibility Check
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedForBrief(initiative)}
                          className="flex-1"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1.5" />
                          Generate Brief
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Dialogs */}
      {selectedForFeasibility && (
        <FeasibilityCheckDialog
          initiative={selectedForFeasibility}
          open={!!selectedForFeasibility}
          onOpenChange={(open) => !open && setSelectedForFeasibility(null)}
        />
      )}
      {selectedForBrief && (
        <GenerateBriefDialog
          initiative={selectedForBrief}
          open={!!selectedForBrief}
          onOpenChange={(open) => !open && setSelectedForBrief(null)}
        />
      )}
      </div>
    </div>
  )
}
