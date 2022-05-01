import React, { useState, useEffect } from 'react';
import '../join.css';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { api_url, useGlobalContext } from '../context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Join = () => {
    const [loginFail, setLoginFail] = useState(false);
    const [registerFail, setRegisterFail] = useState({});
    const [fetching, setFetching] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { isLoggedIn, setIsLoggedIn } = useGlobalContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            const logout = async () => {
                try {
                    await axios.get(`${api_url}auth/logout`, {
                        withCredentials: 'true',
                    });
                    setIsLoggedIn(false);
                } catch (error) {
                    console.log(error.message);
                }
            };
            logout();
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginFail(false);
        setFetching(true);
        try {
            await axios.post(
                `${api_url}auth/login`,
                {
                    email: email,
                    password: password,
                },
                { withCredentials: true, 'Content-Type': 'application/json' }
            );
            setIsLoggedIn(true);
            navigate('/');
        } catch (error) {
            setLoginFail(true);
        }
        setFetching(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setRegisterFail({});
        setFetching(true);
        try {
            await axios.post(
                `${api_url}auth/register`,
                {
                    name: name,
                    email: email,
                    password: password,
                },
                { withCredentials: true, 'Content-Type': 'application/json' }
            );
            const res = await axios.post(
                `${api_url}auth/login`,
                {
                    email: email,
                    password: password,
                },
                { withCredentials: true, 'Content-Type': 'application/json' }
            );
            setIsLoggedIn(true);
            navigate('/');
        } catch (error) {
            console.log(error.response);
            const errors = error.response.data.msg.split(',');
            const man = {};
            errors.map((item) => {
                if (item.match(/name/i)) {
                    man.name = item;
                    return;
                } else if (item.match(/email/i)) {
                    man.email = item;
                    return;
                } else if (item.match(/password/i)) {
                    man.password = item;
                    return;
                }
            });
            setRegisterFail(man);
        }
        setFetching(false);
    };

    useEffect(() => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
            container.classList.add('right-panel-active');
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove('right-panel-active');
        });
    }, []);

    return (
        <div className="big-chungus">
            <div className="container" id="container">
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUp}>
                        <Typography
                            variant="h3"
                            mb={3}
                            sx={{ fontWeight: 'bold' }}
                        >
                            Register
                        </Typography>

                        <TextField
                            sx={{ marginY: '0.25rem' }}
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            helperText={registerFail.name || ' '}
                            error={registerFail.name}
                        />
                        <TextField
                            sx={{ marginY: '0.25rem' }}
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            helperText={registerFail.email || ' '}
                            error={registerFail.email}
                        />
                        <TextField
                            sx={{ marginY: '0.25rem' }}
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            helperText={registerFail.password || ' '}
                            error={registerFail.password}
                        />
                        <LoadingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                            loading={fetching}
                            disableFocusRipple
                        >
                            Register
                        </LoadingButton>
                    </form>
                </div>
                <div class="form-container sign-in-container">
                    <form onSubmit={handleLogin}>
                        <Typography
                            variant="h3"
                            mb={3}
                            sx={{ fontWeight: 'bold' }}
                        >
                            Log in
                        </Typography>

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {loginFail && (
                            <Typography
                                mx={'0.5rem'}
                                display={'block'}
                                variant="caption"
                                color={'red'}
                            >
                                * Wrong Email or password
                            </Typography>
                        )}
                        <a href="#">Forgot your password?</a>
                        <LoadingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disableFocusRipple
                            loading={fetching}
                        >
                            Login
                        </LoadingButton>
                    </form>
                </div>
                <div class="overlay-container">
                    <div class="overlay">
                        <div class="overlay-panel overlay-left">
                            <h1>Already a member?</h1>
                            <p>
                                To keep connected with us please login with your
                                personal info
                            </p>
                            <Button
                                id="signIn"
                                variant="outlined"
                                color="secondary"
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                    ':hover': {
                                        borderColor: 'whitesmoke',
                                    },
                                }}
                            >
                                Login
                            </Button>
                        </div>
                        <div class="overlay-panel overlay-right">
                            <h1>New Memeber?</h1>
                            <p>
                                Sign up with us today to get the full experience
                                of our service
                            </p>
                            {/* <button class="ghost" id="signUp">
                                Register
                            </button> */}
                            <Button
                                id="signUp"
                                variant="outlined"
                                color="secondary"
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                    ':hover': {
                                        borderColor: 'whitesmoke',
                                    },
                                }}
                            >
                                Register
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Join;
