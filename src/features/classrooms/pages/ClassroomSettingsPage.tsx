import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClassroomStore } from '../store/classroomStore';
import { useClassroom } from '../hooks/useClassroom';
import { Settings, Save, Loader2, AlertCircle, Trash2 } from 'lucide-react';

const updateClassroomSchema = z.object({
  name: z.string().min(3, 'Classroom name must contain at least 3 characters'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type UpdateClassroomForm = z.infer<typeof updateClassroomSchema>;

export const ClassroomSettingsPage: React.FC = () => {
  const activeClassroom = useClassroomStore((state) => state.activeClassroom);
  const { updateClassroom: updateApi, deleteClassroom: deleteApi, isUpdating, isDeleting } = useClassroom(activeClassroom?.id);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateClassroomForm>({
    resolver: zodResolver(updateClassroomSchema),
    defaultValues: {
      name: activeClassroom?.name || '',
      description: activeClassroom?.description || '',
      isActive: activeClassroom?.isActive ?? true,
    },
  });

  const onSubmit = async (data: UpdateClassroomForm) => {
    setServerError(null);
    setSuccess(false);
    try {
      await updateApi(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to update settings.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you absolutely sure you want to delete this classroom? All student memberships and logs will be deleted permanently.')) {
      try {
        await deleteApi();
        // Redirect will happen automatically or handle redirect manually
        window.location.href = '/classrooms';
      } catch (err) {
        alert('Failed to delete classroom.');
      }
    }
  };

  if (!activeClassroom) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <Settings className="text-violet-600" size={18} />
        <h3 className="font-bold text-gray-900 dark:text-white text-base">Classroom Settings</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="settings-name">
            Classroom Name
          </label>
          <input
            id="settings-name"
            type="text"
            className={`w-full px-4 py-2 bg-transparent border rounded-lg outline-none text-sm dark:text-white dark:border-zinc-800 focus:border-violet-600 ${
              errors.name ? 'border-red-500' : 'border-gray-200'
            }`}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="settings-desc">
            Description
          </label>
          <textarea
            id="settings-desc"
            rows={4}
            className="w-full px-4 py-2 bg-transparent border border-gray-200 dark:border-zinc-800 rounded-lg outline-none text-sm dark:text-white focus:border-violet-600 resize-none"
            {...register('description')}
          />
        </div>

        {/* Is Active Status checkbox */}
        <div className="flex items-center gap-2 py-1">
          <input
            id="settings-active"
            type="checkbox"
            className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
            {...register('isActive')}
          />
          <label htmlFor="settings-active" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Keep classroom active and accessible to students
          </label>
        </div>

        {serverError && (
          <p className="text-xs text-red-500 text-center">{serverError}</p>
        )}

        {success && (
          <p className="text-xs text-emerald-500 text-center">Settings saved successfully!</p>
        )}

        <div className="flex items-center justify-end border-t border-gray-100 dark:border-zinc-800 pt-4 gap-3">
          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-60"
          >
            {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Settings
          </button>
        </div>
      </form>

      {/* Dangerous/Danger Zone */}
      <div className="border-t border-red-100 dark:border-red-950/30 pt-6 mt-6">
        <h4 className="text-red-500 font-bold text-sm mb-2 flex items-center gap-1.5">
          <AlertCircle size={16} />
          Danger Zone
        </h4>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Deleting a classroom is a permanent operation. There is no rollback or undo option available. All data will be deleted immediately.
        </p>
        
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 text-sm font-bold rounded-lg transition-all disabled:opacity-60"
        >
          {isDeleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
          Delete Classroom
        </button>
      </div>
    </div>
  );
};

export default ClassroomSettingsPage;
