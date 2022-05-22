import React, { useEffect, useState } from 'react';
import {
    Paper,
    Text,
    TextInput,
    Textarea,
    Button,
    Group,
    SimpleGrid,
    createStyles,
    Title,
} from '@mantine/core';
import { ContactIconsList } from '../ContactIcons/ContactIcons.tsx';
import { Alert, Snackbar, Typography } from '@mui/material';
import axios from 'axios';
import { api_url, useGlobalContext } from '../context';
// import bg from './bg.svg';
const bg = 'https://ui.mantine.dev/_next/static/media/bg.daf91204.svg';

const useStyles = createStyles((theme) => {
    const BREAKPOINT = theme.fn.smallerThan('sm');

    return {
        evenBiggerWrapper: {
            padding: '16px',
        },
        biggerWrapper: {
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        wrapper: {
            display: 'flex',
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[8]
                    : theme.white,
            borderRadius: theme.radius.lg,
            padding: 4,
            border: `1px solid ${
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[8]
                    : theme.colors.gray[2]
            }`,

            [BREAKPOINT]: {
                flexDirection: 'column',
            },
        },

        form: {
            boxSizing: 'border-box',
            flex: 1,
            padding: theme.spacing.xl,
            paddingLeft: theme.spacing.xl * 2,
            borderLeft: 0,

            [BREAKPOINT]: {
                padding: theme.spacing.md,
                paddingLeft: theme.spacing.md,
            },
        },

        fields: {
            marginTop: -12,
        },

        fieldInput: {
            flex: 1,

            '& + &': {
                marginLeft: theme.spacing.md,

                [BREAKPOINT]: {
                    marginLeft: 0,
                    marginTop: theme.spacing.md,
                },
            },
        },

        fieldsGroup: {
            display: 'flex',

            [BREAKPOINT]: {
                flexDirection: 'column',
            },
        },

        contacts: {
            boxSizing: 'border-box',
            position: 'relative',
            borderRadius: theme.radius.lg - 2,
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid transparent',
            padding: theme.spacing.xl,
            flex: '0 0 280px',

            [BREAKPOINT]: {
                marginBottom: theme.spacing.sm,
                paddingLeft: theme.spacing.md,
            },
        },

        title: {
            marginBottom: theme.spacing.xl * 1.5,
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,

            [BREAKPOINT]: {
                marginBottom: theme.spacing.xl,
            },
        },

        control: {
            [BREAKPOINT]: {
                flex: 1,
            },
        },
    };
});

export function GetInTouch() {
    const { classes } = useStyles();

    const { user, isLoggedIn } = useGlobalContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [msg, setMsg] = useState('');

    const [snack, setSnack] = useState({ isOpen: false, msg: '', type: '' });

    useEffect(() => {
        if (isLoggedIn) {
            setName(user.name);
            setEmail(user.email);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name === '' || email === '' || subject === '' || msg === '')
            return setSnack({
                isOpen: true,
                type: 'error',
                msg: 'Please fill all the fields',
            });
        try {
            await axios.post(
                `${api_url}contact`,
                { name, email, subject, msg },
                { withCredentials: true }
            );
            setName('');
            setEmail('');
            setSubject('');
            setMsg('');
            setSnack({
                isOpen: true,
                type: 'success',
                msg: 'Sent Successfully',
            });
        } catch (error) {
            setSnack({
                isOpen: true,
                type: 'error',
                msg: 'An error occured. Please try again later',
            });
            console.log('contactUs => ', error.response);
        }
    };

    return (
        <div className={classes.evenBiggerWrapper}>
            <Title
                align="center"
                sx={(theme) => ({
                    fontWeight: 400,
                    marginBottom: theme.spacing.xl * 1.5,
                })}
            >
                Contact us
            </Title>
            <div className={classes.biggerWrapper}>
                <Paper shadow="md" radius="lg">
                    <div className={classes.wrapper}>
                        <div className={classes.contacts}>
                            <Text
                                size="lg"
                                weight={700}
                                className={classes.title}
                                sx={{ color: '#fff' }}
                            >
                                Contact information
                            </Text>

                            <ContactIconsList variant="white" />
                        </div>

                        <form className={classes.form} onSubmit={handleSubmit}>
                            <Text
                                size="lg"
                                weight={700}
                                className={classes.title}
                            >
                                Get in touch
                            </Text>

                            <div className={classes.fields}>
                                <SimpleGrid
                                    cols={2}
                                    breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                                >
                                    <TextInput
                                        label="Your name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Your name"
                                    />
                                    <TextInput
                                        label="Your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="hello@mantine.dev"
                                        required
                                    />
                                </SimpleGrid>

                                <TextInput
                                    mt="md"
                                    label="Subject"
                                    placeholder="Subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />

                                <Textarea
                                    mt="md"
                                    label="Your message"
                                    placeholder="Please include all relevant information"
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    minRows={3}
                                />

                                <Group position="right" mt="md">
                                    <Button
                                        type="submit"
                                        className={classes.control}
                                    >
                                        Send message
                                    </Button>
                                </Group>
                            </div>
                        </form>
                    </div>
                </Paper>
            </div>
            <Snackbar
                open={snack.isOpen}
                autoHideDuration={6000}
                onClose={() => setSnack({ ...snack, isOpen: false })}
            >
                <Alert
                    onClose={() => setSnack({ ...snack, isOpen: false })}
                    severity={snack.type}
                    sx={{ width: '100%' }}
                >
                    {snack.msg}
                </Alert>
            </Snackbar>
        </div>
    );
}
