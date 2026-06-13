import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubmissionsByAssignment,
  getMySubmission,
  submitAssignment,
  gradeSubmission
} from '../api/submissionApi';
import type { Submission, CreateSubmissionInput, GradeSubmissionInput } from '../types/submission.types';
import useAuth from '../../auth/hooks/useAuth';

export const useSubmissions = (assignmentId?: string) => {
  const { user } = useAuth();
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  const query = useQuery<Submission[], Error>({
    queryKey: ['submissions', assignmentId],
    queryFn: () => getSubmissionsByAssignment(assignmentId!),
    enabled: !!assignmentId && isInstructor,
  });

  return {
    submissions: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useMySubmission = (assignmentId?: string) => {
  const { user } = useAuth();

  const query = useQuery<Submission | null, Error>({
    queryKey: ['my-submission', assignmentId],
    queryFn: async () => {
      try {
        return await getMySubmission(assignmentId!);
      } catch (err) {
        // If 404/error (not submitted yet), return null
        return null;
      }
    },
    enabled: !!assignmentId && user?.role === 'student',
  });

  return {
    mySubmission: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useSubmissionActions = (assignmentId?: string) => {
  const queryClient = useQueryClient();

  const submitMutation = useMutation<Submission, Error, CreateSubmissionInput>({
    mutationFn: submitAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-submission', assignmentId] });
      queryClient.invalidateQueries({ queryKey: ['submissions', assignmentId] });
    },
  });

  const gradeMutation = useMutation<Submission, Error, GradeSubmissionInput>({
    mutationFn: gradeSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', assignmentId] });
      queryClient.invalidateQueries({ queryKey: ['my-submission', assignmentId] });
    },
  });

  return {
    submitAssignment: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,

    gradeSubmission: gradeMutation.mutateAsync,
    isGrading: gradeMutation.isPending,
  };
};
