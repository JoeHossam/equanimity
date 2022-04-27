import * as React from 'react';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { api_url, useGlobalContext } from '../context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
    return (
        <>
            <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                {...props}
            >
                {'Copyright © '}
                <Link color="inherit" href="http://localhost:3000/about">
                    Equanimity
                </Link>{' '}
                {new Date().getFullYear()}
                {'.\n'}
                <Link color="inherit" href="http://localhost:3000/">
                    Back Home
                </Link>
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                {...props}
            ></Typography>
        </>
    );
}

const theme = createTheme();

export default function SignIn() {
    const [loginStyle, setLoginStyle] = React.useState({
        transform: `translateX(0%)`,
        opacity: '1',
    });
    const [registerStyle, setRegisterStyle] = React.useState({
        transform: `translateX(100%)`,
        opacity: '0',
    });
    const [fixer, setfixer] = React.useState('');
    const [loginFail, setLoginFail] = React.useState(false);
    const [registerFail, setRegisterFail] = React.useState({});
    const [fetching, setFetching] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const { user, setUser } = useGlobalContext();
    const navigate = useNavigate();

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setfixer('relative');
        }, 1);
        return () => clearTimeout(timeout);
    }, []);

    const login = () => {
        setRegisterStyle({
            transform: `translateX(100%)`,
            opacity: '0',
        });
        setLoginStyle({ transform: `translateX(0%)`, opacity: '1' });
        setLoginFail(false);
        setRegisterFail({});
    };

    const sign = () => {
        setLoginStyle({
            transform: `translateX(-100%)`,
            opacity: '0',
        });
        setRegisterStyle({ transform: `translateX(0%)`, opacity: '1' });
        setLoginFail(false);
        setRegisterFail({});
    };

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

    return (
        <Container
            component="main"
            maxWidth="xl"
            sx={{
                background: '#ccc',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <CssBaseline />
            <div
                className="kbeera"
                style={{ overflow: 'hidden', margin: 'auto' }}
            >
                <div
                    style={{
                        height: '80vh',
                        minHeight: '300px',
                        position: fixer,
                        margin: '2rem',
                        width: '444px',
                        // background: 'white',
                        borderRadius: '0.25rem',
                    }}
                >
                    <div style={loginStyle} className="login-form">
                        <Box
                            sx={{
                                marginTop: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Log in
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleLogin}
                                noValidate
                                sx={{ mt: 1 }}
                            >
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
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value="remember"
                                            color="primary"
                                        />
                                    }
                                    label="Remember me"
                                />
                                <LoadingButton
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    loading={fetching}
                                >
                                    Login
                                </LoadingButton>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link variant="body2" onClick={sign}>
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                                <div
                                    style={{
                                        bottom: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        width: '100%',
                                    }}
                                >
                                    <Copyright sx={{ mb: 2 }} />
                                </div>
                            </Box>
                        </Box>
                    </div>
                    <div style={registerStyle} className="register-form">
                        <Box
                            sx={{
                                marginTop: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Register
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleSignUp}
                                noValidate
                                sx={{ mt: 1 }}
                            >
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
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    helperText={registerFail.password || ' '}
                                    error={registerFail.password}
                                />
                                <LoadingButton
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 2, mb: 2 }}
                                    loading={fetching}
                                >
                                    Register
                                </LoadingButton>
                                <Grid container>
                                    <Grid item>
                                        <Link variant="body2" onClick={login}>
                                            {'Already a member Login'}
                                        </Link>
                                    </Grid>
                                </Grid>
                                <div
                                    style={{
                                        bottom: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        width: '100%',
                                    }}
                                >
                                    <Copyright sx={{ mb: 2 }} />
                                </div>
                            </Box>
                        </Box>
                    </div>
                </div>
            </div>
        </Container>
    );
}
