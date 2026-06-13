import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCourses, getAllCategories, createCourse } from '../api/courseApi';
import { getStudentDashboard, getInstructorDashboard } from '../api/enrollmentApi';
import type { Course, Category, CreateCourseInput } from '../types/course.types';
import type { StudentDashboardResponse, InstructorDashboardResponse } from '../api/enrollmentApi';

export const useCourses = () => {
  const queryClient = useQueryClient();

  const coursesQuery = useQuery<Course[], Error>({
    queryKey: ['courses'],
    queryFn: getAllCourses,
  });

  const categoriesQuery = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  const studentDashboardQuery = useQuery<StudentDashboardResponse, Error>({
    queryKey: ['student-dashboard'],
    queryFn: getStudentDashboard,
  });

  const instructorDashboardQuery = useQuery<InstructorDashboardResponse, Error>({
    queryKey: ['instructor-dashboard'],
    queryFn: getInstructorDashboard,
  });

  const createCourseMutation = useMutation<Course, Error, CreateCourseInput>({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return {
    courses: coursesQuery.data || [],
    isLoading: coursesQuery.isLoading,
    error: coursesQuery.error,

    categories: categoriesQuery.data || [],
    isLoadingCategories: categoriesQuery.isLoading,

    studentDashboard: studentDashboardQuery.data,
    isLoadingStudentDashboard: studentDashboardQuery.isLoading,

    instructorDashboard: instructorDashboardQuery.data,
    isLoadingInstructorDashboard: instructorDashboardQuery.isLoading,

    createCourse: createCourseMutation.mutateAsync,
    isCreating: createCourseMutation.isPending,
  };
};

export default useCourses;
