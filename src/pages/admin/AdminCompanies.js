import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { api_url, useGlobalContext } from '../../context';
import Loading from '../Loading';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link,
    Slide,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AdminCompanies = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [modal, setModal] = useState({
        open: false,
        type: 'create',
        size: 'sm',
    });
    const [re, setRe] = useState(false);
    useEffect(() => {
        setLoading(true);
        const fetchInsData = async () => {
            try {
                const res = await axios.get(`${api_url}company`);
                const companies = res.data.companies.map((item) => {
                    return { ...item, id: item._id };
                });
                setData(companies);
                setLoading(false);
            } catch (error) {
                console.log(error.response);
            }
        };
        fetchInsData();
    }, [re]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <div style={{ margin: '3rem' }}>
                <Typography
                    variant="h4"
                    sx={{ marginTop: '3rem', textAlign: 'center' }}
                >
                    Companies
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Company Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Link
                                            target={'_blank'}
                                            href={`/company/${row._id}`}
                                        >
                                            {row.name}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginY: '2rem',
                }}
            >
                <Button
                    color="success"
                    variant="contained"
                    onClick={() => {
                        setModal({
                            ...modal,
                            open: true,
                            type: 'create',
                            size: 'md',
                        });
                    }}
                >
                    <AddIcon /> add a new company
                </Button>
            </Box>
            <Dialog
                open={modal.open}
                TransitionComponent={Transition}
                keepMounted
                fullWidth={modal.size !== ''}
                maxWidth={modal.size}
                scroll="paper"
                onClose={() => setModal({ ...modal, open: false })}
                aria-describedby="alert-dialog-slide-description"
            >
                {modal.type === 'create' && (
                    <AddCompany setModal={setModal} setRe={setRe} />
                )}
            </Dialog>
        </>
    );
};

const AddCompany = ({ setModal, setRe }) => {
    const [company, setCompany] = useState({
        name: '',
        username: '',
        password: '',
    });

    const handleSubmit = async () => {
        try {
            const res = await axios.post(`${api_url}company`, company, {
                withCredentials: true,
            });
            setModal((prev) => {
                return { ...prev, open: false };
            });
        } catch (error) {
            console.error(error.response);
        }
        setRe({});
    };
    return (
        <>
            <DialogTitle>{'Add a new Company'}</DialogTitle>
            <DialogContent dividers={true}>
                <DialogContentText component={'div'}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            onChange={(e) =>
                                setCompany({
                                    ...company,
                                    name: e.target.value,
                                })
                            }
                        />
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto auto',
                                width: '100%',
                                marginTop: '1rem',
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Username"
                                onChange={(e) =>
                                    setCompany({
                                        ...company,
                                        username: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                onChange={(e) =>
                                    setCompany({
                                        ...company,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </form>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() =>
                        setModal((prev) => {
                            return { ...prev, open: false };
                        })
                    }
                >
                    Cancel
                </Button>
                <Button
                    color="success"
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Create
                </Button>
            </DialogActions>
        </>
    );
};

export default AdminCompanies;
