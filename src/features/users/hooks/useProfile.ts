import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProfileById,
  getMyProfile,
  updateMyProfile,
  getUserActivity,
  followUser,
  unfollowUser,
  isFollowingUser,
  getFollowerCount
} from '../api/usersApi';
import type { UserProfile, UserActivity, UpdateUserInput } from '../types/user.types';
import useAuth from '../../auth/hooks/useAuth';

export const useProfile = (userId?: string) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  
  const isMe = currentUser?.id === userId;

  const profileQuery = useQuery<UserProfile, Error>({
    queryKey: ['profile', userId],
    queryFn: () => getProfileById(userId!),
    enabled: !!userId,
  });

  const activityQuery = useQuery<UserActivity, Error>({
    queryKey: ['profile-activity', userId],
    queryFn: () => getUserActivity(userId!),
    enabled: !!userId,
  });

  const followingQuery = useQuery<{ userId: string; isFollowing: boolean }, Error>({
    queryKey: ['is-following', userId],
    queryFn: () => isFollowingUser(userId!),
    enabled: !!userId && !!currentUser && !isMe,
  });

  const followerCountQuery = useQuery<{ userId: string; followerCount: number; followingCount: number }, Error>({
    queryKey: ['follower-count', userId],
    queryFn: () => getFollowerCount(userId!),
    enabled: !!userId,
  });

  const followMutation = useMutation<any, Error, void>({
    mutationFn: () => followUser(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-following', userId] });
      queryClient.invalidateQueries({ queryKey: ['follower-count', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-activity', userId] });
    },
  });

  const unfollowMutation = useMutation<any, Error, void>({
    mutationFn: () => unfollowUser(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-following', userId] });
      queryClient.invalidateQueries({ queryKey: ['follower-count', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-activity', userId] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    profileError: profileQuery.error,

    activity: activityQuery.data,
    isLoadingActivity: activityQuery.isLoading,

    isFollowing: followingQuery.data?.isFollowing || false,
    isLoadingFollowing: followingQuery.isLoading,

    followerCount: followerCountQuery.data?.followerCount ?? 0,
    followingCount: followerCountQuery.data?.followingCount ?? 0,
    isLoadingFollowerCount: followerCountQuery.isLoading,

    follow: followMutation.mutateAsync,
    isFollowingLoading: followMutation.isPending,

    unfollow: unfollowMutation.mutateAsync,
    isUnfollowingLoading: unfollowMutation.isPending,

    isMe,
  };
};

export const useMyProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery<UserProfile, Error>({
    queryKey: ['profile', 'me'],
    queryFn: getMyProfile,
  });

  const updateMutation = useMutation<UserProfile, Error, UpdateUserInput>({
    mutationFn: updateMyProfile,
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['profile', updatedProfile.id] });
      // Invalidate current auth session as well to update headers
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,

    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
