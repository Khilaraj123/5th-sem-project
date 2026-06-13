import type { UserRole } from '../../auth/types/auth.types';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
}

export interface UserActivity {
  userId: string;
  fullName: string;
  courseEnrollments: number;
  certificatesEarned: number;
  questionsAsked: number;
  answersGiven: number;
  coursesCreated: number;
  joinedDate: string;
  lastActive: string;
  followerCount: number;
  followingCount: number;
}

export interface UpdateUserInput {
  fullName: string;
  bio?: string | null;
  avatarUrl?: string | null;
}
