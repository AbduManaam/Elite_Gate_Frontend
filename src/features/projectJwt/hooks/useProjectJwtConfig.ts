import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import { getProjectJwtConfig } from '../api/projectJwtApi';

export function useProjectJwtConfigQuery(projectId: string | null) {
  return useQuery({
    queryKey: queryKeys.projectJwt(projectId ?? ''),
    queryFn: () => getProjectJwtConfig(projectId ?? ''),
    enabled: Boolean(projectId),
  });
}
