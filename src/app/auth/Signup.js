// pages/auth/signup.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://loginflowbackend.onrender.com/api/auth/register', { username, password });
            
            router.push('/auth/login');
        } catch (error) {
            console.error(error);
            
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Signup</button>
        </form>
    );
};

export default Signup;
