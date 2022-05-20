import React from 'react';
import { Avatar, Text, Button, Paper } from '@mantine/core';

interface UserInfoActionProps {
    avatar: string;
    name: string;
    email: string;
    job: string;
}

export function UserInfoAction({
    avatar,
    name,
    email,
    job,
}: UserInfoActionProps) {
    return (
        <Paper
            radius="md"
            withBorder
            p="lg"
            sx={(theme) => ({
                backgroundColor:
                    theme.colorScheme === 'dark'
                        ? theme.colors.dark[8]
                        : theme.white,
                margin: '0.5rem',
                maxWidth: '800px',
            })}
        >
            <Avatar src={avatar} size={120} radius={120} mx="auto" />
            <Text align="center" size="md" weight={400} mt="md">
                {name}
            </Text>
            <Text align="center" size="lg" weight={500}>
                {job}
            </Text>
            <Text align="center" color="dimmed" size="sm">
                {email}
            </Text>
        </Paper>
    );
}
