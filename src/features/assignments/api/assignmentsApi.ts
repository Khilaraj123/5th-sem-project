import apiClient from '../../../lib/axios';
import type {
  Assignment,
  CreateAssignmentInput,
  UpdateAssignmentInput
} from '../types/assignment.types';

// ================= ASSIGNMENTS =================

export const getAssignmentById = async (assignmentId: string): Promise<Assignment> => {
  const response = await apiClient.get<Assignment>(`/assignment/${assignmentId}`);
  return response.data;
};

export const getAssignmentsByClassroom = async (classroomId: string): Promise<Assignment[]> => {
  const response = await apiClient.get<Assignment[]>(`/assignment/classroom/${classroomId}`);
  return response.data;
};

export const createAssignment = async (data: CreateAssignmentInput): Promise<Assignment> => {
  const response = await apiClient.post<Assignment>('/assignment', data);
  return response.data;
};

export const updateAssignment = async (assignmentId: string, data: UpdateAssignmentInput): Promise<Assignment> => {
  const response = await apiClient.put<Assignment>(`/assignment/${assignmentId}`, data);
  return response.data;
};

export const deleteAssignment = async (assignmentId: string): Promise<void> => {
  await apiClient.delete(`/assignment/${assignmentId}`);
};

export const getAssignmentDetails = async (assignmentId: string): Promise<any> => {
  const response = await apiClient.get(`/assignment/${assignmentId}/details`);
  return response.data;
};
