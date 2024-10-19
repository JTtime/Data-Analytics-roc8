'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
    const router = useRouter();
    const [authToken, setAuthToken] = useState('')
    const { token, setToken} = useAuth();
    // const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);
    // const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('auth_token'));

    console.log('home page')

    useEffect(() => {

        console.log('token in Home', token)
        if (!token?.length) {
            router.push('/auth/Login');
        } else {
            router.push('/visualization');
        }
    }, [token]);

    useEffect(() => {
        console.log('authtoken', authToken)

    }, [authToken])


  return (
    <div>Loading....</div>
  )
}

export default HomePage