import React from 'react';
import {
    ThemeIcon,
    Text,
    Title,
    Container,
    SimpleGrid,
    useMantineTheme,
    createStyles,
} from '@mantine/core';
import { Icon as TablerIcon } from 'tabler-icons-react';
const MOCKDATA = {
    title: 'Integrate effortlessly with any technology stack',
    description:
        'Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when hunger drives it to try biting a Steel-type Pokémon.',
};

export function Feature({ icon: Icon, title, description }) {
    const theme = useMantineTheme();
    return (
        <div>
            <ThemeIcon variant="light" size={40} radius={40}>
                <Icon style={{ width: 20, height: 20 }} />
            </ThemeIcon>
            <Text style={{ marginTop: theme.spacing.sm, marginBottom: 7 }}>
                {title}
            </Text>
            <Text size="sm" color="dimmed" style={{ lineHeight: 1.6 }}>
                {description}
            </Text>
        </div>
    );
}

const useStyles = createStyles((theme) => ({
    wrapper: {
        paddingTop: theme.spacing.xl * 4,
        paddingBottom: theme.spacing.xl * 4,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 900,
        marginBottom: theme.spacing.md,
        textAlign: 'center',

        [theme.fn.smallerThan('sm')]: {
            fontSize: 28,
            textAlign: 'left',
        },
    },

    description: {
        textAlign: 'center',

        [theme.fn.smallerThan('sm')]: {
            textAlign: 'left',
        },
    },
}));

export function FeaturesGrid({ title, description, data = MOCKDATA }) {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const features = data.map((feature, index) => (
        <Feature {...feature} key={index} />
    ));

    return (
        <Container className={classes.wrapper}>
            <Title className={classes.title}>{title}</Title>

            <Container size={560} p={0}>
                <Text size="sm" className={classes.description}>
                    {description}
                </Text>
            </Container>

            <SimpleGrid
                mt={60}
                cols={3}
                spacing={theme.spacing.xl * 2}
                breakpoints={[
                    { maxWidth: 980, cols: 2, spacing: 'xl' },
                    { maxWidth: 755, cols: 1, spacing: 'xl' },
                ]}
            >
                {features}
            </SimpleGrid>
        </Container>
    );
}
