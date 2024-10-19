'use client'

// pages/auth/login.js
// app/auth/login/page.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const {token, setToken} = useAuth()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include', // Ensure cookies are sent
            });
    
            const data = await response.json();
            if (response?.status===200) {
                
                const { auth_token } = await data;
                console.log('token from response', auth_token)
                localStorage.setItem('token', auth_token);
                setToken(token); // Call setToken from AuthContext to update state
              }
    
            // Log the response data
            console.log('Login Response:', data);
    
            // Log the cookies
            console.log('Cookies after login:', document.cookie);
            router.push('/Visualization');            
        }
            
         catch (error) {
            console.error(error);
            // Handle error (e.g., display message)
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
