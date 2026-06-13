import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, MessageSquare, Loader2, AlertCircle, Home, LogOut, Tags } from 'lucide-react';
import { useQuestions } from '../hooks/useQuestions';
import { useAuth } from '../../auth/hooks/useAuth';
import QuestionCard from '../components/QuestionCard';
import NotificationBell from '../../notifications/components/NotificationBell';

const askQuestionSchema = z.object({
  title: z.string().min(5, 'Question title must be at least 5 characters').max(150, 'Title cannot exceed 150 characters'),
  content: z.string().min(10, 'Please explain your question in at least 10 characters'),
  tags: z.string().optional(),
});

type AskQuestionForm = z.infer<typeof askQuestionSchema>;

export const CommunityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { questions, isLoading, error, createQuestion } = useQuestions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AskQuestionForm>({
    resolver: zodResolver(askQuestionSchema),
    defaultValues: { title: '', content: '', tags: '' },
  });

  const onSubmit = async (data: AskQuestionForm) => {
    setModalError(null);
    try {
      const tagArray = data.tags
        ? data.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
        : [];

      await createQuestion({
        userId: user?.id || '',
        title: data.title,
        content: data.content,
        scope: 'Global',
        tags: tagArray,
      });
      reset();
      setIsModalOpen(false);
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to post question.');
    }
  };

  // Extract all unique tags for filter sidebar
  const allTags = Array.from(
    new Set(questions.flatMap((q) => q.tags || []))
  ).slice(0, 10);

  // Filter questions list by search query and selected tag
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (q.tags && q.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header bar */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 py-4 px-6 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/classrooms')}>
          <Home className="text-violet-600" size={22} />
          <span className="font-bold text-xl text-gray-900 dark:text-white">EduLink Community</span>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationBell />
          <div className="text-right hidden sm:block">
            <div className="font-semibold text-sm text-gray-900 dark:text-white">{user?.name}</div>
            <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main body */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Questions List & Search */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Q&A Forum</h2>
              <p className="text-sm text-gray-400 mt-1">Ask questions, share answers, and collaborate.</p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition-all self-start"
            >
              <Plus size={16} />
              Ask a Question
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-1 shadow-sm">
            <Search className="text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search questions by keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none py-2 px-3 text-sm text-gray-950 dark:text-white"
            />
          </div>

          {/* Loading / Error States */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-violet-600" size={36} />
              <span className="text-sm text-gray-400">Loading questions...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-4 text-center flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={24} />
              <div className="text-left">
                <h3 className="font-semibold text-red-900 dark:text-red-400">Failed to load questions</h3>
                <p className="text-xs text-red-700 dark:text-red-500 mt-0.5">{error.message}</p>
              </div>
            </div>
          )}

          {/* Questions Grid */}
          {!isLoading && !error && (
            <>
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm">
                  <MessageSquare className="mx-auto text-gray-300 mb-2" size={40} />
                  <h3 className="font-bold text-gray-700 dark:text-zinc-400">No questions found</h3>
                  <p className="text-xs text-gray-400 mt-1 px-4">
                    Be the first to ask a question to start the conversation!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Side: Filters / Tags List */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-2">
              <Tags size={16} className="text-violet-600" />
              Popular Tags
            </h3>
            
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedTag === null
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-750'
                }`}
              >
                All tags
              </button>
              
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                    selectedTag === tag
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-750'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Popup (Ask Question) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ask a Question</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500" htmlFor="qtitle">Question Title</label>
                <input
                  id="qtitle"
                  type="text"
                  placeholder="e.g. How to use Axios interceptors in React?"
                  className={`w-full px-4 py-2.5 bg-transparent border rounded-lg outline-none text-sm dark:text-white dark:border-zinc-800 focus:border-violet-600 ${
                    errors.title ? 'border-red-500' : 'border-gray-200'
                  }`}
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500" htmlFor="qbody">Body Explanation</label>
                <textarea
                  id="qbody"
                  rows={5}
                  placeholder="Describe your issue with context, error logs, or code snippets..."
                  className={`w-full px-4 py-3 bg-transparent border rounded-lg outline-none text-sm dark:text-white dark:border-zinc-800 focus:border-violet-600 resize-none ${
                    errors.content ? 'border-red-500' : 'border-gray-200'
                  }`}
                  {...register('content')}
                />
                {errors.content && (
                  <p className="text-xs text-red-500">{errors.content.message}</p>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500" htmlFor="qtags">Tags (Comma-separated)</label>
                <input
                  id="qtags"
                  type="text"
                  placeholder="react, axios, typescript"
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 dark:border-zinc-800 rounded-lg outline-none text-sm dark:text-white focus:border-violet-600"
                  {...register('tags')}
                />
              </div>

              {modalError && (
                <p className="text-xs text-red-500 text-center">{modalError}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition-all"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDashboard;
