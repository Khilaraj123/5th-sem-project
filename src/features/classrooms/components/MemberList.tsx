import React from 'react';
import { User, ShieldAlert } from 'lucide-react';
import type { ClassroomMember } from '../types/classroom.types';

interface MemberListProps {
  members: ClassroomMember[];
}

export const MemberList: React.FC<MemberListProps> = ({ members }) => {
  const instructors = members.filter((m) => m.role.toLowerCase() === 'instructor');
  const students = members.filter((m) => m.role.toLowerCase() === 'student');

  const renderMemberRow = (member: ClassroomMember) => {
    const initials = member.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <div
        key={member.userId}
        className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 flex items-center justify-center font-bold text-sm">
            {initials || <User size={16} />}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">
              {member.fullName}
            </div>
            <div className="text-xs text-gray-400">
              Joined {new Date(member.joinedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold capitalize px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
          {member.role}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Instructors Section */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-base border-b border-gray-100 dark:border-zinc-800 pb-2">
          Instructors ({instructors.length})
        </h4>
        {instructors.length === 0 ? (
          <p className="text-sm text-gray-400 py-2">No instructors listed.</p>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-zinc-800">
            {instructors.map(renderMemberRow)}
          </div>
        )}
      </div>

      {/* Students Section */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-base border-b border-gray-100 dark:border-zinc-800 pb-2">
          Students ({students.length})
        </h4>
        {students.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-gray-400 gap-1.5">
            <ShieldAlert size={28} className="text-gray-300" />
            <p className="text-sm">No students enrolled yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-zinc-800">
            {students.map(renderMemberRow)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberList;
