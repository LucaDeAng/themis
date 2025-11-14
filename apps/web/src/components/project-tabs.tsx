'use client'

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Target, BarChart3, Award, FileText, Settings } from 'lucide-react'

export function ProjectTabs() {
  const params = useParams()
  const pathname = usePathname()
  const projectId = params.id as string

  const tabs = [
    {
      name: 'Overview',
      href: `/dashboard/projects/${projectId}`,
      icon: Target,
      active: pathname === `/dashboard/projects/${projectId}`,
    },
    {
      name: 'Criteria',
      href: `/dashboard/projects/${projectId}/criteria`,
      icon: Settings,
      active: pathname?.includes('/criteria'),
    },
    {
      name: 'Scoring',
      href: `/dashboard/projects/${projectId}/scoring`,
      icon: BarChart3,
      active: pathname?.includes('/scoring'),
    },
    {
      name: 'Ranking',
      href: `/dashboard/projects/${projectId}/ranking`,
      icon: Award,
      active: pathname?.includes('/ranking'),
    },
  ]

  return (
    <div className="border-b border-border">
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                tab.active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
