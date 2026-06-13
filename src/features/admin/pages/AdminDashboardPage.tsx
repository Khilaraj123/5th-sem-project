import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  ShieldAlert, 
  FileText, 
  UserCheck 
} from 'lucide-react';
import { getPlatformStats } from '../api/adminApi';
import type { PlatformStats } from '../types/admin.types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPlatformStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch platform metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-zinc-400">Loading admin dashboard statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <p className="text-red-500 font-semibold">{error || 'Failed to load dashboard.'}</p>
      </div>
    );
  }

  // Calculate percentages for visual charts
  const studentPercent = stats.totalUsers > 0 ? (stats.studentCount / stats.totalUsers) * 100 : 0;
  const instructorPercent = stats.totalUsers > 0 ? (stats.instructorCount / stats.totalUsers) * 100 : 0;
  const adminPercent = stats.totalUsers > 0 ? (stats.adminCount / stats.totalUsers) * 100 : 0;

  const coursePublishPercent = stats.totalCourses > 0 ? (stats.publishedCourses / stats.totalCourses) * 100 : 0;
  const enrollmentCompletionPercent = stats.totalEnrollments > 0 ? (stats.completedEnrollments / stats.totalEnrollments) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Global overview of EduLink platform-wide metrics and actions.
          </p>
        </div>
        
        {/* Navigation Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/moderation')}
            className="flex items-center gap-2 border border-gray-250 dark:border-zinc-750 hover:bg-gray-100 dark:hover:bg-zinc-850 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-150"
          >
            <ShieldAlert size={16} className="text-amber-500" />
            Content Moderation
          </button>
          <button
            onClick={() => navigate('/admin/audit-logs')}
            className="flex items-center gap-2 border border-gray-250 dark:border-zinc-750 hover:bg-gray-100 dark:hover:bg-zinc-850 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-150"
          >
            <FileText size={16} className="text-violet-500" />
            Platform Audit Logs
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 rounded-xl border border-violet-100 dark:border-violet-900">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Total Users</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalUsers}</span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">{stats.activeUsers} Active</span>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900">
            <BookOpen size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Courses</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalCourses}</span>
            <span className="text-[10px] text-blue-500 font-bold block mt-0.5">{stats.publishedCourses} Published</span>
          </div>
        </div>

        {/* Total Enrollments */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <GraduationCap size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Enrollments</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalEnrollments}</span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">{stats.completedEnrollments} Completed</span>
          </div>
        </div>

        {/* Verification Rate */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-100 dark:border-amber-900">
            <UserCheck size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Verified Users</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.verifiedUsers}</span>
            <span className="text-[10px] text-amber-500 font-bold block mt-0.5">
              {stats.totalUsers > 0 ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0}% Verification Rate
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Composition Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User Role Distribution</h2>
          
          <div className="space-y-5">
            {/* Student Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-500">Students</span>
                <span>{stats.studentCount} ({Math.round(studentPercent)}%)</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-zinc-800 h-3.5 rounded-full overflow-hidden">
                <div 
                  className="bg-violet-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${studentPercent}%` }}
                />
              </div>
            </div>

            {/* Instructor Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-500">Instructors</span>
                <span>{stats.instructorCount} ({Math.round(instructorPercent)}%)</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-zinc-800 h-3.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${instructorPercent}%` }}
                />
              </div>
            </div>

            {/* Admin Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-500">Administrators</span>
                <span>{stats.adminCount} ({Math.round(adminPercent)}%)</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-zinc-800 h-3.5 rounded-full overflow-hidden">
                <div 
                  className="bg-pink-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${adminPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Course Publishing Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Course Publishing Rate</h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-6">Percentage of created courses that are active.</p>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Circular gauge */}
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="64" cy="64" r="54" 
                  className="stroke-gray-100 dark:stroke-zinc-800 fill-none" 
                  strokeWidth="10" 
                />
                <circle 
                  cx="64" cy="64" r="54" 
                  className="stroke-blue-600 fill-none transition-all duration-500" 
                  strokeWidth="10" 
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - coursePublishPercent / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{Math.round(coursePublishPercent)}%</span>
                <span className="text-[9px] text-gray-400 block font-semibold uppercase">Published</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between border-t border-gray-100 dark:border-zinc-800 pt-4 text-xs font-semibold text-gray-500">
            <span>Total: {stats.totalCourses}</span>
            <span>Drafts/Archived: {stats.totalCourses - stats.publishedCourses}</span>
          </div>
        </div>

        {/* Enrollment Completion Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Course Completion Rate</h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-6">Ratio of completed student enrollments.</p>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="64" cy="64" r="54" 
                  className="stroke-gray-100 dark:stroke-zinc-800 fill-none" 
                  strokeWidth="10" 
                />
                <circle 
                  cx="64" cy="64" r="54" 
                  className="stroke-emerald-600 fill-none transition-all duration-500" 
                  strokeWidth="10" 
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - enrollmentCompletionPercent / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{Math.round(enrollmentCompletionPercent)}%</span>
                <span className="text-[9px] text-gray-400 block font-semibold uppercase">Finished</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between border-t border-gray-100 dark:border-zinc-800 pt-4 text-xs font-semibold text-gray-500">
            <span>Total: {stats.totalEnrollments}</span>
            <span>In-Progress: {stats.totalEnrollments - stats.completedEnrollments}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
