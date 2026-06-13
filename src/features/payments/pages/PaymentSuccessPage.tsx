import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Play, Home } from 'lucide-react';
import { verifyStripePayment, verifyKhaltiPayment, verifyEsewaPayment } from '../api/paymentsApi';
import { enrollInCourse } from '../../courses/api/enrollmentApi';
import useAuth from '../../auth/hooks/useAuth';

export const PaymentSuccessPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [status, setStatus] = useState<'verifying' | 'enrolling' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your payment transaction...');

  useEffect(() => {
    const performVerificationAndEnrollment = async () => {
      if (!courseId || !user) {
        setStatus('error');
        setMessage('Missing course or user authentication data.');
        return;
      }

      const gateway = searchParams.get('gateway');
      const sessionId = searchParams.get('session_id');
      const pidx = searchParams.get('pidx');
      const transactionId = searchParams.get('transactionId');

      try {
        let isVerified = false;
        
        if (gateway === 'stripe' && sessionId) {
          const res = await verifyStripePayment(sessionId);
          isVerified = res.success;
        } else if (gateway === 'khalti' && pidx) {
          const res = await verifyKhaltiPayment(pidx);
          isVerified = res.success;
        } else if (gateway === 'esewa' && transactionId) {
          const res = await verifyEsewaPayment(transactionId);
          isVerified = res.success;
        } else {
          // If no gateway parameters, fall back to verification logic or return error
          throw new Error('Unsupported payment gateway or missing transaction token.');
        }

        if (!isVerified) {
          throw new Error('Gateway transaction verification failed.');
        }

        // 2. Enroll the student on successful payment verification
        setStatus('enrolling');
        setMessage('Payment verified. Setting up your enrollment access...');
        await enrollInCourse(courseId, user.id);
        
        setStatus('success');
        setMessage('Congratulations! Your enrollment is complete. You can start learning now.');
      } catch (err: any) {
        console.error(err);
        setStatus('error');
        setMessage(err.response?.data?.message || err.message || 'Verification or enrollment failed.');
      }
    };

    performVerificationAndEnrollment();
  }, [courseId, user, searchParams]);

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm text-center">
        {status === 'verifying' || status === 'enrolling' ? (
          <div className="space-y-6">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-violet-600 mx-auto"></div>
            <h1 className="text-xl font-bold">Please Wait</h1>
            <p className="text-gray-500 dark:text-zinc-400 text-sm">{message}</p>
          </div>
        ) : status === 'success' ? (
          <div className="space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Payment Successful!</h1>
              <p className="text-gray-500 dark:text-zinc-400 text-sm mt-2">{message}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
              <button
                onClick={() => navigate(`/courses/${courseId}/learn`)}
                className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-violet-600/10 transition-all duration-150"
              >
                <Play size={16} />
                Start Course Player
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="flex items-center justify-center gap-2 border border-gray-250 dark:border-zinc-750 hover:bg-gray-50 dark:hover:bg-zinc-850 font-semibold px-6 py-3 rounded-xl transition-all duration-150"
              >
                <Home size={16} />
                Course Catalog
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900">
              <AlertTriangle size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Verification Failed</h1>
              <p className="text-gray-500 dark:text-zinc-400 text-sm mt-2">{message}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-violet-600/10 transition-all duration-150"
              >
                Back to Course Detail
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="border border-gray-250 dark:border-zinc-750 hover:bg-gray-50 dark:hover:bg-zinc-850 font-semibold px-6 py-3 rounded-xl transition-all duration-150"
              >
                Catalog Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
