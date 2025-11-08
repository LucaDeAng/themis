import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api-client';
import type {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  Criterion,
  CreateCriterionDto,
} from '../types';

// Projects
export function useProjects(workspaceId: string) {
  return useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      const { data } = await apiClient.get<Project[]>(`/projects`, {
        params: { workspaceId },
      });
      return data;
    },
    enabled: !!workspaceId,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Project>(`/projects/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dto: CreateProjectDto) => {
      const { data } = await apiClient.post<Project>('/projects', dto);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.workspaceId] });
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dto: UpdateProjectDto) => {
      const { data} = await apiClient.put<Project>(`/projects/${id}`, dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Criteria
export function useCriteria(projectId: string) {
  return useQuery({
    queryKey: ['criteria', projectId],
    queryFn: async () => {
      const { data } = await apiClient.get<Criterion[]>(`/projects/${projectId}/criteria`);
      return data;
    },
    enabled: !!projectId,
  });
}

export function useAddCriterion(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dto: CreateCriterionDto) => {
      const { data } = await apiClient.post<Criterion>(`/projects/${projectId}/criteria`, dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criteria', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
}

export function useUpdateCriterion(criterionId: string, projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dto: Partial<CreateCriterionDto>) => {
      const { data } = await apiClient.put<Criterion>(`/projects/criteria/${criterionId}`, dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criteria', projectId] });
    },
  });
}

export function useDeleteCriterion(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (criterionId: string) => {
      await apiClient.delete(`/projects/criteria/${criterionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criteria', projectId] });
    },
  });
}
