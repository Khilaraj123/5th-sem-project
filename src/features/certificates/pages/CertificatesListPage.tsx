import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Download, ExternalLink, Calendar } from 'lucide-react';
import { getMyCertificates, getCertificateDownloadUrl } from '../api/certificatesApi';
import type { Certificate } from '../types/certificate.types';

export const CertificatesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await getMyCertificates();
        setCertificates(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch your certificates.');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = (id: string) => {
    const downloadUrl = getCertificateDownloadUrl(id);
    window.open(downloadUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-zinc-400">Loading your certificates...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="border-b border-gray-100 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">My Certificates</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          View and download credentials of your completed courses.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-100 dark:border-violet-900">
            <Award size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">No Certificates Earned Yet</h2>
          <p className="text-gray-500 dark:text-zinc-400 text-sm mt-2 max-w-sm mx-auto">
            Once you enroll and complete 100% of a course's curriculum, your certificate of completion will appear here.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-6 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-violet-600/10 transition-all duration-150"
          >
            Explore Course Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div 
              key={cert.id} 
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl border border-amber-100 dark:border-amber-900">
                    <Award size={24} />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                    Completed
                  </span>
                </div>

                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {cert.courseName || 'Course Certificate of Completion'}
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 mb-6">
                  <Calendar size={14} />
                  <span>Issued on {new Date(cert.issuedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(cert.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-150"
                >
                  <Download size={14} />
                  Download PDF
                </button>
                <button
                  onClick={() => handleDownload(cert.id)}
                  className="p-2.5 border border-gray-250 dark:border-zinc-750 hover:bg-gray-50 dark:hover:bg-zinc-850 text-gray-600 dark:text-zinc-400 rounded-xl transition-all duration-150"
                  title="View Certificate"
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesListPage;
