import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Rating,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { api_url, useGlobalContext } from '../context';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';

const ProfileReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [insurances, setInsurances] = useState([]);
    const [reviewLoading, setReviewLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const { user, userLoading } = useGlobalContext();
    useEffect(() => {
        if (userLoading) return;
        setReviewLoading(true);
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${api_url}review/user/${user._id}`,
                    { withCredentials: true }
                );
                setReviews(res.data.reviews);
                setReviewLoading(false);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, [userLoading]);

    useEffect(() => {
        if (reviewLoading) return;
        if (reviews.length === 0) {
            setLoading(false);
            return;
        }
        const getInsurances = async () => {
            try {
                let list = [];
                for (let index = 0; index < reviews.length; index++) {
                    const insData = await axios.get(
                        `${api_url}insurance/${reviews[index].insuranceId}`
                    );
                    const { title, _id } = insData.data.insurance;
                    list.push({ title, _id });
                }

                setInsurances(list);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };
        getInsurances();
    }, [reviews]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 150px)',
            }}
        >
            {loading ? (
                <CircularProgress />
            ) : reviews.length === 0 ? (
                <Typography>You haven't made any reviews.</Typography>
            ) : (
                <Reviews
                    reviews={reviews}
                    setReviews={setReviews}
                    insurances={insurances}
                />
            )}
        </Box>
    );
};

const Reviews = ({ reviews, setReviews, insurances }) => {
    const [open, setOpen] = useState(false);
    const [snack, setSnack] = useState({
        open: false,
        msg: '',
        type: 'success',
    });
    const [reviewId, setReviewId] = useState({});
    const [editComment, setEditComment] = useState('');
    const [editRating, setEditRating] = useState(0);
    const [isDelete, setIsDelete] = useState(false);

    const openEdit = (review) => {
        setReviewId(review._id);
        setEditComment(review.comment);
        setEditRating(review.rating);
        setIsDelete(false);
        setOpen(true);
    };

    const updateReview = async () => {
        try {
            const res = await axios.patch(
                `${api_url}review/${reviewId}`,
                {
                    rating: editRating,
                    comment: editComment,
                },
                { withCredentials: 'true' }
            );
            const { updatedReview } = res.data;
            setReviews(
                reviews.map((item) => {
                    if (item._id !== updatedReview._id) return item;
                    return updatedReview;
                })
            );
            setOpen(false);
            setSnack({
                open: true,
                msg: 'Updated Successfully',
                type: 'success',
            });
        } catch (error) {
            setSnack({ open: true, msg: error.message, type: 'error' });
        }
    };

    const openDelete = (id) => {
        setReviewId(id);
        setIsDelete(true);
        setOpen(true);
    };

    const deleteReview = async () => {
        try {
            await axios.delete(`${api_url}review/${reviewId}`, {
                withCredentials: true,
            });
            setReviews(
                reviews.filter((item) => {
                    if (item._id !== reviewId) return item;
                })
            );
            setOpen(false);
            setIsDelete(false);
            setSnack({
                open: true,
                msg: 'Deleted Successfully',
                type: 'success',
            });
        } catch (error) {
            setSnack({ open: true, msg: error.message, type: 'error' });
        }
    };
    return (
        <div>
            <Typography
                variant="h4"
                align="center"
                sx={{ marginBottom: '3rem' }}
            >
                my reviews
            </Typography>
            <ul
                style={{
                    borderBlockEnd: '1',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '60vw',
                }}
            >
                {reviews.map((item) => {
                    if (
                        !insurances.find((ins) => ins._id === item.insuranceId)
                    ) {
                        return <NotFoundInsurance />;
                    }
                    return (
                        <>
                            <li
                                key={item._id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '0.25rem',
                                    width: '100%',
                                    marginBottom: '2rem',
                                }}
                            >
                                <CardHeader
                                    sx={{
                                        alignItems: 'flex-start',
                                    }}
                                    title={
                                        <>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <Link
                                                    to={`/insurance/${item.insuranceId}`}
                                                >
                                                    {
                                                        insurances.find(
                                                            (ins) =>
                                                                ins._id ===
                                                                item.insuranceId
                                                        ).title
                                                    }
                                                </Link>
                                                <ButtonGroup>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() =>
                                                            openEdit(item)
                                                        }
                                                    >
                                                        <EditIcon />
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        variant="contained"
                                                        onClick={() =>
                                                            openDelete(item._id)
                                                        }
                                                    >
                                                        <ClearIcon />
                                                    </Button>
                                                </ButtonGroup>
                                            </Typography>

                                            <Rating
                                                name="read-only"
                                                value={item.rating}
                                                precision={0.5}
                                                readOnly
                                            />
                                            {item.comment && (
                                                <>
                                                    <Divider />
                                                    <p
                                                        style={{
                                                            margin: '18px 0',
                                                        }}
                                                    >
                                                        {item.comment}
                                                    </p>
                                                </>
                                            )}
                                        </>
                                    }
                                />
                                <Divider />
                            </li>
                        </>
                    );
                })}
            </ul>
            <Dialog
                open={open}
                maxWidth="md"
                fullWidth={!isDelete}
                onClose={() => setOpen(false)}
            >
                {isDelete ? (
                    <>
                        <DialogTitle>Delete Review</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this insurance
                            </DialogContentText>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                }}
                            >
                                <Button color="error" onClick={deleteReview}>
                                    Delete
                                </Button>
                                <Button
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </DialogContent>
                    </>
                ) : (
                    <>
                        <DialogTitle>Edit Review</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Rating
                                    value={editRating}
                                    size="large"
                                    onChange={(event, newValue) => {
                                        setEditRating(newValue);
                                    }}
                                />
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Review"
                                sx={{ minWidth: '400px' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={editComment}
                                onChange={(event) => {
                                    setEditComment(event.target.value);
                                }}
                                fullWidth
                                variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => updateReview()}>
                                Update
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
            <Snackbar
                open={snack.open}
                autoHideDuration={6000}
                onClose={() => setSnack({ ...snack, open: false })}
            >
                <Alert
                    onClose={() => setSnack({ ...snack, open: false })}
                    severity={snack.type}
                    sx={{ width: '100%' }}
                >
                    {snack.msg}
                </Alert>
            </Snackbar>
        </div>
    );
};

const NotFoundInsurance = () => {
    return (
        <Card>
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h5"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                    component="div"
                >
                    <Box>Review on Disabled Insurance</Box>
                </Typography>
                <Divider />
                <Typography variant="subtitle2">
                    This insurance may be under update, suspended or hidden by
                    the company. Please check on it another time.
                </Typography>
            </CardContent>
            <Divider />
        </Card>
    );
};

export default ProfileReviews;
