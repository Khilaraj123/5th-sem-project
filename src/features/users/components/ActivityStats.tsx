import React from 'react';
import { BookOpen, Award, MessageSquare, CheckSquare, GraduationCap } from 'lucide-react';
import type { UserActivity } from '../types/user.types';

interface ActivityStatsProps {
  activity?: UserActivity;
  isLoading: boolean;
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({ activity, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="text-center py-8 text-sm text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
        No activity statistics available.
      </div>
    );
  }

  const stats = [
    {
      label: 'Course Enrollments',
      value: activity.courseEnrollments,
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400',
    },
    {
      label: 'Certificates Earned',
      value: activity.certificatesEarned,
      icon: Award,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400',
    },
    {
      label: 'Questions Asked',
      value: activity.questionsAsked,
      icon: MessageSquare,
      color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/30 dark:text-violet-400',
    },
    {
      label: 'Answers Given',
      value: activity.answersGiven,
      icon: CheckSquare,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400',
    },
  ];

  // If instructor or admin, we also show Courses Created
  if (activity.coursesCreated > 0) {
    stats.push({
      label: 'Courses Created',
      value: activity.coursesCreated,
      icon: BookOpen,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400',
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </div>
            <div className={`p-2.5 rounded-lg ${stat.color}`}>
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityStats;
