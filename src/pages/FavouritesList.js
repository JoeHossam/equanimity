import { Favorite, FavoriteBorder } from '@mui/icons-material';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    Grid,
    Pagination,
    Skeleton,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Plus } from 'tabler-icons-react';
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

const Insurance = ({ insuranceId, companies }) => {
    const { user, userLoading } = useGlobalContext();
    const [isFavourite, setIsFavourite] = useState(true);
    const [loading, setLoading] = useState(true);
    const [insurance, setInsurance] = useState({});
    const [company, setCompany] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchInsurance = async () => {
            try {
                const res = await axios.get(
                    `${api_url}insurance/${insuranceId}`
                );
                setCompany(
                    companies.find(
                        (comp) => comp._id === res.data.insurance.createdBy
                    )
                );
                setInsurance(res.data.insurance);
                setLoading(false);
            } catch (error) {
                console.log(error.response);
            }
        };
        fetchInsurance();
    }, []);

    useEffect(() => {
        if (userLoading) return;
        const man = async () => {
            try {
                const res = await axios.get(
                    `${api_url}user/isfavourite?user=${user._id}&insurance=${insuranceId}`,
                    { withCredentials: true }
                );
                console.log(res);
                if (res.data.isFavourite === true) {
                    setIsFavourite(true);
                }
            } catch (error) {
                console.log(error.response);
            }
        };
        man();
    }, [userLoading]);

    const toggleFavourite = async () => {
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
    const {
        _id,
        title,
        category,
        description,
        basePrice: price,
        createdBy,
    } = insurance;
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
                            <Box
                                onClick={() => navigate(`/insurance/${_id}`)}
                                sx={{ cursor: 'pointer' }}
                            >
                                {title}
                            </Box>
                            <FormControlLabel
                                sx={{ margin: 0 }}
                                control={
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
                                                }}
                                                variant="outlined"
                                            >
                                                <Plus size={20} />
                                                Save
                                            </Button>
                                        }
                                        checkedIcon={
                                            <Button
                                                disableRipple
                                                size="small"
                                                variant="contained"
                                                sx={{ margin: 0 }}
                                            >
                                                <Check size={20} />
                                                Saved
                                            </Button>
                                        }
                                        onClick={toggleFavourite}
                                    />
                                }
                            />
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/company/${createdBy}`)}
                        >
                            {company.name}
                        </Typography>
                        <Divider />
                        <Typography variant="subtitle1">{category}</Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{ marginTop: '0.5rem' }}
                        >
                            {price} EGP
                        </Typography>
                    </CardContent>
                    <Divider />
                </Card>
            )}
        </div>
    );
};

const FavouritesList = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const preRes = await axios.get(`${api_url}user/favourite`, {
                withCredentials: true,
            });
            const { favourites } = preRes.data;

            setData(favourites);

            const res2 = await fetch(`${api_url}company`);
            const { companies: companiesData } = await res2.json();
            setCompanies(companiesData);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            ) : data.length === 0 ? (
                'You have no favourites'
            ) : (
                <div>
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{ marginBottom: '3rem' }}
                    >
                        saved insurances
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
                        {data.map((item) => {
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
                                        insuranceId={item.insuranceId}
                                        companies={companies}
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
