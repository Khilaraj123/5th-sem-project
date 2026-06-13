import { create } from 'zustand';
import type { CourseDetail } from '../types/course.types';
import type { Lesson } from '../types/lesson.types';

interface CourseState {
  activeCourseId: string | null;
  activeCourse: CourseDetail | null;
  activeSectionId: string | null;
  activeLessonId: string | null;
  activeLesson: Lesson | null;
  setActiveCourse: (course: CourseDetail | null) => void;
  setActiveLesson: (lesson: Lesson | null, sectionId: string | null) => void;
  clearActiveCourse: () => void;
  clearActiveLesson: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  activeCourseId: null,
  activeCourse: null,
  activeSectionId: null,
  activeLessonId: null,
  activeLesson: null,
  setActiveCourse: (course) =>
    set({
      activeCourse: course,
      activeCourseId: course ? course.id : null,
    }),
  setActiveLesson: (lesson, sectionId) =>
    set({
      activeLesson: lesson,
      activeLessonId: lesson ? lesson.id : null,
      activeSectionId: sectionId,
    }),
  clearActiveCourse: () =>
    set({
      activeCourse: null,
      activeCourseId: null,
      activeSectionId: null,
      activeLessonId: null,
      activeLesson: null,
    }),
  clearActiveLesson: () =>
    set({
      activeSectionId: null,
      activeLessonId: null,
      activeLesson: null,
    }),
}));

export default useCourseStore;
