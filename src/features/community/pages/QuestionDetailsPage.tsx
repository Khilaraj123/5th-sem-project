import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, User } from 'lucide-react';
import { useQuestions } from '../hooks/useQuestions';
import { useAnswers } from '../hooks/useAnswers';
import { useAuth } from '../../auth/hooks/useAuth';
import AnswerList from '../components/AnswerList';
import AnswerForm from '../components/AnswerForm';

export const QuestionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { question, isLoadingDetails, errorDetails } = useQuestions(id);
  const {
    answers,
    isLoading: isLoadingAnswers,
    createAnswer,
    upvoteAnswer,
    acceptAnswer,
    deleteAnswer,
  } = useAnswers(id);

  if (isLoadingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-violet-600" size={36} />
        <span className="text-sm text-gray-400">Loading question details...</span>
      </div>
    );
  }

  if (errorDetails || !question) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-6 text-center max-w-md shadow-sm">
          <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
          <h3 className="font-bold text-red-900 dark:text-red-400 text-lg">Question not found</h3>
          <p className="text-xs text-red-700 dark:text-red-500 mt-1">
            {errorDetails?.message || 'The question you are trying to access does not exist.'}
          </p>
          <button
            onClick={() => navigate('/community')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 font-bold rounded-lg text-xs transition-all"
          >
            <ArrowLeft size={14} />
            Back to forum
          </button>
        </div>
      </div>
    );
  }

  const handlePostAnswer = async (content: string) => {
    await createAnswer({
      questionId: question.id,
      userId: user?.id || '',
      content,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">
      {/* Header banner */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 py-5">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => navigate('/community')}
            className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline mb-4"
          >
            <ArrowLeft size={16} />
            Back to forum
          </button>
          
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {question.isAnswered && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2.5 py-0.5 rounded-md">
                  <CheckCircle size={14} />
                  Solved
                </span>
              )}
              {question.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 rounded-md font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-2xl font-bold text-gray-950 dark:text-white leading-tight">
              {question.title}
            </h1>

            {/* Author Meta Info */}
            <div className="flex items-center gap-3 text-xs text-gray-400 border-t border-gray-100 dark:border-zinc-850 pt-4 mt-2">
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-gray-300" />
                <span className="font-semibold text-gray-700 dark:text-zinc-300">
                  {question.authorName || 'Anonymous'}
                </span>
              </div>
              <span>•</span>
              <span>Asked on {new Date(question.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{question.upvoteCount} upvotes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content body grid */}
      <div className="max-w-4xl mx-auto px-6 py-8 w-full flex-1 space-y-8">
        {/* Question Details Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {question.body}
          </p>
        </div>

        {/* Answers List */}
        {isLoadingAnswers ? (
          <div className="text-center py-6">
            <Loader2 className="animate-spin mx-auto text-violet-600 mb-2" size={24} />
            <span className="text-xs text-gray-400">Loading answers...</span>
          </div>
        ) : (
          <AnswerList
            answers={answers}
            questionAuthorId={question.authorId}
            isQuestionAnswered={question.isAnswered}
            onUpvote={upvoteAnswer}
            onAccept={acceptAnswer}
            onDelete={deleteAnswer}
          />
        )}

        {/* New Answer Composer */}
        <AnswerForm onPostAnswer={handlePostAnswer} />
      </div>
    </div>
  );
};

export default QuestionDetailsPage;
