import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, UserPlus, GraduationCap, School } from 'lucide-react';
import { registerSchema, type RegisterInput } from '../schemas/registerSchema';
import { useAuth } from '../hooks/useAuth';
import { PasswordStrength } from './PasswordStrength';
import styles from './AuthComponents.module.css';

interface RegisterFormProps {
  onSuccess?: (user: any) => void;
  onLoginLinkClick?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onLoginLinkClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'student',
      password: '',
      confirmPassword: '',
    },
  });

  const selectedRole = watch('role');
  const passwordVal = watch('password');

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (onSuccess) {
        onSuccess(response.user);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your inputs and try again.';
      setServerError(msg);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>
          Already have an account?{' '}
          <a href="#login" onClick={(e) => { e.preventDefault(); onLoginLinkClick?.(); }}>
            Sign in
          </a>
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="register-name">Full Name</label>
          <div className={styles.inputWrapper}>
            <input
              id="register-name"
              type="text"
              placeholder="John Doe"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              {...register('name')}
            />
          </div>
          {errors.name && (
            <p className={styles.errorMessage}>{errors.name.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="register-email">Email Address</label>
          <div className={styles.inputWrapper}>
            <input
              id="register-email"
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

        {/* Role Selector (Student vs Instructor Toggle) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>I want to join as a</label>
          <div className={styles.roleSelector}>
            <button
              type="button"
              className={`${styles.roleOption} ${selectedRole === 'student' ? styles.roleOptionActive : ''}`}
              onClick={() => setValue('role', 'student')}
            >
              <GraduationCap size={18} />
              Student
            </button>
            <button
              type="button"
              className={`${styles.roleOption} ${selectedRole === 'instructor' ? styles.roleOptionActive : ''}`}
              onClick={() => setValue('role', 'instructor')}
            >
              <School size={18} />
              Instructor
            </button>
          </div>
          {errors.role && (
            <p className={styles.errorMessage}>{errors.role.message}</p>
          )}
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="register-password">Password</label>
          <div className={styles.inputWrapper}>
            <input
              id="register-password"
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
          {/* Password Strength Indicator */}
          <PasswordStrength password={passwordVal} />
        </div>

        {/* Confirm Password */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="register-confirmPassword">Confirm Password</label>
          <div className={styles.inputWrapper}>
            <input
              id="register-confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className={styles.errorMessage}>{errors.confirmPassword.message}</p>
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
              Creating account...
            </>
          ) : (
            <>
              <UserPlus size={20} />
              Sign Up
            </>
          )}
        </button>
      </form>


    </div>
  );
};

export default RegisterForm;
