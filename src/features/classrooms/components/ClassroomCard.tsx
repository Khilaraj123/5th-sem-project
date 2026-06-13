import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen } from 'lucide-react';
import type { Classroom } from '../types/classroom.types';

interface ClassroomCardProps {
  classroom: Classroom;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({ classroom }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
            {classroom.name}
          </h3>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
            classroom.isActive 
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
              : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400'
          }`}>
            {classroom.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
          {classroom.description || 'No description provided.'}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-4 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <Users size={16} />
          <span>{classroom.memberCount} members</span>
        </div>
        
        <Link
          to={`/classrooms/${classroom.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-all"
        >
          <BookOpen size={14} />
          View Class
        </Link>
      </div>
    </div>
  );
};

export default ClassroomCard;
