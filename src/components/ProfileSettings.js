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
    Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import { useGlobalContext, api_url } from '../context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FileBase from 'react-file-base64';
import { Image } from '@mantine/core';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    wrapper: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12,1fr)',
        gap: '20px',
        margin: '0 40px',
        [theme.fn.smallerThan('md')]: {
            display: 'block',
        },
    },
    leftSide: {
        gridColumnStart: 1,
        gridColumnEnd: 4,
    },
    rightSide: {
        gridColumnStart: 5,
        gridColumnEnd: 13,
    },
}));

const ProfileSettings = () => {
    const { classes, theme } = useStyles();
    const { user, setUser, userLoading, setIsLoggedIn } = useGlobalContext();
    const [fetching, setFetching] = useState(false);
    const [passFetching, setPassFetching] = useState(false);
    const [deleteFetching, setDeleteFetching] = useState(false);
    const [newImage, setNewImage] = useState('');
    const [showError, setShowError] = useState({});
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (userLoading) return;
        setName(user.name);
        setPhone(user.phone);
        setAge(user.age);
    }, [userLoading]);

    const changePhoto = (e) => {
        e.preventDefault();
        const updateImage = async () => {
            try {
                const res = await axios.patch(
                    `${api_url}user`,
                    { img: newImage },
                    {
                        withCredentials: true,
                    }
                );
                console.log(res.data);
            } catch (error) {
                console.log(error.message);
            }
            setUser({ ...user, name });
            setShowError({
                isError: 'true',
                msg: 'Updated Succefully',
                type: 'success',
            });
        };
        updateImage();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setFetching(true);
        try {
            const res = await axios.patch(
                `${api_url}user`,
                { name, phone, age },
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

    const handleDelete = async (e) => {
        e.preventDefault();
        setDeleteFetching(true);
        try {
            const res = await axios.delete(`${api_url}user/`, {
                withCredentials: true,
            });
            setIsLoggedIn(false);
            navigate('/');
        } catch (error) {
            setShowError({
                isError: 'true',
                msg: 'Something went wrong. Try again later.',
                type: 'warning',
            });
        }
        setDeleteFetching(true);
    };
    if (userLoading) {
        return 'loading..';
    }
    return (
        <main className={classes.wrapper}>
            <Box
                className={classes.leftSide}
                sx={{
                    marginTop: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div>
                    <form onSubmit={changePhoto} htmlFor="file-input">
                        <Avatar
                            alt={user.name}
                            src={newImage === '' ? user.img : newImage}
                            sx={{ width: 128, height: 128 }}
                        />
                        <FileBase
                            type="file"
                            multiple={false}
                            onDone={({ base64 }) => setNewImage(base64)}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </div>
                <Typography variant="h2">{user.name}</Typography>
            </Box>
            <div className={classes.rightSide}>
                <Box
                    sx={{
                        marginTop: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'center',
                    }}
                >
                    <form onSubmit={handleUpdate}>
                        <Typography variant="h5">Update User Info</Typography>
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
                        />
                        <TextField
                            sx={{
                                marginY: '0.25rem',
                                maxWidth: '444px',
                            }}
                            id="age"
                            label="Age"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            name="age"
                            autoComplete="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                        <TextField
                            sx={{
                                marginY: '0.25rem',
                                maxWidth: '444px',
                            }}
                            id="phone"
                            label="phone"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            name="phone"
                            autoComplete="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
                    <Divider orientation="horizontal" />
                    <form onSubmit={handlePassword}>
                        <Typography variant="h5">Change Password</Typography>

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
                    <Divider />

                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="error"
                        sx={{ margin: '16px auto' }}
                        loading={deleteFetching}
                        disableFocusRipple
                        onClick={() => setOpenDeleteDialog(true)}
                    >
                        Delete Account
                    </LoadingButton>
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
                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {'Delete Account'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete your account? all
                            data on this account will be lost and there is no
                            going back
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>
                            cancel
                        </Button>
                        <Button color="error" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </main>
    );
};

export default ProfileSettings;
