'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle2, AlertTriangle, XCircle, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface FeasibilityCheckDialogProps {
  initiative: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FeasibilityResult {
  overallScore: number
  technicalFeasibility: number
  resourceAvailability: number
  timeToMarket: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  blockers: string[]
  recommendations: string[]
  estimatedDuration: string
  estimatedCost: string
}

export function FeasibilityCheckDialog({
  initiative,
  open,
  onOpenChange,
}: FeasibilityCheckDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<FeasibilityResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runFeasibilityCheck = async () => {
    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      
      const res = await fetch(`${API_URL}/api/generation/feasibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          initiativeId: initiative.id,
          name: initiative.name || initiative.title,
          description: initiative.description,
          scores: initiative.criterionBreakdown,
        }),
      })

      if (!res.ok) {
        throw new Error('Feasibility check failed')
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error('Feasibility check error:', err)
      setError('Failed to analyze feasibility. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            AI Feasibility Check
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis of technical feasibility, resources, and risks for{' '}
            <span className="font-semibold">{initiative.name || initiative.title}</span>
          </DialogDescription>
        </DialogHeader>

        {!result && !isAnalyzing && !error && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/30 mx-auto flex items-center justify-center">
              <Lightbulb className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-muted-foreground">
              Run an AI-powered feasibility check to analyze technical complexity, resource needs,
              and potential blockers.
            </p>
            <Button onClick={runFeasibilityCheck} className="gradient-themis">
              Analyze Feasibility
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
            <p className="text-muted-foreground">Analyzing initiative feasibility...</p>
            <p className="text-sm text-muted-foreground">This may take a few seconds</p>
          </div>
        )}

        {error && (
          <div className="py-8 text-center space-y-4">
            <XCircle className="h-12 w-12 text-red-600 mx-auto" />
            <p className="text-red-600">{error}</p>
            <Button onClick={runFeasibilityCheck} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card className="border-2 border-primary">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">
                    {result.overallScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Feasibility Score</div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="pt-4 text-center">
                  {getScoreIcon(result.technicalFeasibility)}
                  <div className="text-2xl font-bold mt-2">{result.technicalFeasibility}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Technical</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  {getScoreIcon(result.resourceAvailability)}
                  <div className="text-2xl font-bold mt-2">{result.resourceAvailability}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Resources</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  {getScoreIcon(result.timeToMarket)}
                  <div className="text-2xl font-bold mt-2">{result.timeToMarket}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Time to Market</div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Level */}
            <div>
              <div className="text-sm font-medium mb-2">Risk Level</div>
              <Badge className={`text-base px-4 py-2 ${getRiskColor(result.riskLevel)}`}>
                {result.riskLevel} RISK
              </Badge>
            </div>

            {/* Estimates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Estimated Duration
                </div>
                <div className="text-lg font-semibold">{result.estimatedDuration}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Estimated Cost
                </div>
                <div className="text-lg font-semibold">{result.estimatedCost}</div>
              </div>
            </div>

            {/* Blockers */}
            {result.blockers && result.blockers.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Potential Blockers
                </div>
                <ul className="space-y-2">
                  {result.blockers.map((blocker, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{blocker}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-purple-600" />
                  AI Recommendations
                </div>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-purple-600 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {result && (
            <Button onClick={runFeasibilityCheck} variant="outline">
              Re-analyze
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
