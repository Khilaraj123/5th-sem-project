import React, { useState, useEffect } from 'react';
import type { Lesson, LessonType } from '../types/lesson.types';

interface LessonEditorProps {
  initialValues?: Partial<Lesson>;
  onSubmit: (data: {
    title: string;
    type: LessonType;
    content: string;
    videoUrl?: string | null;
    durationInSeconds: number;
    isFree: boolean;
    orderIndex: number;
  }) => void;
  onCancel: () => void;
  defaultOrderIndex?: number;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  defaultOrderIndex = 0,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<LessonType>('Video');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [orderIndex, setOrderIndex] = useState(defaultOrderIndex);

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setType(initialValues.type || 'Video');
      setContent(initialValues.content || '');
      setVideoUrl(initialValues.videoUrl || '');
      setDurationMinutes(Math.round((initialValues.durationInSeconds || 0) / 60));
      setIsFree(initialValues.isFree || false);
      setOrderIndex(initialValues.orderIndex ?? defaultOrderIndex);
    }
  }, [initialValues, defaultOrderIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      type,
      content,
      videoUrl: type === 'Video' ? videoUrl : null,
      durationInSeconds: durationMinutes * 60,
      isFree,
      orderIndex,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-zinc-900/50 p-5 rounded-lg border border-gray-200 dark:border-zinc-800">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
        {initialValues ? 'Edit Lesson' : 'Add New Lesson'}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">Lesson Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            placeholder="e.g. Introduction to React"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">Lesson Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LessonType)}
            className="w-full text-sm px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="Video">Video Lesson</option>
            <option value="Article">Article (Text) Lesson</option>
            <option value="Quiz">Interactive Quiz</option>
          </select>
        </div>
      </div>

      {type === 'Video' && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">Video URL (YouTube / Vimeo / MP4)</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full text-sm px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            placeholder="e.g. https://www.youtube.com/watch?v=..."
          />
        </div>
      )}

      {type === 'Article' && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">Article Content (Markdown supported)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full text-sm px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
            placeholder="Write lesson text or markdown content here..."
          />
        </div>
      )}

      {type === 'Quiz' && (
        <div className="bg-amber-50/20 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 p-3 rounded text-xs text-amber-800 dark:text-amber-300">
          <strong>Interactive Quiz Note:</strong> You can edit quiz questions using the Quiz Builder after saving this lesson. Use the text content box below for initial instructions/description for the quiz.
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="w-full text-sm mt-2 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            placeholder="e.g. Test your knowledge on module 1 topics!"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">Duration (Minutes)</label>
          <input
            type="number"
            min="0"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
            className="w-full text-sm px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">Sort Order (Index)</label>
          <input
            type="number"
            min="0"
            value={orderIndex}
            onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
            className="w-full text-sm px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="rounded text-violet-600 focus:ring-violet-500"
            />
            <span>Free Preview Lesson</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-gray-200 dark:border-zinc-800 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded transition-colors"
        >
          {initialValues ? 'Save Changes' : 'Create Lesson'}
        </button>
      </div>
    </form>
  );
};

export default LessonEditor;
