import { Paper, Text, Title } from '@mantine/core';
import { Typography } from '@mui/material';
import React from 'react';
import { UserInfoAction } from '../components/AboutTeam.tsx';
import { GetInTouch } from '../components/ContactUs';
import { FaqSimple } from '../components/FrequentlyAskedQuestions';

const About = () => {
    const team = [
        {
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
            job: 'Head of IT Department',
            name: 'Youssef Hossam',
            email: 'youssefhossam@equanimity.com',
            phone: '+201000000000',
        },
        {
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
            job: 'Head of the business department',
            name: 'Youssef Amr',
            email: 'youssefamr@equanimity.com',
            phone: '+201000000000',
        },
        {
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
            job: 'Head of the analysis and design Department',
            name: 'Alaa Mohamed',
            email: 'alaa@equanimity.com',
            phone: '+201000000000',
        },
        {
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
            job: 'An IT Developer',
            name: 'Noha Hossam',
            email: 'nohahossam@equanimity.com',
            phone: '+201000000000',
        },
        {
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
            job: 'A senior leader',
            name: 'Mohamed Hosny',
            email: 'mohamedhorny@equanimity.com',
            phone: '+201000000000',
        },
        {
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
            job: 'A system analyst',
            name: 'Amr Ali',
            email: 'amrali@equanimity.com',
            phone: '+201000000000',
        },
    ];
    return (
        <>
            <FaqSimple />
            <Paper
                sx={(theme) => ({
                    padding: '2rem 5rem',
                    backgroundColor:
                        theme.colorScheme === 'dark'
                            ? theme.colors.dark[6]
                            : theme.colors.gray[0],
                    [theme.fn.smallerThan('sm')]: {
                        padding: '1rem 0.1rem',
                    },
                })}
            >
                <Title
                    align="center"
                    sx={(theme) => ({
                        fontWeight: 400,
                        marginBottom: theme.spacing.xl * 1.5,
                    })}
                >
                    Meet our team
                </Title>
                <Paper
                    sx={(theme) => ({
                        padding: '2rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        [theme.fn.smallerThan('sm')]: {
                            gridTemplateColumns: '1fr 1fr',
                        },
                    })}
                >
                    {team.map((item, index) => (
                        <UserInfoAction key={index} {...item} />
                    ))}
                </Paper>
            </Paper>
            <GetInTouch />
        </>
    );
};

export default About;
