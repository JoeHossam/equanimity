import {
    Avatar,
    Button,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    MenuItem,
    Rating,
    Select,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api_url } from '../../context';
import Loading from '../Loading';

const AdminReviews = () => {
    const [loading, setLoading] = useState(true);
    const [openDelModal, setOpenDelModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [sortBy, setSortBy] = useState('dateup');
    useEffect(() => {
        setLoading(true);
        const fetchRev = async () => {
            try {
                const res = await axios.get(`${api_url}review`, {
                    withCredentials: true,
                });
                const revs = res.data.reviews;
                const res2 = await axios.get(`${api_url}insurance`);
                const res3 = await axios.get(`${api_url}user`, {
                    withCredentials: true,
                });
                console.log(res3);
                setReviews(
                    revs.map((item) => {
                        return {
                            ...item,
                            insuranceName: res2.data.insurances.find(
                                (item2) => item2._id === item.insuranceId
                            ),
                            userName:
                                res3.data.users.find(
                                    (item2) => item2._id === item.userId
                                ) ||
                                res3.data.authUsers.find(
                                    (item2) => item2._id === item.userId
                                ),
                        };
                    })
                );

                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(error);
            }
        };
        fetchRev();
    }, []);

    useEffect(() => {
        switch (sortBy) {
            case 'ratingup':
                setReviews(reviews.sort((a, b) => b.rating - a.rating));
                break;

            case 'ratingdown':
                setReviews(reviews.sort((a, b) => a.rating - b.rating));
                break;

            case 'dateup':
                setReviews(
                    reviews.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
                );
                break;

            case 'datedown':
                setReviews(
                    reviews.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
                );
                break;
        }
    }, [sortBy]);

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`${api_url}review/${deleteId}`, {
                withCredentials: true,
            });
        } catch (error) {
            console.log(error.response);
        }
    };

    if (loading) {
        return <Loading />;
    }
    return (
        <>
            <DialogActions
                sx={{ justifyContent: 'space-evenly', flexDirection: 'column' }}
            >
                <Typography variant="h4">{'Reviews'}</Typography>
                <Select
                    size="small"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <MenuItem value="ratingup">Lower Rating</MenuItem>
                    <MenuItem value="ratingdown">Higher Rating</MenuItem>
                    <MenuItem value="dateup">Oldest</MenuItem>
                    <MenuItem value="datedown">Newest</MenuItem>
                </Select>
            </DialogActions>
            <DialogContent>
                <DialogContentText component={'div'}>
                    <ul style={{}}>
                        {reviews.map((item) => {
                            console.log(item.insuranceName);
                            return (
                                <>
                                    <li
                                        key={item._id}
                                        style={{
                                            backgroundColor: 'white',
                                            margin: '1rem 0',
                                            border: '1px solid #ccc',
                                        }}
                                    >
                                        <CardHeader
                                            sx={{ alignItems: 'flex-start' }}
                                            avatar={
                                                <Avatar
                                                    // alt={item.userName}
                                                    src={item.userName.img}
                                                />
                                            }
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
                                                        <div>
                                                            {item.userName.name}
                                                        </div>
                                                        <div>
                                                            <Link
                                                                to={`/insurance/${item.insuranceId}`}
                                                                target="_blank"
                                                            >
                                                                {item
                                                                    .insuranceName
                                                                    .title ||
                                                                    'deleted Insurance'}
                                                            </Link>
                                                            <Button
                                                                sx={{
                                                                    marginLeft:
                                                                        '1rem',
                                                                }}
                                                                variant="contained"
                                                                onClick={() => {
                                                                    setOpenDelModal(
                                                                        true
                                                                    );
                                                                    setDeleteId(
                                                                        item._id
                                                                    );
                                                                }}
                                                                color="error"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </Typography>

                                                    <Rating
                                                        name="read-only"
                                                        value={item.rating}
                                                        readOnly
                                                    />
                                                    {item.comment && (
                                                        <>
                                                            <Divider />
                                                            <p
                                                                style={{
                                                                    margin: '18px 0',
                                                                    whiteSpace:
                                                                        'pre',
                                                                }}
                                                            >
                                                                {item.comment}
                                                            </p>
                                                        </>
                                                    )}
                                                </>
                                            }
                                        />
                                    </li>
                                    <Divider />
                                </>
                            );
                        })}
                    </ul>
                </DialogContentText>
            </DialogContent>
            <Dialog
                open={openDelModal}
                onClose={() => setOpenDelModal(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Delete Review?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this review
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelModal(false)}>
                        Cancel
                    </Button>
                    <Button color="error" onClick={handleDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminReviews;
