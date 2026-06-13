import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useAssignment, useAssignmentActions } from '../hooks/useAssignments';

export const EditAssignmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { assignment, isLoading } = useAssignment(id);
  const { updateAssignment, isUpdating } = useAssignmentActions(assignment?.classroomId);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState(100);
  const [allowLate, setAllowLate] = useState(true);

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title || '');
      setDescription(assignment.description || '');
      // Format to datetime-local expected string 'YYYY-MM-DDThh:mm'
      if (assignment.dueDate) {
        const date = new Date(assignment.dueDate);
        const tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
        const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, -1);
        setDueDate(localISOTime.substring(0, 16));
      }
      setMaxScore(assignment.maxScore || 100);
      setAllowLate(assignment.allowLate ?? true);
    }
  }, [assignment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !title.trim() || !dueDate) return;

    try {
      await updateAssignment({
        assignmentId: id,
        data: {
          title,
          description,
          dueDate: new Date(dueDate).toISOString(),
          maxScore,
          allowLate,
        },
      });

      navigate(`/assignments/${id}`);
    } catch (err) {
      console.error(err);
      alert('Error updating assignment.');
    }
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <span className="text-sm text-gray-500">Loading assignment details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-150 dark:border-zinc-800 pb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Edit Assignment</h1>
          <p className="text-xs text-gray-550 dark:text-zinc-400">Update instructions or deadlines</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Assignment Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Description / Instructions</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-855 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Due Date & Time</label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-855 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Max Score (Points)</label>
              <input
                type="number"
                min="1"
                required
                value={maxScore}
                onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
                className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-855 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="flex items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-655 dark:text-zinc-350">
              <input
                type="checkbox"
                checked={allowLate}
                onChange={(e) => setAllowLate(e.target.checked)}
                className="rounded text-violet-600 focus:ring-violet-500"
              />
              <span>Allow late submissions after deadline</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-150 dark:border-zinc-800 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 border border-gray-350 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 hover:bg-violet-750 disabled:bg-violet-400 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <Save size={16} />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAssignmentPage;
