// pages/auth/login.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/auth/login', { username, password });
            // Redirect to visualization page
            router.push('/visualization');
        } catch (error) {
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
