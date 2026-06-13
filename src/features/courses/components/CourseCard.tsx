import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Tag } from 'lucide-react';
import type { Course } from '../types/course.types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} mins`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Thumbnail placeholder */}
      <div className="bg-gray-100 dark:bg-zinc-800 aspect-video flex items-center justify-center text-gray-400 select-none border-b border-gray-100 dark:border-zinc-850">
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen size={40} className="text-gray-300 dark:text-zinc-600" />
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 rounded">
              {course.level}
            </span>
            <span className="text-xs text-gray-400 capitalize">{course.language}</span>
          </div>

          <Link
            to={`/courses/${course.id}`}
            className="block text-base font-bold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-2"
          >
            {course.title}
          </Link>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-4 mt-2">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formatDuration(course.totalDurationSeconds)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag size={14} />
              <span>{course.price > 0 ? `$${course.price}` : 'Free'}</span>
            </div>
          </div>

          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-all"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
