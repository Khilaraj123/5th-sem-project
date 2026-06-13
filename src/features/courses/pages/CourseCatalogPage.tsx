import React, { useState } from 'react';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import useCourses from '../hooks/useCourses';
import CourseCard from '../components/CourseCard';

export const CourseCatalogPage: React.FC = () => {
  const { courses, categories, isLoading } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Filter courses based on search term and selected category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // In our backend, does course have a categoryId or tags? Let's check tags or general matching.
    // If we filter by tags or categories, we can see. Let's see if Category Name matches any tags.
    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    const matchesCategory =
      !selectedCategoryId || 
      (selectedCategory && course.tags.some(t => t.toLowerCase() === selectedCategory.name.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Explore Courses</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Build new skills with online courses from industry instructors.
          </p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses by title or keywords..."
            className="w-full text-sm pl-11 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div className="flex items-center gap-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 rounded-xl">
          <SlidersHorizontal size={16} className="text-gray-400 dark:text-zinc-550" />
          <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">Filters</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-100 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={() => setSelectedCategoryId(null)}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0 border ${
            selectedCategoryId === null
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-650 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategoryId(category.id)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0 border ${
              selectedCategoryId === category.id
                ? 'bg-violet-600 border-violet-600 text-white'
                : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-650 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-900/50 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl bg-gray-50/20 dark:bg-zinc-900/10">
          <BookOpen className="mx-auto text-gray-300 dark:text-zinc-650 mb-3" size={48} />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">No courses found</h3>
          <p className="text-xs text-gray-550 dark:text-zinc-400 mt-1">
            Try adjusting your search criteria or choosing a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseCatalogPage;
