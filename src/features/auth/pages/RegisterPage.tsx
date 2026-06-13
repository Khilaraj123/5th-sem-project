import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate to email verification page or dashboard
    navigate('/verify-email');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md text-center mb-4">
        <h1 className="text-3xl font-bold text-violet-600 dark:text-violet-400">
          EduLink
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Join our educational community today
        </p>
      </div>

      <div className="w-full">
        <RegisterForm 
          onSuccess={handleSuccess} 
          onLoginLinkClick={handleLoginClick} 
        />
      </div>
    </div>
  );
};

export default RegisterPage;
