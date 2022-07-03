import { Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api_url } from '../getData.js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

const CompanyList = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const res = await fetch(`${api_url}company`);
            const { companies } = await res.json();
            setData(companies);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return 'loading...';
    }

    return (
        <Box sx={{ margin: '1rem', padding: '0.5rem' }}>
            <ul
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    sx={{
                        width: '100%',
                        margin: 'auto',
                        padding: '1rem',
                        justifyContent: 'space-evenly',
                    }}
                >
                    {data.map((item) => {
                        return (
                            <Card
                                sx={{ minWidth: 345, margin: '1rem' }}
                                onClick={() => navigate(`/company/${item._id}`)}
                            >
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="240px"
                                        image={`${item.img}`}
                                        alt={`${item.name}`}
                                    />
                                    <CardContent>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="div"
                                            // fontWeight="700"
                                        >
                                            {item.name}
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            color="text.secondary"
                                        >
                                            <Typography variant="caption">
                                                HOTLINE
                                            </Typography>
                                            <b>{item.phone}</b>
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        );
                    })}
                </Grid>
            </ul>
        </Box>
    );
};

export default CompanyList;
