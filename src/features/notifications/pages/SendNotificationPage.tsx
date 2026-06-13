import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Mail, Smartphone, Bell, CheckCircle } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import useAuth from '../../auth/hooks/useAuth';

export const SendNotificationPage: React.FC = () => {
  const { user } = useAuth();
  const { sendEmail, sendPush, sendInApp } = useNotifications();

  const [activeChannel, setActiveChannel] = useState<'email' | 'push' | 'in-app'>('in-app');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleFillMyId = () => {
    if (user) {
      setUserId(user.id);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      if (activeChannel === 'email') {
        if (!email.trim() || !subject.trim()) return;
        await sendEmail({ email, subject, message });
        setSuccessMessage('Email notification logged successfully to backend logs!');
      } else if (activeChannel === 'push') {
        if (!userId.trim() || !title.trim()) return;
        await sendPush({ userId, title, message });
        setSuccessMessage('Push notification logged successfully to backend logs!');
      } else if (activeChannel === 'in-app') {
        if (!userId.trim() || !title.trim()) return;
        await sendInApp({ userId, title, message });
        setSuccessMessage('In-app notification sent! Check the bell icon above if sent to yourself.');
      }

      // Reset message
      setMessage('');
    } catch (error) {
      console.error('Failed to send notification', error);
      alert('Failed to send notification. Check console/logs for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-150 dark:border-zinc-800 pb-4">
        <Link
          to="/notifications"
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Send Notification Alert</h1>
          <p className="text-xs text-gray-550 dark:text-zinc-400">Trigger system notifications for testing or announcements</p>
        </div>
      </div>

      {/* Channel Switch Tabs */}
      <div className="grid grid-cols-3 gap-2 border-b border-gray-100 dark:border-zinc-850 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveChannel('in-app');
            setSuccessMessage(null);
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg border transition-all ${
            activeChannel === 'in-app'
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'bg-white dark:bg-zinc-900 border-gray-205 dark:border-zinc-800 text-gray-650 dark:text-zinc-350 hover:bg-gray-50 dark:hover:bg-zinc-805'
          }`}
        >
          <Bell size={14} />
          In-App Alert
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveChannel('email');
            setSuccessMessage(null);
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg border transition-all ${
            activeChannel === 'email'
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'bg-white dark:bg-zinc-900 border-gray-205 dark:border-zinc-800 text-gray-655 dark:text-zinc-350 hover:bg-gray-50 dark:hover:bg-zinc-805'
          }`}
        >
          <Mail size={14} />
          Email Send
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveChannel('push');
            setSuccessMessage(null);
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg border transition-all ${
            activeChannel === 'push'
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'bg-white dark:bg-zinc-900 border-gray-205 dark:border-zinc-800 text-gray-655 dark:text-zinc-350 hover:bg-gray-50 dark:hover:bg-zinc-805'
          }`}
        >
          <Smartphone size={14} />
          Push Notify
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/30 p-4 rounded-xl flex items-start gap-2.5">
          <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">{successMessage}</p>
        </div>
      )}

      {/* Main Composer Form */}
      <form onSubmit={handleSend} className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-6 space-y-5">
        <div className="space-y-4">
          {/* Recipient selectors based on channel */}
          {activeChannel === 'email' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Recipient Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="e.g. user@edulink.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="e.g. Welcome to EduLink Platform!"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400">Recipient User ID (GUID)</label>
                  <button
                    type="button"
                    onClick={handleFillMyId}
                    className="text-[10px] font-bold text-violet-650 hover:underline"
                  >
                    Send to myself (My ID)
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
                  placeholder="e.g. 00000000-0000-0000-0000-000000000000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="e.g. Assignment Graded"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">Message Content</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full text-sm px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-855 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Write the text message details to send..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-150 dark:border-zinc-800 pt-4">
          <Link
            to="/notifications"
            className="px-4 py-2.5 border border-gray-350 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Back
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 hover:bg-violet-750 disabled:bg-violet-400 text-white text-xs font-bold rounded-lg transition-colors shadow-sm animate-none"
          >
            <Send size={14} />
            {isSubmitting ? 'Sending...' : 'Trigger Notification'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendNotificationPage;
