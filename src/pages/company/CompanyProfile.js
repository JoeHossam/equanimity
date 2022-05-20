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
import { useGlobalContext, api_url } from '../../context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FileBase from 'react-file-base64';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const CompanyProfile = () => {
    const { companyUser, setCompanyUser, userLoading, setIsCompanyLogged } =
        useGlobalContext();
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
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (userLoading) return;
        setName(companyUser.name);
        setPhone(companyUser.phone);
        setAddress(companyUser.address);
        setEmail(companyUser.email);
    }, [userLoading]);

    const changePhoto = (e) => {
        e.preventDefault();
        const updateImage = async () => {
            try {
                const res = await axios.patch(
                    `${api_url}company/${companyUser._id}`,
                    { img: newImage },
                    {
                        withCredentials: true,
                    }
                );
                console.log(res.data);
            } catch (error) {
                console.log(error.message);
            }
            setCompanyUser({ ...companyUser, name });
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
                `${api_url}company/${companyUser._id}`,
                { name, phone, address, email },
                {
                    withCredentials: true,
                }
            );
            console.log(res.data);
        } catch (error) {
            console.log(error.message);
        }
        setFetching(false);
        setCompanyUser({ ...companyUser, name });
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
                `${api_url}company/${companyUser._id}/password`,
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
            setCompanyUser(res.data);
        } catch (error) {
            console.log(error.response);
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
            const res = await axios.delete(
                `${api_url}company/${companyUser._id}`,
                {
                    withCredentials: true,
                }
            );
            setIsCompanyLogged(false);
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
                    <div>
                        <form onSubmit={changePhoto} htmlFor="file-input">
                            <Avatar
                                alt={companyUser.name}
                                src={
                                    newImage === '' ? companyUser.img : newImage
                                }
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
                    <Typography variant="h2">{companyUser.name}</Typography>
                </Box>
            }
            title={
                <>
                    <Box sx={{ marginTop: '2rem' }}>
                        <form onSubmit={handleUpdate}>
                            <Typography variant="h5">
                                Update Company Settings
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
                            />
                            <TextField
                                sx={{
                                    marginY: '0.25rem',
                                    maxWidth: '444px',
                                }}
                                id="address"
                                label="address"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                name="address"
                                autoComplete="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        <Divider />

                        <LoadingButton
                            type="submit"
                            variant="contained"
                            color="error"
                            sx={{ mt: 2, mb: 2 }}
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
                                Are you sure you want to delete your account?
                                all data on this account will be lost and there
                                is no going back
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
                </>
            }
        />
    );
};

export default CompanyProfile;
