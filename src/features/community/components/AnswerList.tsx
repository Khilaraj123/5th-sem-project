import React from 'react';
import { ArrowUp, CheckCircle, Trash2, User, Award } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import type { Answer } from '../types/community.types';

interface AnswerListProps {
  answers: Answer[];
  questionAuthorId: string;
  isQuestionAnswered: boolean;
  onUpvote: (id: string) => Promise<any>;
  onAccept?: (id: string) => Promise<any>;
  onDelete?: (id: string) => Promise<any>;
}

export const AnswerList: React.FC<AnswerListProps> = ({
  answers,
  questionAuthorId,
  isQuestionAnswered,
  onUpvote,
  onAccept,
  onDelete,
}) => {
  const { user } = useAuth();

  const isCurrentUserQuestionAuthor = user?.id === questionAuthorId;
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  const renderAnswerCard = (ans: Answer) => {
    const isAnswerAuthor = user?.id === ans.authorId;
    const canDelete = isAnswerAuthor || isInstructor;
    const canAccept = isCurrentUserQuestionAuthor && !isQuestionAnswered && onAccept;

    const authorInitials = (ans.authorName || 'User')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <div
        key={ans.id}
        className={`p-5 rounded-xl border transition-all ${
          ans.isAccepted
            ? 'bg-emerald-50/20 border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-900/50'
            : 'bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-800'
        } relative group space-y-3`}
      >
        {/* Accepted Badge */}
        {ans.isAccepted && (
          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-md">
            <Award size={14} />
            Accepted Answer
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 flex items-center justify-center font-bold text-sm">
              {authorInitials}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {ans.authorName || 'Contributor'}
              </div>
              <div className="text-xs text-gray-400">
                Answered {new Date(ans.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canAccept && (
              <button
                type="button"
                onClick={() => onAccept(ans.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all"
              >
                <CheckCircle size={12} />
                Accept Answer
              </button>
            )}

            {canDelete && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(ans.id)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete answer"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {ans.body}
        </p>

        {/* Footer controls: upvoting */}
        <div className="flex items-center gap-3 pt-1 border-t border-gray-50 dark:border-zinc-800/50 mt-2">
          <button
            type="button"
            onClick={() => onUpvote(ans.id)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
          >
            <ArrowUp size={14} />
            <span>{ans.upvoteCount} Upvotes</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-2">
        Answers ({answers.length})
      </h3>

      {answers.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <User className="mx-auto text-gray-300 mb-2" size={32} />
          <h4 className="font-semibold text-gray-700 dark:text-zinc-400 text-sm">No answers posted yet</h4>
          <p className="text-xs text-gray-400 mt-1 px-4">
            Be the first to share your knowledge by posting an answer below!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Put accepted answer first */}
          {[...answers]
            .sort((a, b) => (b.isAccepted ? 1 : 0) - (a.isAccepted ? 1 : 0))
            .map(renderAnswerCard)}
        </div>
      )}
    </div>
  );
};

export default AnswerList;
