import apiClient from '../../../lib/axios';
import type { Question, CreateQuestionInput, UpdateQuestionInput } from '../types/community.types';

export const getAllQuestions = async (): Promise<Question[]> => {
  const response = await apiClient.get<Question[]>('/questions');
  return response.data;
};

export const getQuestionById = async (id: string): Promise<Question> => {
  const response = await apiClient.get<Question>(`/questions/${id}`);
  return response.data;
};

export const createQuestion = async (data: CreateQuestionInput): Promise<Question> => {
  const response = await apiClient.post<Question>('/questions', data);
  return response.data;
};

export const updateQuestion = async (id: string, data: UpdateQuestionInput): Promise<void> => {
  await apiClient.put(`/questions/${id}`, data);
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await apiClient.delete(`/questions/${id}`);
};
