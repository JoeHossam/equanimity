import React from 'react';
import {
    createStyles,
    Overlay,
    Container,
    Title,
    Button,
    Text,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
    hero: {
        position: 'relative',
        backgroundImage: 'url(https://wallpaperaccess.com/full/749813.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    container: {
        height: 700,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingBottom: theme.spacing.xl * 6,
        zIndex: 1,
        position: 'relative',

        [theme.fn.smallerThan('sm')]: {
            height: 500,
            paddingBottom: theme.spacing.xl * 3,
        },
    },

    title: {
        color: theme.white,
        fontSize: 60,
        fontWeight: 900,
        lineHeight: 1.1,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 40,
            lineHeight: 1.2,
        },

        [theme.fn.smallerThan('xs')]: {
            fontSize: 28,
            lineHeight: 1.3,
        },
    },

    description: {
        color: theme.white,
        maxWidth: 600,

        [theme.fn.smallerThan('md')]: {
            width: '60%',
        },
        [theme.fn.smallerThan('sm')]: {
            maxWidth: '100%',
            fontSize: theme.fontSizes.sm,
        },
    },

    control: {
        marginTop: theme.spacing.xl * 1.5,

        [theme.fn.smallerThan('sm')]: {
            width: '100%',
        },
    },
}));

export default function HeroContentLeft({ browseSection }) {
    const { classes } = useStyles();
    return (
        <div className={classes.hero}>
            {/* <Overlay
                gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
                opacity={1}
                zIndex={0}
            /> */}
            <Container className={classes.container}>
                <Title className={classes.title}>Equanitmity</Title>
                <Text className={classes.description} size="xl" mt="xl">
                    {/* Equanimity offers various categories and types of insurance
                    contracts to suit all of your needs and offer you the best
                    of the best. */}
                    No one can surely predict the future. But we can help you
                    protect it. Leave the Insurance to Us.
                </Text>

                <Button
                    variant="gradient"
                    size="xl"
                    radius="xl"
                    className={classes.control}
                    onClick={() =>
                        browseSection.current.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                        })
                    }
                >
                    Get started
                </Button>
            </Container>
        </div>
    );
}
