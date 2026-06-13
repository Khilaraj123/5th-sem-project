import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Star, Award, ShieldAlert, Check } from 'lucide-react';
import useCourse from '../hooks/useCourse';
import useCourses from '../hooks/useCourses';
import useAuth from '../../auth/hooks/useAuth';
import ReviewList from '../components/ReviewList';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { studentDashboard } = useCourses();
  
  const {
    course,
    isLoading,
    sections,
    reviews,
    addReview,
    enrollInCourse,
    isEnrolling,
  } = useCourse(id);

  // Check enrollment status
  const enrollment = studentDashboard?.enrollments.find((e) => e.courseId === id);
  const isEnrolled = !!enrollment;
  const isInstructor = user?.role === 'instructor' && course?.instructorId === user.id;

  const [activeTab, setActiveTab] = useState<'curriculum' | 'reviews'>('curriculum');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (!id || !course) return;

    if (course.price > 0) {
      navigate(`/checkout/${id}`);
      return;
    }

    try {
      await enrollInCourse(user.id);
      // Re-route to course learning page
      navigate(`/courses/${id}/learn`);
    } catch (error) {
      console.error('Failed to enroll', error);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !comment.trim()) return;

    setIsSubmittingReview(true);
    try {
      await addReview({
        rating,
        comment,
        userId: user.id,
      });
      setComment('');
      setRating(5);
    } catch (error) {
      console.error('Failed to add review', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-pulse">
        <div className="h-60 bg-gray-150 dark:bg-zinc-900 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-80 bg-gray-150 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-80 bg-gray-150 dark:bg-zinc-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Course Not Found</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
          The course you are looking for might have been removed or is unavailable.
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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours} hours ${minutes} mins`;
    return `${minutes} mins`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Course Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="w-full md:w-1/3 aspect-video bg-gray-100 dark:bg-zinc-850 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-gray-200/50 dark:border-zinc-800">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <BookOpen size={48} className="text-gray-300 dark:text-zinc-700" />
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 px-2.5 py-1 rounded-md">
              {course.level}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-650 dark:text-zinc-350 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
              {course.language}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
            {course.title}
          </h1>

          <p className="text-sm text-gray-550 dark:text-zinc-400 leading-relaxed max-w-3xl">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>{formatDuration(course.totalDurationSeconds)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={16} className="text-amber-500 fill-amber-500" />
              <span>{reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'No reviews'} ({reviews.length} reviews)</span>
            </div>
            {course.instructorName && (
              <div className="flex items-center gap-1.5">
                <Award size={16} className="text-violet-500" />
                <span>Instructor: {course.instructorName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Content Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-gray-250 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab('curriculum')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors -mb-[2px] ${
                activeTab === 'curriculum'
                  ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Course Curriculum
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors -mb-[2px] ${
                activeTab === 'reviews'
                  ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'curriculum' ? (
            <div className="space-y-4">
              {sections.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/20 dark:bg-zinc-900/10">
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Curriculum details not added yet.</p>
                </div>
              ) : (
                sections
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((section) => (
                    <div
                      key={section.id}
                      className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden"
                    >
                      <div className="px-5 py-3.5 bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-800/80 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-xs">{section.title}</h4>
                          <span className="text-[10px] text-gray-400">{section.lessons.length} lessons</span>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-100 dark:divide-zinc-850">
                        {section.lessons
                          .sort((a, b) => a.orderIndex - b.orderIndex)
                          .map((lesson) => (
                            <div
                              key={lesson.id}
                              className="px-5 py-3 flex items-center justify-between text-xs text-gray-650 dark:text-zinc-350"
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen size={14} className="text-gray-400" />
                                <span>{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {lesson.isFree && (
                                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1 py-0.2 rounded border border-emerald-100 dark:border-emerald-900/30">
                                    Preview
                                  </span>
                                )}
                                <span className="text-gray-400">{Math.round(lesson.durationInSeconds / 60)}m</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Write review form (only if enrolled) */}
              {isEnrolled && (
                <form onSubmit={handleReviewSubmit} className="p-5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 space-y-4">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Leave a Review</h4>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-amber-500 focus:outline-none"
                        >
                          <Star size={20} className={star <= rating ? 'fill-amber-500' : 'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 mb-1">Comment</label>
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="w-full text-xs px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                      placeholder="Write your thoughts about this course..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-750 disabled:bg-violet-400 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              <ReviewList reviews={reviews} />
            </div>
          )}
        </div>

        {/* Right column: Sticky Side Card */}
        <div className="border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-6 space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs text-gray-400">Course Price</span>
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              {course.price > 0 ? `$${course.price}` : 'Free'}
            </div>
          </div>

          <div className="space-y-3.5 border-t border-gray-100 dark:border-zinc-855 pt-5">
            {isInstructor ? (
              <Link
                to={`/courses/${id}/edit`}
                className="w-full block py-2.5 text-center bg-zinc-900 hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Manage & Edit Course
              </Link>
            ) : isEnrolled ? (
              <Link
                to={`/courses/${id}/learn`}
                className="w-full block py-2.5 text-center bg-violet-600 hover:bg-violet-750 text-white text-xs font-bold rounded-xl transition-all"
              >
                Go to Classroom
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-750 disabled:bg-violet-400 text-white text-xs font-bold rounded-xl transition-all"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll in Course'}
              </button>
            )}

            <div className="text-[10px] text-gray-400 text-center leading-relaxed">
              * 30-day money-back guarantee. Instant lifetime access.
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-zinc-855 pt-5 space-y-3">
            <h5 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">This course includes:</h5>
            <ul className="space-y-2 text-xs text-gray-650 dark:text-zinc-350">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-violet-500" />
                <span>Full lifetime access</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-violet-500" />
                <span>Access on mobile and desktop</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-violet-500" />
                <span>Certificate of completion</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
