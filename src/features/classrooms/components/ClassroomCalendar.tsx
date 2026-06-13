import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  dueDate: string;
  type: 'assignment' | 'lecture' | 'exam';
}

export const ClassroomCalendar: React.FC = () => {
  // Static mock events to show visual calendars in the class Details view
  const events: CalendarEvent[] = [
    {
      id: 'e1',
      title: 'Submit Assignment 1: Introduction to React',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'assignment',
    },
    {
      id: 'e2',
      title: 'Lecture: RESTful APIs with ASP.NET Core',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'lecture',
    },
    {
      id: 'e3',
      title: 'Quiz 1: State Management',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'exam',
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
        <Calendar className="text-violet-600" size={18} />
        <h3 className="font-bold text-gray-900 dark:text-white text-base">
          Upcoming Schedule
        </h3>
      </div>

      <div className="space-y-3">
        {events.map((event) => {
          const badgeColors = {
            assignment: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
            lecture: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
            exam: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
          };

          return (
            <div
              key={event.id}
              className="p-3 border border-gray-100 dark:border-zinc-800 rounded-lg flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded ${badgeColors[event.type]}`}>
                  {event.type}
                </span>
                <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200 mt-1">
                  {event.title}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                <Clock size={14} />
                <span>{new Date(event.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassroomCalendar;
