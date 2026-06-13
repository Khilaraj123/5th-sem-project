import apiClient from '../../../lib/axios';
import type { Section } from '../types/course.types';
import type { Lesson, CreateSectionInput, UpdateSectionInput, CreateLessonInput, UpdateLessonInput } from '../types/lesson.types';

export const getCourseSections = async (courseId: string): Promise<Section[]> => {
  const response = await apiClient.get<Section[]>(`/Curriculum/courses/${courseId}/sections`);
  return response.data;
};

export const addSection = async (courseId: string, data: CreateSectionInput): Promise<Section> => {
  const response = await apiClient.post<Section>(`/Curriculum/courses/${courseId}/sections`, data);
  return response.data;
};

export const updateSection = async (sectionId: string, data: UpdateSectionInput): Promise<Section> => {
  const response = await apiClient.put<Section>(`/Curriculum/sections/${sectionId}`, data);
  return response.data;
};

export const deleteSection = async (sectionId: string): Promise<void> => {
  await apiClient.delete(`/Curriculum/sections/${sectionId}`);
};

export const addLesson = async (sectionId: string, data: CreateLessonInput): Promise<Lesson> => {
  const response = await apiClient.post<Lesson>(`/Curriculum/sections/${sectionId}/lessons`, data);
  return response.data;
};

export const updateLesson = async (lessonId: string, data: UpdateLessonInput): Promise<Lesson> => {
  const response = await apiClient.put<Lesson>(`/Curriculum/lessons/${lessonId}`, data);
  return response.data;
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
  await apiClient.delete(`/Curriculum/lessons/${lessonId}`);
};
