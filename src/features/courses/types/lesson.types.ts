export type LessonType = 'Video' | 'Article' | 'Quiz';

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  type: LessonType;
  content: string;
  videoUrl?: string | null;
  durationInSeconds: number;
  isFree: boolean;
  orderIndex: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string | null;
  progressPercentage: number;
}

export interface CreateSectionInput {
  title: string;
  orderIndex: number;
}

export interface UpdateSectionInput {
  title: string;
}

export interface CreateLessonInput {
  title: string;
  type: LessonType;
  content: string;
  videoUrl?: string | null;
  durationInSeconds: number;
  isFree: boolean;
  orderIndex: number;
}

export interface UpdateLessonInput {
  title: string;
  content?: string;
  videoUrl?: string | null;
  durationInSeconds?: number;
  isFree?: boolean;
}
