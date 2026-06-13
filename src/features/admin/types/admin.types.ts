export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
  studentCount: number;
  instructorCount: number;
  adminCount: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  completedEnrollments: number;
}

export interface ContentFlag {
  id: string;
  reporterId: string;
  reporterName?: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: 'Pending' | 'Resolved' | 'Dismissed';
  resolvedById?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
}
