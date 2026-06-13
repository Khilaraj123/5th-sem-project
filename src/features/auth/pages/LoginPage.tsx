import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (user: any) => {
    // Navigate to dashboard after successful login
    // Depending on user role, you can redirect to different pages
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md text-center mb-4">
        <h1 className="text-3xl font-bold text-violet-600 dark:text-violet-400">
          EduLink
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Connecting Minds, Shaping Futures
        </p>
      </div>
      
      <div className="w-full">
        <LoginForm 
          onSuccess={handleSuccess} 
          onRegisterLinkClick={handleRegisterClick} 
        />
      </div>
    </div>
  );
};

export default LoginPage;
