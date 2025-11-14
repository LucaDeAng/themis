'use client'

import { useState } from 'react'
import { Pencil, Trash2, GripVertical } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { EditCriterionDialog } from './edit-criterion-dialog'
import { useDeleteCriterion } from '@/hooks/use-criteria'
import type { Criterion } from '@/types'

interface CriteriaListProps {
  criteria: Criterion[]
  projectId: string
}

const categoryColors: Record<string, string> = {
  Strategic: 'bg-blue-500',
  Financial: 'bg-emerald-500',
  Operational: 'bg-violet-500',
  Risk: 'bg-red-500',
  Customer: 'bg-amber-500',
  Innovation: 'bg-pink-500',
}

export function CriteriaList({ criteria, projectId }: CriteriaListProps) {
  const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null)
  const deleteCriterion = useDeleteCriterion()

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this criterion?')) {
      await deleteCriterion.mutateAsync({ id, projectId })
    }
  }

  // Group by category
  const grouped = criteria.reduce((acc, c) => {
    const category = c.category || 'Uncategorized'
    if (!acc[category]) acc[category] = []
    acc[category].push(c)
    return acc
  }, {} as Record<string, Criterion[]>)

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => {
        const categoryWeight = items.reduce((sum, c) => sum + (c.weight || 0), 0)
        const categoryPercentage = Math.round(categoryWeight * 100)

        return (
          <div key={category} className="space-y-2">
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    categoryColors[category] || 'bg-gray-500'
                  }`}
                />
                <h3 className="font-semibold text-lg">{category}</h3>
                <Badge variant="secondary">{categoryPercentage}%</Badge>
              </div>
              <Progress value={categoryPercentage} className="w-24" />
            </div>

            {/* Criteria Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Criterion</TableHead>
                  <TableHead className="w-24">Weight</TableHead>
                  <TableHead className="w-20">Type</TableHead>
                  <TableHead className="w-24">Min Score</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((criterion) => {
                  const weightPercent = Math.round((criterion.weight || 0) * 100)
                  return (
                    <TableRow key={criterion.id}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{criterion.name}</div>
                          {criterion.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {criterion.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={weightPercent} className="w-16" />
                          <span className="text-sm font-medium">{weightPercent}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={criterion.type === 'HARD' ? 'destructive' : 'secondary'}
                        >
                          {criterion.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {criterion.minThreshold ? (
                          <span className="text-sm">
                            ≥ {criterion.minThreshold}/5
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCriterion(criterion)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(criterion.id)}
                            disabled={deleteCriterion.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )
      })}

      {/* Edit Dialog */}
      {editingCriterion && (
        <EditCriterionDialog
          criterion={editingCriterion}
          open={!!editingCriterion}
          onOpenChange={(open: boolean) => !open && setEditingCriterion(null)}
        />
      )}
    </div>
  )
}
