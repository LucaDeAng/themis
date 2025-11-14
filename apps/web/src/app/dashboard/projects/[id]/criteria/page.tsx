'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Plus, BarChart3, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CriteriaList } from '@/components/criteria-list'
import { AddCriterionDialog } from '@/components/add-criterion-dialog'
import { WeightDistributionChart } from '@/components/weight-distribution-chart'
import { useCriteria } from '@/hooks/use-criteria'
import { useProject } from '@/hooks/use-projects'
import type { Criterion } from '@/types'

export default function CriteriaPage() {
  const params = useParams()
  const projectId = params.id as string
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const { data: project, isLoading: projectLoading } = useProject(projectId)
  const { data: criteria = [], isLoading: criteriaLoading } = useCriteria(projectId)

  const totalWeight = criteria.reduce((sum: number, c: Criterion) => sum + (c.weight || 0), 0)
  const weightPercentage = Math.round(totalWeight * 100)
  const isWeightValid = Math.abs(weightPercentage - 100) < 1 // Allow 1% tolerance

  if (projectLoading || criteriaLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">{project?.name}</h1>
          <p className="text-muted-foreground mt-2">
            Define evaluation criteria with weights and thresholds
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gradient-themis">
          <Plus className="mr-2 h-4 w-4" />
          Add Criterion
        </Button>
      </div>

      {/* Weight Distribution Alert */}
      {criteria.length > 0 && !isWeightValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Total weight is {weightPercentage}%. Adjust weights to reach 100% for accurate scoring.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Criteria List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Evaluation Criteria</CardTitle>
            <CardDescription>
              {criteria.length} / 8 criteria defined • Weight: {weightPercentage}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            {criteria.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No criteria defined</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start by adding evaluation criteria for your initiatives
                </p>
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Criterion
                </Button>
              </div>
            ) : (
              <CriteriaList criteria={criteria} projectId={projectId} />
            )}
          </CardContent>
        </Card>

        {/* Weight Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weight Distribution</CardTitle>
            <CardDescription>
              Visual breakdown by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeightDistributionChart criteria={criteria} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Criteria</CardDescription>
            <CardTitle className="text-3xl">{criteria.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Weight Allocated</CardDescription>
            <CardTitle className="text-3xl">{weightPercentage}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Hard Gates</CardDescription>
            <CardTitle className="text-3xl">
              {criteria.filter((c: Criterion) => c.type === 'HARD').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-3xl">
              {new Set(criteria.map((c: Criterion) => c.category).filter(Boolean)).size}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Add Criterion Dialog */}
      <AddCriterionDialog
        projectId={projectId}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </div>
  )
}
