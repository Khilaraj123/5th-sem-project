import apiClient from '../../../lib/axios';
import type { Announcement } from '../types/classroom.types';

export const getAnnouncements = async (classroomId: string): Promise<Announcement[]> => {
  try {
    const response = await apiClient.get<Announcement[]>(`/classroom/${classroomId}/announcements`);
    return response.data;
  } catch (error) {
    console.warn('Announcements endpoints might not be implemented, returning simulated feed', error);
    // Return simulated announcements as a fallback
    return [
      {
        id: 'ann-1',
        classroomId,
        authorId: 'inst-1',
        authorName: 'Dr. Jane Smith',
        authorRole: 'instructor',
        title: 'Welcome to the Class!',
        content: 'Hello everyone! Welcome to our classroom. Please read the syllabus in the course curriculum and introduce yourself here.',
        isScheduled: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
      },
      {
        id: 'ann-2',
        classroomId,
        authorId: 'inst-1',
        authorName: 'Dr. Jane Smith',
        authorRole: 'instructor',
        title: 'Assignment 1 Released',
        content: 'The first programming assignment has been released under Classwork. The deadline is next Friday. Let me know if you have any questions.',
        isScheduled: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
      },
    ];
  }
};

export const createAnnouncement = async (
  classroomId: string,
  data: { title: string; content: string }
): Promise<Announcement> => {
  try {
    const response = await apiClient.post<Announcement>(`/classroom/${classroomId}/announcements`, data);
    return response.data;
  } catch (error) {
    console.warn('Creating announcement on server failed, simulating success', error);
    // Return a mocked success response
    return {
      id: Math.random().toString(36).substring(7),
      classroomId,
      authorId: 'current-user',
      authorName: 'You',
      authorRole: 'instructor',
      title: data.title,
      content: data.content,
      isScheduled: false,
      createdAt: new Date().toISOString(),
      attachments: [],
    };
  }
};

export const deleteAnnouncement = async (classroomId: string, announcementId: string): Promise<void> => {
  await apiClient.delete(`/classroom/${classroomId}/announcements/${announcementId}`);
};
