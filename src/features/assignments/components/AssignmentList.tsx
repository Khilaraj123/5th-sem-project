import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, Calendar, CheckSquare, Plus, Edit3, Trash2 } from 'lucide-react';
import { useAssignments, useAssignmentActions } from '../hooks/useAssignments';
import useAuth from '../../auth/hooks/useAuth';

interface AssignmentListProps {
  classroomId: string;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({ classroomId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assignments, isLoading } = useAssignments(classroomId);
  const { deleteAssignment } = useAssignmentActions(classroomId);

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div
            key={n}
            className="h-24 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Classwork Assignments</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400">View tasks, deadlines, and project submissions</p>
        </div>

        {isInstructor && (
          <Link
            to={`/classrooms/${classroomId}/assignments/create`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 hover:bg-violet-750 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Plus size={16} />
            Create Assignment
          </Link>
        )}
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-205 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900">
          <ClipboardList className="mx-auto text-gray-300 dark:text-zinc-700 mb-3" size={48} />
          <h4 className="font-bold text-gray-900 dark:text-white text-sm">No assignments posted</h4>
          <p className="text-xs text-gray-500 dark:text-zinc-450 mt-1">
            {isInstructor ? 'Get started by creating your first classroom assignment.' : 'Hooray! No tasks assigned yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((assign) => {
              const isPastDue = new Date(assign.dueDate).getTime() < new Date().getTime();

              return (
                <div
                  key={assign.id}
                  onClick={() => navigate(`/assignments/${assign.id}`)}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-zinc-700 rounded-xl p-5 shadow-sm transition-all flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex gap-4 items-start flex-1">
                    <div className="p-2.5 bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 rounded-xl shrink-0">
                      <ClipboardList size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{assign.title}</h4>
                      <p className="text-xs text-gray-550 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {assign.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 font-semibold pt-1">
                        <div className="flex items-center gap-1">
                          <Calendar size={13} />
                          <span className={isPastDue ? 'text-red-500' : ''}>
                            Due: {new Date(assign.dueDate).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckSquare size={13} />
                          <span>Max Points: {assign.maxScore}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isInstructor && (
                    <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/assignments/${assign.id}/edit`}
                        className="p-1.5 text-gray-450 hover:text-violet-600 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Edit Assignment"
                      >
                        <Edit3 size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, assign.id)}
                        className="p-1.5 text-gray-450 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Delete Assignment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
