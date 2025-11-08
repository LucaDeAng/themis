'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Brain,
  Sparkles,
  Download,
  Eye,
  MoreVertical,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const mockBriefs = [
  {
    id: '1',
    initiative: 'AI-Powered Customer Portal',
    createdAt: '2024-11-07',
    status: 'completed',
    sections: 4,
    isAIGenerated: true,
  },
  {
    id: '2',
    initiative: 'Mobile App Redesign',
    createdAt: '2024-11-06',
    status: 'completed',
    sections: 5,
    isAIGenerated: true,
  },
  {
    id: '3',
    initiative: 'Data Analytics Platform',
    createdAt: '2024-11-05',
    status: 'draft',
    sections: 3,
    isAIGenerated: false,
  },
]

export default function BriefsPage() {
  const [selectedProject, setSelectedProject] = useState('all')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient">Briefs</h1>
          <p className="text-muted-foreground mt-2">
            AI-generated initiative briefs and documentation
          </p>
        </div>
        <Button className="gradient-themis">
          <Brain className="h-4 w-4 mr-2" />
          Generate Brief
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="1">Digital Transformation</SelectItem>
            <SelectItem value="2">Product Innovation</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Briefs</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBriefs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Generated</p>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Generated</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBriefs.filter((b) => b.isAIGenerated).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(
                (mockBriefs.filter((b) => b.isAIGenerated).length /
                  mockBriefs.length) *
                  100
              )}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Sparkles className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBriefs.filter((b) => b.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ready to view</p>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Sections</CardTitle>
            <FileText className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                mockBriefs.reduce((sum, b) => sum + b.sections, 0) /
                mockBriefs.length
              ).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per brief</p>
          </CardContent>
        </Card>
      </div>

      {/* Briefs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockBriefs.map((brief, index) => (
          <motion.div
            key={brief.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-effect hover:glow-effect transition-all">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <Badge
                      variant={
                        brief.status === 'completed' ? 'default' : 'secondary'
                      }
                    >
                      {brief.status}
                    </Badge>
                    {brief.isAIGenerated && (
                      <Badge variant="outline" className="gap-1">
                        <Brain className="h-3 w-3" />
                        AI
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {brief.initiative}
                  </CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Brain className="h-4 w-4 mr-2" />
                      Regenerate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sections</span>
                    <span className="font-medium">{brief.sections}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">
                      {new Date(brief.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Brief
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add New Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: mockBriefs.length * 0.05 }}
        >
          <Card className="glass-effect hover:border-purple-500/50 transition-all cursor-pointer h-full flex items-center justify-center min-h-[280px]">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Generate New Brief</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create an AI-powered brief for an initiative
              </p>
              <Button className="gradient-themis">
                <Brain className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Preview Example */}
      <Card className="border-purple-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Brief Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Standard Sections</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                  Executive Summary
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                  Strategic Rationale
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                  Business Impact
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                  Implementation Plan
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                  Risk Assessment
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                  Success Metrics
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">AI Capabilities</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  Context-aware content generation
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  Industry best practices integration
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  Risk identification and mitigation
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  KPI recommendations
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  Visual diagram generation
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
