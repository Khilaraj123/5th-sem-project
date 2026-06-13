import apiClient from '../../../lib/axios';
import type { Review } from '../types/course.types';

export const getCourseReviews = async (courseId: string): Promise<Review[]> => {
  const response = await apiClient.get<Review[]>(`/reviews/course/${courseId}`);
  return response.data;
};

export const createReview = async (
  courseId: string,
  data: { rating: number; comment: string; userId: string }
): Promise<Review> => {
  const response = await apiClient.post<Review>(`/reviews/course/${courseId}`, data);
  return response.data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await apiClient.delete(`/reviews/${reviewId}`);
};
