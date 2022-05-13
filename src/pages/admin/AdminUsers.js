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

const AdminUsers = () => {
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
                const res = await axios.get(`${api_url}user`, {
                    withCredentials: true,
                });
                const users = res.data.users.map((item) => {
                    return { ...item, id: item._id };
                });
                setData(users);
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
                    Users
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                                        {row.name}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default AdminUsers;
