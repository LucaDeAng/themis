'use client'

import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Zap,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

const mockRankings = [
  {
    id: '1',
    title: 'AI-Powered Customer Portal',
    score: 9.2,
    rank: 1,
    criteria: { strategic: 9.5, feasibility: 8.8, impact: 9.3 },
  },
  {
    id: '2',
    title: 'Mobile App Redesign',
    score: 8.7,
    rank: 2,
    criteria: { strategic: 8.5, feasibility: 9.2, impact: 8.4 },
  },
  {
    id: '3',
    title: 'Data Analytics Platform',
    score: 8.3,
    rank: 3,
    criteria: { strategic: 9.0, feasibility: 7.5, impact: 8.5 },
  },
  {
    id: '4',
    title: 'Process Automation Suite',
    score: 7.8,
    rank: 4,
    criteria: { strategic: 7.5, feasibility: 8.5, impact: 7.5 },
  },
  {
    id: '5',
    title: 'Cloud Migration Phase 2',
    score: 7.5,
    rank: 5,
    criteria: { strategic: 8.0, feasibility: 7.0, impact: 7.5 },
  },
]

export default function RankingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient">Rankings</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered initiative prioritization and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="gradient-themis">
            <Zap className="h-4 w-4 mr-2" />
            Recalculate
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="1">Digital Transformation</SelectItem>
            <SelectItem value="2">Product Innovation</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="overall">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overall">Overall Score</SelectItem>
            <SelectItem value="strategic">Strategic Value</SelectItem>
            <SelectItem value="feasibility">Feasibility</SelectItem>
            <SelectItem value="impact">Business Impact</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Ranked</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockRankings[0].title.substring(0, 20)}...
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Score: {mockRankings[0].score}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all initiatives
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockRankings.filter((r) => r.score >= 8.5).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Score ≥ 8.5</p>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Confidence</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-1">AI confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Rankings List */}
      <div className="space-y-4">
        {mockRankings.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-effect hover:glow-effect transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Rank Badge */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg ${
                        item.rank === 1
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                          : item.rank === 2
                          ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                          : item.rank === 3
                          ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                          : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                      }`}
                    >
                      {item.rank}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      Rank
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {item.title}
                        </h3>
                        <div className="flex gap-2">
                          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">
                            Score: {item.score}
                          </Badge>
                          {item.rank <= 3 && (
                            <Badge variant="outline">
                              <Award className="h-3 w-3 mr-1" />
                              Top 3
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>

                    {/* Criteria Breakdown */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Strategic Value
                          </span>
                          <span className="font-medium">
                            {item.criteria.strategic}
                          </span>
                        </div>
                        <Progress
                          value={item.criteria.strategic * 10}
                          className="h-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Feasibility
                          </span>
                          <span className="font-medium">
                            {item.criteria.feasibility}
                          </span>
                        </div>
                        <Progress
                          value={item.criteria.feasibility * 10}
                          className="h-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Business Impact
                          </span>
                          <span className="font-medium">
                            {item.criteria.impact}
                          </span>
                        </div>
                        <Progress
                          value={item.criteria.impact * 10}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      <Card className="border-purple-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shrink-0">
              1
            </div>
            <p className="text-sm">
              <span className="font-semibold">AI-Powered Customer Portal</span>{' '}
              shows exceptionally high strategic alignment (9.5) and strong
              business impact (9.3). Recommend prioritizing for Q1 execution.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shrink-0">
              2
            </div>
            <p className="text-sm">
              <span className="font-semibold">Data Analytics Platform</span> has
              lower feasibility (7.5) which may require additional resources or
              timeline adjustments.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shrink-0">
              3
            </div>
            <p className="text-sm">
              Consider grouping{' '}
              <span className="font-semibold">Process Automation Suite</span>{' '}
              with <span className="font-semibold">Cloud Migration Phase 2</span>{' '}
              for synergy benefits.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
