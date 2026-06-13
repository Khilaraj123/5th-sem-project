export interface Classroom {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  instructorId: string;
  courseId?: string | null;
  isActive: boolean;
  createdAt: string;
  memberCount: number;
}

export interface ClassroomMember {
  userId: string;
  classroomId: string;
  fullName: string;
  avatarUrl?: string | null;
  role: string;
  joinedAt: string;
}

export interface FileUploadDto {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export interface Announcement {
  id: string;
  classroomId: string;
  authorId: string;
  authorName?: string;
  authorRole?: string;
  title: string;
  content: string;
  isScheduled: boolean;
  scheduledAt?: string | null;
  createdAt: string;
  attachments: FileUploadDto[];
}

export interface CreateClassroomInput {
  name: string;
  description?: string;
  instructorId: string;
  courseId?: string | null;
}

export interface UpdateClassroomInput {
  name: string;
  description?: string;
  isActive: boolean;
}
