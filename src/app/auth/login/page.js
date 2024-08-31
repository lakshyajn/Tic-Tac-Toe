import React from 'react';
import { useRouter } from 'next/router';
import AuthForm from '@/components/AuthForm';
import { login } from '@/lib/auth';

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <AuthForm onSubmit={handleLogin} isLogin={true} />
    </div>
  );
};

export default LoginPage;