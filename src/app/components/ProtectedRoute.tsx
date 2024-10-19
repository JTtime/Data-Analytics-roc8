'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!token) {
      router.push('/auth/Login');
    }
  }, [token, router]);

  if (!token) {
    return null; // loading spinner here
  }

  return <>{children}</>;
};

export default ProtectedRoute;
