import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronLeft, 
  Filter, 
  RefreshCw,
  Check
} from 'lucide-react';
import { getContentFlags, resolveContentFlag, dismissContentFlag } from '../api/adminApi';
import type { ContentFlag } from '../types/admin.types';

export const ModerationPage: React.FC = () => {
  const navigate = useNavigate();
  const [flags, setFlags] = useState<ContentFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Resolved' | 'Dismissed'>('All');
  
  // Resolution Modal State
  const [selectedFlag, setSelectedFlag] = useState<ContentFlag | null>(null);
  const [resolution, setResolution] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchFlags = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContentFlags();
      setFlags(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to fetch content flags.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleDismiss = async (id: string) => {
    if (!window.confirm('Are you sure you want to dismiss this flag?')) return;
    
    setActionLoading(true);
    setActionError(null);
    try {
      await dismissContentFlag(id);
      // Update local state
      setFlags(prev => prev.map(f => f.id === id ? { ...f, status: 'Dismissed' as const } : f));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to dismiss flag.');
    } finally {
      setActionLoading(false);
    }
  };

  const openResolveModal = (flag: ContentFlag) => {
    setSelectedFlag(flag);
    setResolution('');
    setActionError(null);
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlag || !resolution.trim()) return;

    setActionLoading(true);
    setActionError(null);
    try {
      await resolveContentFlag(selectedFlag.id, resolution);
      // Update local state
      setFlags(prev => prev.map(f => f.id === selectedFlag.id ? { ...f, status: 'Resolved' as const, resolvedAt: new Date().toISOString() } : f));
      setSelectedFlag(null);
      setResolution('');
    } catch (err: any) {
      console.error(err);
      setActionError(err?.response?.data?.message || 'Failed to resolve flag.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredFlags = flags.filter(flag => {
    if (filter === 'All') return true;
    return flag.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
            <AlertCircle size={12} />
            Pending
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
            <CheckCircle size={12} />
            Resolved
          </span>
        );
      case 'Dismissed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-150 dark:border-zinc-700/50">
            <XCircle size={12} />
            Dismissed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-gray-500 dark:text-zinc-400"
            aria-label="Back to Dashboard"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="text-amber-500" size={24} />
              Content Moderation
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Review, resolve, or dismiss reported content and user behaviors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchFlags}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors border border-gray-250 dark:border-zinc-750 text-gray-500 dark:text-zinc-400"
            title="Refresh logs"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filter and stats row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Filter size={16} className="text-gray-400 shrink-0" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 shrink-0">Filter Status:</span>
          {(['All', 'Pending', 'Resolved', 'Dismissed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filter === status
                  ? 'bg-violet-600 text-white'
                  : 'bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-350 border border-gray-200 dark:border-zinc-855'
              }`}
            >
              {status} ({flags.filter(f => status === 'All' ? true : f.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* List / Table */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-zinc-400">Loading moderation records...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/50 p-6 rounded-2xl text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          <button 
            onClick={fetchFlags} 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      ) : filteredFlags.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-16 rounded-3xl text-center">
          <CheckCircle className="mx-auto text-gray-300 dark:text-zinc-700 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Clean Slate!</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            No flagged content found matching your filter.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/80 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Target / Reporter</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 text-sm">
                {filteredFlags.map((flag) => (
                  <tr key={flag.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-850/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-[10px] text-gray-500 uppercase">
                            {flag.targetType}
                          </span>
                          <span className="truncate max-w-[200px] text-xs font-mono" title={flag.targetId}>
                            {flag.targetId}
                          </span>
                        </span>
                        <span className="text-xs text-gray-400 mt-0.5">
                          Reporter: {flag.reporterName || 'Anonymous'} ({flag.reporterId.substring(0, 8)}...)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 dark:text-zinc-300 max-w-sm whitespace-pre-line text-xs font-medium">
                        {flag.reason}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(flag.status)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-zinc-400 font-medium">
                      {new Date(flag.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {flag.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openResolveModal(flag)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                          >
                            <Check size={12} />
                            Resolve
                          </button>
                          <button
                            onClick={() => handleDismiss(flag.id)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 border border-gray-250 dark:border-zinc-750 hover:bg-gray-100 dark:hover:bg-zinc-850 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                          >
                            Dismiss
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 dark:text-zinc-500">
                          Resolved / Closed
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {selectedFlag && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="text-amber-500" size={20} />
              Resolve Content Flag
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Provide a resolution message explaining the action taken to resolve this flag.
            </p>

            <div className="mt-4 p-3 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-850 text-xs">
              <div className="flex justify-between font-bold text-gray-500">
                <span>Target: {selectedFlag.targetType}</span>
                <span className="font-mono">{selectedFlag.targetId}</span>
              </div>
              <p className="mt-2 text-gray-700 dark:text-zinc-350">
                <strong>Reason for report:</strong> {selectedFlag.reason}
              </p>
            </div>

            <form onSubmit={handleResolve} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Resolution Actions taken
                </label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                  placeholder="Describe the action taken (e.g. Warning sent, content deleted, no policy violation found...)"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:text-white resize-none"
                  required
                />
              </div>

              {actionError && (
                <div className="text-xs text-red-500 font-bold bg-red-50 dark:bg-red-950/10 p-2.5 rounded-lg border border-red-100 dark:border-red-900/50">
                  {actionError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedFlag(null)}
                  disabled={actionLoading}
                  className="px-4 py-2 border border-gray-250 dark:border-zinc-750 hover:bg-gray-150 dark:hover:bg-zinc-850 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !resolution.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Submit Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
