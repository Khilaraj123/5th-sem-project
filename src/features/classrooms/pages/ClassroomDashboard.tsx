import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { useClassrooms } from '../hooks/useClassrooms';
import { useAuth } from '../../auth/hooks/useAuth';
import ClassroomCard from '../components/ClassroomCard';


const createClassroomSchema = z.object({
  name: z.string().min(3, 'Classroom name must contain at least 3 characters'),
  description: z.string().optional(),
});

type CreateClassroomForm = z.infer<typeof createClassroomSchema>;

export const ClassroomDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classrooms, isLoading, error, createClassroom } = useClassrooms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClassroomForm>({
    resolver: zodResolver(createClassroomSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (data: CreateClassroomForm) => {
    setModalError(null);
    try {
      await createClassroom({
        name: data.name,
        description: data.description,
        instructorId: user?.id || '',
      });
      reset();
      setIsModalOpen(false);
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to create classroom.');
    }
  };

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Classrooms</h2>
            <p className="text-sm text-gray-400 mt-1">Manage and access all your registered classes.</p>
          </div>

          <div className="flex items-center gap-3">
            {isInstructor ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition-all"
              >
                <Plus size={16} />
                Create Classroom
              </button>
            ) : (
              <button
                onClick={() => navigate('/classrooms/join')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition-all"
              >
                <Plus size={16} />
                Join Classroom
              </button>
            )}
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-violet-600" size={36} />
            <span className="text-sm text-gray-400">Loading classrooms...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-4 text-center max-w-lg mx-auto flex items-center gap-3">
            <AlertCircle className="text-red-500 shrink-0" size={24} />
            <div className="text-left">
              <h3 className="font-semibold text-red-900 dark:text-red-400">Failed to load classrooms</h3>
              <p className="text-xs text-red-700 dark:text-red-500 mt-0.5">{error.message}</p>
            </div>
          </div>
        )}

        {/* Classroom Grid */}
        {!isLoading && !error && (
          <>
            {classrooms.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl max-w-lg mx-auto shadow-sm">
                <BookOpen className="mx-auto text-gray-300 mb-2" size={40} />
                <h3 className="font-bold text-gray-700 dark:text-zinc-400">No classrooms found</h3>
                <p className="text-xs text-gray-400 mt-1 px-4">
                  {isInstructor 
                    ? 'Get started by creating a new classroom to share lectures and assignments.' 
                    : 'Get started by joining a classroom with an invite code provided by your instructor.'
                  }
                </p>
                <button
                  onClick={() => isInstructor ? setIsModalOpen(true) : navigate('/classrooms/join')}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-all"
                >
                  <Plus size={14} />
                  {isInstructor ? 'Create Class' : 'Join Class'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.map((c) => (
                  <ClassroomCard key={c.id} classroom={c} />
                ))}
              </div>
            )}
          </>
        )}


      {/* Modal popup (Create Classroom) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create Classroom</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500" htmlFor="classname">Classroom Name</label>
                <input
                  id="classname"
                  type="text"
                  placeholder="e.g. Physics 101"
                  className={`w-full px-4 py-2 bg-transparent border rounded-lg outline-none text-sm dark:text-white dark:border-zinc-800 focus:border-violet-600 ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500" htmlFor="classdesc">Description</label>
                <textarea
                  id="classdesc"
                  rows={3}
                  placeholder="Class guidelines, schedules, or tags..."
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 dark:border-zinc-800 rounded-lg outline-none text-sm dark:text-white focus:border-violet-600 resize-none"
                  {...register('description')}
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomDashboard;
