import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Divider,
    TextField,
    Tooltip,
    Typography,
    Input,
    Snackbar,
    Alert,
    CardHeader,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import { useGlobalContext, api_url } from '../context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
    const { user, setUser, userLoading } = useGlobalContext();
    const [fetching, setFetching] = useState(false);
    const [passFetching, setPassFetching] = useState(false);
    const [newImage, setNewImage] = useState('');
    const [showError, setShowError] = useState({});

    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading) setName(user.name);
    }, [userLoading]);

    const changePhoto = (e) => {
        setNewImage(e.taget.files[0]);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setFetching(true);
        try {
            const res = await axios.patch(
                `${api_url}user`,
                { name },
                {
                    withCredentials: true,
                }
            );
            console.log(res.data);
        } catch (error) {
            console.log(error.message);
        }
        setFetching(false);
        setUser({ ...user, name });
        setShowError({
            isError: 'true',
            msg: 'Updated Succefully',
            type: 'success',
        });
        // window.location.reload(false);
    };

    const handlePassword = async (e) => {
        e.preventDefault();
        setPassFetching(true);
        try {
            const res = await axios.patch(
                `${api_url}user/password`,
                { oldPassword, newPassword },
                {
                    withCredentials: true,
                }
            );
            setShowError({
                isError: 'true',
                msg: 'Password updated Succesfully.',
                type: 'success',
            });
            setNewPassword('');
            setOldPassword('');
            setUser(res.data);
        } catch (error) {
            if (error.response.status === 401) {
                setShowError({
                    isError: 'true',
                    msg: 'Old password is incorrect',
                    type: 'error',
                });
            } else {
                setShowError({
                    isError: 'true',
                    msg: 'Something went wrong. Try again later.',
                    type: 'warning',
                });
            }
        }

        setPassFetching(false);
    };
    if (userLoading) {
        return 'loading..';
    }
    return (
        <CardHeader
            sx={{ alignItems: 'flex-start', justifyContent: 'center' }}
            avatar={
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Tooltip
                        title={
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <EditIcon /> Change
                            </div>
                        }
                    >
                        <div onClick={changePhoto}>
                            <label
                                style={{ cursor: 'pointer' }}
                                htmlFor="file-input"
                            >
                                <Avatar
                                    alt={user.name}
                                    src={
                                        'https://images.unsplash.com/photo-1650875808907-52874cdb6b2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80'
                                    }
                                    sx={{ width: 128, height: 128 }}
                                />
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={changePhoto}
                            />
                        </div>
                    </Tooltip>
                    <Typography variant="h2">{user.name}</Typography>
                </Box>
            }
            title={
                <>
                    <Box sx={{ marginTop: '2rem' }}>
                        <form onSubmit={handleUpdate}>
                            <Typography variant="h5">
                                Update User Settings
                            </Typography>
                            <TextField
                                sx={{
                                    marginY: '0.25rem',
                                    maxWidth: '444px',
                                }}
                                id="name"
                                label="Name"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                name="name"
                                autoComplete="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                // helperText={registerFail.name || ' '}
                                // error={registerFail.name}
                            />
                            <TextField
                                sx={{
                                    marginY: '0.25rem',
                                    maxWidth: '444px',
                                }}
                                id="email"
                                label="Email Address"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                name="email"
                                autoComplete="email"
                                disabled
                                value={user.email}
                                // onChange={(e) => setEmail(e.target.value)}
                                // helperText={registerFail.email || ' '}
                                // error={registerFail.email}
                            />
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                                loading={fetching}
                                disableFocusRipple
                            >
                                Update
                            </LoadingButton>
                        </form>
                        <Divider />
                        <form onSubmit={handlePassword}>
                            <Typography variant="h5">
                                Change Password
                            </Typography>

                            <TextField
                                sx={{
                                    marginY: '0.25rem',
                                    maxWidth: '444px',
                                }}
                                name="oldpassword"
                                label="Old Password"
                                fullWidth
                                type="password"
                                id="oldpassword"
                                autoComplete="current-password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                // helperText={registerFail.password || ' '}
                                // error={registerFail.password}
                            />
                            <TextField
                                sx={{
                                    marginY: '0.25rem',
                                    maxWidth: '444px',
                                }}
                                name="password"
                                label="New Password"
                                fullWidth
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                // helperText={registerFail.password || ' '}
                                // error={registerFail.password}
                            />
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                                loading={passFetching}
                                disableFocusRipple
                            >
                                Update password
                            </LoadingButton>
                        </form>
                    </Box>
                    <Snackbar
                        open={showError.isError}
                        autoHideDuration={6000}
                        onClose={() =>
                            setShowError({ ...showError, isError: false })
                        }
                    >
                        <Alert
                            onClose={() =>
                                setShowError({
                                    ...showError,
                                    isError: false,
                                })
                            }
                            severity={showError.type}
                            sx={{ width: '100%' }}
                        >
                            {showError.msg}
                        </Alert>
                    </Snackbar>
                </>
            }
        />
    );
};

export default ProfileSettings;
