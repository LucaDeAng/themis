import type { Initiative, Criterion } from '@/types'

// Export ranking to CSV
export function exportRankingToCSV(
  initiatives: any[],
  projectName: string
) {
  const headers = [
    'Rank',
    'Initiative',
    'Description',
    'Weighted Score',
    'Passes Gates',
    'Meets Thresholds',
    'Status',
  ]

  const rows = initiatives.map((init, idx) => [
    idx + 1,
    init.name || init.title,
    init.description || '',
    init.weightedScore.toFixed(2),
    init.passesGates ? 'Yes' : 'No',
    init.meetsMin ? 'Yes' : 'No',
    init.passesGates && init.meetsMin ? 'Green' : !init.passesGates ? 'Red' : 'Yellow',
  ])

  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${projectName.replace(/[^a-z0-9]/gi, '-')}-ranking.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export scoring matrix to CSV
export function exportScoringToCSV(
  initiatives: Initiative[],
  criteria: Criterion[],
  scores: any[],
  projectName: string
) {
  const softCriteria = criteria.filter((c) => c.type === 'SOFT')
  
  const headers = [
    'Initiative',
    'Description',
    ...softCriteria.map((c) => `${c.name} (${Math.round((c.weight || 0) * 100)}%)`),
    'Weighted Score',
  ]

  const rows = initiatives.map((init) => {
    const initiativeScores = scores.filter((s) => s.initiativeId === init.id)
    const criterionValues = softCriteria.map((criterion) => {
      const score = initiativeScores.find((s) => s.criterionId === criterion.id)
      return score?.value?.toFixed(1) || '-'
    })

    // Calculate weighted score
    let totalWeighted = 0
    let totalWeight = 0
    softCriteria.forEach((criterion) => {
      const score = initiativeScores.find((s) => s.criterionId === criterion.id)
      if (score && score.value) {
        totalWeighted += score.value * (criterion.weight || 0)
        totalWeight += criterion.weight || 0
      }
    })
    const weightedScore = totalWeight > 0 ? (totalWeighted / totalWeight).toFixed(2) : '0.00'

    return [
      init.name || init.title,
      init.description || '',
      ...criterionValues,
      weightedScore,
    ]
  })

  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${projectName.replace(/[^a-z0-9]/gi, '-')}-scoring.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export criteria to CSV
export function exportCriteriaToCSV(criteria: Criterion[], projectName: string) {
  const headers = ['Name', 'Description', 'Category', 'Type', 'Weight (%)', 'Min Threshold', 'Display Order']

  const rows = criteria.map((c) => [
    c.name,
    c.description || '',
    c.category || 'Uncategorized',
    c.type,
    Math.round((c.weight || 0) * 100),
    c.minThreshold || '-',
    c.displayOrder || 0,
  ])

  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${projectName.replace(/[^a-z0-9]/gi, '-')}-criteria.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Criterion Templates
export const CRITERION_TEMPLATES = {
  digitalTransformation: [
    {
      name: 'Digital Maturity Impact',
      description: 'Contribution to digital transformation goals and capabilities',
      category: 'Strategic',
      type: 'SOFT' as const,
      weight: 0.2,
      minThreshold: 3,
    },
    {
      name: 'Technology Innovation',
      description: 'Use of modern tech stack and innovative approaches',
      category: 'Innovation',
      type: 'SOFT' as const,
      weight: 0.15,
      minThreshold: null,
    },
    {
      name: 'Customer Experience',
      description: 'Impact on customer satisfaction and digital experience',
      category: 'Customer',
      type: 'SOFT' as const,
      weight: 0.25,
      minThreshold: 4,
    },
    {
      name: 'Operational Efficiency',
      description: 'Process automation and efficiency gains',
      category: 'Operational',
      type: 'SOFT' as const,
      weight: 0.2,
      minThreshold: null,
    },
    {
      name: 'Financial ROI',
      description: 'Expected return on investment and cost savings',
      category: 'Financial',
      type: 'SOFT' as const,
      weight: 0.2,
      minThreshold: 3,
    },
  ],
  productInnovation: [
    {
      name: 'Market Differentiation',
      description: 'Unique value proposition and competitive advantage',
      category: 'Strategic',
      type: 'SOFT' as const,
      weight: 0.25,
      minThreshold: 4,
    },
    {
      name: 'Customer Demand',
      description: 'Validated customer need and market demand',
      category: 'Customer',
      type: 'SOFT' as const,
      weight: 0.25,
      minThreshold: 4,
    },
    {
      name: 'Innovation Level',
      description: 'Degree of innovation and technological novelty',
      category: 'Innovation',
      type: 'SOFT' as const,
      weight: 0.15,
      minThreshold: null,
    },
    {
      name: 'Revenue Potential',
      description: 'Projected revenue generation and growth',
      category: 'Financial',
      type: 'SOFT' as const,
      weight: 0.2,
      minThreshold: 3,
    },
    {
      name: 'Time to Market',
      description: 'Speed to launch and competitive timing',
      category: 'Operational',
      type: 'SOFT' as const,
      weight: 0.15,
      minThreshold: null,
    },
  ],
  vasInsurance: [
    {
      name: 'Strategic Alignment',
      description: 'Alignment with corporate strategy and insurance priorities',
      category: 'Strategic',
      type: 'SOFT' as const,
      weight: 0.2,
      minThreshold: 3,
    },
    {
      name: 'Profitability',
      description: 'Expected profit margin and premium growth',
      category: 'Financial',
      type: 'SOFT' as const,
      weight: 0.25,
      minThreshold: 4,
    },
    {
      name: 'Risk Assessment',
      description: 'Underwriting risk and claims exposure',
      category: 'Risk',
      type: 'SOFT' as const,
      weight: 0.15,
      minThreshold: 3,
    },
    {
      name: 'Customer Retention',
      description: 'Impact on policyholder retention and satisfaction',
      category: 'Customer',
      type: 'SOFT' as const,
      weight: 0.2,
      minThreshold: 4,
    },
    {
      name: 'Regulatory Compliance',
      description: 'Compliance with insurance regulations',
      category: 'Risk',
      type: 'HARD' as const,
      weight: 0,
      minThreshold: null,
    },
    {
      name: 'Operational Scalability',
      description: 'Ability to scale operations efficiently',
      category: 'Operational',
      type: 'SOFT' as const,
      weight: 0.2,
      minThreshold: null,
    },
  ],
}

export type TemplateType = keyof typeof CRITERION_TEMPLATES
