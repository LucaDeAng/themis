'use client'

import { useState } from 'react'
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
import { useCreateProject } from '@/hooks/use-projects'
import { CreateProjectDto } from '@/types'
import { Loader2 } from 'lucide-react'

interface CreateProjectDialogProps {
  workspaceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProjectDialog({
  workspaceId,
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectDto>({
    defaultValues: {
      workspaceId,
      name: '',
      description: '',
    },
  })

  const createProject = useCreateProject()

  const onSubmit = async (data: CreateProjectDto) => {
    try {
      // Add createdBy field (temporary hardcoded until auth is implemented)
      const projectData = {
        ...data,
        createdBy: '1', // Default user ID
      }
      console.log('📤 Sending project data:', JSON.stringify(projectData, null, 2))
      await createProject.mutateAsync(projectData)
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create project:', error)
      console.error('Error details:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Define a new project to organize and prioritize your initiatives
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Digital Transformation Q1"
              {...register('name', { required: 'Project name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of the project"
              {...register('description')}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-themis"
              disabled={createProject.isPending}
            >
              {createProject.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
