import apiClient from '../../../lib/axios';
import type { Answer, CreateAnswerInput, UpdateAnswerInput } from '../types/community.types';

export const getAnswersByQuestion = async (questionId: string): Promise<Answer[]> => {
  const response = await apiClient.get<Answer[]>(`/answers/question/${questionId}`);
  return response.data;
};

export const createAnswer = async (data: CreateAnswerInput): Promise<Answer> => {
  const response = await apiClient.post<Answer>('/answers', data);
  return response.data;
};

export const updateAnswer = async (id: string, data: UpdateAnswerInput): Promise<void> => {
  await apiClient.put(`/answers/${id}`, data);
};

export const acceptAnswer = async (id: string): Promise<void> => {
  await apiClient.put(`/answers/${id}/accept`);
};

export const upvoteAnswer = async (id: string): Promise<void> => {
  await apiClient.post(`/answers/${id}/upvote`);
};

export const deleteAnswer = async (id: string): Promise<void> => {
  await apiClient.delete(`/answers/${id}`);
};
