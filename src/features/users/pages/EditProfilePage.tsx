import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Home, LogOut, ArrowLeft, Loader2, Save, User, FileText, Image as ImageIcon } from 'lucide-react';
import { useMyProfile } from '../hooks/useProfile';
import { useAuth } from '../../auth/hooks/useAuth';
import NotificationBell from '../../notifications/components/NotificationBell';

const editProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must contain at least 2 characters'),
  bio: z.string().max(500, 'Bio must be under 500 characters').nullable().optional(),
  avatarUrl: z.string().url('Please enter a valid URL').or(z.literal('')).nullable().optional(),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const { profile, isLoading, updateProfile, isUpdating } = useMyProfile();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: '',
      bio: '',
      avatarUrl: '',
    },
  });

  // Load profile details when fetched
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: EditProfileForm) => {
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await updateProfile({
        fullName: data.fullName,
        bio: data.bio || null,
        avatarUrl: data.avatarUrl || null,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/profile/me');
      }, 1500);
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Failed to update profile details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header bar */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 py-4 px-6 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/classrooms')}>
          <Home className="text-violet-600" size={22} />
          <span className="font-bold text-xl text-gray-900 dark:text-white">EduLink Profile</span>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />
          <div className="text-right hidden sm:block">
            <div className="font-semibold text-sm text-gray-900 dark:text-white">{currentUser?.name}</div>
            <div className="text-xs text-gray-400 capitalize">{currentUser?.role}</div>
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
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Navigation Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/profile/me')}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <ArrowLeft size={14} />
            Back to Profile
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-zinc-800 pb-3">
            Edit Profile Details
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="animate-spin text-violet-600" size={32} />
              <span className="text-sm text-gray-400">Fetching profile info...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5" htmlFor="fullName">
                  <User size={14} />
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. John Doe"
                  className={`w-full px-4 py-2.5 bg-transparent border rounded-lg outline-none text-sm dark:text-white dark:border-zinc-800 focus:border-violet-600 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-200'
                  }`}
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5" htmlFor="bio">
                  <FileText size={14} />
                  Bio / Description
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell others about your expertise, studies, or interests..."
                  className={`w-full px-4 py-3 bg-transparent border rounded-lg outline-none text-sm dark:text-white dark:border-zinc-800 focus:border-violet-600 resize-none ${
                    errors.bio ? 'border-red-500' : 'border-gray-200'
                  }`}
                  {...register('bio')}
                />
                {errors.bio && (
                  <p className="text-xs text-red-500">{errors.bio.message}</p>
                )}
              </div>

              {/* Avatar URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5" htmlFor="avatarUrl">
                  <ImageIcon size={14} />
                  Avatar Image URL
                </label>
                <input
                  id="avatarUrl"
                  type="text"
                  placeholder="e.g. https://example.com/avatar.jpg"
                  className={`w-full px-4 py-2.5 bg-transparent border rounded-lg outline-none text-sm dark:text-white dark:border-zinc-800 focus:border-violet-600 ${
                    errors.avatarUrl ? 'border-red-500' : 'border-gray-200'
                  }`}
                  {...register('avatarUrl')}
                />
                {errors.avatarUrl && (
                  <p className="text-xs text-red-500">{errors.avatarUrl.message}</p>
                )}
              </div>

              {/* Notification banners */}
              {saveError && (
                <p className="text-sm font-semibold text-red-500 text-center">{saveError}</p>
              )}
              {saveSuccess && (
                <p className="text-sm font-semibold text-emerald-600 text-center">
                  Profile updated successfully! Redirecting...
                </p>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => navigate('/profile/me')}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition-all shadow-sm"
                >
                  {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditProfilePage;
