import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import {
    listProjectGateways,
    listAllGateways,
    provisionGateway,
    decommissionGateway,
    reloadConfig,
    restartGateway
} from '../api/gatewaysApi';

export function useGatewaysQuery(projectId: string) {
    return useQuery({
        queryKey: queryKeys.gateways(projectId),
        queryFn: () => listProjectGateways(projectId),
        enabled: !!projectId,
    });
}

export function useAllGatewaysQuery() {
    return useQuery({
        queryKey: queryKeys.allGateways(),
        queryFn: listAllGateways,
    });
}

export function useProvisionGatewayMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (plan: string) => provisionGateway(projectId, plan),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.gateways(projectId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.allGateways() });
        },
    });
}

export function useDecommissionGatewayMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (gatewayId: string) => decommissionGateway(projectId, gatewayId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.gateways(projectId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.allGateways() });
        },
    });
}

export function useReloadConfigMutation(projectId: string) {
    return useMutation({
        mutationFn: () => reloadConfig(projectId),
    });
}

export function useRestartGatewayMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (gatewayId: string) => restartGateway(gatewayId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.gateways(projectId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.allGateways() });
        },
    });
}
