import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import apiClient from '../../../lib/axios';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null);
    if (!token || !email) {
      setServerError('Invalid reset link. Token or email is missing.');
      return;
    }

    try {
      await apiClient.post('/Password/reset', {
        email,
        token,
        password: data.password,
      });
      setSuccess(true);
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || 'Failed to reset password. The link may have expired.'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 text-center">
            <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-400">Password Reset Complete</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-500 mt-1">
              Your password has been successfully reset.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
            >
              Sign In
            </button>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Password Field */}
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 bg-transparent border rounded-xl outline-none transition-all dark:text-white dark:border-zinc-800 focus:border-violet-600 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/30 ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' : 'border-gray-300'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 bg-transparent border rounded-xl outline-none transition-all dark:text-white dark:border-zinc-800 focus:border-violet-600 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/30 ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' : 'border-gray-300'
                  }`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {(!token || !email) && (
              <p className="text-xs text-amber-500 text-center">
                Warning: Reset parameters (token/email) are missing from the URL.
              </p>
            )}

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
                  Resetting password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
