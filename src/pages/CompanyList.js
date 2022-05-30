import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api_url } from '../getData.js';

const CompanyList = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

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
                {data.map((item) => {
                    return (
                        <li style={{}} key={item._id}>
                            <Link to={`/company/${item._id}`}>
                                <h4>{item.name}</h4>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </Box>
    );
};

export default CompanyList;
