import { Avatar, Rating, CardHeader, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getData, api_url } from '../getData.js';

const Insurance = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [companyLoading, setCompanyLoading] = useState(true);

    const [insuranceData, setInsuranceData] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [reviewData, setReviewData] = useState([]);

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

    if (loading || companyLoading) {
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
            <p>{category}</p>
            <p>Provided by: {company}</p>
            <p>Price: {price}</p>
            <Rating name="read-only" value={rating} precision={0.5} readOnly />
            <p>{rating}</p>
            <Reviews reviewsData={reviews} />
        </main>
    );
};

const Reviews = ({ reviewsData }) => {
    const [userRating, setUserRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
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

    if (loading) {
        return <h4>'loading reviews..'</h4>;
    }

    return (
        <>
            <h3>Reviews</h3>
            <ul>
                {reviews.map((item) => {
                    return (
                        <li key={item._id}>
                            <CardHeader
                                avatar={
                                    <Avatar alt={item.name} src={item.img} />
                                }
                                title={
                                    <>
                                        <Rating
                                            name="read-only"
                                            value={item.rating}
                                            precision={0.5}
                                            readOnly
                                        />
                                        <br />
                                        {item.name}
                                        <p>{item.comment}</p>
                                    </>
                                }
                            />
                        </li>
                    );
                })}
            </ul>
            <form
                className="leave-review"
                style={{
                    padding: '1rem',
                    margin: '1rem',
                }}
            >
                Leave a review
                <br />
                <TextField id="time" type="text" required />
                <br />
                <Rating
                    name="simple-controlled"
                    value={userRating}
                    precision={0.5}
                    onChange={(event, newValue) => {
                        setUserRating(newValue);
                    }}
                    required
                />
                <Button variant="contained">Submit</Button>
            </form>
        </>
    );
};

export default Insurance;
