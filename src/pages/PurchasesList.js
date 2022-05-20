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
import { Link, useNavigate } from 'react-router-dom';
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

const Insurance = ({ insuranceId, companies, totalPrice, features }) => {
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
                            onClick={() => navigate(`/insurance/${_id}`)}
                            sx={{ cursor: 'pointer' }}
                            component="div"
                        >
                            {/* <Link to={`/insurance/${_id}`}> */}
                            {title}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/company/${createdBy}`)}
                        >
                            {/* <Link to={`/company/${createdBy}`}> */}
                            {company.name}
                        </Typography>
                        <Divider />
                        {features.length !== 0 && (
                            <>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ marginTop: '0.5rem' }}
                                >
                                    Additional Coverages
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ marginTop: '0.5rem' }}
                                >
                                    {features.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                {item.name} -{' '}
                                                {item.price.toFixed(2)} EGP
                                            </li>
                                        );
                                    })}
                                </Typography>
                            </>
                        )}
                        <Divider />
                        <Typography
                            variant="subtitle2"
                            sx={{ marginTop: '0.5rem' }}
                        >
                            Total {totalPrice} EGP
                        </Typography>
                    </CardContent>
                    <Divider />
                    {/* <CardActions>
                        <Button size="small">
                            <Link to={`/insurance/${_id}`}>See More</Link>
                        </Button>
                    </CardActions> */}
                </Card>
            )}
        </div>
    );
};

const PurchaseList = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const preRes = await axios.get(`${api_url}payment/user`, {
                withCredentials: true,
            });
            const { payments } = preRes.data;
            setData(payments);

            const res = await axios.get(`${api_url}company`);
            setCompanies(res.data.companies);

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
                "You havn't made any purchases yet"
            ) : (
                <div>
                    <Typography variant="h2" sx={{ marginBottom: '3rem' }}>
                        my purchases
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
                                        companies={companies}
                                        {...item}
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
export default PurchaseList;
