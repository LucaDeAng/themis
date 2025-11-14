'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Score } from '@/types'

interface ScoringCellProps {
  initiativeId: string
  criterionId: string
  projectId: string
  scores: Score[]
  minThreshold?: number | null
  onScoreChange?: () => void
}

export function ScoringCell({
  initiativeId,
  criterionId,
  projectId,
  scores,
  minThreshold,
  onScoreChange,
}: ScoringCellProps) {
  const existingScore = scores.find(
    (s) => s.initiativeId === initiativeId && s.criterionId === criterionId
  )

  const [value, setValue] = useState<string>(
    existingScore?.value?.toString() || ''
  )
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setValue(existingScore?.value?.toString() || '')
  }, [existingScore])

  const handleBlur = async () => {
    const numValue = parseFloat(value)

    // Validate
    if (value && (isNaN(numValue) || numValue < 1 || numValue > 5)) {
      alert('Score must be between 1 and 5')
      setValue(existingScore?.value?.toString() || '')
      return
    }

    // Skip if no change
    if (existingScore?.value === numValue || (!value && !existingScore)) {
      return
    }

    setIsSaving(true)
    onScoreChange?.()

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

      if (existingScore) {
        // Update existing score
        const res = await fetch(`${API_URL}/api/scores/${existingScore.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ value: numValue || null }),
        })

        if (!res.ok) throw new Error('Failed to update score')
      } else if (value) {
        // Create new score
        const res = await fetch(`${API_URL}/api/scores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            initiativeId,
            criterionId,
            projectId,
            value: numValue,
            reviewerId: 'current-user-id', // TODO: Get from auth context
          }),
        })

        if (!res.ok) throw new Error('Failed to create score')
      }

      // Refresh scores would happen via React Query invalidation in a real hook
      console.log('Score saved successfully')
    } catch (error) {
      console.error('Failed to save score:', error)
      alert('Failed to save score. Please try again.')
      setValue(existingScore?.value?.toString() || '')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  // Get color based on value (VAS style)
  const getBackgroundColor = () => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return 'bg-background'

    if (minThreshold && numValue < minThreshold) {
      return 'bg-orange-50 dark:bg-orange-950/20 border-orange-300'
    }

    if (numValue >= 4.5) return 'bg-green-100 dark:bg-green-950/30'
    if (numValue >= 3.5) return 'bg-green-50 dark:bg-green-950/20'
    if (numValue >= 2.5) return 'bg-yellow-50 dark:bg-yellow-950/20'
    if (numValue >= 1.5) return 'bg-orange-50 dark:bg-orange-950/20'
    return 'bg-red-50 dark:bg-red-950/20'
  }

  const getTextColor = () => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return 'text-foreground'

    if (numValue >= 4.5) return 'text-green-700 dark:text-green-400 font-semibold'
    if (numValue >= 3.5) return 'text-green-600 dark:text-green-500'
    if (numValue >= 2.5) return 'text-yellow-700 dark:text-yellow-500'
    if (numValue >= 1.5) return 'text-orange-700 dark:text-orange-500'
    return 'text-red-700 dark:text-red-500'
  }

  return (
    <td className="p-2">
      <Input
        type="number"
        min="1"
        max="5"
        step="0.5"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
        placeholder="-"
        className={cn(
          'text-center font-semibold text-base w-20 h-10 transition-colors',
          getBackgroundColor(),
          getTextColor(),
          isSaving && 'opacity-50 cursor-wait'
        )}
      />
    </td>
  )
}
