'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const {token, setToken} = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('https://loginflowbackend.onrender.com/api/auth/login', {
                username,
                password,
            }, {
                withCredentials: true, // Ensure cookies are sent
            });
            

   
            if (response?.status === 200) {

                toast.success(response?.data?.message)

                const { auth_token } = await response;
                console.log('token from response', auth_token)
                localStorage.setItem('token', auth_token);
                setToken(token); // Call setToken from AuthContext to update state
                router.push('/visualisation');
            } 

            console.log('Login Response:', data);


            console.log('Cookies after login:', document.cookie);
            // router.push('/visualization');
        } catch (error) {
            console.error(error);
            setError('Invalid username or password.');
        }
    };

    const handleSignup = () => {
        router.push('/auth/Signup');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            variant="outlined"
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            variant="outlined"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error?.length ? (
                            <Typography color="error" align="center">
                                {error}
                            </Typography>
                        ) : ''}
                        <Button variant="contained" color="primary" type="submit">
                            Login
                        </Button>
                    </Box>
                </form>
                <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
                    <Grid item>
                        <Button variant="text" onClick={handleSignup}>
                            Don't have an account? Sign Up
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <ToastContainer/>
        </Container>
    );
};

export default Login;
