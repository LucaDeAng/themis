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
import { Loader2, FileText, Download, Copy, CheckCircle2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { RankedInitiative } from '@/types'

interface GenerateBriefDialogProps {
  initiative: RankedInitiative
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Brief {
  executiveSummary: string
  rationale: string
  risks: string
  metrics: string
  implementation: string
  timeline: string
}

export function GenerateBriefDialog({
  initiative,
  open,
  onOpenChange,
}: GenerateBriefDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateBrief = async () => {
    setIsGenerating(true)
    setError(null)
    setBrief(null)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

      const res = await fetch(`${API_URL}/api/generation/brief`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          initiativeId: initiative.id,
          name: initiative.name || initiative.title,
          description: initiative.description,
          weightedScore: initiative.weightedScore,
          criterionBreakdown: initiative.criterionBreakdown,
        }),
      })

      if (!res.ok) {
        throw new Error('Brief generation failed')
      }

      const data = await res.json()
      setBrief(data)
    } catch (err) {
      console.error('Brief generation error:', err)
      setError('Failed to generate brief. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (!brief) return

    const text = `
# ${initiative.name || initiative.title}

## Executive Summary
${brief.executiveSummary}

## Rationale
${brief.rationale}

## Risks
${brief.risks}

## Success Metrics
${brief.metrics}

## Implementation Plan
${brief.implementation}

## Timeline
${brief.timeline}
    `.trim()

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadBrief = () => {
    if (!brief) return

    const text = `
# ${initiative.name || initiative.title}

## Executive Summary
${brief.executiveSummary}

## Rationale
${brief.rationale}

## Risks
${brief.risks}

## Success Metrics
${brief.metrics}

## Implementation Plan
${brief.implementation}

## Timeline
${brief.timeline}
    `.trim()

    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(initiative.name || initiative.title).replace(/[^a-z0-9]/gi, '-')}-brief.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            AI Concept Brief
          </DialogTitle>
          <DialogDescription>
            Generate a comprehensive concept brief for{' '}
            <span className="font-semibold">{initiative.name || initiative.title}</span>
          </DialogDescription>
        </DialogHeader>

        {!brief && !isGenerating && !error && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/30 mx-auto flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              Generate an AI-powered concept brief with executive summary, rationale, risks,
              metrics, implementation plan, and timeline.
            </p>
            <div className="flex gap-2 justify-center">
              <Badge variant="outline">Executive Summary</Badge>
              <Badge variant="outline">Rationale</Badge>
              <Badge variant="outline">Risks</Badge>
              <Badge variant="outline">Metrics</Badge>
            </div>
            <Button onClick={generateBrief} className="gradient-themis">
              <FileText className="h-4 w-4 mr-2" />
              Generate Brief
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-muted-foreground">Generating concept brief...</p>
            <p className="text-sm text-muted-foreground">AI is analyzing and writing</p>
          </div>
        )}

        {error && (
          <div className="py-8 text-center space-y-4">
            <div className="text-red-600">{error}</div>
            <Button onClick={generateBrief} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {brief && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button onClick={downloadBrief} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <Tabs defaultValue="executive" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="executive">Summary</TabsTrigger>
                <TabsTrigger value="rationale">Rationale</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="implementation">Plan</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="executive" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                    <CardDescription>High-level overview of the initiative</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{brief.executiveSummary}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rationale" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Strategic Rationale</CardTitle>
                    <CardDescription>Why this initiative matters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{brief.rationale}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risks" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Risks & Mitigation</CardTitle>
                    <CardDescription>Potential challenges and solutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{brief.risks}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metrics" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Success Metrics</CardTitle>
                    <CardDescription>How we measure success</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{brief.metrics}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="implementation" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Plan</CardTitle>
                    <CardDescription>How to execute this initiative</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{brief.implementation}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                    <CardDescription>Estimated phases and milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{brief.timeline}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {brief && (
            <Button onClick={generateBrief} variant="outline">
              Regenerate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
