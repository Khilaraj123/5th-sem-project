import apiClient from '../../../lib/axios';
import type { Submission, CreateSubmissionInput, GradeSubmissionInput } from '../types/submission.types';

export const getSubmissionById = async (submissionId: string): Promise<Submission> => {
  const response = await apiClient.get<Submission>(`/submission/${submissionId}`);
  return response.data;
};

export const getSubmissionsByAssignment = async (assignmentId: string): Promise<Submission[]> => {
  const response = await apiClient.get<Submission[]>(`/submission/assignment/${assignmentId}`);
  return response.data;
};

export const getMySubmission = async (assignmentId: string): Promise<Submission> => {
  const response = await apiClient.get<Submission>(`/submission/my-submission/${assignmentId}`);
  return response.data;
};

export const submitAssignment = async (data: CreateSubmissionInput): Promise<Submission> => {
  const response = await apiClient.post<Submission>('/submission/submit', data);
  return response.data;
};

export const gradeSubmission = async (input: GradeSubmissionInput): Promise<Submission> => {
  const { submissionId, score, feedback } = input;
  const response = await apiClient.post<Submission>(`/submission/${submissionId}/grade`, {
    submissionId,
    score,
    feedback,
  });
  return response.data;
};

export const downloadSubmissionFile = async (submissionId: string): Promise<Blob> => {
  const response = await apiClient.get(`/submission/${submissionId}/download`, {
    responseType: 'blob',
  });
  return response.data;
};
