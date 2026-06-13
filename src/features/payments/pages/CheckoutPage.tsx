import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, ShieldCheck, Sparkles } from 'lucide-react';
import { getCourseById } from '../../courses/api/courseApi';
import type { CourseDetail } from '../../courses/types/course.types';
import { createStripeCheckout, createKhaltiCheckout, createEsewaCheckout } from '../api/paymentsApi';

export const CheckoutPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'khalti' | 'esewa'>('stripe');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handlePayment = async () => {
    if (!courseId || !course) return;
    setSubmitting(true);
    setError(null);

    const successUrl = `${window.location.origin}/payment/success`;
    const cancelUrl = `${window.location.origin}/courses/${courseId}`;

    const payload = {
      courseId,
      successUrl,
      cancelUrl,
    };

    try {
      let redirectUrl = '';
      if (paymentMethod === 'stripe') {
        const res = await createStripeCheckout(payload);
        redirectUrl = res.redirectUrl;
      } else if (paymentMethod === 'khalti') {
        const res = await createKhaltiCheckout(payload);
        redirectUrl = res.redirectUrl;
      } else {
        const res = await createEsewaCheckout(payload);
        redirectUrl = res.redirectUrl;
      }

      if (redirectUrl) {
        // Redirect to the payment gateway
        window.location.href = redirectUrl;
      } else {
        throw new Error('Failed to generate redirect URL');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Payment checkout session failed. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-zinc-400">Loading checkout summary...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <p className="text-red-500 font-semibold">Course not found.</p>
        <button onClick={() => navigate('/courses')} className="mt-4 text-violet-600 hover:underline">Back to Courses</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back link */}
      <button
        onClick={() => navigate(`/courses/${courseId}`)}
        className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline mb-6"
      >
        <ArrowLeft size={16} />
        Back to Course
      </button>

      <h1 className="text-3xl font-black tracking-tight mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Payment options */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Select Payment Method</h2>
            
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl p-3 text-sm mb-4">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Stripe option */}
              <label 
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'stripe'
                    ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/10'
                    : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'stripe'} 
                    onChange={() => setPaymentMethod('stripe')} 
                    className="text-violet-600 focus:ring-violet-500" 
                  />
                  <div>
                    <span className="font-semibold block text-sm">Credit / Debit Card (Stripe)</span>
                    <span className="text-xs text-gray-500 dark:text-zinc-400">Pay securely with Visa, MasterCard, Amex</span>
                  </div>
                </div>
                <CreditCard className="text-violet-600" size={24} />
              </label>

              {/* Khalti option */}
              <label 
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'khalti'
                    ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/10'
                    : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'khalti'} 
                    onChange={() => setPaymentMethod('khalti')} 
                    className="text-violet-600 focus:ring-violet-500" 
                  />
                  <div>
                    <span className="font-semibold block text-sm">Khalti Wallet</span>
                    <span className="text-xs text-gray-500 dark:text-zinc-400">Pay via Khalti credentials or Mobile Banking</span>
                  </div>
                </div>
                <Wallet className="text-purple-600 font-bold" size={24} />
              </label>

              {/* eSewa option */}
              <label 
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'esewa'
                    ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/10'
                    : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'esewa'} 
                    onChange={() => setPaymentMethod('esewa')} 
                    className="text-violet-600 focus:ring-violet-500" 
                  />
                  <div>
                    <span className="font-semibold block text-sm">eSewa Mobile Wallet</span>
                    <span className="text-xs text-gray-500 dark:text-zinc-400">Nepal's leading digital wallet</span>
                  </div>
                </div>
                <span className="font-extrabold text-green-600 text-lg">eSewa</span>
              </label>
            </div>
          </div>
        </div>

        {/* Course Billing Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="flex gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800 mb-4">
              <div className="w-16 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg shrink-0 flex items-center justify-center text-zinc-500">
                <Sparkles size={20} className="text-violet-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm truncate text-gray-900 dark:text-white">{course.title}</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">by {course.instructorName || 'Instructor'}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Original Price</span>
                <span className="font-semibold">${course.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">VAT/Taxes</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 dark:border-zinc-800 pt-3 text-base font-black">
                <span>Total</span>
                <span>${course.price}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={submitting}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl shadow-md shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-98 transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? 'Redirecting to gateway...' : `Pay $${course.price}`}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Secure Checkout & Encrypted Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
