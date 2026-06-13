import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import useCourses from '../hooks/useCourses';
import useAuth from '../../auth/hooks/useAuth';
import type { CourseLevel } from '../types/course.types';

export const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createCourse, categories, isCreating } = useCourses();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [level, setLevel] = useState<CourseLevel>('Beginner');
  const [language, setLanguage] = useState('English');
  const [tagsString, setTagsString] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    // Build tags array
    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (selectedCategoryName) {
      tags.push(selectedCategoryName);
    }

    try {
      const newCourse = await createCourse({
        title,
        description,
        instructorId: user.id,
        price,
        level,
        language,
        tags,
      });

      // Redirect to edit page so instructor can build curriculum
      navigate(`/courses/${newCourse.id}/edit`);
    } catch (error) {
      console.error('Failed to create course', error);
      alert('Error creating course. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-150 dark:border-zinc-800 pb-4">
        <Link
          to="/courses"
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Create New Course</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Setup your course metadata & configuration</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="e.g. Complete React & TypeScript Guide 2026"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-855 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Write a brief overview describing what students will learn in this course..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Price (USD)</label>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Course Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CourseLevel)}
                className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="Beginner">Beginner Level</option>
                <option value="Intermediate">Intermediate Level</option>
                <option value="Advanced">Advanced Level</option>
                <option value="AllLevels">All Levels</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Language</label>
              <input
                type="text"
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="e.g. English, Spanish"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Category</label>
              <select
                value={selectedCategoryName}
                onChange={(e) => setSelectedCategoryName(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Tags (Comma separated)</label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="e.g. webdev, react, frontend"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-150 dark:border-zinc-800 pt-4">
          <Link
            to="/courses"
            className="px-4 py-2.5 border border-gray-350 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 hover:bg-violet-750 disabled:bg-violet-400 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <Check size={16} />
            {isCreating ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage;
