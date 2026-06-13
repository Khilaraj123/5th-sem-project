import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../../auth/hooks/useAuth';
import ProfileHeader from '../components/ProfileHeader';
import ActivityStats from '../components/ActivityStats';
import { Home, LogOut, ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import NotificationBell from '../../notifications/components/NotificationBell';

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();

  // If ID is not present or is "me", use current user's ID
  const userId = id && id !== 'me' ? id : currentUser?.id;

  const {
    profile,
    isLoadingProfile,
    profileError,
    activity,
    isLoadingActivity,
    isFollowing,
    isLoadingFollowing,
    followerCount,
    followingCount,
    follow,
    unfollow,
    isMe,
  } = useProfile(userId);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollow();
      } else {
        await follow();
      }
    } catch (error) {
      console.error('Failed to toggle follow status:', error);
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
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Navigation Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>

        {/* Loading state */}
        {isLoadingProfile && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-violet-600" size={36} />
            <span className="text-sm text-gray-400">Loading user profile...</span>
          </div>
        )}

        {/* Error state */}
        {profileError && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-6 text-center max-w-lg mx-auto space-y-3">
            <BookOpen className="mx-auto text-red-500" size={40} />
            <h3 className="font-bold text-red-900 dark:text-red-400">Failed to load profile</h3>
            <p className="text-xs text-red-700 dark:text-red-500">{profileError.message}</p>
            <button
              onClick={() => navigate('/classrooms')}
              className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Profile Content */}
        {!isLoadingProfile && !profileError && profile && (
          <div className="space-y-6">
            <ProfileHeader
              profile={profile}
              isMe={isMe}
              isFollowing={isFollowing}
              followerCount={followerCount}
              followingCount={followingCount}
              isLoading={isLoadingProfile}
              isFollowingLoading={isLoadingFollowing}
              onFollowToggle={handleFollowToggle}
            />

            {/* Dashboard Activity Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-2">
                User Activity & Metrics
              </h2>
              <ActivityStats activity={activity} isLoading={isLoadingActivity} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
