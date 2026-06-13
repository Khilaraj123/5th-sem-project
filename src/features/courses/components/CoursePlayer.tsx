import React, { useEffect, useState } from 'react';
import type { CourseDetail } from '../types/course.types';
import type { Lesson } from '../types/lesson.types';
import { useCourseStore } from '../store/courseStore';
import { useLessonProgress } from '../hooks/useLessonProgress';
import LessonVideo from './LessonVideo';
import CurriculumSidebar from './CurriculumSidebar';
import ProgressBar from './ProgressBar';

interface CoursePlayerProps {
  courseDetail: CourseDetail;
  enrollmentId?: string;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  courseDetail,
  enrollmentId,
}) => {
  const { activeLesson, activeLessonId, setActiveLesson } = useCourseStore();

  const totalLessonsCount = courseDetail.sections.reduce(
    (acc, curr) => acc + curr.lessons.length,
    0
  );

  const { markLessonComplete, isLessonCompleted } = useLessonProgress(
    courseDetail.id,
    enrollmentId
  );

  const [activeTab, setActiveTab] = useState<'about' | 'resources'>('about');

  // Select first lesson by default if none is active
  useEffect(() => {
    if (!activeLessonId && courseDetail.sections.length > 0) {
      const sortedSections = [...courseDetail.sections].sort((a, b) => a.orderIndex - b.orderIndex);
      const firstSection = sortedSections[0];
      if (firstSection.lessons.length > 0) {
        const sortedLessons = [...firstSection.lessons].sort((a, b) => a.orderIndex - b.orderIndex);
        setActiveLesson(sortedLessons[0], firstSection.id);
      }
    }
  }, [courseDetail, activeLessonId, setActiveLesson]);

  const handleLessonSelect = (lesson: Lesson, sectionId: string) => {
    setActiveLesson(lesson, sectionId);
  };

  const handleLessonComplete = async () => {
    if (activeLesson) {
      await markLessonComplete(activeLesson.id, totalLessonsCount);
    }
  };

  // Calculate local progress percentage for display
  const cached = localStorage.getItem(`completed-lessons-${courseDetail.id}`);
  const completedCount = cached ? JSON.parse(cached).length : 0;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Left Column: Player & Info Tabs */}
      <div className="flex-1 space-y-6">
        {activeLesson ? (
          <LessonVideo
            lesson={activeLesson}
            isCompleted={isLessonCompleted(activeLesson.id)}
            onComplete={handleLessonComplete}
          />
        ) : (
          <div className="bg-gray-100 dark:bg-zinc-800 aspect-video rounded-xl flex items-center justify-center text-gray-400">
            Select a lesson to begin learning.
          </div>
        )}

        {/* Info tabs */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-6 text-sm font-semibold border-b border-gray-100 dark:border-zinc-800 pb-3">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-1.5 border-b-2 transition-all ${
                activeTab === 'about'
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              About Lesson
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`pb-1.5 border-b-2 transition-all ${
                activeTab === 'resources'
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Resources
            </button>
          </div>

          <div>
            {activeTab === 'about' && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {activeLesson?.title || 'No active lesson'}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {activeLesson?.content || 'This lesson does not contain details.'}
                </p>
              </div>
            )}
            
            {activeTab === 'resources' && (
              <p className="text-xs text-gray-400">No downloadable files or resources associated with this lesson.</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Progress bar and Curriculum list */}
      <div className="w-full lg:w-80 space-y-6 shrink-0">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
          <ProgressBar progressPercent={progressPercent} showText />
        </div>

        <CurriculumSidebar
          sections={courseDetail.sections}
          activeLessonId={activeLessonId}
          isLessonCompleted={isLessonCompleted}
          onSelectLesson={handleLessonSelect}
        />
      </div>
    </div>
  );
};

export default CoursePlayer;
