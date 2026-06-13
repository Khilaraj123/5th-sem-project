export interface Assignment {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  allowLate: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface CreateAssignmentInput {
  classroomId: string;
  title: string;
  description: string;
  dueDate: string; // ISO String
  maxScore: number;
  allowLate: boolean;
}

export interface UpdateAssignmentInput {
  title: string;
  description: string;
  dueDate: string; // ISO String
  maxScore: number;
  allowLate: boolean;
}
