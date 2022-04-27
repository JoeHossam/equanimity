import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Avatar,
    Rating,
    CardHeader,
    TextField,
    Button,
    Checkbox,
    Divider,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalContext } from '../context.js';
import { getData, api_url } from '../getData.js';

const Insurance = () => {
    const { id } = useParams();
    const { user, userLoading } = useGlobalContext();
    const [loading, setLoading] = useState(true);
    const [companyLoading, setCompanyLoading] = useState(true);
    const [isFavourite, setIsFavourite] = useState(false);
    const [loadingFav, setLoadingFav] = useState(true);
    const [insuranceData, setInsuranceData] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [reviewData, setReviewData] = useState([]);

    useEffect(() => {
        if (userLoading) return;
        setLoadingFav(true);
        const man = async () => {
            console.log(user);
            try {
                const res = await axios.get(
                    `${api_url}user/isfavourite?user=${user._id}&insurance=${id}`
                );
                console.log(res.data);
                if (res.data.isFavourite === true) {
                    setIsFavourite(true);
                }
            } catch (error) {
                console.log(error);
            }
            setLoadingFav(false);
        };
        man();
    }, [userLoading]);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const insRes = await fetch(`${api_url}insurance/${id}`);
            const insData = await insRes.json();
            setInsuranceData(insData);

            const revRes = await fetch(`${api_url}review/${id}`);
            const revData = await revRes.json();
            setReviewData(revData);

            setLoading(false);
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (insuranceData === [] || loading) {
            return;
        }
        const fetchCompanyData = async () => {
            const createdBy = insuranceData.insurance.createdBy;
            const comRes = await fetch(`${api_url}company/${createdBy}`);
            const comData = await comRes.json();
            setCompanyData(comData);
            setCompanyLoading(false);
        };
        fetchCompanyData();
    }, [loading]);

    const toggleFavourite = async () => {
        setLoadingFav(true);
        setIsFavourite(!isFavourite);
        console.log(user);
        console.log(!isFavourite);
        try {
            const res1 = await axios.post(
                `${api_url}user/favourite/toggle`,
                {
                    favouriting: !isFavourite,
                    insurance: id,
                    user: user._id,
                    userType: user.provider === 'local' ? 'User' : 'OAuthUser',
                },
                { withCredentials: true, 'Content-Type': 'application/json' }
            );
            console.log(res1);
            const res = await axios.get(
                `${api_url}user/isfavourite?user=${user._id}&insurance=${id}`
            );
            if (res.data.isFavourite) {
                setIsFavourite(true);
            } else {
                setIsFavourite(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (loading || companyLoading || userLoading) {
        return <h2>loading..</h2>;
    }

    // Insurance
    const {
        title,
        category,
        createdBy,
        price,
        rating, //add rating component mui
        reviewCount,
        description,
    } = insuranceData.insurance;

    // Get Company
    const company = companyData.company.name;

    // Get Reviews
    const { reviews } = reviewData;
    return (
        <main className="section">
            <h3>{title}</h3>
            <p>Category: {category}</p>
            <p>Provided by: {company}</p>
            <p>Price: {price}</p>
            <Rating name="read-only" value={rating} precision={0.5} readOnly />
            <p>Rating: {rating.toFixed(2)}</p>
            <Checkbox
                checked={isFavourite}
                icon={<FavoriteBorder sx={{ color: 'red' }} />}
                checkedIcon={<Favorite sx={{ color: 'red' }} />}
                onClick={toggleFavourite}
            />
            <Reviews reviewsData={reviews} insuranceId={id} />
        </main>
    );
};

const Reviews = ({ reviewsData, insuranceId }) => {
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (reviewsData === []) {
            return;
        }
        const fetchReviewData = async () => {
            let newReviews = [];

            for (const review of reviewsData) {
                const res = await fetch(
                    `${api_url}user/${review.user_type}/${review.userId}`
                );
                const user = await res.json();
                newReviews.push({ ...review, name: user.name, img: user.img });
            }
            console.log(newReviews);
            setReviews(newReviews);
            setLoading(false);
        };
        fetchReviewData();
    }, [reviewsData]);

    const submitReview = async (e) => {
        e.preventDefault();
        setError('');
        if (userRating === 0) {
            setError('Rating is requierd');
            return;
        }
        setSubmitting(true);
        try {
            const res = await axios.post(
                `${api_url}review/${insuranceId}`,
                {
                    rating: userRating,
                    comment: userComment,
                },
                { withCredentials: true }
            );
        } catch (error) {
            setError('you have already reviewed this insurance');
        }
        setSubmitting(false);
    };

    if (loading) {
        return <h4>'loading reviews..'</h4>;
    }

    return (
        <div style={{ maxWidth: '600px' }}>
            <h3>Reviews</h3>
            <ul
                style={{
                    overflow: 'auto',
                    maxHeight: '80vh',
                    borderBlockEnd: '1',
                }}
            >
                {reviews.map((item) => {
                    return (
                        <>
                            <li
                                key={item._id}
                                style={{
                                    backgroundColor: 'white',
                                }}
                            >
                                <CardHeader
                                    sx={{ alignItems: 'flex-start' }}
                                    avatar={
                                        <Avatar
                                            alt={item.name}
                                            src={item.img}
                                        />
                                    }
                                    title={
                                        <>
                                            <Typography variant="h6">
                                                {item.name}
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
                            </li>
                            <Divider />
                        </>
                    );
                })}
            </ul>
            <Divider />
            <form
                className="leave-review"
                onSubmit={submitReview}
                style={{
                    padding: '1rem',
                    backgroundColor: 'transparent',
                    display: 'grid',
                }}
            >
                <TextField
                    multiline
                    fullWidth
                    size="small"
                    minRows="3"
                    maxRows="5"
                    label="Leave a review"
                    id="review"
                    type="text"
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                />
                <Divider />
                <Rating
                    sx={{ fontSize: '1.6rem !important' }}
                    name="simple-controlled"
                    value={userRating}
                    precision={0.5}
                    onChange={(event, newValue) => {
                        setUserRating(newValue);
                    }}
                    required
                />
                <LoadingButton
                    loading={submitting}
                    type="submit"
                    variant="contained"
                >
                    Submit
                </LoadingButton>
                <Snackbar
                    open={error !== ''}
                    autoHideDuration={6000}
                    onClose={() => setError('')}
                >
                    <Alert
                        onClose={() => setError('')}
                        severity="error"
                        sx={{ width: '100%' }}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            </form>
        </div>
    );
};

export default Insurance;
