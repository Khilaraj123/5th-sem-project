import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClassroomById, updateClassroom, deleteClassroom } from '../api/classroomApi';
import { getClassroomMembers, joinClassroom } from '../api/membershipApi';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../api/announcementApi';
import { useClassroomStore } from '../store/classroomStore';
import type { Classroom, ClassroomMember, Announcement, UpdateClassroomInput } from '../types/classroom.types';

export const useClassroom = (id?: string) => {
  const queryClient = useQueryClient();
  const setActiveClassroom = useClassroomStore((state) => state.setActiveClassroom);

  const classroomQuery = useQuery<Classroom, Error>({
    queryKey: ['classroom', id],
    queryFn: () => getClassroomById(id!),
    enabled: !!id,
  });

  // Automatically update store active classroom when data loads
  if (classroomQuery.data) {
    setActiveClassroom(classroomQuery.data);
  }

  const updateMutation = useMutation<void, Error, UpdateClassroomInput>({
    mutationFn: (data) => updateClassroom(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroom', id] });
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });

  const deleteMutation = useMutation<void, Error, void>({
    mutationFn: () => deleteClassroom(id!),
    onSuccess: () => {
      setActiveClassroom(null);
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });

  const joinMutation = useMutation<{ classroomId: string }, Error, string>({
    mutationFn: joinClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });

  const membersQuery = useQuery<ClassroomMember[], Error>({
    queryKey: ['classroom-members', id],
    queryFn: () => getClassroomMembers(id!),
    enabled: !!id,
  });

  const announcementsQuery = useQuery<Announcement[], Error>({
    queryKey: ['classroom-announcements', id],
    queryFn: () => getAnnouncements(id!),
    enabled: !!id,
  });

  const createAnnouncementMutation = useMutation<
    Announcement,
    Error,
    { title: string; content: string }
  >({
    mutationFn: (data) => createAnnouncement(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroom-announcements', id] });
    },
  });

  const deleteAnnouncementMutation = useMutation<void, Error, string>({
    mutationFn: (annId) => deleteAnnouncement(id!, annId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroom-announcements', id] });
    },
  });

  return {
    classroom: classroomQuery.data,
    isLoading: classroomQuery.isLoading,
    error: classroomQuery.error,

    updateClassroom: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteClassroom: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    joinClassroom: joinMutation.mutateAsync,
    isJoining: joinMutation.isPending,
    joinError: joinMutation.error,

    members: membersQuery.data || [],
    isLoadingMembers: membersQuery.isLoading,

    announcements: announcementsQuery.data || [],
    isLoadingAnnouncements: announcementsQuery.isLoading,

    createAnnouncement: createAnnouncementMutation.mutateAsync,
    isCreatingAnnouncement: createAnnouncementMutation.isPending,

    deleteAnnouncement: deleteAnnouncementMutation.mutateAsync,
  };
};

export default useClassroom;
