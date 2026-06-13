import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Users, Settings, Megaphone, Calendar, ClipboardList } from 'lucide-react';
import { useClassroom } from '../hooks/useClassroom';
import { useAuth } from '../../auth/hooks/useAuth';
import AnnouncementFeed from '../components/AnnouncementFeed';
import MemberList from '../components/MemberList';
import InviteCodeBox from '../components/InviteCodeBox';
import ClassroomCalendar from '../components/ClassroomCalendar';
import ClassroomSettingsPage from './ClassroomSettingsPage';
import AssignmentList from '../../assignments/components/AssignmentList';

export const ClassroomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    classroom,
    isLoading,
    error,
    members,
    announcements,
    createAnnouncement,
    deleteAnnouncement,
  } = useClassroom(id);

  const [activeTab, setActiveTab] = useState<'feed' | 'assignments' | 'members' | 'calendar' | 'settings'>('feed');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-violet-600" size={36} />
        <span className="text-sm text-gray-400">Loading classroom details...</span>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-6 text-center max-w-md shadow-sm">
          <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
          <h3 className="font-bold text-red-900 dark:text-red-400 text-lg">Classroom not found</h3>
          <p className="text-xs text-red-700 dark:text-red-500 mt-1">
            {error?.message || 'The classroom you are trying to access does not exist or you do not have permission to view it.'}
          </p>
          <button
            onClick={() => navigate('/classrooms')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 font-bold rounded-lg text-xs transition-all"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">
      {/* Top Banner and Navigation */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/classrooms')}
              className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{classroom.name}</h1>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{classroom.description || 'No description'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 rounded-lg text-xs font-semibold">
            {classroom.memberCount} Members
          </div>
        </div>

        {/* Tab Controls */}
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 text-sm font-semibold border-t border-gray-100 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('feed')}
            className={`py-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'feed'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <Megaphone size={16} />
            Stream
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'assignments'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <ClipboardList size={16} />
            Assignments
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`py-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'members'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <Users size={16} />
            People
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'calendar'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <Calendar size={16} />
            Schedule
          </button>
          {isInstructor && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'settings'
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <Settings size={16} />
              Settings
            </button>
          )}
        </div>
      </div>

      {/* Main details body layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left main content tab contents */}
        <div className="lg:col-span-3">
          {activeTab === 'feed' && (
            <AnnouncementFeed
              announcements={announcements}
              onPostAnnouncement={createAnnouncement}
              onDeleteAnnouncement={deleteAnnouncement}
            />
          )}

          {activeTab === 'assignments' && <AssignmentList classroomId={id!} />}

          {activeTab === 'members' && <MemberList members={members} />}

          {activeTab === 'calendar' && <ClassroomCalendar />}

          {activeTab === 'settings' && isInstructor && <ClassroomSettingsPage />}
        </div>

        {/* Right sidebar details */}
        <div className="space-y-6">
          {/* Invite Code card */}
          {isInstructor && classroom.inviteCode && (
            <InviteCodeBox inviteCode={classroom.inviteCode} />
          )}

          {/* About Class Info box */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Classroom Info</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Created:</span>
                <span className="font-semibold text-gray-700 dark:text-zinc-300">
                  {new Date(classroom.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-semibold ${classroom.isActive ? 'text-emerald-500' : 'text-gray-500'}`}>
                  {classroom.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {classroom.courseId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Linked Course:</span>
                  <span className="font-semibold text-gray-700 dark:text-zinc-300">Linked</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetailsPage;
