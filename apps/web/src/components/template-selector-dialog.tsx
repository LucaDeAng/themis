'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Sparkles, TrendingUp, Shield, X } from 'lucide-react'
import { CRITERION_TEMPLATES, type TemplateType } from '@/lib/export'

interface TemplateSelectorDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onTemplateApplied: () => void
}

const TEMPLATE_INFO = {
  digitalTransformation: {
    title: 'Digital Transformation',
    description: 'Evaluate initiatives focused on digital maturity, technology innovation, and customer experience',
    icon: Sparkles,
    color: 'bg-blue-500',
    criteria: 5,
  },
  productInnovation: {
    title: 'Product Innovation',
    description: 'Assess new product ideas based on market differentiation, customer demand, and revenue potential',
    icon: TrendingUp,
    color: 'bg-purple-500',
    criteria: 5,
  },
  vasInsurance: {
    title: 'VAS Insurance',
    description: 'Prioritize insurance value-added services with focus on profitability, risk, and compliance',
    icon: Shield,
    color: 'bg-green-500',
    criteria: 6,
  },
}

export function TemplateSelectorDialog({
  projectId,
  open,
  onOpenChange,
  onTemplateApplied,
}: TemplateSelectorDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return

    setIsApplying(true)
    try {
      const templateCriteria = CRITERION_TEMPLATES[selectedTemplate]
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

      // Create each criterion from template
      for (const criterion of templateCriteria) {
        await fetch(`${API_URL}/api/criteria`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...criterion,
            projectId,
          }),
        })
      }

      onTemplateApplied()
      onOpenChange(false)
      setSelectedTemplate(null)
    } catch (error) {
      console.error('Error applying template:', error)
      alert('Failed to apply template. Please try again.')
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Start with a pre-configured set of criteria tailored to your project type
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {(Object.keys(TEMPLATE_INFO) as TemplateType[]).map((key) => {
            const template = TEMPLATE_INFO[key]
            const Icon = template.icon
            const isSelected = selectedTemplate === key

            return (
              <div
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${template.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{template.title}</h3>
                      <Badge variant="secondary">{template.criteria} criteria</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {template.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {CRITERION_TEMPLATES[key].map((criterion, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {criterion.name}
                          {criterion.type === 'HARD' && ' (HARD)'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-6 h-6 text-blue-500 absolute top-4 right-4" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <Button
            variant="ghost"
            onClick={() => {
              onOpenChange(false)
              setSelectedTemplate(null)
            }}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleApplyTemplate}
            disabled={!selectedTemplate || isApplying}
          >
            {isApplying ? 'Applying...' : 'Apply Template'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
