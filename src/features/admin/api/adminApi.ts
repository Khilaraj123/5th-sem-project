import apiClient from '../../../lib/axios';
import type { PlatformStats, ContentFlag, AuditLog } from '../types/admin.types';

export const getPlatformStats = async (): Promise<PlatformStats> => {
  const response = await apiClient.get<PlatformStats>('/admin/users/platform-statistics');
  return response.data;
};

export const getContentFlags = async (): Promise<ContentFlag[]> => {
  // Matches backend Route [HttpGet("flags")] in ModerationController
  const response = await apiClient.get<{ items: ContentFlag[] } | ContentFlag[]>('/admin/moderation/flags');
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data.items || [];
};

export const resolveContentFlag = async (id: string, resolution: string): Promise<void> => {
  // Matches backend [HttpPut("flags/{id:guid}/resolve")] in ModerationController
  await apiClient.put(`/admin/moderation/flags/${id}/resolve`, { resolution });
};

export const dismissContentFlag = async (id: string): Promise<void> => {
  // Matches backend [HttpPut("flags/{id:guid}/dismiss")] in ModerationController
  await apiClient.put(`/admin/moderation/flags/${id}/dismiss`);
};

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  // Matches backend [HttpGet] in AuditLogsController
  const response = await apiClient.get<{ items: AuditLog[] } | AuditLog[]>('/admin/audit-logs');
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data.items || [];
};
