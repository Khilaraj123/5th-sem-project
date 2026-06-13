import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllClassrooms, createClassroom } from '../api/classroomApi';
import type { Classroom, CreateClassroomInput } from '../types/classroom.types';

export const useClassrooms = () => {
  const queryClient = useQueryClient();

  const classroomsQuery = useQuery<Classroom[], Error>({
    queryKey: ['classrooms'],
    queryFn: getAllClassrooms,
  });

  const createClassroomMutation = useMutation<Classroom, Error, CreateClassroomInput>({
    mutationFn: createClassroom,
    onSuccess: () => {
      // Invalidate the classrooms list cache to trigger a reload
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });

  return {
    classrooms: classroomsQuery.data || [],
    isLoading: classroomsQuery.isLoading,
    error: classroomsQuery.error,
    createClassroom: createClassroomMutation.mutateAsync,
    isCreating: createClassroomMutation.isPending,
    createError: createClassroomMutation.error,
  };
};

export default useClassrooms;
