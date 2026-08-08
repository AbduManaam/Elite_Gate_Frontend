import { apiClient } from '../../../lib/api/client';
import type {
  ConfigureProjectJwtInput,
  ProjectJwtConfig,
} from './types';

const projectJwtPath = (projectId: string) =>
  `/v1/projects/${projectId}/security/jwt`;

export async function getProjectJwtConfig(
  projectId: string
): Promise<ProjectJwtConfig> {
  const { data } = await apiClient.get<ProjectJwtConfig>(
    projectJwtPath(projectId)
  );
  return data;
}

export async function configureProjectJwt(
  projectId: string,
  input: ConfigureProjectJwtInput
): Promise<ProjectJwtConfig> {
  const { data } = await apiClient.put<ProjectJwtConfig>(
    projectJwtPath(projectId),
    input
  );
  return data;
}

export async function deleteProjectJwtConfig(
  projectId: string
): Promise<void> {
  await apiClient.delete(projectJwtPath(projectId));
}
