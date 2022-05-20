import { Image, Paper } from '@mantine/core';
import { Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { api_url } from '../context';

const HomePartners = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await axios.get(`${api_url}front/companies`);
                setData(res.data.companies);
                setLoading(false);
            } catch (error) {
                console.log('home partners => ', error.response);
            }
        };
        fetchData();
    }, []);

    if (loading) return;

    return (
        <Paper
            withBorder
            sx={(theme) => ({
                backgroundColor:
                    theme.colorScheme === 'dark'
                        ? theme.colors.dark[6]
                        : theme.colors.gray[0],
                padding: '2rem ',
            })}
        >
            <Typography
                variant="h4"
                align="center"
                fontWeight={400}
                mb={'1.5rem'}
                fontFamily={
                    '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji'
                }
            >
                our partners
            </Typography>
            <section
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}
            >
                {data.map((item) => {
                    return (
                        <Paper
                            sx={(theme) => ({
                                textAlign: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                                width: '8rem',
                                height: '8rem',
                                margin: '0.25rem',
                                [theme.fn.smallerThan('sm')]: {
                                    width: '6rem',
                                    height: '6rem',
                                },
                                transition:
                                    'box-shadow 150ms ease, transform 100ms ease',

                                '&:hover': {
                                    boxShadow: `${theme.shadows.md} !important`,
                                    transform: 'scale(1.05)',
                                    cursor: 'default',
                                },
                            })}
                        >
                            <Image src={item.image} alt={item.name} />
                        </Paper>
                    );
                })}
            </section>
        </Paper>
    );
};

export default HomePartners;
