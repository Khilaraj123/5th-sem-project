import { useState, useEffect } from 'react';
import { updateEnrollmentProgress } from '../api/enrollmentApi';

export const useLessonProgress = (courseId?: string, enrollmentId?: string) => {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Load progress from local storage on mount
  useEffect(() => {
    if (!courseId) return;
    const cacheKey = `completed-lessons-${courseId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setCompletedLessons(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse cached lesson progress', e);
      }
    }
  }, [courseId]);

  const markLessonComplete = async (lessonId: string, totalLessonsCount: number) => {
    if (!courseId || completedLessons.includes(lessonId)) return;

    const updated = [...completedLessons, lessonId];
    setCompletedLessons(updated);

    const cacheKey = `completed-lessons-${courseId}`;
    localStorage.setItem(cacheKey, JSON.stringify(updated));

    // Calculate progress percentage
    if (totalLessonsCount > 0 && enrollmentId) {
      const progressPercent = Math.round((updated.length / totalLessonsCount) * 100);
      try {
        await updateEnrollmentProgress(enrollmentId, progressPercent);
      } catch (err) {
        console.error('Failed to update progress on server', err);
      }
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  return {
    completedLessons,
    markLessonComplete,
    isLessonCompleted,
  };
};

export default useLessonProgress;
