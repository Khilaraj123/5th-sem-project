import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../lib/axios';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null);
    try {
      await apiClient.post('/Password/forgot', data);
      setSuccess(true);
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || 'Something went wrong. Please try again later.'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        <div className="mb-6">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline mb-4"
          >
            <ArrowLeft size={16} />
            Back to login
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Enter the email address associated with your account, and we will send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 text-center">
            <Mail className="mx-auto text-emerald-500 mb-2" size={32} />
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-400">Check your email</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-500 mt-1">
              We have sent password reset instructions to your email address.
            </p>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`w-full px-4 py-2.5 bg-transparent border rounded-xl outline-none transition-all dark:text-white dark:border-zinc-800 focus:border-violet-600 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/30 ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' : 'border-gray-300'
                }`}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {serverError && (
              <p className="text-xs text-red-500 text-center">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending email...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
