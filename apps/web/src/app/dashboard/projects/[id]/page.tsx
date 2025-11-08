'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash,
  Target,
  Lightbulb,
  BarChart3,
  FileText,
  Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useProject, useCriteria } from '@/hooks/use-projects'
import { useInitiatives } from '@/hooks/use-initiatives'
import Link from 'next/link'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const { data: project, isLoading: projectLoading } = useProject(projectId)
  const { data: criteria, isLoading: criteriaLoading } = useCriteria(projectId)
  const { data: initiatives, isLoading: initiativesLoading } =
    useInitiatives(projectId)

  if (projectLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-muted-foreground mb-4">Project not found</p>
        <Button onClick={() => router.push('/dashboard/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/dashboard/projects')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gradient">{project.title}</h1>
            {project.description && (
              <p className="text-muted-foreground mt-2">
                {project.description}
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Criteria</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {project._count?.criteria || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Defined</p>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Initiatives</CardTitle>
            <Lightbulb className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {project._count?.initiatives || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scored</CardTitle>
            <BarChart3 className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initiatives?.filter((i) => i.aggregateScores).length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Initiatives</p>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Briefs</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initiatives?.filter((i) => i.brief).length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="criteria" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="criteria">Criteria</TabsTrigger>
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Criteria Tab */}
        <TabsContent value="criteria" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Define the criteria used to evaluate and score initiatives
            </p>
            <Button className="gradient-themis">
              <Plus className="h-4 w-4 mr-2" />
              Add Criterion
            </Button>
          </div>

          {criteriaLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : !criteria || criteria.length === 0 ? (
            <Card className="p-12 text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No criteria defined</h3>
              <p className="text-muted-foreground mb-4">
                Add criteria to start scoring your initiatives
              </p>
              <Button className="gradient-themis">
                <Plus className="h-4 w-4 mr-2" />
                Add First Criterion
              </Button>
            </Card>
          ) : (
            <div className="space-y-2">
              {criteria.map((criterion, index) => (
                <motion.div
                  key={criterion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">
                            Weight: {criterion.weight}
                          </Badge>
                          <h4 className="font-semibold">{criterion.name}</h4>
                        </div>
                        {criterion.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {criterion.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Initiatives Tab */}
        <TabsContent value="initiatives" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Manage and generate initiatives for this project
            </p>
            <div className="flex gap-2">
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
              <Button className="gradient-themis">
                <Plus className="h-4 w-4 mr-2" />
                Add Initiative
              </Button>
            </div>
          </div>

          {initiativesLoading ? (
            <Skeleton className="h-64" />
          ) : !initiatives || initiatives.length === 0 ? (
            <Card className="p-12 text-center">
              <Lightbulb className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                No initiatives yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Add or generate initiatives to start prioritizing
              </p>
              <Button className="gradient-themis">
                <Brain className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initiatives.map((initiative) => (
                    <TableRow key={initiative.id}>
                      <TableCell className="font-medium">
                        {initiative.title}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {initiative.description}
                      </TableCell>
                      <TableCell>
                        {initiative.aggregateScores ? (
                          <Badge>
                            {initiative.aggregateScores.overallScore.toFixed(1)}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not scored</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            initiative.brief ? 'default' : 'secondary'
                          }
                        >
                          {initiative.brief ? 'Complete' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        {/* Rankings Tab */}
        <TabsContent value="rankings" className="space-y-4">
          <Card className="p-12 text-center">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Rankings coming soon
            </h3>
            <p className="text-muted-foreground">
              View AI-powered initiative rankings here
            </p>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card className="p-12 text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              AI Insights coming soon
            </h3>
            <p className="text-muted-foreground">
              Get AI-powered recommendations and insights
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
