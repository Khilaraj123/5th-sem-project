import React from 'react';
import { ShieldCheck, Edit, Mail, Calendar, UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../types/user.types';

interface ProfileHeaderProps {
  profile?: UserProfile;
  isMe: boolean;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
  isLoading: boolean;
  isFollowingLoading: boolean;
  onFollowToggle: () => Promise<void>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isMe,
  isFollowing,
  followerCount,
  followingCount,
  isLoading,
  isFollowingLoading,
  onFollowToggle,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 animate-pulse">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 bg-gray-200 dark:bg-zinc-800 rounded-full shrink-0" />
          <div className="flex-1 space-y-3 w-full text-center md:text-left">
            <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/3 mx-auto md:mx-0" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/4 mx-auto md:mx-0" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-2/3 mx-auto md:mx-0" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 text-center text-gray-500">
        Profile not found
      </div>
    );
  }

  // Generate initials for placeholder avatar
  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      })
    : 'Recently';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="shrink-0 relative">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-24 h-24 rounded-full object-cover border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-violet-100 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/50 flex items-center justify-center text-violet-750 dark:text-violet-400 text-3xl font-black">
              {initials}
            </div>
          )}
        </div>

        {/* User Info details */}
        <div className="flex-1 w-full text-center md:text-left space-y-4">
          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                {profile.fullName}
              </h1>
              {profile.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40 shrink-0">
                  <ShieldCheck size={12} />
                  Verified
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs font-medium text-gray-500 dark:text-zinc-400">
              <span className="capitalize px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-gray-700 dark:text-zinc-300">
                {profile.role}
              </span>
              <span className="flex items-center gap-1">
                <Mail size={13} className="text-gray-400" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-gray-400" />
                Joined {joinedDate}
              </span>
            </div>
          </div>

          {/* Bio info */}
          {profile.bio && (
            <p className="text-sm text-gray-650 dark:text-zinc-300 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Followers metrics */}
          <div className="flex items-center justify-center md:justify-start gap-6 pt-1">
            <div className="text-center md:text-left">
              <div className="text-lg font-extrabold text-gray-900 dark:text-white">
                {followerCount}
              </div>
              <div className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Followers
              </div>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800" />
            <div className="text-center md:text-left">
              <div className="text-lg font-extrabold text-gray-900 dark:text-white">
                {followingCount}
              </div>
              <div className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Following
              </div>
            </div>
          </div>
        </div>

        {/* Call to action action button */}
        <div className="shrink-0 flex items-center gap-3">
          {isMe ? (
            <button
              onClick={() => navigate('/profile/edit')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-zinc-800 bg-white hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-750 dark:text-zinc-200 text-sm font-bold rounded-lg transition-all"
            >
              <Edit size={15} />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={onFollowToggle}
              disabled={isFollowingLoading}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all border ${
                isFollowing
                  ? 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-800'
                  : 'bg-violet-600 hover:bg-violet-700 text-white border-violet-600'
              }`}
            >
              {isFollowingLoading ? (
                <Loader2 className="animate-spin" size={15} />
              ) : isFollowing ? (
                <UserCheck size={15} />
              ) : (
                <UserPlus size={15} />
              )}
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
