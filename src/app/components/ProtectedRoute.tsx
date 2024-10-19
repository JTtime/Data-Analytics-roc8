// components/ProtectedRoute.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!token) {
      router.push('/auth/Login'); // Redirect to login if no token
    }
  }, [token, router]);

  if (!token) {
    return null; // Optionally, you can return a loading spinner here
  }

  return <>{children}</>;
};

export default ProtectedRoute;
