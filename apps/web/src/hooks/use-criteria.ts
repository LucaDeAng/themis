import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Criterion } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// GET all criteria for a project
export function useCriteria(projectId: string) {
  return useQuery({
    queryKey: ['criteria', projectId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/criteria`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch criteria')
      return res.json() as Promise<Criterion[]>
    },
    enabled: !!projectId,
  })
}

// POST create new criterion
export function useAddCriterion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      data,
    }: {
      projectId: string
      data: {
        name: string
        description?: string
        category: string
        weight: number
        type: 'SOFT' | 'HARD'
        minThreshold?: number | null
      }
    }) => {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/criteria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create criterion')
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['criteria', variables.projectId] })
    },
  })
}

// PUT update existing criterion
export function useUpdateCriterion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: {
        name?: string
        description?: string
        category?: string
        weight?: number
        type?: 'SOFT' | 'HARD'
        minThreshold?: number | null
      }
    }) => {
      const res = await fetch(`${API_URL}/api/projects/criteria/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update criterion')
      return res.json()
    },
    onSuccess: (data) => {
      // Invalidate criteria for the project this criterion belongs to
      queryClient.invalidateQueries({ queryKey: ['criteria', data.projectId] })
    },
  })
}

// DELETE remove criterion
export function useDeleteCriterion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const res = await fetch(`${API_URL}/api/projects/criteria/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete criterion')
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['criteria', variables.projectId] })
    },
  })
}

// Helper: Calculate if weights are normalized
export function useWeightValidation(criteria: Criterion[]) {
  const softCriteria = criteria.filter((c) => c.type === 'SOFT')
  const totalWeight = softCriteria.reduce((sum, c) => sum + (c.weight || 0), 0)
  const isNormalized = Math.abs(totalWeight - 1) < 0.01

  return {
    totalWeight,
    totalPercentage: Math.round(totalWeight * 100),
    isNormalized,
    difference: Math.round((1 - totalWeight) * 100),
  }
}

// Helper: Auto-normalize weights (distribute evenly or proportionally)
export function useNormalizeCriteriaWeights() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      criteria,
      mode = 'proportional',
    }: {
      projectId: string
      criteria: Criterion[]
      mode?: 'proportional' | 'even'
    }) => {
      const softCriteria = criteria.filter((c) => c.type === 'SOFT')
      const totalWeight = softCriteria.reduce((sum, c) => sum + (c.weight || 0), 0)

      if (totalWeight === 0) {
        // Even distribution
        const evenWeight = 1 / softCriteria.length
        return Promise.all(
          softCriteria.map((c) =>
            fetch(`${API_URL}/api/projects/criteria/${c.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ weight: evenWeight }),
            })
          )
        )
      }

      if (mode === 'even') {
        const evenWeight = 1 / softCriteria.length
        return Promise.all(
          softCriteria.map((c) =>
            fetch(`${API_URL}/api/projects/criteria/${c.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ weight: evenWeight }),
            })
          )
        )
      }

      // Proportional normalization
      return Promise.all(
        softCriteria.map((c) =>
          fetch(`${API_URL}/api/projects/criteria/${c.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ weight: (c.weight || 0) / totalWeight }),
          })
        )
      )
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['criteria', variables.projectId] })
    },
  })
}
