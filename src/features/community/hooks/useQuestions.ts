import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion } from '../api/questionsApi';
import type { Question, CreateQuestionInput, UpdateQuestionInput } from '../types/community.types';

export const useQuestions = (id?: string) => {
  const queryClient = useQueryClient();

  const questionsQuery = useQuery<Question[], Error>({
    queryKey: ['questions'],
    queryFn: getAllQuestions,
  });

  const questionDetailsQuery = useQuery<Question, Error>({
    queryKey: ['question', id],
    queryFn: () => getQuestionById(id!),
    enabled: !!id,
  });

  const createMutation = useMutation<Question, Error, CreateQuestionInput>({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const updateMutation = useMutation<void, Error, UpdateQuestionInput>({
    mutationFn: (data) => updateQuestion(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question', id] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const deleteMutation = useMutation<void, Error, void>({
    mutationFn: () => deleteQuestion(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  return {
    questions: questionsQuery.data || [],
    isLoading: questionsQuery.isLoading,
    error: questionsQuery.error,

    question: questionDetailsQuery.data,
    isLoadingDetails: questionDetailsQuery.isLoading,
    errorDetails: questionDetailsQuery.error,

    createQuestion: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateQuestion: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteQuestion: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

export default useQuestions;
