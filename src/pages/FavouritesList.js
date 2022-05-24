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
                    <Box>Disabled Insurance</Box>
                </Typography>
                <Divider />
                <Typography variant="subtitle2">
                    This insurance may be under update, suspended, hidden by the
                    company or deleted. Please check on it another time
                </Typography>
            </CardContent>
            <Divider />
        </Card>
    );
};

const Insurance = ({ insuranceId, companies, insurance }) => {
    const { user, userLoading } = useGlobalContext();
    const [isFavourite, setIsFavourite] = useState(true);
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!insurance) return;
        setLoading(true);
        if (company !== '') {
            setLoading(false);
            return;
        }
        setCompany(companies.find((comp) => comp._id === insurance.createdBy));
    }, [company]);

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

    if (!insurance) {
        return <NotFoundInsurance />;
    }
    const { _id, title, category, basePrice: price, createdBy } = insurance;
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
    const [insurances, setInsurances] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const preRes = await axios.get(`${api_url}user/favourite`, {
                withCredentials: true,
            });
            setData(preRes.data.favourites);

            const res = await axios.get(`${api_url}insurance`, {
                withCredentials: true,
            });
            setInsurances(res.data.insurances);

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
                                        insurance={insurances.find(
                                            (ins) =>
                                                ins._id === item.insuranceId
                                        )}
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
