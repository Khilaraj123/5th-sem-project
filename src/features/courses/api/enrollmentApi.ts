import apiClient from '../../../lib/axios';
import type { Enrollment } from '../types/lesson.types';

export interface StudentProgressItem {
  studentId: string;
  enrollmentId: string;
  progressPercent: number;
  isCompleted: boolean;
  enrolledAt: string;
  completedAt?: string | null;
}

export interface StudentProgressResponse {
  courseId: string;
  totalStudents: number;
  students: StudentProgressItem[];
}

export interface CourseStatisticsResponse {
  courseId: string;
  courseName: string;
  totalEnrollments: number;
  completedEnrollments: number;
  completionRate: number;
  averageProgress: number;
  activeStudents: number;
}

export interface InstructorDashboardResponse {
  instructorId: string;
  coursesCreated: number;
  publishedCourses: number;
  totalStudents: number;
  totalCompletions: number;
  completionRate: number;
}

export interface StudentDashboardEnrollment {
  enrollmentId: string;
  courseId: string;
  progressPercent: number;
  isCompleted: boolean;
  enrolledAt: string;
}

export interface StudentDashboardResponse {
  studentId: string;
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageProgress: number;
  enrollments: StudentDashboardEnrollment[];
}

export const enrollInCourse = async (courseId: string, studentId: string): Promise<Enrollment> => {
  const response = await apiClient.post<Enrollment>(`/courses/${courseId}/enroll`, { studentId });
  return response.data;
};

export const getStudentDashboard = async (): Promise<StudentDashboardResponse> => {
  const response = await apiClient.get<StudentDashboardResponse>('/course-analytics/student/dashboard');
  return response.data;
};

export const getInstructorDashboard = async (): Promise<InstructorDashboardResponse> => {
  const response = await apiClient.get<InstructorDashboardResponse>('/course-analytics/instructor/dashboard');
  return response.data;
};

export const getCourseStatistics = async (courseId: string): Promise<CourseStatisticsResponse> => {
  const response = await apiClient.get<CourseStatisticsResponse>(`/course-analytics/courses/${courseId}/statistics`);
  return response.data;
};

export const getStudentProgress = async (courseId: string): Promise<StudentProgressResponse> => {
  const response = await apiClient.get<StudentProgressResponse>(`/course-analytics/courses/${courseId}/student-progress`);
  return response.data;
};

export const updateEnrollmentProgress = async (
  enrollmentId: string,
  progressPercentage: number
): Promise<void> => {
  await apiClient.put(`/enrollments/${enrollmentId}/progress`, { progressPercentage });
};
