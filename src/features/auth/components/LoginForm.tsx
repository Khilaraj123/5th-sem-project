import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom'; // Handles dashboard redirection
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { loginSchema, type LoginInput } from '../schemas/loginSchema';
import { useAuth } from '../hooks/useAuth';
import styles from './AuthComponents.module.css'; // Importing your CSS Module

interface LoginFormProps {
  onSuccess?: (user: any) => void;
  onRegisterLinkClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onRegisterLinkClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate(); // Hook instantiation for client routing

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
      
      // Execute optional context callbacks
      if (onSuccess) {
        onSuccess(response.user);
      }
      
      // Core redirect logic: Sends user to the dashboard path upon successful auth
      const userRole = response.user?.role?.toLowerCase();
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard'); // Standard fallback landing dashboard
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
        {/* Email Field Group */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="login-email">Email Address</label>
          <div className={styles.inputWrapper}>
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              {...register('email')}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email.message}</p>
          )}
        </div>

        {/* Password Field Group */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="login-password">Password</label>
          <div className={styles.inputWrapper}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              {...register('password')}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password.message}</p>
          )}
        </div>

        {/* Server Context Error Message Display */}
        {serverError && (
          <p className={styles.errorMessage} style={{ textAlign: 'center', marginTop: '4px' }}>
            {serverError}
          </p>
        )}

        {/* Dynamic Submit Action Button */}
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

      {/* Styled Horizontal Line Divider */}
      <div className={styles.divider}>or continue with</div>

    </div>
  );
};

export default LoginForm;