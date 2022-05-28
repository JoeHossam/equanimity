import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api_url } from '../context';
import Loading from './Loading';
import { Box, Group, Image, Text, Title } from '@mantine/core';
import { Avatar } from '@mui/material';

const User = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setuser] = useState({});
    const [err, setErr] = useState({ isErr: false, msg: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${api_url}user/User/${id}`);
                setuser(res.data.user);
            } catch (error) {
                console.log(error.response);
                setErr({ isErr: true, msg: error.response.msg });
            }
        };
        fetchData();
        setLoading(false);
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (err.isErr) {
        return 'Something went wrong';
    }

    return (
        <Box
            sx={(theme) => ({
                display: 'grid',
                gridTemplateColumns: 'repeat(12,1fr)',
                gap: '20px',
                margin: '0 40px',
                paddingTop: '10px',
                [theme.fn.smallerThan('md')]: {
                    display: 'block',
                },
            })}
        >
            <Group
                sx={{
                    gridColumnStart: 1,
                    gridColumnEnd: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Avatar
                    src={user.img}
                    radius="md"
                    sx={{ width: 128, height: 128 }}
                    alt={user.name}
                />
                <Text
                    size="xl"
                    variant=""
                    weight={700}
                    transform="capitalize"
                    align="center"
                    sx={{ display: 'block' }}
                    mb={'2rem'}
                >
                    {user.name}
                </Text>
            </Group>
            <Box
                sx={{
                    gridColumnStart: 5,
                    gridColumnEnd: 13,
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <p>
                        Phone: <br />
                        +20{user.phone}
                    </p>
                    <p>
                        Email: <br />
                        {user.email}
                    </p>
                    <p>
                        Age: <br />
                        {user.age}
                    </p>
                </Box>
            </Box>
        </Box>
    );
};

export default User;
