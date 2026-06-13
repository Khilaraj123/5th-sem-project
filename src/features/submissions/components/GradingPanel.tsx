import React, { useState } from 'react';
import { Save, FileDown } from 'lucide-react';
import { useSubmissionActions } from '../hooks/useSubmissions';
import { downloadSubmissionFile } from '../api/submissionApi';
import type { Submission } from '../types/submission.types';

interface GradingPanelProps {
  submission: Submission;
  maxScore: number;
  onClose: () => void;
  assignmentId: string;
}

export const GradingPanel: React.FC<GradingPanelProps> = ({
  submission,
  maxScore,
  onClose,
  assignmentId,
}) => {
  const { gradeSubmission, isGrading } = useSubmissionActions(assignmentId);

  const [score, setScore] = useState<number>(submission.score || 0);
  const [feedback, setFeedback] = useState(submission.feedback || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (score > maxScore) {
      alert(`Score cannot exceed the maximum score of ${maxScore}.`);
      return;
    }

    try {
      await gradeSubmission({
        submissionId: submission.id,
        score,
        feedback,
      });
      alert('Submission graded successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to grade submission.');
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadSubmissionFile(submission.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submission-${submission.id}.txt`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error('Failed to download file', err);
      alert('Error downloading submission file.');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-805 rounded-2xl p-6 space-y-5 shadow-lg">
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-850 pb-3">
        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Grading Panel</h4>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1 px-2.5 py-1 border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-[10px] rounded font-bold transition-colors"
          title="Download Text Submission"
        >
          <FileDown size={12} />
          Download Content
        </button>
      </div>

      <div className="space-y-4">
        {/* Submitted Content preview */}
        <div className="p-3.5 border border-gray-100 dark:border-zinc-850 bg-gray-50/50 dark:bg-zinc-900/50 rounded-xl">
          <span className="text-[10px] text-gray-400 font-bold block uppercase">Submitted Answer:</span>
          <p className="text-xs text-gray-700 dark:text-zinc-300 italic whitespace-pre-wrap mt-1">
            "{submission.content || submission.textContent}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">
              Score (out of {maxScore})
            </label>
            <input
              type="number"
              required
              min="0"
              max={maxScore}
              step="0.5"
              value={score}
              onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
              className="w-full text-xs px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Feedback Notes</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full text-xs px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Good job! Just work on..."
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded hover:bg-gray-55"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGrading}
              className="flex-1 py-2 bg-violet-600 hover:bg-violet-750 text-white text-xs font-bold rounded transition-colors inline-flex justify-center items-center gap-1"
            >
              <Save size={14} />
              {isGrading ? 'Grading...' : 'Save Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradingPanel;
