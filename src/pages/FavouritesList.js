import { Favorite, FavoriteBorder } from '@mui/icons-material';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    CircularProgress,
    Divider,
    Grid,
    Pagination,
    Skeleton,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api_url, useGlobalContext } from '../context';

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

const Insurance = (props) => {
    const { user, userLoading } = useGlobalContext();
    const { _id, title, createdBy, category, price, description } =
        props.insurance;
    const { company } = props;

    const [isFavourite, setIsFavourite] = useState(false);
    const [loadingFav, setLoadingFav] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (company === undefined) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [company]);

    useEffect(() => {
        if (userLoading) return;
        setLoadingFav(true);
        const man = async () => {
            console.log(user);
            try {
                const res = await axios.get(
                    `${api_url}user/isfavourite?user=${user._id}&insurance=${_id}`
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
                    insurance: _id,
                    user: user._id,
                    userType: user.provider === 'local' ? 'User' : 'OAuthUser',
                },
                { withCredentials: true, 'Content-Type': 'application/json' }
            );
            console.log(res1);
            const res = await axios.get(
                `${api_url}user/isfavourite?user=${user._id}&insurance=${_id}`
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

    return (
        <div>
            {loading ? (
                <InsuranceSkeleton />
            ) : (
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
                            {title}
                            <Checkbox
                                checked={isFavourite}
                                icon={<FavoriteBorder sx={{ color: 'red' }} />}
                                checkedIcon={<Favorite sx={{ color: 'red' }} />}
                                onClick={toggleFavourite}
                            />
                        </Typography>
                        <Typography variant="subtitle1">{category}</Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary">
                            {description}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{ marginTop: '0.5rem' }}
                        >
                            {price} EGP
                        </Typography>
                        <Typography variant="subtitle1">
                            <Link to={`/company/${createdBy}`}>
                                {company.name}
                            </Link>
                        </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button size="small">
                            <Link to={`/insurance/${_id}`}>See More</Link>
                        </Button>
                    </CardActions>
                </Card>
            )}
        </div>
    );
};

const FavouritesList = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [insruances, setInsurances] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [favLoading, setFavLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setFavLoading(true);
        const fetchData = async () => {
            const preRes = await axios.get(`${api_url}user/favourite`, {
                withCredentials: true,
            });
            const { favourites } = preRes.data;

            setData(favourites);
            console.log(data);

            const res2 = await fetch(`${api_url}company`);
            const { companies: companiesData } = await res2.json();
            setCompanies(companiesData);

            setFavLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (favLoading) return;
        if (data.length === 0) {
            setLoading(false);
            return;
        }
        const getInsurances = async () => {
            let list = [];
            for (let index = 0; index < data.length; index++) {
                const insData = await axios.get(
                    `${api_url}insurance/${data[index].insuranceId}`
                );
                list.push(insData.data.insurance);
            }

            setInsurances(list);
            setLoading(false);
        };
        getInsurances();
    }, [favLoading]);

    return (
        <div>
            {loading ? (
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            ) : insruances.length === 0 ? (
                'You have no favourites'
            ) : (
                <div>
                    <Typography variant="h2" sx={{ marginBottom: '3rem' }}>
                        my favourites
                    </Typography>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: 'auto',
                            alignItems: 'center',
                            width: '100vw',
                        }}
                    >
                        {insruances.map((item) => {
                            const company = companies.find(
                                (comp) => comp._id === item.createdBy
                            );
                            return (
                                <Grid
                                    key={item._id}
                                    sx={{
                                        backgroundColor: 'white',
                                        borderRadius: '0.25rem',
                                        width: '40%',
                                        marginBottom: '2rem',
                                    }}
                                >
                                    <Insurance
                                        key={item._id}
                                        insurance={{ ...item }}
                                        company={company}
                                    />
                                </Grid>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
export default FavouritesList;
