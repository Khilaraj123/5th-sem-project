import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, LayoutGrid, BarChart3, Save, Trash2, CheckCircle, ShieldAlert } from 'lucide-react';
import useCourse from '../hooks/useCourse';
import CurriculumBuilder from '../editor/CurriculumBuilder';
import type { CourseLevel, CourseStatus } from '../types/course.types';

export const EditCoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    course,
    isLoading,
    updateCourse,
    isUpdating,
    deleteCourse,
    statistics,
    progress,
  } = useCourse(id);

  // UI state
  const [activeTab, setActiveTab] = useState<'details' | 'curriculum' | 'analytics'>('details');

  // Metadata form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [level, setLevel] = useState<CourseLevel>('Beginner');
  const [status, setStatus] = useState<CourseStatus>('Draft');
  const [language, setLanguage] = useState('English');
  const [tagsString, setTagsString] = useState('');

  useEffect(() => {
    if (course) {
      setTitle(course.title || '');
      setDescription(course.description || '');
      setPrice(course.price || 0);
      setLevel(course.level || 'Beginner');
      setStatus(course.status || 'Draft');
      setLanguage(course.language || 'English');
      setTagsString(course.tags?.join(', ') || '');
    }
  }, [course]);

  const handleUpdateMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      await updateCourse({
        title,
        description,
        price,
        level,
        status,
        language,
        tags,
      });
      alert('Course details updated successfully.');
    } catch (error) {
      console.error('Failed to update course', error);
      alert('Error updating course details.');
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete this course? All sections, lessons and enrollments will be permanently deleted.')) {
      return;
    }

    try {
      await deleteCourse();
      navigate('/courses');
    } catch (error) {
      console.error('Failed to delete course', error);
      alert('Error deleting course.');
    }
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="text-sm text-gray-500 dark:text-zinc-400">Loading course manager...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Course Not Found</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
          Unable to locate the requested course.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-flex px-4 py-2 bg-violet-600 text-white font-bold text-xs rounded-lg hover:bg-violet-750"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to={`/courses/${id}`}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1">{course.title}</h1>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Instructor Management Dashboard</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDeleteCourse}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 dark:border-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg transition-colors"
        >
          <Trash2 size={14} />
          Delete Course
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors -mb-[2px] ${
            activeTab === 'details'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Edit2 size={14} />
          Edit Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors -mb-[2px] ${
            activeTab === 'curriculum'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <LayoutGrid size={14} />
          Build Curriculum
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors -mb-[2px] ${
            activeTab === 'analytics'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 size={14} />
          Course Analytics
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[50vh]">
        {activeTab === 'details' && (
          <form onSubmit={handleUpdateMetadata} className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-6 space-y-6 max-w-3xl">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
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
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CourseStatus)}
                    className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="Draft">Draft Mode</option>
                    <option value="Published">Published Live</option>
                    <option value="Archived">Archived</option>
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
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={tagsString}
                    onChange={(e) => setTagsString(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-150 dark:border-zinc-800">
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 hover:bg-violet-750 disabled:bg-violet-400 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                <Save size={16} />
                {isUpdating ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'curriculum' && (
          <div className="border border-gray-205 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-6">
            <CurriculumBuilder courseId={course.id} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Enrollments</span>
                <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                  {statistics?.totalEnrollments ?? 0}
                </div>
              </div>
              <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Students</span>
                <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                  {statistics?.activeStudents ?? 0}
                </div>
              </div>
              <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Completions</span>
                <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                  {statistics?.completedEnrollments ?? 0}
                </div>
              </div>
              <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Avg Progress</span>
                <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                  {statistics?.averageProgress ? Math.round(statistics.averageProgress) : 0}%
                </div>
              </div>
            </div>

            {/* Students Progress List */}
            <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Student Progress Roll</h3>
              
              {!progress || progress.students.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-gray-550 dark:text-zinc-450">No students enrolled in this course yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-200 dark:border-zinc-800/80 pb-2">
                        <th className="py-2.5">Student ID</th>
                        <th className="py-2.5">Enrolled Date</th>
                        <th className="py-2.5">Progress</th>
                        <th className="py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 dark:divide-zinc-850">
                      {progress.students.map((stud) => (
                        <tr key={stud.enrollmentId} className="text-gray-750 dark:text-zinc-350">
                          <td className="py-3.5 font-mono">{stud.studentId}</td>
                          <td className="py-3.5">{new Date(stud.enrolledAt).toLocaleDateString()}</td>
                          <td className="py-3.5">
                            <div className="flex items-center gap-2 max-w-xs">
                              <div className="w-24 bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-violet-650 h-full" style={{ width: `${stud.progressPercent}%` }} />
                              </div>
                              <span>{stud.progressPercent}%</span>
                            </div>
                          </td>
                          <td className="py-3.5">
                            {stud.isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-200/50">
                                <CheckCircle size={10} /> Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-200/50">
                                In Progress
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCoursePage;
