import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import apiClient from '../../../lib/axios';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setStatus('idle');
        return;
      }

      setStatus('verifying');
      try {
        await apiClient.post('/auth/verify-email', { token, email });
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(
          err.response?.data?.message || 'Verification link is invalid or has expired.'
        );
      }
    };

    verifyEmail();
  }, [token, email]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm text-center">
        {status === 'idle' && (
          <div className="space-y-4">
            <Mail className="mx-auto text-violet-500" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We have sent a verification link to your email address. Please click the link to confirm your account and get started.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {status === 'verifying' && (
          <div className="space-y-4 py-6">
            <Loader2 className="animate-spin mx-auto text-violet-600" size={40} />
            <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Verifying your email</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please wait while we confirm your credentials...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="mx-auto text-emerald-500" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Verified!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your email has been successfully verified. You can now access your account.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
            >
              Sign In
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="mx-auto text-red-500" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Failed</h2>
            <p className="text-sm text-red-500 mt-1">
              {errorMessage}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try resending the verification link, or contact support if the issue persists.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-700 font-semibold rounded-xl transition-all"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
