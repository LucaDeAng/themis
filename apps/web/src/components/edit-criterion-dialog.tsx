'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useUpdateCriterion } from '@/hooks/use-criteria'
import { Loader2 } from 'lucide-react'
import type { Criterion } from '@/types'

interface EditCriterionDialogProps {
  criterion: Criterion
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categories = [
  'Strategic',
  'Financial',
  'Operational',
  'Risk',
  'Customer',
  'Innovation',
]

export function EditCriterionDialog({
  criterion,
  open,
  onOpenChange,
}: EditCriterionDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: criterion.name,
      description: criterion.description || '',
      category: criterion.category || 'Strategic',
      weight: criterion.weight || 0.1,
      type: criterion.type || 'SOFT',
      minThreshold: criterion.minThreshold,
    },
  })

  const updateCriterion = useUpdateCriterion()
  const criterionType = watch('type')
  const weight = watch('weight')

  useEffect(() => {
    reset({
      name: criterion.name,
      description: criterion.description || '',
      category: criterion.category || 'Strategic',
      weight: criterion.weight || 0.1,
      type: criterion.type || 'SOFT',
      minThreshold: criterion.minThreshold,
    })
  }, [criterion, reset])

  const onSubmit = async (data: any) => {
    try {
      await updateCriterion.mutateAsync({
        id: criterion.id,
        data: {
          ...data,
          minThreshold: data.type === 'SOFT' ? data.minThreshold : null,
        },
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update criterion:', error)
    }
  }

  const wordCount = watch('name')?.split(/\s+/).filter(Boolean).length || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Criterion</DialogTitle>
          <DialogDescription>
            Update criterion configuration. Max 6 words for the name.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Criterion Name * <span className="text-muted-foreground">({wordCount}/6 words)</span>
            </Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Criterion name is required',
                validate: (value) => {
                  const words = value.split(/\s+/).filter(Boolean).length
                  return words <= 6 || 'Maximum 6 words allowed'
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register('description')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={watch('category')}
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={criterionType === 'HARD'}
                  onCheckedChange={(checked) =>
                    setValue('type', checked ? 'HARD' : 'SOFT')
                  }
                />
                <Label className="font-normal">
                  {criterionType === 'HARD' ? 'HARD Gate' : 'SOFT Scoring'}
                </Label>
              </div>
            </div>

            {criterionType === 'SOFT' && (
              <div className="space-y-2">
                <Label>Weight: {Math.round(weight * 100)}%</Label>
                <Slider
                  value={[weight * 100]}
                  onValueChange={([value]: [number]) => setValue('weight', value / 100)}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            )}
          </div>

          {criterionType === 'SOFT' && (
            <div className="space-y-2">
              <Label htmlFor="minThreshold">Minimum Threshold</Label>
              <Select
                value={String(watch('minThreshold') || '')}
                onValueChange={(value) =>
                  setValue('minThreshold', value ? Number(value) : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No minimum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No minimum</SelectItem>
                  <SelectItem value="2">≥ 2 / 5</SelectItem>
                  <SelectItem value="3">≥ 3 / 5</SelectItem>
                  <SelectItem value="4">≥ 4 / 5</SelectItem>
                  <SelectItem value="5">≥ 5 / 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-themis" disabled={updateCriterion.isPending}>
              {updateCriterion.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Criterion
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
