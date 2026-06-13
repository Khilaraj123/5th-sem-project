import React, { useState } from 'react';
import { PlayCircle, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import type { Lesson } from '../types/lesson.types';

interface LessonVideoProps {
  lesson: Lesson;
  isCompleted: boolean;
  onComplete: () => Promise<any>;
}

export const LessonVideo: React.FC<LessonVideoProps> = ({
  lesson,
  isCompleted,
  onComplete,
}) => {
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const renderPlayer = () => {
    switch (lesson.type) {
      case 'Video':
        return (
          <div className="bg-black aspect-video w-full rounded-xl overflow-hidden relative flex items-center justify-center">
            {lesson.videoUrl ? (
              <video
                src={lesson.videoUrl}
                controls
                className="w-full h-full object-contain"
                onEnded={onComplete}
              />
            ) : (
              <div className="text-center text-gray-500">
                <PlayCircle size={48} className="mx-auto mb-2 text-zinc-700" />
                <p className="text-sm font-semibold">Video source missing.</p>
                <button
                  onClick={onComplete}
                  className="mt-3 px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg text-xs transition-all"
                >
                  Mark lesson as completed
                </button>
              </div>
            )}
          </div>
        );

      case 'Article':
        return (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
              <FileText className="text-violet-600" size={20} />
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Reading Lesson</h3>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {lesson.content || 'This lesson does not contain any article content.'}
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onComplete}
                disabled={isCompleted}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all border ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/50'
                    : 'bg-violet-600 text-white border-violet-600 hover:bg-violet-700'
                }`}
              >
                <CheckCircle size={16} />
                {isCompleted ? 'Completed' : 'Mark as Completed'}
              </button>
            </div>
          </div>
        );

      case 'Quiz':
        return (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
              <HelpCircle className="text-violet-600" size={20} />
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Lesson Quiz</h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {lesson.content || 'Select the correct answer to complete this quiz.'}
            </p>

            {quizSubmitted || isCompleted ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 text-center">
                <CheckCircle className="mx-auto text-emerald-500 mb-2" size={28} />
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-400">Quiz Completed!</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">
                  You scored 100% on this assessment.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-850 p-3 rounded-lg cursor-pointer">
                    <input type="radio" name="quiz" className="w-4 h-4 text-violet-600" />
                    <span className="text-sm text-gray-700 dark:text-zinc-300">Option A</span>
                  </label>
                  <label className="flex items-center gap-3 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-850 p-3 rounded-lg cursor-pointer">
                    <input type="radio" name="quiz" className="w-4 h-4 text-violet-600" />
                    <span className="text-sm text-gray-700 dark:text-zinc-300">Option B</span>
                  </label>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(true);
                      onComplete();
                    }}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg text-sm transition-all"
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 w-full">
      {renderPlayer()}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{lesson.title}</h2>
    </div>
  );
};

export default LessonVideo;
