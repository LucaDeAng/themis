import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Score } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// GET all scores for a project
export function useScores(projectId: string) {
  return useQuery({
    queryKey: ['scores', projectId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/scores?projectId=${projectId}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch scores')
      return res.json() as Promise<Score[]>
    },
    enabled: !!projectId,
  })
}

// GET scores for a specific initiative
export function useInitiativeScores(initiativeId: string) {
  return useQuery({
    queryKey: ['scores', 'initiative', initiativeId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/scores?initiativeId=${initiativeId}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch initiative scores')
      return res.json() as Promise<Score[]>
    },
    enabled: !!initiativeId,
  })
}

// POST create new score
export function useAddScore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      initiativeId: string
      criterionId: string
      projectId: string
      value: number
      reviewerId: string
      confidence?: number
      comment?: string
    }) => {
      const res = await fetch(`${API_URL}/api/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create score')
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scores', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['scores', 'initiative', variables.initiativeId] })
    },
  })
}

// PUT update existing score
export function useUpdateScore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: {
        value?: number
        confidence?: number
        comment?: string
      }
    }) => {
      const res = await fetch(`${API_URL}/api/scores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update score')
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['scores'] })
    },
  })
}

// DELETE remove score
export function useDeleteScore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const res = await fetch(`${API_URL}/api/scores/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete score')
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scores', variables.projectId] })
    },
  })
}

// Helper: Calculate aggregate scores for all initiatives in a project
export function useAggregateScores(projectId: string) {
  const { data: scores = [] } = useScores(projectId)
  
  return useQuery({
    queryKey: ['aggregate-scores', projectId],
    queryFn: async () => {
      // This would typically be a backend endpoint
      // For now, we calculate on the frontend
      const grouped = scores.reduce<Record<string, Score[]>>((acc, score: Score) => {
        if (!acc[score.initiativeId]) {
          acc[score.initiativeId] = []
        }
        acc[score.initiativeId].push(score)
        return acc
      }, {})

      return grouped
    },
    enabled: !!projectId && scores.length > 0,
  })
}
