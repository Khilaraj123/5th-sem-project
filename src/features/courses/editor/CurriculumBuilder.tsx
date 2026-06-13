import React, { useState } from 'react';
import { Plus, Trash2, Edit, HelpCircle, FileText, Play, Check } from 'lucide-react';
import useCourse from '../hooks/useCourse';
import LessonEditor from './LessonEditor';
import QuizBuilder from './QuizBuilder';
import type { Section } from '../types/course.types';
import type { Lesson, LessonType } from '../types/lesson.types';

interface CurriculumBuilderProps {
  courseId: string;
}

export const CurriculumBuilder: React.FC<CurriculumBuilderProps> = ({ courseId }) => {
  const {
    sections,
    isLoadingSections,
    addSection,
    updateSection,
    deleteSection,
    addLesson,
    updateLesson,
    deleteLesson,
  } = useCourse(courseId);

  // UI state
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState('');

  // Lesson state
  const [activeAddLessonSectionId, setActiveAddLessonSectionId] = useState<string | null>(null);
  const [activeEditLesson, setActiveEditLesson] = useState<Lesson | null>(null);
  const [activeQuizLesson, setActiveQuizLesson] = useState<Lesson | null>(null);

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    try {
      await addSection({
        title: newSectionTitle,
        orderIndex: sections.length,
      });
      setNewSectionTitle('');
      setIsAddingSection(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditSection = (section: Section) => {
    setEditingSectionId(section.id);
    setEditingSectionTitle(section.title);
  };

  const handleSaveSectionTitle = async (sectionId: string) => {
    if (!editingSectionTitle.trim()) return;
    try {
      await updateSection({
        sectionId,
        data: { title: editingSectionTitle },
      });
      setEditingSectionId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLessonSubmit = async (
    sectionId: string,
    lessonData: {
      title: string;
      type: LessonType;
      content: string;
      videoUrl?: string | null;
      durationInSeconds: number;
      isFree: boolean;
      orderIndex: number;
    }
  ) => {
    try {
      await addLesson({
        sectionId,
        data: lessonData,
      });
      setActiveAddLessonSectionId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditLessonSubmit = async (
    lessonId: string,
    lessonData: {
      title: string;
      type: LessonType;
      content: string;
      videoUrl?: string | null;
      durationInSeconds: number;
      isFree: boolean;
      orderIndex: number;
    }
  ) => {
    try {
      await updateLesson({
        lessonId,
        data: lessonData,
      });
      setActiveEditLesson(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveQuizContent = async (updatedContent: string) => {
    if (!activeQuizLesson) return;
    try {
      await updateLesson({
        lessonId: activeQuizLesson.id,
        data: {
          title: activeQuizLesson.title,
          content: updatedContent,
        },
      });
      setActiveQuizLesson(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (activeQuizLesson) {
    return (
      <QuizBuilder
        lesson={activeQuizLesson}
        onSave={handleSaveQuizContent}
        onBack={() => setActiveQuizLesson(null)}
      />
    );
  }

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case 'Video':
        return <Play size={14} className="text-gray-400 dark:text-zinc-500" />;
      case 'Article':
        return <FileText size={14} className="text-gray-400 dark:text-zinc-500" />;
      case 'Quiz':
        return <HelpCircle size={14} className="text-gray-400 dark:text-zinc-500" />;
      default:
        return <Play size={14} className="text-gray-400 dark:text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Course Curriculum</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Add, edit, or remove sections and lessons</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingSection(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Section
        </button>
      </div>

      {isLoadingSections ? (
        <div className="text-center py-8 text-sm text-gray-500 dark:text-zinc-400">Loading curriculum...</div>
      ) : (
        <div className="space-y-6">
          {isAddingSection && (
            <form onSubmit={handleAddSection} className="p-4 border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 rounded-lg flex items-center gap-3">
              <input
                type="text"
                required
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="New Section Title"
                className="flex-1 text-sm px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSection(false)}
                className="px-3 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </form>
          )}

          {sections.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-300 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-900/30">
              <p className="text-sm text-gray-500 dark:text-zinc-400">No sections added to this course yet.</p>
            </div>
          ) : (
            sections
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((section) => (
                <div
                  key={section.id}
                  className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-800/80 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      {editingSectionId === section.id ? (
                        <div className="flex items-center gap-2 max-w-md">
                          <input
                            type="text"
                            value={editingSectionTitle}
                            onChange={(e) => setEditingSectionTitle(e.target.value)}
                            className="text-xs px-2 py-1.5 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveSectionTitle(section.id)}
                            className="p-1.5 bg-violet-600 text-white rounded hover:bg-violet-700"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-xs">{section.title}</h4>
                          <span className="text-[10px] text-gray-400 mt-0.5">{section.lessons.length} lessons</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditSection(section)}
                        className="p-1.5 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"
                        title="Edit Section Name"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSection(section.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"
                        title="Delete Section"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveAddLessonSectionId(section.id);
                          setActiveEditLesson(null);
                        }}
                        className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold rounded"
                      >
                        <Plus size={12} />
                        Lesson
                      </button>
                    </div>
                  </div>

                  {/* Lessons list inside section */}
                  <div className="divide-y divide-gray-100 dark:divide-zinc-850">
                    {section.lessons
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((lesson) => (
                        <div key={lesson.id} className="p-3.5 flex items-center justify-between gap-4 text-xs font-semibold hover:bg-gray-50/50 dark:hover:bg-zinc-850/20">
                          {activeEditLesson?.id === lesson.id ? (
                            <div className="w-full">
                              <LessonEditor
                                initialValues={lesson}
                                onSubmit={(data) => handleEditLessonSubmit(lesson.id, data)}
                                onCancel={() => setActiveEditLesson(null)}
                                defaultOrderIndex={lesson.orderIndex}
                              />
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                {getLessonIcon(lesson.type)}
                                <span className="text-gray-700 dark:text-zinc-300">{lesson.title}</span>
                                {lesson.isFree && (
                                  <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 px-1 py-0.2 rounded font-bold uppercase">
                                    Free Preview
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                {lesson.type === 'Quiz' && (
                                  <button
                                    type="button"
                                    onClick={() => setActiveQuizLesson(lesson)}
                                    className="px-2 py-1 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 rounded font-bold text-[10px]"
                                  >
                                    Configure Quiz
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveEditLesson(lesson);
                                    setActiveAddLessonSectionId(null);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 rounded"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteLesson(lesson.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}

                    {/* Inline Form to Add Lesson */}
                    {activeAddLessonSectionId === section.id && (
                      <div className="p-4 bg-gray-50/50 dark:bg-zinc-900/20">
                        <LessonEditor
                          onSubmit={(data) => handleAddLessonSubmit(section.id, data)}
                          onCancel={() => setActiveAddLessonSectionId(null)}
                          defaultOrderIndex={section.lessons.length}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default CurriculumBuilder;
