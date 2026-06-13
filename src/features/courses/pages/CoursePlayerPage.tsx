import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import useCourse from '../hooks/useCourse';
import useCourses from '../hooks/useCourses';
import CoursePlayer from '../components/CoursePlayer';

export const CoursePlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { studentDashboard } = useCourses();
  const { course, isLoading } = useCourse(id);

  // Get enrollment matching courseId
  const enrollment = studentDashboard?.enrollments.find((e) => e.courseId === id);
  const enrollmentId = enrollment?.enrollmentId;

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="text-sm text-gray-500 dark:text-zinc-400">Loading classroom player...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-xs text-gray-550 dark:text-zinc-400 mt-2">
          Unable to load this course content. Make sure you are enrolled first.
        </p>
        <Link
          to={`/courses/${id}`}
          className="mt-6 inline-flex px-4 py-2 bg-violet-600 text-white font-bold text-xs rounded-lg hover:bg-violet-750"
        >
          View Details
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">
      {/* Classroom Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            to={`/courses/${id}`}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xs font-black text-gray-900 dark:text-white line-clamp-1">{course.title}</h1>
            <p className="text-[10px] text-gray-450 dark:text-zinc-550 mt-0.5">Classroom Learn Panel</p>
          </div>
        </div>
      </header>

      {/* Classroom Main Layout */}
      <div className="flex-1 p-4 lg:p-6">
        <CoursePlayer courseDetail={course} enrollmentId={enrollmentId} />
      </div>
    </div>
  );
};

export default CoursePlayerPage;
