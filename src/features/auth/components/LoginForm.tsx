import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { loginSchema, type LoginInput } from '../schemas/loginSchema';
import { useAuth } from '../hooks/useAuth';
import { OAuthButtons } from './OAuthButtons';
import styles from './AuthComponents.module.css';

interface LoginFormProps {
  onSuccess?: (user: any) => void;
  onRegisterLinkClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onRegisterLinkClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const response = await login(data);
      if (onSuccess) {
        onSuccess(response.user);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setServerError(msg);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>
          Don't have an account?{' '}
          <a href="#register" onClick={(e) => { e.preventDefault(); onRegisterLinkClick?.(); }}>
            Sign up
          </a>
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="login-email">Email Address</label>
          <div className={styles.inputWrapper}>
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="login-password">Password</label>
          <div className={styles.inputWrapper}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className={styles.errorMessage} style={{ textAlign: 'center', marginTop: '4px' }}>
            {serverError}
          </p>
        )}

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className={styles.spinner} size={20} />
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={20} />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className={styles.divider}>or continue with</div>

      <OAuthButtons />
    </div>
  );
};

export default LoginForm;
