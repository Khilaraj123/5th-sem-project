import { create } from 'zustand';
import type { Classroom } from '../types/classroom.types';

interface ClassroomState {
  activeClassroomId: string | null;
  activeClassroom: Classroom | null;
  setActiveClassroom: (classroom: Classroom | null) => void;
  clearActiveClassroom: () => void;
}

export const useClassroomStore = create<ClassroomState>((set) => ({
  activeClassroomId: null,
  activeClassroom: null,
  setActiveClassroom: (classroom) =>
    set({
      activeClassroom: classroom,
      activeClassroomId: classroom ? classroom.id : null,
    }),
  clearActiveClassroom: () =>
    set({
      activeClassroom: null,
      activeClassroomId: null,
    }),
}));

export default useClassroomStore;
