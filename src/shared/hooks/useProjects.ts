import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listProjects, createProject, deleteProject, updateProject, CreateProjectInput, UpdateProjectInput } from '../api/projectsApi';

export function useProjectsQuery() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: listProjects,
    });
}

export function useCreateProjectMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateProjectInput) => createProject(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
}

export function useUpdateProjectMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, input }: { projectId: string; input: UpdateProjectInput }) =>
            updateProject(projectId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
}

export function useDeleteProjectMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (projectId: string) => deleteProject(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
}
