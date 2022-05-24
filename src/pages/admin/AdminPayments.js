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
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AdminPayments = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await axios.get(`${api_url}payment`, {
                    withCredentials: true,
                });
                setData(res.data.payments);
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
                            <TableCell colSpan={7} align="center">
                                <Typography
                                    variant="h4"
                                    sx={{ textAlign: 'center' }}
                                >
                                    Payments
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">Insurance</TableCell>
                            <TableCell align="center">Company</TableCell>
                            <TableCell align="center">Customer</TableCell>
                            <TableCell align="center">
                                Customer's Phone
                            </TableCell>
                            <TableCell align="center">Features</TableCell>
                            <TableCell align="right">Total Price</TableCell>
                            <TableCell align="right">Date and Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => {
                            return (
                                <TableRow>
                                    <TableCell
                                        align="center"
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() =>
                                            navigate(
                                                `/insurance/${item.insurnaceId}`
                                            )
                                        }
                                    >
                                        {item.insuranceName}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() =>
                                            navigate(
                                                `/company/${item.companyId}`
                                            )
                                        }
                                    >
                                        {item.companyName}
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.user[0].name || 'Deleted Account'}
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.phone}
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.features.length === 0
                                            ? '-'
                                            : item.features.map((feat) => {
                                                  return (
                                                      <li key={feat.name}>
                                                          {feat.name} -{' '}
                                                          {feat.price.toLocaleString(
                                                              'en-US'
                                                          )}{' '}
                                                          EGP
                                                      </li>
                                                  );
                                              })}
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.totalPrice.toLocaleString(
                                            'en-US'
                                        )}{' '}
                                        EGP
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.createdAt.split('T')[0]}
                                        <br />
                                        {item.createdAt
                                            .split('T')[1]
                                            .slice(0, -5)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AdminPayments;
