import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ShieldAlert, Award, FileDown } from 'lucide-react';
import { useAssignment } from '../hooks/useAssignments';
import { downloadSubmissionFile } from '../../submissions/api/submissionApi';
import useAuth from '../../auth/hooks/useAuth';
import type { Submission } from '../../submissions/types/submission.types';
import SubmissionComposer from '../../submissions/components/SubmissionComposer';
import GradingPanel from '../../submissions/components/GradingPanel';

export const AssignmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    assignment,
    isLoading,
    submissions,
    isLoadingSubmissions,
  } = useAssignment(id);

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  // Instructor states
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const handleSelectSubmission = (sub: Submission) => {
    setSelectedSubmission(sub);
  };

  const handleDownload = async (subId: string) => {
    try {
      const blob = await downloadSubmissionFile(subId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submission-${subId}.txt`);
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
        <span className="text-sm text-gray-500">Loading task details...</span>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assignment Not Found</h2>
        <p className="text-xs text-gray-550 dark:text-zinc-400 mt-2">
          This assignment may have been deleted or you do not have permission to view it.
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

  const isPastDue = new Date(assignment.dueDate).getTime() < new Date().getTime();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-gray-150 dark:border-zinc-800 pb-5">
        <button
          type="button"
          onClick={() => navigate(`/classrooms/${assignment.classroomId}`)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-655 dark:text-violet-400">
            Class Assignment Task
          </span>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight">
            {assignment.title}
          </h1>
        </div>
      </div>

      {/* Main Details and Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Assignment Description and instructions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 dark:text-zinc-455 border-b border-gray-100 dark:border-zinc-850 pb-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span className={isPastDue ? 'text-red-500 font-bold' : ''}>
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award size={16} />
                <span>Max Points: {assignment.maxScore}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                <span>Allow Late: {assignment.allowLate ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">Instructions:</h3>
              <p className="text-sm text-gray-650 dark:text-zinc-350 leading-relaxed whitespace-pre-wrap">
                {assignment.description}
              </p>
            </div>
          </div>

          {/* INSTRUCTOR VIEW: Submissions list */}
          {isInstructor && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="border-b border-gray-100 dark:border-zinc-850 pb-3">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Student Submissions</h3>
                <p className="text-[11px] text-gray-450 mt-0.5">Grade papers and review student text content</p>
              </div>

              {isLoadingSubmissions ? (
                <div className="text-center py-6 text-xs text-gray-500">Loading student submissions...</div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8 text-gray-450 text-xs">No students have submitted this assignment yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-150 dark:border-zinc-800/80 pb-2">
                        <th className="py-2.5">Student ID</th>
                        <th className="py-2.5">Submitted Date</th>
                        <th className="py-2.5">Late?</th>
                        <th className="py-2.5">Score</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 dark:divide-zinc-850">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="text-gray-755 dark:text-zinc-350 hover:bg-gray-50/50 dark:hover:bg-zinc-850/20">
                          <td className="py-3.5 font-mono">{sub.studentId.substring(0, 8)}...</td>
                          <td className="py-3.5">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                          <td className="py-3.5">
                            {sub.isLate ? (
                              <span className="text-[10px] text-red-655 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full border border-red-200/50 font-semibold">Late</span>
                            ) : (
                              <span className="text-[10px] text-emerald-655 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-200/50 font-semibold">On Time</span>
                            )}
                          </td>
                          <td className="py-3.5 font-bold">
                            {sub.score !== null && sub.score !== undefined ? `${sub.score} / ${assignment.maxScore}` : 'Ungraded'}
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleDownload(sub.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 dark:border-zinc-750 hover:bg-gray-55 text-[10px] rounded"
                              title="Download Text Submission"
                            >
                              <FileDown size={12} />
                              Download
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectSubmission(sub)}
                              className="px-2.5 py-1 bg-violet-650 hover:bg-violet-755 text-white text-[10px] rounded font-bold"
                            >
                              Grade
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Sidebar composer / grading drawer */}
        <div className="space-y-6">
          {/* STUDENT VIEW: Submission status card */}
          {!isInstructor && (
            <SubmissionComposer
              assignmentId={id!}
              maxScore={assignment.maxScore}
              dueDate={assignment.dueDate}
              allowLate={assignment.allowLate}
            />
          )}

          {/* INSTRUCTOR VIEW: Grading panel */}
          {isInstructor && selectedSubmission && (
            <GradingPanel
              submission={selectedSubmission}
              maxScore={assignment.maxScore}
              onClose={() => setSelectedSubmission(null)}
              assignmentId={id!}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailsPage;
