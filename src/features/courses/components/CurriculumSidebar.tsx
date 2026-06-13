import React from 'react';
import { Play, FileText, CheckCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Section } from '../types/course.types';
import type { Lesson } from '../types/lesson.types';

interface CurriculumSidebarProps {
  sections: Section[];
  activeLessonId: string | null;
  isLessonCompleted: (id: string) => boolean;
  onSelectLesson: (lesson: Lesson, sectionId: string) => void;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
  sections,
  activeLessonId,
  isLessonCompleted,
  onSelectLesson,
}) => {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getLessonIcon = (type: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="text-emerald-500 shrink-0" size={16} />;
    }
    switch (type) {
      case 'Video':
        return <Play className="text-gray-400 dark:text-zinc-500 shrink-0" size={16} />;
      case 'Article':
        return <FileText className="text-gray-400 dark:text-zinc-500 shrink-0" size={16} />;
      case 'Quiz':
        return <HelpCircle className="text-gray-400 dark:text-zinc-500 shrink-0" size={16} />;
      default:
        return <Play className="text-gray-400 dark:text-zinc-500 shrink-0" size={16} />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-zinc-850 bg-gray-50 dark:bg-zinc-900/50">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Course Curriculum</h3>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-zinc-850 overflow-y-auto flex-1">
        {sections
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((section) => {
            const isOpen = openSections[section.id] !== false; // Open by default
            return (
              <div key={section.id} className="flex flex-col">
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-zinc-900/30 text-left hover:bg-gray-50 dark:hover:bg-zinc-850 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-xs line-clamp-1">
                      {section.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      {section.lessons.length} lessons
                    </span>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>

                {/* Lessons List */}
                {isOpen && (
                  <div className="bg-white dark:bg-zinc-900/10">
                    {section.lessons
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((lesson) => {
                        const isSelected = activeLessonId === lesson.id;
                        const isCompleted = isLessonCompleted(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => onSelectLesson(lesson, section.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left border-l-2 text-xs font-semibold transition-all hover:bg-gray-50 dark:hover:bg-zinc-850/50 ${
                              isSelected
                                ? 'border-violet-600 bg-violet-50/20 text-violet-600 dark:bg-violet-950/10 dark:text-violet-400 font-bold'
                                : 'border-transparent text-gray-600 dark:text-zinc-400'
                            }`}
                          >
                            {getLessonIcon(lesson.type, isCompleted)}
                            <span className="truncate flex-1">{lesson.title}</span>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CurriculumSidebar;
