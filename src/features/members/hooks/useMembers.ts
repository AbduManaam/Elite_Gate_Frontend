import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import {
    listMembers,
    addMember,
    changeMemberRole,
    removeMember
} from '../api/membersApi';

export function useMembersQuery(projectId: string) {
    return useQuery({
        queryKey: queryKeys.members(projectId),
        queryFn: () => listMembers(projectId),
        enabled: !!projectId,
    });
}

export function useInviteMemberMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ email, role }: { email: string; role: string }) => addMember(projectId, email, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.members(projectId) });
        },
    });
}

export function useChangeMemberRoleMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ memberId, role }: { memberId: string; role: string }) =>
            changeMemberRole(projectId, memberId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.members(projectId) });
        },
    });
}

export function useRemoveMemberMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (memberId: string) => removeMember(projectId, memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.members(projectId) });
        },
    });
}
