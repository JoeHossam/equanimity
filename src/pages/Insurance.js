import { Favorite, FavoriteBorder } from '@mui/icons-material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
    FormControlLabel,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGlobalContext } from '../context.js';
import { getData, api_url } from '../getData.js';

const Insurance = () => {
    const { id } = useParams();
    const { user, userLoading, isLoggedIn } = useGlobalContext();
    const [loading, setLoading] = useState(true);
    const [companyLoading, setCompanyLoading] = useState(true);
    const [isFavourite, setIsFavourite] = useState(false);
    const [loadingFav, setLoadingFav] = useState(true);
    const [insuranceData, setInsuranceData] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [reviewData, setReviewData] = useState([]);
    const [selectedList, setSelectedList] = useState([]);
    const [baseList, setBaseList] = useState([]);
    const [favs, setFavs] = useState(0);

    useEffect(() => {
        if (userLoading) return;
        setLoadingFav(true);
        const man = async () => {
            console.log(user);
            try {
                const res = await axios.get(
                    `${api_url}user/isfavourite?insurance=${id}`,
                    { withCredentials: true }
                );
                console.log(res);
                setFavs(res.data.count);
                if (res.data.isFavourite) {
                    setIsFavourite(true);
                } else {
                    setIsFavourite(false);
                }
            } catch (error) {
                console.log(error);
            }
            setLoadingFav(false);
        };
        man();
    }, [userLoading, isFavourite]);

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
        if (insuranceData.length === 0 || loading) {
            return;
        }
        const fetchCompanyData = async () => {
            const createdBy = insuranceData.insurance.createdBy;
            const comRes = await fetch(`${api_url}company/${createdBy}`);
            const comData = await comRes.json();
            setCompanyData(comData);
            setSelectedList(
                insuranceData.insurance.features.map((item) => {
                    return { ...item, checked: false };
                })
            );
            setBaseList(insuranceData.insurance.baseFeatures);
            setCompanyLoading(false);
        };
        fetchCompanyData();
    }, [loading]);

    const toggleFavourite = async () => {
        setLoadingFav(true);
        setIsFavourite(!isFavourite);
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
            console.log(res);

            if (res.data.isFavourite) {
                setIsFavourite(true);
            } else {
                setIsFavourite(false);
            }
        } catch (error) {
            console.log('here');
            console.log(error.response);
            setIsFavourite(false);
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
        basePrice,
        rating, //add rating component mui
        reviewCount,
        description,
        features,
    } = insuranceData.insurance;

    // Get Company
    const company = companyData.company.name;

    // Get Reviews
    const { reviews } = reviewData;
    return (
        <main
            style={{
                display: 'flex',
                padding: '1rem',
            }}
        >
            <div style={{ padding: '2rem', width: '100%' }}>
                <Typography variant="h1">{title}</Typography>
                <Typography variant="h5">Category: {category}</Typography>
                <br />
                <Typography variant="h5">
                    Provided by:{' '}
                    <Link
                        style={{
                            textDecoration: 'underline',
                        }}
                        to={`/company/${companyData.company._id}`}
                    >
                        <Typography sx={{ width: 'fit-content' }} variant="h5">
                            {company}
                        </Typography>
                    </Link>
                </Typography>
                <br />
                <Typography variant="h5">
                    Base Price: {basePrice} EGP
                </Typography>
                <br />
                <Typography variant="h5">Base Services</Typography>
                <ul>
                    {baseList.map((item, index) => {
                        return (
                            <li key={index}>
                                <Typography variant="body1">
                                    - {item}
                                </Typography>
                            </li>
                        );
                    })}
                </ul>
                <br />
                <Typography variant="h5">Description</Typography>
                <Typography style={{ whiteSpace: 'pre' }}>
                    {description}
                </Typography>
                <br />
                <Typography variant="h5">
                    Rating: {rating.toFixed(2)}
                </Typography>
                <Rating
                    name="read-only"
                    value={rating}
                    precision={0.2}
                    readOnly
                />
                <br />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isFavourite}
                            icon={<FavoriteBorder sx={{ color: 'red' }} />}
                            checkedIcon={<Favorite sx={{ color: 'red' }} />}
                            onClick={toggleFavourite}
                        />
                    }
                    label={favs}
                />
                <Reviews
                    reviewsData={reviews}
                    insuranceId={id}
                    setReviewData={setReviewData}
                />
            </div>
            <div
                style={{
                    height: '100%',
                }}
            >
                <TableContainer component={Paper}>
                    <Table
                        sx={{
                            minWidth: 650,
                            maxWidth: 800,
                            maxHeight: 'fit-content',
                            '& .MuiTableCell-root': {
                                fontSize: '1rem !important',
                            },
                        }}
                        aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" colSpan={2}>
                                    <Typography variant="h5">
                                        Services
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="h5">Price</Typography>
                                </TableCell>
                                <TableCell
                                    style={{ width: 'min-width' }}
                                    align="right"
                                >
                                    {/* <Typography variant="h5">Services</Typography> */}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    Base Services total
                                </TableCell>
                                <TableCell align="right">{basePrice}</TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ color: 'green' }}
                                >
                                    {'+' + basePrice}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant="h5">
                                        Additional Services
                                    </Typography>
                                </TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell
                                    style={{ width: 'min-width' }}
                                    align="right"
                                ></TableCell>
                            </TableRow>
                            {selectedList.map((row) => (
                                <TableRow
                                    key={row._id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell style={{ width: 40 }}>
                                        <Checkbox
                                            checked={row.checked}
                                            onClick={() =>
                                                setSelectedList(
                                                    selectedList.map((item) => {
                                                        if (
                                                            item._id !== row._id
                                                        )
                                                            return item;
                                                        return {
                                                            ...item,
                                                            checked:
                                                                !item.checked,
                                                        };
                                                    })
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.price}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ color: 'green' }}
                                    >
                                        {row.checked && '+' + row.price}
                                    </TableCell>
                                </TableRow>
                            ))}

                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant="h5">
                                        Estimated Price
                                    </Typography>
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">
                                    <Typography variant="h5">
                                        {selectedList.reduce(
                                            (total, current) => {
                                                if (current.checked)
                                                    total += current.price;
                                                return total;
                                            },
                                            basePrice
                                        )}{' '}
                                        EGP
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Button
                        variant="contained"
                        sx={{ float: 'right', margin: '1rem' }}
                    >
                        Proceed to payment
                    </Button>
                </TableContainer>
                <Typography
                    variant="body1"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginY: '2rem',
                        justifyContent: 'center',
                    }}
                >
                    <InfoOutlinedIcon sx={{ marginX: '1rem' }} />
                    Note that this price is affected by your age, weither you
                    have chronic disease, or any other personal information you
                    have previously submitted.
                </Typography>{' '}
            </div>
        </main>
    );
};

const Reviews = ({ reviewsData, insuranceId, setReviewData }) => {
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { isLoggedIn } = useGlobalContext();

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
            const revRes = await fetch(`${api_url}review/${insuranceId}`);
            const revData = await revRes.json();
            setReviewData(revData);
        } catch (error) {
            if (error.response.status === 401) {
                if (!isLoggedIn) {
                    setError('You must Login first');
                    setSubmitting(false);
                    return;
                }
                setError('There has been an error try again later');
                setSubmitting(false);
                return;
            }
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
                    maxHeight: '80%',
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
                                                            whiteSpace: 'pre',
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
                    height: 'auto',
                    // display: 'grid',
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
                    // sx={{ fontSize: '1.6rem !important' }}
                    value={userRating}
                    onChange={(event, newValue) => {
                        setUserRating(newValue);
                    }}
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
