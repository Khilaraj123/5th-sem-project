import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, MessageSquare, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import type { Review } from '../types/course.types';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(5, 'Review comments must be at least 5 characters'),
});

type ReviewFormInput = z.infer<typeof reviewSchema>;

interface ReviewListProps {
  reviews: Review[];
  onAddReview?: (rating: number, comment: string) => Promise<any>;
  onDeleteReview?: (id: string) => Promise<any>;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onAddReview,
  onDeleteReview,
}) => {
  const { user } = useAuth();
  const [ratingVal, setRatingVal] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  });

  const onSubmit = async (data: ReviewFormInput) => {
    setServerError(null);
    if (!onAddReview) return;
    try {
      await onAddReview(data.rating, data.comment);
      reset();
      setRatingVal(0);
    } catch (err: any) {
      setServerError('Failed to submit review. Try again.');
    }
  };

  const renderStars = (rating: number, clickable = false) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            onClick={() => {
              if (clickable) {
                setRatingVal(star);
                setValue('rating', star);
              }
            }}
            className={`${
              star <= (clickable ? ratingVal : rating)
                ? 'text-amber-500 fill-amber-500'
                : 'text-gray-300 dark:text-zinc-700'
            } ${clickable ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-2">
        Student Reviews ({reviews.length})
      </h3>

      {/* Write a Review section (if enrolled / logged in) */}
      {onAddReview && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm">Write a Review</h4>
          
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Clickable star ratings */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">Select Rating</label>
              {renderStars(0, true)}
              {errors.rating && (
                <p className="text-xs text-red-500">{errors.rating.message}</p>
              )}
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500" htmlFor="reviewcomment">Comments</label>
              <textarea
                id="reviewcomment"
                rows={3}
                placeholder="What did you think of the course? Was the instructor clear?..."
                className={`w-full px-4 py-2.5 bg-transparent border rounded-lg outline-none text-sm dark:text-white dark:border-zinc-800 focus:border-violet-600 resize-none ${
                  errors.comment ? 'border-red-500' : 'border-gray-200'
                }`}
                {...register('comment')}
              />
              {errors.comment && (
                <p className="text-xs text-red-500">{errors.comment.message}</p>
              )}
            </div>

            {serverError && (
              <p className="text-xs text-red-500 text-center">{serverError}</p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Posting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm">
            <MessageSquare className="mx-auto text-gray-300 mb-2" size={32} />
            <h4 className="font-semibold text-gray-700 dark:text-zinc-400 text-sm">No reviews yet</h4>
            <p className="text-xs text-gray-400 mt-1 px-4">
              Be the first to review this course and share your feedback!
            </p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3 relative group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 flex items-center justify-center font-bold text-xs">
                    {(rev.userName || 'Student').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-xs">
                      {rev.userName || 'Student'}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {renderStars(rev.rating)}

                {user?.id === rev.userId && onDeleteReview && (
                  <button
                    onClick={() => onDeleteReview(rev.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded transition-all absolute right-5 top-5 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete review"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewList;
