import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourseById, updateCourse, deleteCourse } from '../api/courseApi';
import { getCourseSections, addSection, updateSection, deleteSection, addLesson, updateLesson, deleteLesson } from '../api/lessonApi';
import { getCourseReviews, createReview } from '../api/reviewApi';
import { enrollInCourse, getCourseStatistics, getStudentProgress } from '../api/enrollmentApi';
import { useCourseStore } from '../store/courseStore';
import type { CourseDetail, Section, Review, UpdateCourseInput } from '../types/course.types';
import type { CreateSectionInput, UpdateSectionInput, Lesson, CreateLessonInput, UpdateLessonInput, Enrollment } from '../types/lesson.types';
import type { CourseStatisticsResponse, StudentProgressResponse } from '../api/enrollmentApi';

export const useCourse = (id?: string) => {
  const queryClient = useQueryClient();
  const setActiveCourse = useCourseStore((state) => state.setActiveCourse);

  const courseQuery = useQuery<CourseDetail, Error>({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id!),
    enabled: !!id,
  });

  if (courseQuery.data) {
    setActiveCourse(courseQuery.data);
  }

  const updateMutation = useMutation<void, Error, UpdateCourseInput>({
    mutationFn: (data) => updateCourse(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const deleteMutation = useMutation<void, Error, void>({
    mutationFn: () => deleteCourse(id!),
    onSuccess: () => {
      setActiveCourse(null);
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const enrollMutation = useMutation<Enrollment, Error, string>({
    mutationFn: (studentId) => enrollInCourse(id!, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
  });

  const sectionsQuery = useQuery<Section[], Error>({
    queryKey: ['course-sections', id],
    queryFn: () => getCourseSections(id!),
    enabled: !!id,
  });

  const reviewsQuery = useQuery<Review[], Error>({
    queryKey: ['course-reviews', id],
    queryFn: () => getCourseReviews(id!),
    enabled: !!id,
  });

  const addSectionMutation = useMutation<Section, Error, CreateSectionInput>({
    mutationFn: (data) => addSection(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-sections', id] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
  });

  const updateSectionMutation = useMutation<Section, Error, { sectionId: string; data: UpdateSectionInput }>({
    mutationFn: ({ sectionId, data }) => updateSection(sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-sections', id] });
    },
  });

  const deleteSectionMutation = useMutation<void, Error, string>({
    mutationFn: (sectionId) => deleteSection(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-sections', id] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
  });

  const addLessonMutation = useMutation<Lesson, Error, { sectionId: string; data: CreateLessonInput }>({
    mutationFn: ({ sectionId, data }) => addLesson(sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-sections', id] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
  });

  const updateLessonMutation = useMutation<Lesson, Error, { lessonId: string; data: UpdateLessonInput }>({
    mutationFn: ({ lessonId, data }) => updateLesson(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-sections', id] });
    },
  });

  const deleteLessonMutation = useMutation<void, Error, string>({
    mutationFn: (lessonId) => deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-sections', id] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
  });

  const addReviewMutation = useMutation<Review, Error, { rating: number; comment: string; userId: string }>({
    mutationFn: (data) => createReview(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
  });

  const statisticsQuery = useQuery<CourseStatisticsResponse, Error>({
    queryKey: ['course-statistics', id],
    queryFn: () => getCourseStatistics(id!),
    enabled: !!id,
  });

  const progressQuery = useQuery<StudentProgressResponse, Error>({
    queryKey: ['course-student-progress', id],
    queryFn: () => getStudentProgress(id!),
    enabled: !!id,
  });

  return {
    course: courseQuery.data,
    isLoading: courseQuery.isLoading,
    error: courseQuery.error,

    updateCourse: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteCourse: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    enrollInCourse: enrollMutation.mutateAsync,
    isEnrolling: enrollMutation.isPending,

    sections: sectionsQuery.data || [],
    isLoadingSections: sectionsQuery.isLoading,

    reviews: reviewsQuery.data || [],
    isLoadingReviews: reviewsQuery.isLoading,

    addSection: addSectionMutation.mutateAsync,
    updateSection: updateSectionMutation.mutateAsync,
    deleteSection: deleteSectionMutation.mutateAsync,

    addLesson: addLessonMutation.mutateAsync,
    updateLesson: updateLessonMutation.mutateAsync,
    deleteLesson: deleteLessonMutation.mutateAsync,

    addReview: addReviewMutation.mutateAsync,

    statistics: statisticsQuery.data,
    progress: progressQuery.data,
  };
};

export default useCourse;
