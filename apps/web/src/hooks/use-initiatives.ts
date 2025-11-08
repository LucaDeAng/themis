import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api-client';
import type {
  Initiative,
  CreateInitiativeDto,
  UpdateInitiativeDto,
  GenerateInitiativesDto,
} from '../types';

export function useInitiatives(projectId: string) {
  return useQuery({
    queryKey: ['initiatives', projectId],
    queryFn: async () => {
      const { data } = await apiClient.get<Initiative[]>('/initiatives', {
        params: { projectId },
      });
      return data;
    },
    enabled: !!projectId,
  });
}

export function useInitiative(id: string) {
  return useQuery({
    queryKey: ['initiative', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Initiative>(`/initiatives/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateInitiative() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dto: CreateInitiativeDto) => {
      const { data } = await apiClient.post<Initiative>('/initiatives', dto);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['initiatives', variables.projectId] });
    },
  });
}

export function useUpdateInitiative(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dto: UpdateInitiativeDto) => {
      const { data } = await apiClient.put<Initiative>(`/initiatives/${id}`, dto);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['initiative', id] });
      queryClient.invalidateQueries({ queryKey: ['initiatives', data.projectId] });
    },
  });
}

export function useDeleteInitiative() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/initiatives/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
    },
  });
}

export function useGenerateInitiatives() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dto: GenerateInitiativesDto) => {
      const { data } = await apiClient.post<{ count: number; initiatives: Initiative[] }>(
        '/generation/initiatives',
        dto
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['initiatives', variables.projectId] });
    },
  });
}
