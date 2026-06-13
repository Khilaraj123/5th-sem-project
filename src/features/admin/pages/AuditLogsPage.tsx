import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ChevronLeft, 
  Search, 
  RefreshCw, 
  Calendar,
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { getAuditLogs } from '../api/adminApi';
import type { AuditLog } from '../types/admin.types';

export const AuditLogsPage: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering & Searching State
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to fetch audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter unique entities for the filter dropdown
  const uniqueEntities = ['All', ...Array.from(new Set(logs.map(log => log.entityType).filter(Boolean)))];

  // Filtering Logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesEntity = entityFilter === 'All' || log.entityType === entityFilter;
    
    return matchesSearch && matchesEntity;
  });

  const getActionColor = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('CREATE') || act.includes('ADD') || act.includes('REGISTER')) {
      return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40';
    }
    if (act.includes('DELETE') || act.includes('REMOVE') || act.includes('BLOCK') || act.includes('REVOKE')) {
      return 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40';
    }
    if (act.includes('UPDATE') || act.includes('EDIT') || act.includes('RESOLVE') || act.includes('MODIFY')) {
      return 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40';
    }
    return 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-350 border border-gray-150 dark:border-zinc-700/50';
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
              <FileText className="text-violet-500" size={24} />
              Platform Audit Logs
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Platform-wide actions, configuration adjustments, and user operations tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors border border-gray-250 dark:border-zinc-750 text-gray-500 dark:text-zinc-400"
            title="Refresh logs"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by action, actor email, details, or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 dark:text-white"
          />
        </div>

        {/* Entity Filter */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 dark:text-white appearance-none cursor-pointer"
          >
            {uniqueEntities.map(entity => (
              <option key={entity} value={entity}>
                Entity: {entity}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-zinc-400">Loading platform audit logs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/50 p-6 rounded-2xl text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          <button 
            onClick={fetchLogs} 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-16 rounded-3xl text-center">
          <Info className="mx-auto text-gray-300 dark:text-zinc-700 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Logs Found</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            No audit records match your query or filters.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/80 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Target Entity</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-850/20 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold tracking-wide ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">{log.userEmail || 'System'}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{log.userId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {log.entityType ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700 dark:text-zinc-300 text-xs uppercase">{log.entityType}</span>
                          <span className="text-[10px] text-gray-400 font-mono truncate max-w-[150px]" title={log.entityId}>
                            {log.entityId}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-250 dark:border-zinc-750 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold text-gray-700 dark:text-zinc-300 transition-colors"
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 w-full max-w-2xl rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="text-violet-500" size={20} />
                Audit Log Details
              </h2>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${getActionColor(selectedLog.action)}`}>
                {selectedLog.action}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-gray-400 block font-semibold uppercase tracking-wider mb-1">Actor (User)</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedLog.userEmail || 'System'}</span>
                <span className="text-gray-400 block font-mono mt-0.5">{selectedLog.userId}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold uppercase tracking-wider mb-1">Timestamp</span>
                <span className="font-bold text-gray-900 dark:text-white">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                <span className="text-gray-400 block mt-0.5">ID: {selectedLog.id}</span>
              </div>
              {selectedLog.entityType && (
                <div className="sm:col-span-2">
                  <span className="text-gray-400 block font-semibold uppercase tracking-wider mb-1">Target Entity</span>
                  <span className="font-bold text-gray-950 dark:text-zinc-200 uppercase mr-2">{selectedLog.entityType}</span>
                  <span className="font-mono text-gray-400 text-[11px]">{selectedLog.entityId}</span>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Log Payload / Details</span>
              <div className="bg-gray-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-auto max-h-60 border border-zinc-850">
                {selectedLog.details.startsWith('{') || selectedLog.details.startsWith('[') ? (
                  <pre className="whitespace-pre-wrap">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(selectedLog.details), null, 2);
                      } catch {
                        return selectedLog.details;
                      }
                    })()}
                  </pre>
                ) : (
                  <p className="whitespace-pre-wrap text-zinc-350">{selectedLog.details}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800 mt-6">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-gray-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
