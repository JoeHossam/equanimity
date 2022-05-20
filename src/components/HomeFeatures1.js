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
    Flame,
    CircleDotted,
    FileCode,
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
        icon: ReceiptOff,
        title: 'Free and open source',
        description:
            'All packages are published under MIT license, you can use Mantine in any project',
    },
    {
        icon: FileCode,
        title: 'TypeScript based',
        description:
            'Build type safe applications, all components and hooks export types',
    },
    {
        icon: CircleDotted,
        title: 'No annoying focus ring',
        description:
            'With new :focus-visible selector focus ring will appear only when user navigates with keyboard',
    },
    {
        icon: Flame,
        title: 'Best Deals',
        description:
            'Customize colors, spacing, shadows, fonts and many other settings with global theme object',
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
                        {`Choose among ${data.insurancesCount} insurances deals from ${data.categoriesCount} different Categories provided by over ${data.companiesCount} of the major insurance companies in egypt.`}
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
