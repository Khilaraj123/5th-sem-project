import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, ArrowLeft } from 'lucide-react';
import type { Lesson } from '../types/lesson.types';

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

interface QuizBuilderProps {
  lesson: Lesson;
  onSave: (updatedContent: string) => Promise<void>;
  onBack: () => void;
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({
  lesson,
  onSave,
  onBack,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load questions from lesson content
  useEffect(() => {
    if (lesson.content) {
      try {
        const parsed = JSON.parse(lesson.content);
        if (Array.isArray(parsed)) {
          setQuestions(parsed);
        } else {
          setQuestions([]);
        }
      } catch {
        // Content might not be JSON yet (e.g. empty or placeholder text)
        setQuestions([]);
      }
    } else {
      setQuestions([]);
    }
  }, [lesson]);

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].questionText = text;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = text;
    setQuestions(updated);
  };

  const handleCorrectIndexChange = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].correctOptionIndex = oIndex;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) return; // Keep at least 2 options
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
    if (updated[qIndex].correctOptionIndex >= updated[qIndex].options.length) {
      updated[qIndex].correctOptionIndex = 0;
    }
    setQuestions(updated);
  };

  const handleSaveQuiz = async () => {
    setIsSaving(true);
    try {
      const serialized = JSON.stringify(questions);
      await onSave(serialized);
    } catch (error) {
      console.error('Failed to save quiz', error);
      alert('Failed to save quiz. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Quiz Builder</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Configure questions for: {lesson.title}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSaveQuiz}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Check size={16} />
            {isSaving ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-300 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-900/30">
            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">No questions created yet for this quiz.</p>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-violet-300 dark:border-violet-850 hover:bg-violet-50 dark:hover:bg-violet-950/20 text-violet-600 dark:text-violet-400 text-xs font-bold rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Your First Question
            </button>
          </div>
        ) : (
          questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="p-5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">
                    Question {qIndex + 1}
                  </label>
                  <input
                    type="text"
                    required
                    value={question.questionText}
                    onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="Enter the question text..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIndex)}
                  className="mt-6 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 rounded-lg transition-colors"
                  title="Delete Question"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400">
                  Options (Select the correct answer option)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {question.options.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      className="flex items-center gap-2 border border-gray-200 dark:border-zinc-800 p-2 rounded-lg bg-gray-50/50 dark:bg-zinc-900/50"
                    >
                      <input
                        type="radio"
                        name={`q-${qIndex}-correct`}
                        checked={question.correctOptionIndex === oIndex}
                        onChange={() => handleCorrectIndexChange(qIndex, oIndex)}
                        className="text-violet-600 focus:ring-violet-500 shrink-0"
                      />
                      <input
                        type="text"
                        required
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        className="flex-1 text-xs px-2 py-1 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-violet-500 focus:outline-none text-gray-900 dark:text-white"
                        placeholder={`Option ${oIndex + 1}`}
                      />
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(qIndex, oIndex)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-start pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddOption(qIndex)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    <Plus size={12} />
                    Add Option
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {questions.length > 0 && (
          <div className="flex justify-center border-t border-gray-100 dark:border-zinc-855 pt-4">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Another Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizBuilder;
