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

const Insurance = ({
    companyName,
    insuranceName,
    insuranceId,
    companyId,
    totalPrice,
    features,
}) => {
    const navigate = useNavigate();
    return (
        <div>
            <Card>
                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h5"
                        onClick={() => navigate(`/insurance/${insuranceId}`)}
                        sx={{ cursor: 'pointer' }}
                        component="div"
                    >
                        {insuranceName}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/company/${companyId}`)}
                    >
                        {/* <Link to={`/company/${createdBy}`}> */}
                        {companyName}
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
            </Card>
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
            ) : data.length === 0 ? (
                <Typography>You haven't made any purchases yet.</Typography>
            ) : (
                <div>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{ marginBottom: '3rem' }}
                    >
                        purchases
                    </Typography>
                    <div>
                        {data.map((item) => {
                            return (
                                <Grid
                                    key={item._id}
                                    sx={{
                                        backgroundColor: 'white',
                                        borderRadius: '0.25rem',
                                        width: '100%',
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
        </Box>
    );
};
export default PurchaseList;
