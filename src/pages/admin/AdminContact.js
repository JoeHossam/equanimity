import {
    Button,
    Dialog,
    Paper,
    Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { api_url } from '../../context';
import Loading from '../Loading';

import { TextInput, Textarea, SimpleGrid, createStyles } from '@mantine/core';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AdminContact = () => {
    const [loading, setLoading] = useState(true);
    const [selectedCat, setSelectedCat] = useState({});
    const [data, setData] = useState({});
    const [modal, setModal] = useState({
        open: false,
        type: 'create',
        size: 'lg',
    });

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await axios.get(`${api_url}contact`, {
                    withCredentials: true,
                });
                setData(res.data.contacts);
                setLoading(false);
            } catch (error) {
                console.error(error.response);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }
    return (
        <div style={{ margin: '2rem 10rem' }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2} align="center">
                                <Typography
                                    variant="h4"
                                    sx={{ textAlign: 'center' }}
                                >
                                    Contact Messages
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => {
                            return (
                                <TableRow>
                                    <TableCell align="center">
                                        {item.subject}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            color="info"
                                            onClick={() => {
                                                setModal({
                                                    ...modal,
                                                    open: true,
                                                    type: 'edit',
                                                    size: 'md',
                                                });
                                                setSelectedCat(item);
                                            }}
                                        >
                                            See More
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={modal.open}
                TransitionComponent={Transition}
                maxWidth="lg"
                scroll="paper"
                onClose={() => setModal({ ...modal, open: false })}
                aria-describedby="alert-dialog-slide-description"
            >
                <Contact selectedCat={selectedCat} />
            </Dialog>
        </div>
    );
};

const useStyles = createStyles((theme) => {
    const BREAKPOINT = theme.fn.smallerThan('sm');

    return {
        form: {
            boxSizing: 'border-box',
            flex: 1,
            padding: theme.spacing.xl,
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
    };
});

const Contact = ({ selectedCat }) => {
    const { classes } = useStyles();

    return (
        <form className={classes.form}>
            <div className={classes.fields}>
                <SimpleGrid
                    cols={2}
                    breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                >
                    <TextInput
                        label="name"
                        value={selectedCat.name}
                        placeholder="Your name"
                    />
                    <TextInput
                        label="email"
                        value={selectedCat.email}
                        placeholder="hello@mantine.dev"
                    />
                </SimpleGrid>

                <TextInput
                    mt="md"
                    label="Subject"
                    placeholder="Subject"
                    value={selectedCat.subject}
                />

                <Textarea
                    mt="md"
                    label="message"
                    placeholder="Please include all relevant information"
                    value={selectedCat.msg}
                    minRows={3}
                />
            </div>
        </form>
    );
};

export default AdminContact;
