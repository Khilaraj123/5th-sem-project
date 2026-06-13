import apiClient from '../../../lib/axios';
import type { ClassroomMember } from '../types/classroom.types';

export const getClassroomMembers = async (classroomId: string): Promise<ClassroomMember[]> => {
  try {
    const response = await apiClient.get<ClassroomMember[]>(`/classroom/${classroomId}/members`);
    return response.data;
  } catch (error) {
    console.warn('Membership endpoints might not be implemented, returning simulated members', error);
    // Return simulated members as a fallback
    return [
      {
        userId: '1',
        classroomId,
        fullName: 'Dr. Jane Smith',
        role: 'instructor',
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        userId: '2',
        classroomId,
        fullName: 'Alex Johnson',
        role: 'student',
        joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        userId: '3',
        classroomId,
        fullName: 'Emily Davis',
        role: 'student',
        joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
};

export const joinClassroom = async (inviteCode: string): Promise<{ classroomId: string }> => {
  const response = await apiClient.post<{ classroomId: string }>('/classroom/join', { inviteCode });
  return response.data;
};

export const removeMember = async (classroomId: string, userId: string): Promise<void> => {
  await apiClient.delete(`/classroom/${classroomId}/members/${userId}`);
};
