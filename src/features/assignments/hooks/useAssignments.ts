import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAssignmentById,
  getAssignmentsByClassroom,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from '../api/assignmentsApi';
import {
  getSubmissionsByAssignment,
  getMySubmission
} from '../../submissions/api/submissionApi';
import type {
  Assignment,
  CreateAssignmentInput,
  UpdateAssignmentInput
} from '../types/assignment.types';
import type { Submission } from '../../submissions/types/submission.types';
import useAuth from '../../auth/hooks/useAuth';

export const useAssignments = (classroomId?: string) => {
  const query = useQuery<Assignment[], Error>({
    queryKey: ['assignments', classroomId],
    queryFn: () => getAssignmentsByClassroom(classroomId!),
    enabled: !!classroomId,
  });

  return {
    assignments: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useAssignment = (assignmentId?: string) => {
  const { user } = useAuth();
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  const assignmentQuery = useQuery<Assignment, Error>({
    queryKey: ['assignment', assignmentId],
    queryFn: () => getAssignmentById(assignmentId!),
    enabled: !!assignmentId,
  });

  // Query submissions (instructor only)
  const submissionsQuery = useQuery<Submission[], Error>({
    queryKey: ['submissions', assignmentId],
    queryFn: () => getSubmissionsByAssignment(assignmentId!),
    enabled: !!assignmentId && isInstructor,
  });

  // Query my submission (student only)
  const mySubmissionQuery = useQuery<Submission | null, Error>({
    queryKey: ['my-submission', assignmentId],
    queryFn: async () => {
      try {
        return await getMySubmission(assignmentId!);
      } catch (err) {
        // If 404 (not submitted yet), return null
        return null;
      }
    },
    enabled: !!assignmentId && user?.role === 'student',
  });

  return {
    assignment: assignmentQuery.data,
    isLoading: assignmentQuery.isLoading,
    error: assignmentQuery.error,

    submissions: submissionsQuery.data || [],
    isLoadingSubmissions: submissionsQuery.isLoading,

    mySubmission: mySubmissionQuery.data || null,
    isLoadingMySubmission: mySubmissionQuery.isLoading,
  };
};

export const useAssignmentActions = (classroomId?: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<Assignment, Error, CreateAssignmentInput>({
    mutationFn: createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', classroomId] });
    },
  });

  const updateMutation = useMutation<Assignment, Error, { assignmentId: string; data: UpdateAssignmentInput }>({
    mutationFn: ({ assignmentId, data }) => updateAssignment(assignmentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.assignmentId] });
      queryClient.invalidateQueries({ queryKey: ['assignments', classroomId] });
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', classroomId] });
    },
  });

  return {
    createAssignment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateAssignment: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteAssignment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
