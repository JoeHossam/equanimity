import React, { useEffect, useState } from 'react';
import {
    createStyles,
    Title,
    SimpleGrid,
    Text,
    Button,
    ThemeIcon,
    Grid,
    Col,
} from '@mantine/core';
import {
    ReceiptOff,
    AdjustmentsAlt,
    ShieldLock,
    Flame,
    ShieldCheck,
    CreditCard,
    ArrowNarrowRight,
} from 'tabler-icons-react';
import axios from 'axios';
import Loading from '../pages/Loading';
import { api_url } from '../context';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
    wrapper: {
        padding: `${theme.spacing.xl * 2}px ${theme.spacing.xl}px`,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: 36,
        fontWeight: 900,
        lineHeight: 1.1,
        marginBottom: theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
}));

const features = [
    {
        icon: ShieldLock,
        title: 'Privacy',
        description:
            'All accounts and personal information on the website are private, secure and are not used by any third parties',
    },
    {
        icon: AdjustmentsAlt,
        title: 'Customization & Filteration',
        description:
            'Fully customizable deals with the desired additional features you want alongside customizing your search towards what your heart desires',
    },
    {
        icon: CreditCard,
        title: 'Safe Payment',
        description:
            'We offer our customers a safe paying process for the insurance contract they choose',
    },
    {
        icon: Flame,
        title: 'Best Deals',
        description:
            'We advertise the best deals from the best insruance companies available in Egypt',
    },
];

export default function FeaturesTitle() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const { classes } = useStyles();

    const items = features.map((feature) => (
        <div key={feature.title}>
            <ThemeIcon
                size={44}
                radius="md"
                variant="gradient"
                gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
            >
                <feature.icon size={26} />
            </ThemeIcon>
            <Text size="lg" mt="sm" weight={500}>
                {feature.title}
            </Text>
            <Text color="dimmed" size="sm">
                {feature.description}
            </Text>
        </div>
    ));
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await axios.get(`${api_url}front/home`);
                setData(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error.response);
                setError(true);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }
    if (error) {
        return 'error.';
    }
    return (
        <div className={classes.wrapper}>
            <Grid gutter={80}>
                <Col span={12} md={5}>
                    <Title className={classes.title} order={2}>
                        Best Insurance deals from the top insurance companies in
                        egypt
                    </Title>
                    <Text color="dimmed">
                        We promise to offer portability, best performance,
                        accuracy, usability, reliability, availability, and
                        security all combined in one place.
                        <br />
                        <div style={{ wordWrap: 'pre-wrap' }}>
                            {`You can choose among`}{' '}
                            <b> {`${data.insurancesCount} `}</b>
                            {` insurance deals from`}{' '}
                            <b> {`${data.categoriesCount} `}</b>
                            {` different Categories provided by over`}{' '}
                            <b> {`${data.companiesCount}`} </b>{' '}
                            {`of the major insurance companies in egypt.`}
                        </div>
                    </Text>

                    <Button
                        variant="gradient"
                        gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
                        size="lg"
                        radius="md"
                        mt="xl"
                        onClick={() => navigate('/insurances')}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            // textTransform: 'capitalize',
                        }}
                    >
                        Browse
                        <ArrowNarrowRight
                            style={{ marginLeft: '16px' }}
                            size={20}
                        />
                    </Button>
                </Col>
                <Col span={12} md={7}>
                    <SimpleGrid
                        cols={2}
                        spacing={30}
                        breakpoints={[{ maxWidth: 'md', cols: 1 }]}
                    >
                        {items}
                    </SimpleGrid>
                </Col>
            </Grid>
        </div>
    );
}
