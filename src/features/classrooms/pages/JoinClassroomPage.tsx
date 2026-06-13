import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Key, Loader2 } from 'lucide-react';
import { useClassroom } from '../hooks/useClassroom';

const joinClassroomSchema = z.object({
  inviteCode: z
    .string()
    .min(1, 'Invite code is required')
    .min(4, 'Code must be at least 4 characters')
    .max(15, 'Code cannot exceed 15 characters'),
});

type JoinClassroomForm = z.infer<typeof joinClassroomSchema>;

export const JoinClassroomPage: React.FC = () => {
  const navigate = useNavigate();
  const { joinClassroom, isJoining } = useClassroom();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinClassroomForm>({
    resolver: zodResolver(joinClassroomSchema),
    defaultValues: { inviteCode: '' },
  });

  const onSubmit = async (data: JoinClassroomForm) => {
    setServerError(null);
    try {
      const response = await joinClassroom(data.inviteCode);
      // Navigate to the joined classroom details
      navigate(`/classrooms/${response.classroomId}`);
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || 'Invalid invite code or you are already enrolled in this class.'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        <div className="mb-6">
          <button
            onClick={() => navigate('/classrooms')}
            className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline mb-4"
          >
            <ArrowLeft size={16} />
            Back to classrooms
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Join Classroom</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Ask your instructor for the classroom code, then enter it here to join.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="inviteCode" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Invite Code
            </label>
            <div className="relative flex items-center">
              <input
                id="inviteCode"
                type="text"
                placeholder="e.g. AB12CD"
                className={`w-full px-4 py-2.5 bg-transparent border rounded-xl outline-none transition-all uppercase tracking-widest text-center font-bold text-lg dark:text-white dark:border-zinc-800 focus:border-violet-600 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/30 ${
                  errors.inviteCode ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' : 'border-gray-300'
                }`}
                {...register('inviteCode')}
              />
            </div>
            {errors.inviteCode && (
              <p className="text-xs text-red-500 text-center">{errors.inviteCode.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-xs text-red-500 text-center">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isJoining}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isJoining ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Joining class...
              </>
            ) : (
              <>
                <Key size={18} />
                Join Class
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinClassroomPage;
