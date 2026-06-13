import apiClient from '../../../lib/axios';
import type { UserProfile, UserActivity, UpdateUserInput } from '../types/user.types';

export const getProfileById = async (userId: string): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(`/Profile/${userId}`);
  return response.data;
};

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/Profile/me');
  return response.data;
};

export const updateMyProfile = async (data: UpdateUserInput): Promise<UserProfile> => {
  const response = await apiClient.put<UserProfile>('/Profile/me', data);
  return response.data;
};

export const getUserActivity = async (userId: string): Promise<UserActivity> => {
  const response = await apiClient.get<UserActivity>(`/Profile/${userId}/activity`);
  return response.data;
};

export const followUser = async (userId: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(`/follow/${userId}/follow`);
  return response.data;
};

export const unfollowUser = async (userId: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(`/follow/${userId}/unfollow`);
  return response.data;
};

export const isFollowingUser = async (userId: string): Promise<{ userId: string; isFollowing: boolean }> => {
  const response = await apiClient.get<{ userId: string; isFollowing: boolean }>(`/follow/${userId}/is-following`);
  return response.data;
};

export const getFollowerCount = async (userId: string): Promise<{ userId: string; followerCount: number; followingCount: number }> => {
  const response = await apiClient.get<{ userId: string; followerCount: number; followingCount: number }>(`/follow/${userId}/follower-count`);
  return response.data;
};
