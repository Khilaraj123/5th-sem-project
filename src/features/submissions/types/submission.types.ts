export type SubmissionType = 0 | 1 | 2 | 'Text' | 'FileUrl' | 'Link';

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  contentType: SubmissionType;
  content: string;
  textContent?: string | null;
  score?: number | null;
  feedback?: string | null;
  isLate: boolean;
  submittedAt: string;
  gradedAt?: string | null;
}

export interface CreateSubmissionInput {
  assignmentId: string;
  studentId: string;
  contentType: SubmissionType;
  content: string;
  textContent?: string;
}

export interface GradeSubmissionInput {
  submissionId: string;
  score: number;
  feedback: string;
}
