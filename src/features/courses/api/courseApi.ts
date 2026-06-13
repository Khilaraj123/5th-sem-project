import apiClient from '../../../lib/axios';
import type { Course, CourseDetail, Category, CreateCourseInput, UpdateCourseInput } from '../types/course.types';

export const getAllCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get<Course[]>('/courses');
  return response.data;
};

export const getCourseById = async (id: string): Promise<CourseDetail> => {
  const response = await apiClient.get<CourseDetail>(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (data: CreateCourseInput): Promise<Course> => {
  const response = await apiClient.post<Course>('/courses', data);
  return response.data;
};

export const updateCourse = async (id: string, data: UpdateCourseInput): Promise<void> => {
  await apiClient.put(`/courses/${id}`, data);
};

export const deleteCourse = async (id: string): Promise<void> => {
  await apiClient.delete(`/courses/${id}`);
};

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/Categories');
  return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await apiClient.get<Category>(`/Categories/${id}`);
  return response.data;
};
