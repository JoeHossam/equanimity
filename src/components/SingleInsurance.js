import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Checkbox, Divider, Skeleton, Rating, Box } from '@mui/material';
import { Check, Plus } from 'tabler-icons-react';
import { api_url } from '../getData.js';
import axios from 'axios';
import { useGlobalContext } from '../context';
import { Button as MantineButton } from '@mantine/core';

const InsuranceSkeleton = () => {
    return (
        <>
            <Skeleton variant="rectangular" />
            <br />
            <Skeleton variant="rectangular" height={118} />
            <Skeleton variant="text" />
            <Skeleton variant="rectangular" height={25} />
        </>
    );
};

const SingleInsurance = (props) => {
    const { _id, title, createdBy, category, basePrice, rating, reviewCount } =
        props.insurance;
    const {
        comparing1,
        comparing2,
        setComparing2,
        setComparing1,
        setShowError,
        company,
        insuranceLoading,
    } = props;

    const { user, isLoggedIn } = useGlobalContext();
    const [isFavourite, setIsFavourite] = useState(false);

    const addToCompare = () => {
        if (
            Object.keys(comparing1).length !== 0 &&
            Object.keys(comparing2).length !== 0
        ) {
            return setShowError({
                isError: true,
                type: 'warning',
                msg: 'Compare List already full',
            });
        }
        if (Object.keys(comparing1).length === 0) {
            setComparing1({ ...props.insurance });
            setShowError({
                isError: true,
                type: 'success',
                msg: 'Item added successfully',
            });
            return;
        }
        if (Object.keys(comparing2).length === 0) {
            setComparing2({ ...props.insurance });
            setShowError({
                isError: true,
                type: 'success',
                msg: 'Item added successfully',
            });
            return;
        }
    };
    const toggleFavourite = async () => {
        if (!isLoggedIn)
            return setShowError({
                isError: true,
                type: 'error',
                msg: 'You must login first to save an insurance.',
            });
        try {
            const res1 = await axios.post(
                `${api_url}user/favourite/toggle`,
                {
                    favouriting: !isFavourite,
                    insurance: _id,
                    user: user._id,
                    userType: user.provider === 'local' ? 'User' : 'OAuthUser',
                },
                { withCredentials: true, 'Content-Type': 'application/json' }
            );

            setIsFavourite(res1.data.msg);
        } catch (error) {
            console.log(error.response);
        }
    };
    const [loading, setLoading] = useState(true);
    // const [company, setCompany] = useState('');
    useEffect(() => {
        if (company === undefined) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [company]);

    useEffect(() => {
        const man = async () => {
            try {
                const res = await axios.get(
                    `${api_url}user/isfavourite?insurance=${_id}`,
                    { withCredentials: true }
                );
                if (res.data.isFavourite) {
                    setIsFavourite(true);
                } else {
                    setIsFavourite(false);
                }
            } catch (error) {
                console.error(error);
            }
        };
        man();
    }, []);

    return (
        <div>
            {loading || insuranceLoading ? (
                <InsuranceSkeleton />
            ) : (
                <Card
                    sx={{
                        // border: '1px solid #ccc',
                        boxShadow: `0px 2px 4px -1px rgb(0 0 0 / 20%),
        0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)`,
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <Typography
                                    variant="h5"
                                    sx={{ marginBottom: '0.5rem' }}
                                >
                                    {title}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="subtitle1"
                                    sx={{
                                        lineHeight: 'inherit',
                                        marginBottom: 0,
                                        fontFamily: 'Quicksand',
                                    }}
                                >
                                    <Link
                                        style={{
                                            color: '#faaf00',
                                            fontWeight: 'bolder',
                                        }}
                                        to={`/company/${createdBy}`}
                                    >
                                        {company.name}
                                    </Link>
                                </Typography>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Checkbox
                                    disableRipple
                                    sx={{ padding: 0 }}
                                    checked={isFavourite}
                                    icon={
                                        <Button
                                            disableRipple
                                            size="small"
                                            sx={{
                                                margin: 0,
                                                border: '2px solid #1976d2 !important',
                                                padding: '0 3px',
                                                fontSize: '0.75rem',
                                            }}
                                            variant="outlined"
                                        >
                                            <Plus size={15} />
                                            Save
                                        </Button>
                                    }
                                    checkedIcon={
                                        <Button
                                            disableRipple
                                            size="small"
                                            variant="contained"
                                            sx={{ margin: 0, padding: '0 3px' }}
                                        >
                                            <Check size={15} />
                                            Saved
                                        </Button>
                                    }
                                    onClick={toggleFavourite}
                                />
                                <Typography variant="caption" align="right">
                                    {category}
                                </Typography>
                            </div>
                        </Typography>
                        <Divider sx={{ margin: '0.5rem 0' }} />
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{ marginTop: '0.5rem', fontWeight: 'bold' }}
                            >
                                {basePrice} EGP
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-end',
                                }}
                            >
                                <Rating
                                    readOnly
                                    value={rating}
                                    precision={0.5}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant="h6">
                                        {rating.toFixed(2)}
                                    </Typography>
                                    <div style={{ fontSize: '12px' }}>
                                        {reviewCount} reviews
                                    </div>
                                </div>
                            </Box>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button
                            size="small"
                            sx={{
                                fontSize: '12px !important',
                                lineHeight: 'inherit',
                            }}
                        >
                            <Link
                                style={{ fontSize: '12px' }}
                                to={`/insurance/${_id}`}
                            >
                                See More
                            </Link>
                        </Button>
                        <Button
                            onClick={addToCompare}
                            sx={{
                                fontSize: '12px !important',
                                lineHeight: 'inherit',
                            }}
                            size="small"
                        >
                            Add to Compare
                        </Button>
                    </CardActions>
                </Card>
            )}
        </div>
    );
};

export default SingleInsurance;
