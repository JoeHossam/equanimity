import React from 'react';
import {
    createStyles,
    Card,
    Text,
    SimpleGrid,
    UnstyledButton,
    Anchor,
    Group,
} from '@mantine/core';
import {
    CreditCard,
    BuildingBank,
    Repeat,
    ReceiptRefund,
    Receipt,
    ReceiptTax,
    Report,
    CashBanknote,
    Coin,
    Heartbeat,
    MedicalCross,
    Car,
    Building,
    Plane,
    School,
} from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';

const mockdata = [
    { title: 'Life Insurance', icon: Heartbeat, color: 'red' },
    { title: 'Medical Insurance', icon: MedicalCross, color: 'green' },
    { title: 'Motor Insurance', icon: Car, color: 'blue' },
    { title: 'Property Insurance', icon: Building, color: 'gray' },
    { title: 'Travel Insurance', icon: Plane, color: 'teal' },
    { title: 'Education Insurance', icon: School, color: 'dark' },
    // { title: 'Reports', icon: Report, color: 'pink' },
    // { title: 'Payments', icon: Coin, color: 'red' },
    // { title: 'Cashback', icon: CashBanknote, color: 'orange' },
];

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
        borderRadius: 0,
        padding: '16px 7rem !important',
        [theme.fn.smallerThan('sm')]: {
            padding: '16px !important',
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
        justifyContent: 'center !important',
        fontSize: '2.5rem',
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: theme.radius.md,
        height: 225,
        backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease, transform 100ms ease',

        '&:hover': {
            boxShadow: `${theme.shadows.md} !important`,
            transform: 'scale(1.05)',
        },
    },
}));

export default function ActionsGrid() {
    const { classes, theme } = useStyles();
    const navigate = useNavigate();

    const items = mockdata.map((item) => (
        <UnstyledButton
            key={item.title}
            onClick={() => navigate(`/insurances/${item.title}`)}
            className={classes.item}
        >
            <item.icon color={theme.colors[item.color][6]} size={64} />
            <Text size="sm" mt={7}>
                {item.title}
            </Text>
        </UnstyledButton>
    ));

    return (
        <Card withBorder radius="md" className={classes.card}>
            <Group position="apart">
                <Text className={classes.title}>Insurances</Text>
            </Group>
            <SimpleGrid cols={3} mt="md">
                {items}
            </SimpleGrid>
        </Card>
    );
}
