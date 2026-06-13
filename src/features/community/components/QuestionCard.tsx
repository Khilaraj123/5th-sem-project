import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MessageSquare, CheckCircle, User } from 'lucide-react';
import type { Question } from '../types/community.types';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <Link
            to={`/community/questions/${question.id}`}
            className="text-base font-bold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-1"
          >
            {question.title}
          </Link>
          {question.isAnswered && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle size={14} />
              Solved
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {question.body}
        </p>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {question.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 rounded-md font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-3 text-xs text-gray-400 mt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <ArrowUp size={14} className="text-gray-400" />
            <span>{question.upvoteCount} upvotes</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <MessageSquare size={14} className="text-gray-400" />
            <span>{question.answerCount} answers</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <User size={12} className="text-gray-300" />
          <span className="font-semibold text-gray-600 dark:text-zinc-400 max-w-[100px] truncate">
            {question.authorName || 'Anonymous'}
          </span>
          <span>•</span>
          <span>{new Date(question.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
