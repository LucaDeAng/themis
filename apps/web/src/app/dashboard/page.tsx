'use client'

import { motion } from 'framer-motion'
import {
  FolderKanban,
  Lightbulb,
  Target,
  TrendingUp,
  Brain,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const stats = [
  {
    title: 'Total Projects',
    value: '12',
    change: '+2 this month',
    icon: FolderKanban,
    color: 'text-purple-600',
  },
  {
    title: 'Active Initiatives',
    value: '48',
    change: '+8 this week',
    icon: Lightbulb,
    color: 'text-blue-600',
  },
  {
    title: 'Criteria Defined',
    value: '24',
    change: 'Across all projects',
    icon: Target,
    color: 'text-cyan-600',
  },
  {
    title: 'Avg Score',
    value: '7.8/10',
    change: '+0.5 vs last month',
    icon: TrendingUp,
    color: 'text-green-600',
  },
]

const recentActivity = [
  {
    title: 'New Initiative Generated',
    description: 'AI generated 5 new initiatives for Q1 Planning',
    time: '2 hours ago',
    icon: Brain,
  },
  {
    title: 'Scoring Completed',
    description: 'All initiatives scored for Digital Transformation',
    time: '5 hours ago',
    icon: Target,
  },
  {
    title: 'Rankings Updated',
    description: 'New rankings available for Product Innovation',
    time: '1 day ago',
    icon: TrendingUp,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your AI-powered initiative prioritization engine
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/dashboard/projects">
              <Button className="w-full h-24 gradient-themis">
                <FolderKanban className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Create Project</div>
                  <div className="text-xs opacity-90">Start new project</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/initiatives">
              <Button className="w-full h-24 gradient-themis">
                <Brain className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Generate Ideas</div>
                  <div className="text-xs opacity-90">AI-powered</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/rankings">
              <Button className="w-full h-24 gradient-themis">
                <TrendingUp className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">View Rankings</div>
                  <div className="text-xs opacity-90">See priorities</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg border"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-purple-600 to-blue-600">
                  <activity.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
