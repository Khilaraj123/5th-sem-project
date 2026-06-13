import apiClient from '../../../lib/axios';
import type { Classroom, CreateClassroomInput, UpdateClassroomInput } from '../types/classroom.types';

export const getAllClassrooms = async (): Promise<Classroom[]> => {
  const response = await apiClient.get<Classroom[]>('/classroom');
  return response.data;
};

export const getClassroomById = async (id: string): Promise<Classroom> => {
  const response = await apiClient.get<Classroom>(`/classroom/${id}`);
  return response.data;
};

export const createClassroom = async (data: CreateClassroomInput): Promise<Classroom> => {
  const response = await apiClient.post<Classroom>('/classroom', data);
  return response.data;
};

export const updateClassroom = async (id: string, data: UpdateClassroomInput): Promise<void> => {
  await apiClient.put(`/classroom/${id}`, data);
};

export const deleteClassroom = async (id: string): Promise<void> => {
  await apiClient.delete(`/classroom/${id}`);
};

export const getClassroomByInviteCode = async (inviteCode: string): Promise<Classroom> => {
  const response = await apiClient.get<Classroom>(`/classroom/invite/${inviteCode}`);
  return response.data;
};
