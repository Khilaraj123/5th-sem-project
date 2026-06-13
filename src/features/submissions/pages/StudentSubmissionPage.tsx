import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, Clock, FileDown, ShieldAlert, Award } from 'lucide-react';
import { getSubmissionById, downloadSubmissionFile } from '../api/submissionApi';

export const StudentSubmissionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: submission, isLoading, error } = useQuery({
    queryKey: ['submission', id],
    queryFn: () => getSubmissionById(id!),
    enabled: !!id,
  });

  const handleDownload = async () => {
    if (!id) return;
    try {
      const blob = await downloadSubmissionFile(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submission-${id}.txt`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error('Failed to download file', err);
      alert('Error downloading submission file.');
    }
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <span className="text-sm text-gray-500">Loading submission details...</span>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submission Not Found</h2>
        <p className="text-xs text-gray-550 dark:text-zinc-400 mt-2">
          This submission is unavailable or you do not have permission to view it.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex px-4 py-2 bg-violet-650 text-white font-bold text-xs rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">Submission Sheet</h1>
            <p className="text-xs text-gray-550 dark:text-zinc-400">Review student response content & grading details</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs font-bold rounded-lg transition-colors"
        >
          <FileDown size={14} />
          Download Content
        </button>
      </div>

      {/* Sheet details */}
      <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-100 dark:border-zinc-850 pb-5 text-xs">
          <div>
            <span className="text-gray-400 font-bold block uppercase tracking-wider mb-1">Student ID</span>
            <span className="font-mono text-gray-800 dark:text-zinc-200">{submission.studentId}</span>
          </div>

          <div>
            <span className="text-gray-400 font-bold block uppercase tracking-wider mb-1">Submitted Date</span>
            <span className="text-gray-800 dark:text-zinc-200">{new Date(submission.submittedAt).toLocaleString()}</span>
          </div>

          <div>
            <span className="text-gray-400 font-bold block uppercase tracking-wider mb-1">Status</span>
            {submission.isLate ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-red-650 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full border border-red-200/50">
                <Clock size={10} /> Late
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-250">
                <CheckCircle size={10} /> On Time
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">Answer Content:</h3>
          <div className="p-4 border border-gray-100 dark:border-zinc-850 bg-gray-50/50 dark:bg-zinc-900/50 rounded-xl">
            <p className="text-sm text-gray-750 dark:text-zinc-350 leading-relaxed whitespace-pre-wrap italic">
              "{submission.content || submission.textContent}"
            </p>
          </div>
        </div>

        {/* Grade info */}
        {submission.score !== null && submission.score !== undefined ? (
          <div className="p-5 border border-violet-200 dark:border-violet-950/30 bg-violet-50/10 dark:bg-violet-950/5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Award className="text-violet-650" size={20} />
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Graded Evaluation</h4>
            </div>

            <div className="space-y-3.5 pt-2 text-xs">
              <div>
                <span className="text-gray-400 font-bold block uppercase tracking-wider mb-1">Score Awarded</span>
                <span className="text-xl font-black text-gray-900 dark:text-white">{submission.score} Points</span>
              </div>

              {submission.feedback && (
                <div>
                  <span className="text-gray-400 font-bold block uppercase tracking-wider mb-1">Instructor Comments</span>
                  <p className="text-xs text-gray-750 dark:text-zinc-350 leading-relaxed italic">
                    "{submission.feedback}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-400 italic">
            This submission is pending review by the course instructor.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSubmissionPage;
