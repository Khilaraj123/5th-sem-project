import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useMySubmission, useSubmissionActions } from '../hooks/useSubmissions';
import useAuth from '../../auth/hooks/useAuth';

interface SubmissionComposerProps {
  assignmentId: string;
  maxScore: number;
  dueDate: string;
  allowLate: boolean;
}

export const SubmissionComposer: React.FC<SubmissionComposerProps> = ({
  assignmentId,
  maxScore,
  dueDate,
  allowLate,
}) => {
  const { user } = useAuth();
  const { mySubmission, isLoading } = useMySubmission(assignmentId);
  const { submitAssignment, isSubmitting } = useSubmissionActions(assignmentId);

  const [submissionContent, setSubmissionContent] = useState('');

  const isPastDue = new Date(dueDate).getTime() < new Date().getTime();

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !submissionContent.trim()) return;

    try {
      await submitAssignment({
        assignmentId,
        studentId: user.id,
        contentType: 0, // 'Text'
        content: submissionContent,
        textContent: submissionContent,
      });
      setSubmissionContent('');
      alert('Assignment turned in successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit assignment.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="h-20 bg-gray-200 dark:bg-zinc-800 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Your Work</h4>
        {mySubmission ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250">
            Turned In
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-650 bg-amber-50 dark:bg-amber-950/20 border border-amber-250">
            Assigned
          </span>
        )}
      </div>

      {mySubmission ? (
        <div className="space-y-4">
          <div className="p-3.5 border border-gray-200 dark:border-zinc-850 rounded-xl bg-gray-50/50 dark:bg-zinc-900/50 space-y-2">
            <span className="text-[10px] text-gray-400 font-bold block uppercase">Submitted Answer:</span>
            <p className="text-xs text-gray-750 dark:text-zinc-350 whitespace-pre-wrap italic">
              "{mySubmission.content || mySubmission.textContent}"
            </p>
            <span className="text-[9px] text-gray-400 block pt-1">
              Submitted: {new Date(mySubmission.submittedAt).toLocaleString()}
            </span>
          </div>

          {mySubmission.score !== null && mySubmission.score !== undefined ? (
            <div className="p-4 border border-violet-200 dark:border-violet-950/30 rounded-xl bg-violet-50/20 dark:bg-violet-950/10 space-y-2">
              <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block">Graded Score</span>
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {mySubmission.score} <span className="text-sm font-semibold text-gray-400">/ {maxScore}</span>
              </div>
              {mySubmission.feedback && (
                <div className="border-t border-violet-100 dark:border-violet-950/40 pt-2 mt-2">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Feedback:</span>
                  <p className="text-xs text-gray-755 dark:text-zinc-300 italic mt-0.5">"{mySubmission.feedback}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-400 italic text-center">Pending instructor grade...</div>
          )}
        </div>
      ) : (
        <form onSubmit={handleStudentSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 mb-1">
              Compose Text Submission
            </label>
            <textarea
              required
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              rows={5}
              className="w-full text-xs px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Write your assignment essay, text, or links here..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (isPastDue && !allowLate)}
            className="w-full py-2 bg-violet-600 hover:bg-violet-750 disabled:bg-violet-400 text-white text-xs font-bold rounded-lg transition-colors shadow-sm animate-none"
          >
            {isSubmitting ? 'Turning In...' : 'Turn In Work'}
          </button>

          {isPastDue && !allowLate && (
            <div className="flex gap-2 items-center bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/35 p-2 rounded text-[10px] text-red-750 dark:text-red-300">
              <AlertTriangle size={12} className="shrink-0" />
              <span>Submissions closed. Deadline passed.</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default SubmissionComposer;
