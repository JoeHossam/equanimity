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

const AdminCompanies = () => {
    const { companyUser } = useGlobalContext();
    const [loading, setLoading] = useState(true);
    const [selectedIns, setSelectedIns] = useState({});
    const [data, setData] = useState({});
    const [modal, setModal] = useState({
        open: false,
        type: 'create',
        size: 'md',
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
        <div>
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
                                    {row.name}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AdminCompanies;
