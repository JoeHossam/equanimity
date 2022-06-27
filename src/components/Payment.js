import { useState } from 'react';
import { Stepper, Button, Group, Input, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context';

export default function Demo({
    children,
    type,
    handlePayment,
    equationData,
    setEquationData,
}) {
    const [active, setActive] = useState(0);
    const { isLoggedIn } = useGlobalContext();
    // Life
    const [age, setAge] = useState(0);
    const [disease, setDisease] = useState(0);

    // Motor
    const [model, setModel] = useState(0);
    const [manufacturer, setManufacturer] = useState(0);
    const [price, setPrice] = useState(0);
    const [year, setYear] = useState(0);
    const [noStepsFix, setNoStepsFix] = useState(false);

    const navigate = useNavigate();

    const nextStep = (index) => {
        if (index === steps.length - 2)
            setEquationData({ age, disease, model, manufacturer, price, year });
        if (index === steps.length - 1) handlePayment();
        setActive((current) =>
            current < steps.length ? current + 1 : current
        );
    };

    const prevStep = () =>
        setActive((current) => (current > 0 ? current - 1 : current));

    let steps = [];

    switch (type) {
        case 'Medical Insurance':
            steps = [
                {
                    label: 'enter your age',
                    component: (
                        <Group
                            sx={{
                                maxWidth: '500px',
                                margin: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '2rem',
                            }}
                        >
                            <Text size="lg">What is your age</Text>
                            <Input
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </Group>
                    ),
                },
                {
                    label: 'Medical Condition',
                    component: (
                        <Group
                            sx={{
                                maxWidth: '500px',
                                margin: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '2rem',
                            }}
                        >
                            <Text size="lg">
                                Do you have a chronic disease?
                            </Text>
                            <Group>
                                <Button
                                    variant={
                                        disease === true ? 'filled' : 'outline'
                                    }
                                    onClick={() => setDisease(true)}
                                >
                                    Yes
                                </Button>
                                <Button
                                    variant={
                                        disease === false ? 'filled' : 'outline'
                                    }
                                    onClick={() => setDisease(false)}
                                >
                                    No
                                </Button>
                            </Group>
                        </Group>
                    ),
                },
                { label: 'Payment' },
            ];
            break;
        case 'Motor Insurance':
            steps = [
                {
                    label: 'Car Manufacturer ',
                    component: (
                        <Group
                            sx={{
                                maxWidth: '500px',
                                margin: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '2rem',
                            }}
                        >
                            <Text size="lg">What is your car brand</Text>
                            <Input
                                value={manufacturer}
                                onChange={(e) =>
                                    setManufacturer(e.target.value)
                                }
                            />
                        </Group>
                    ),
                },
                {
                    label: 'Car Model',
                    component: (
                        <Group
                            sx={{
                                maxWidth: '500px',
                                margin: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '2rem',
                            }}
                        >
                            <Text size="lg">What is your car model</Text>
                            <Input
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                            />
                        </Group>
                    ),
                },
                {
                    label: 'Manufacturing year',
                    component: (
                        <Group
                            sx={{
                                maxWidth: '500px',
                                margin: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '2rem',
                            }}
                        >
                            <Text size="lg">
                                What is your car production's year
                            </Text>
                            <Input
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />
                        </Group>
                    ),
                },
                {
                    label: 'Manufacturing Price',
                    component: (
                        <Group
                            sx={{
                                maxWidth: '500px',
                                margin: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '2rem',
                            }}
                        >
                            <Text size="lg">What is your car price</Text>
                            <Input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Group>
                    ),
                },
                {
                    label: 'Payment',
                },
            ];
            break;
        default:
            steps = [];
            break;
    }

    if (!isLoggedIn) {
        return (
            <Group align="right" position="center" mt="xl">
                Please Login First
            </Group>
        );
    }
    if (steps.length === 0)
        return (
            <>
                {noStepsFix ? (
                    <>
                        Payment Completed, you can check it on your purchases
                        tab in your profile
                        <br />
                        <Button
                            size="xs"
                            onClick={() => navigate('/profile/purchases')}
                        >
                            purchases
                        </Button>
                    </>
                ) : (
                    <>
                        {children}
                        <Group align="right" position="center" mt="xl">
                            <Button
                                onClick={() => {
                                    handlePayment();
                                    setNoStepsFix(true);
                                }}
                            >
                                Pay
                            </Button>
                        </Group>
                    </>
                )}
            </>
        );

    return (
        <>
            <Stepper active={active} breakpoint="sm">
                {steps.map((step, index) => {
                    return (
                        <Stepper.Step
                            key={index}
                            label={step.label}
                            description={step.label}
                        >
                            {index === steps.length - 1
                                ? children
                                : step.component}
                            <Group align="right" position="center" mt="xl">
                                <Button onClick={() => prevStep()}>back</Button>
                                <Button onClick={() => nextStep(index)}>
                                    {index === steps.length - 1
                                        ? 'Pay'
                                        : 'Next'}
                                </Button>
                            </Group>
                        </Stepper.Step>
                    );
                })}
                <Stepper.Completed key={'sadsakldjas'}>
                    Payment Completed, you can check it on your purchases tab in
                    your profile
                    <br />
                    <Button
                        size="xs"
                        onClick={() => navigate('/profile/purchases')}
                    >
                        purchases
                    </Button>
                </Stepper.Completed>
            </Stepper>
        </>
    );
}
