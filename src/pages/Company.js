import { Box, Group, Image, Text, Title } from '@mantine/core';
import { Divider, Link } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api_url } from '../getData.js';

const Company = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [company, setCompanyData] = useState([]);
    const [insurances, setInsurances] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchCompanyData = async () => {
            const comRes = await fetch(`${api_url}company/${id}`);
            const { company } = await comRes.json();
            setCompanyData(company);
        };
        fetchCompanyData();
    }, [id]);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${api_url}insurance?company=${company._id}`
                );
                setInsurances(res.data.insurances);
            } catch (error) {
                console.log(error.response);
            }
        };
        fetchData();
        setLoading(false);
    });

    if (loading) {
        return 'loading...';
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
                }}
            >
                <Image
                    src={company.img}
                    radius="md"
                    width={'100%'}
                    alt={company.name}
                />
                <Box sx={{ width: '100%' }}>
                    <Text
                        size="xl"
                        variant=""
                        weight={700}
                        transform="capitalize"
                        align="center"
                        sx={{ display: 'block' }}
                        mb={'2rem'}
                    >
                        {company.name}
                    </Text>
                    <p>
                        Phone: <br />
                        +20{company.phone}
                    </p>
                    <p>
                        Email: <br />
                        {company.email}
                    </p>
                    <p>
                        Address: <br />
                        {company.address}
                    </p>
                </Box>
            </Group>
            <Box
                sx={{
                    gridColumnStart: 5,
                    gridColumnEnd: 13,
                }}
            >
                <Title order={2} weight={500} transform="capitalize">
                    Insurances
                </Title>
                <ul
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {insurances.length === 0
                        ? 'Company has no insurances on our website yet'
                        : insurances.map((item) => {
                              return (
                                  <li
                                      key={item._id}
                                      style={{
                                          width: '100%',
                                          minHeight: '30px',
                                      }}
                                  >
                                      <Link href={`/insurance/${item._id}`}>
                                          {item.title}
                                      </Link>
                                  </li>
                              );
                          })}
                </ul>
            </Box>
        </Box>
    );
};

export default Company;
