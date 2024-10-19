'use client'
import { useState } from 'react';
import axios from 'axios';
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

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:3001/api/auth/register', { username, password });
            if (response?.status===201) {
                router.push('/auth/Login');
            }
            
        } catch (error) {
            console.error(error);
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign Up
                </Typography>
                <form onSubmit={handleSignup}>
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
                        {error && (
                            <Typography color="error" align="center">
                                {error}
                            </Typography>
                        )}
                        <Button variant="contained" color="primary" type="submit">
                            Sign Up
                        </Button>
                    </Box>
                </form>
                <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
                    <Grid item>
                        <Button variant="text" onClick={() => router.push('/auth/Login')}>
                            Already have an account? Login
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Signup;
