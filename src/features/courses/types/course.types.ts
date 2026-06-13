import type { Lesson } from './lesson.types';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'AllLevels';
export type CourseStatus = 'Draft' | 'Published' | 'Archived';

export interface Course {
  id: string;
  instructorId: string;
  instructorName?: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string | null;
  price: number;
  currency: string;
  level: CourseLevel;
  status: CourseStatus;
  language: string;
  tags: string[];
  totalDurationSeconds: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  courseCount: number;
}

export interface Review {
  id: string;
  userId: string;
  userName?: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface CourseDetail extends Course {
  sections: Section[];
  reviews: Review[];
  averageRating: number;
  enrollmentCount: number;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  instructorId: string;
  courseId?: string | null;
  price?: number;
  level?: CourseLevel;
  language?: string;
  tags?: string[];
}

export interface UpdateCourseInput {
  title: string;
  description?: string;
  price?: number;
  level?: CourseLevel;
  status?: CourseStatus;
  language?: string;
  tags?: string[];
}
