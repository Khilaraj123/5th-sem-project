import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnswersByQuestion, createAnswer, updateAnswer, acceptAnswer, upvoteAnswer, deleteAnswer } from '../api/answersApi';
import type { Answer, CreateAnswerInput, UpdateAnswerInput } from '../types/community.types';

export const useAnswers = (questionId?: string) => {
  const queryClient = useQueryClient();

  const answersQuery = useQuery<Answer[], Error>({
    queryKey: ['question-answers', questionId],
    queryFn: () => getAnswersByQuestion(questionId!),
    enabled: !!questionId,
  });

  const createMutation = useMutation<Answer, Error, CreateAnswerInput>({
    mutationFn: createAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-answers', questionId] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question', questionId] });
    },
  });

  const updateMutation = useMutation<void, Error, { id: string; data: UpdateAnswerInput }>({
    mutationFn: ({ id, data }) => updateAnswer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-answers', questionId] });
    },
  });

  const acceptMutation = useMutation<void, Error, string>({
    mutationFn: acceptAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-answers', questionId] });
      queryClient.invalidateQueries({ queryKey: ['question', questionId] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const upvoteMutation = useMutation<void, Error, string>({
    mutationFn: upvoteAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-answers', questionId] });
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-answers', questionId] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question', questionId] });
    },
  });

  return {
    answers: answersQuery.data || [],
    isLoading: answersQuery.isLoading,
    error: answersQuery.error,

    createAnswer: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateAnswer: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    acceptAnswer: acceptMutation.mutateAsync,
    isAccepting: acceptMutation.isPending,

    upvoteAnswer: upvoteMutation.mutateAsync,
    isUpvoting: upvoteMutation.isPending,

    deleteAnswer: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

export default useAnswers;
