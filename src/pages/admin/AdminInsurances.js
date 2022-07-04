import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { api_url } from '../../context';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link,
    Paper,
    Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Loading from '../Loading';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AdminInsurances = () => {
    const [selectedIns, setSelectedIns] = useState({});
    const [modal, setModal] = useState({
        open: false,
        type: 'create',
        size: 'md',
    });
    const [re, setRe] = useState({});

    return (
        <>
            <PublicInsurances
                modal={modal}
                setModal={setModal}
                setSelectedIns={setSelectedIns}
                re={re}
                setRe={setRe}
            />
            <PendingInsurances
                modal={modal}
                setModal={setModal}
                setSelectedIns={setSelectedIns}
                re={re}
                setRe={setRe}
            />
            <AllInsurances
                modal={modal}
                setModal={setModal}
                setSelectedIns={setSelectedIns}
            />
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
                {modal.type === 'view' ? (
                    <ViewInsurance
                        modal={modal}
                        setModal={setModal}
                        selectedIns={selectedIns}
                        setRe={setRe}
                    />
                ) : modal.type === 'view_all' ? (
                    <ViewAll
                        setModal={setModal}
                        modal={modal}
                        selectedIns={selectedIns}
                        setRe={setRe}
                    />
                ) : (
                    <SuspendInsurance
                        setModal={setModal}
                        modal={modal}
                        selectedIns={selectedIns}
                        setRe={setRe}
                    />
                )}
            </Dialog>
        </>
    );
};

const PublicInsurances = ({ modal, setModal, setSelectedIns, re, setRe }) => {
    const [loading, setLoading] = useState([]);
    const [data, setData] = useState([]);
    const columns = [
        {
            field: 'title',
            headerName: 'Insurance Title',
            width: 150,
            flex: 1,
            renderCell: (cellvalues) => {
                return (
                    <Link
                        size="small"
                        target={'_blank'}
                        href={`/insurance/${cellvalues.row._id}`}
                    >
                        {cellvalues.value}
                    </Link>
                );
            },
        },
        {
            field: 'company',
            headerName: 'Company',
            width: 150,
            flex: 1,
            renderCell: (cellvalues) => {
                return (
                    <Link
                        target={'_blank'}
                        size="small"
                        href={`/company/${cellvalues.value._id}`}
                    >
                        {cellvalues.value.name}
                    </Link>
                );
            },
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            flex: 1,
        },
        {
            field: 'basePrice',
            headerName: 'Price',
            type: 'number',
            width: 110,
            flex: 1,
        },
        {
            field: 'rating',
            headerName: 'Rating',
            type: 'number',
            width: 110,
            flex: 1,
        },
        {
            field: 'reviewCount',
            headerName: 'Reviews',
            width: 110,
            type: 'number',
            renderCell: (cellvalues) => {
                return (
                    <Button size="small">{cellvalues.formattedValue}</Button>
                );
            },
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Suspend',
            sortable: false,
            minWidth: 150,
            align: 'center',
            type: 'actions',
            getActions: ({ row: ins }) => [
                <GridActionsCellItem
                    label="Suspend"
                    disableFocusRipple
                    disableRipple
                    icon={
                        <Button size="small" variant="contained" color="error">
                            <RemoveCircleIcon />
                        </Button>
                    }
                    onClick={() => {
                        setModal({
                            ...modal,
                            open: true,
                            type: 'suspend',
                            size: '',
                        });
                        setSelectedIns(ins);
                        console.log(ins);
                    }}
                />,
            ],
            flex: 1,
        },
    ];
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await axios.get(`${api_url}insurance`, {
                    withCredentials: true,
                });
                const res2 = await axios.get(`${api_url}company`);
                const { companies } = res2.data;

                const insurances = res.data.insurances.map((item) => {
                    const company = companies.find(
                        (item2) => item2._id === item.createdBy
                    );
                    return { ...item, id: item._id, company };
                });
                setData(insurances);
                setLoading(false);
            } catch (error) {
                console.error(error.response);
            }
        };
        fetchData();
    }, [re]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Typography
                variant="h4"
                sx={{ marginTop: '3rem', textAlign: 'center' }}
            >
                Public Insurances
            </Typography>
            <div style={{ height: 400, margin: ' 1rem 2rem' }}>
                <DataGrid
                    sx={{
                        backgroundColor: 'white',
                        width: 'auto',
                        '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus':
                            {
                                outline: 'none',
                            },
                    }}
                    disableExtendRowFullWidth
                    rows={data}
                    columns={columns}
                    autoPageSize
                    checkboxSelection={false}
                    hideFooterSelectedRowCount
                    disableColumnSelector
                    disableSelectionOnClick={true}
                />
            </div>
        </>
    );
};

const PendingInsurances = ({ modal, setModal, setSelectedIns, re, setRe }) => {
    const [loading, setLoading] = useState([]);
    const [data, setData] = useState([]);
    const columns = [
        {
            field: 'title',
            headerName: 'Insurance Title',
            width: 150,
            flex: 1,
        },
        {
            field: 'company',
            headerName: 'Company',
            width: 150,
            flex: 1,
            renderCell: (cellvalues) => {
                return (
                    <Link
                        target={'_blank'}
                        size="small"
                        href={`/company/${cellvalues.value._id}`}
                    >
                        {cellvalues.value.name}
                    </Link>
                );
            },
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            flex: 1,
        },
        {
            field: 'basePrice',
            headerName: 'Price',
            type: 'number',
            width: 110,
            flex: 1,
        },
        {
            field: 'actions',
            sortable: false,
            minWidth: 150,
            align: 'center',
            type: 'actions',
            getActions: ({ row: ins }) => [
                <GridActionsCellItem
                    label="Details"
                    disableFocusRipple
                    disableRipple
                    icon={
                        <Button size="small" color="info">
                            View Details
                        </Button>
                    }
                    onClick={() => {
                        setModal({
                            ...modal,
                            open: true,
                            type: 'view',
                            size: 'md',
                        });
                        setSelectedIns(ins);
                        console.log(ins);
                    }}
                />,
            ],
            flex: 1,
        },
    ];
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${api_url}insurance/admin/unapproved`,
                    {
                        withCredentials: true,
                    }
                );
                const res2 = await axios.get(`${api_url}company`);
                const { companies } = res2.data;

                const insurances = res.data.insurances.map((item) => {
                    const company = companies.find(
                        (item2) => item2._id === item.createdBy
                    );
                    return { ...item, id: item._id, company };
                });

                setData(insurances);
                setLoading(false);
            } catch (error) {
                console.error(error.response);
            }
        };
        fetchData();
    }, [re]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Typography
                variant="h4"
                sx={{ marginTop: '3rem', textAlign: 'center' }}
            >
                Pending Insurances
            </Typography>
            <div style={{ height: 400, margin: ' 1rem 2rem' }}>
                <DataGrid
                    sx={{
                        backgroundColor: 'white',
                        width: 'auto',
                        '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus':
                            {
                                outline: 'none',
                            },
                    }}
                    disableExtendRowFullWidth
                    rows={data}
                    columns={columns}
                    autoPageSize
                    checkboxSelection={false}
                    hideFooterSelectedRowCount
                    disableColumnSelector
                    disableSelectionOnClick={true}
                />
            </div>
        </>
    );
};

const AllInsurances = ({ modal, setModal, setSelectedIns }) => {
    const [loading, setLoading] = useState([]);
    const [data, setData] = useState([]);
    const columns = [
        {
            field: 'title',
            headerName: 'Insurance Title',
            width: 150,
            flex: 1,
        },
        {
            field: 'company',
            headerName: 'Company',
            width: 150,
            flex: 1,
            renderCell: (cellvalues) => {
                return (
                    <Link
                        target={'_blank'}
                        size="small"
                        href={`/company/${cellvalues.value._id}`}
                    >
                        {cellvalues.value.name}
                    </Link>
                );
            },
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            flex: 1,
        },
        {
            field: 'basePrice',
            headerName: 'Price',
            type: 'number',
            width: 110,
            flex: 1,
        },
        {
            field: 'rating',
            headerName: 'Rating',
            width: 150,
            flex: 1,
        },
        {
            field: 'reviewCount',
            headerName: 'Reviews',
            width: 150,
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            flex: 1,
        },
        {
            field: 'hidden',
            headerName: 'Hidden',
            type: 'boolean',
            headerAlign: 'center',
            align: 'center',
            width: 150,
            flex: 1,
        },
        {
            field: 'actions',
            sortable: false,
            minWidth: 150,
            align: 'center',
            type: 'actions',
            getActions: ({ row: ins }) => [
                <GridActionsCellItem
                    label="Details"
                    disableFocusRipple
                    disableRipple
                    icon={
                        <Button size="small" color="info">
                            View Details
                        </Button>
                    }
                    onClick={() => {
                        setModal({
                            ...modal,
                            open: true,
                            type: 'view_all',
                            size: 'md',
                        });
                        setSelectedIns(ins);
                    }}
                />,
            ],
            flex: 1,
        },
    ];
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await axios.get(`${api_url}insurance/admin/all`, {
                    withCredentials: true,
                });
                const res2 = await axios.get(`${api_url}company`);
                const { companies } = res2.data;

                const insurances = res.data.insurances.map((item) => {
                    const company = companies.find(
                        (item2) => item2._id === item.createdBy
                    );
                    return { ...item, id: item._id, company };
                });

                setData(insurances);
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
        <>
            <Typography
                variant="h4"
                sx={{ marginTop: '3rem', textAlign: 'center' }}
            >
                All Insurances
            </Typography>
            <div style={{ height: 400, margin: ' 1rem 2rem' }}>
                <DataGrid
                    sx={{
                        backgroundColor: 'white',
                        width: 'auto',
                        '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus':
                            {
                                outline: 'none',
                            },
                    }}
                    disableExtendRowFullWidth
                    rows={data}
                    columns={columns}
                    autoPageSize
                    checkboxSelection={false}
                    hideFooterSelectedRowCount
                    disableColumnSelector
                    disableSelectionOnClick={true}
                />
            </div>
        </>
    );
};

const ViewInsurance = ({ setModal, selectedIns, setRe }) => {
    const handleApprove = async () => {
        const { _id } = selectedIns;
        try {
            const res = await axios.patch(
                `${api_url}insurance/approve/${_id}`,
                {},
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.log(error.response);
        }
        setModal((prev) => {
            return { ...prev, open: false };
        });
        setRe({});
    };
    const deleteInsurance = async () => {
        const { _id } = selectedIns;
        try {
            await axios.delete(`${api_url}insurance/${_id}`, {
                withCredentials: true,
                data: {
                    company_id: selectedIns.createdBy,
                },
            });
        } catch (error) {
            console.log(error.response);
        }
        setModal((prev) => {
            return { ...prev, open: false };
        });
        setRe({});
    };
    return (
        <>
            <DialogTitle>{'Insurance'}</DialogTitle>
            <DialogContent dividers>
                <DialogContentText component={'div'}>
                    <form>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto auto',
                                width: '100%',
                                marginBottom: '1rem',
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Title"
                                value={selectedIns.title}
                            />
                            <TextField fullWidth value={selectedIns.category} />
                        </div>
                        <TextField
                            fullWidth
                            label="Base Price"
                            type="number"
                            value={selectedIns.basePrice}
                            sx={{ marginBottom: '1rem' }}
                        />
                        Description
                        <Typography
                            sx={{ border: '1px solid #ccc', width: '100%' }}
                            dangerouslySetInnerHTML={{
                                __html: selectedIns.description,
                            }}
                            style={{
                                marginBottom: '1rem',
                                padding: 0,
                            }}
                        ></Typography>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650, border: '2px solid #eee' }}
                                aria-label="simple table"
                            >
                                <TableBody>
                                    {selectedIns.baseFeatures.length > 0 && (
                                        <>
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <Typography variant="h6">
                                                        Insurance Base Features
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            {selectedIns.baseFeatures.map(
                                                (item, index) => {
                                                    if (!item) return;
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell
                                                                colSpan={2}
                                                            >
                                                                {item}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                            )}
                                        </>
                                    )}
                                    {selectedIns.features.length > 0 && (
                                        <>
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <Typography variant="h6">
                                                        Insurance Additional
                                                        Features
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            {selectedIns.features.map(
                                                (item) => {
                                                    if (!item) return;
                                                    return (
                                                        <TableRow
                                                            key={item._id}
                                                        >
                                                            <TableCell>
                                                                {item.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.price}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                            )}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </form>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={() =>
                        setModal((prev) => {
                            return { ...prev, open: false };
                        })
                    }
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={deleteInsurance}
                >
                    Delete
                </Button>
                <Button variant="contained" onClick={handleApprove}>
                    Approve
                </Button>
            </DialogActions>
        </>
    );
};

const ViewAll = ({ setModal, selectedIns, setRe }) => {
    const deleteInsurance = async () => {
        const { _id } = selectedIns;
        try {
            await axios.delete(`${api_url}insurance/${_id}`, {
                withCredentials: true,
                data: {
                    company_id: selectedIns.createdBy,
                },
            });
        } catch (error) {
            console.log(error.response);
        }
        setModal((prev) => {
            return { ...prev, open: false };
        });
        setRe({});
    };

    const handleSuspend = async () => {
        const { _id } = selectedIns;
        try {
            await axios.patch(
                `${api_url}insurance/${
                    selectedIns.status === 'suspended' ? 'unsuspend' : 'suspend'
                }/${_id}`,
                {},
                { withCredentials: true }
            );
        } catch (error) {
            console.log(error.response);
        }
        setModal((prev) => {
            return { ...prev, open: false };
        });
        setRe({});
    };
    return (
        <>
            <DialogTitle>
                {selectedIns.status === 'approved' &&
                selectedIns.hidden === false
                    ? 'Public Insurance'
                    : 'Private insurance'}
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText component={'div'}>
                    <form>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto auto',
                                width: '100%',
                                marginBottom: '1rem',
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Title"
                                value={selectedIns.title}
                            />
                            <TextField fullWidth value={selectedIns.category} />
                        </div>
                        <TextField
                            fullWidth
                            label="Base Price"
                            type="number"
                            value={selectedIns.basePrice}
                            sx={{ marginBottom: '1rem' }}
                        />
                        Description
                        <Typography
                            sx={{ border: '1px solid #ccc', width: '100%' }}
                            dangerouslySetInnerHTML={{
                                __html: selectedIns.description,
                            }}
                            style={{
                                marginBottom: '1rem',
                                padding: 0,
                            }}
                        ></Typography>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650, border: '2px solid #eee' }}
                                aria-label="simple table"
                            >
                                <TableBody>
                                    {selectedIns.baseFeatures.length > 0 && (
                                        <>
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <Typography variant="h6">
                                                        Insurance Base Features
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            {selectedIns.baseFeatures.map(
                                                (item, index) => {
                                                    if (!item) return;
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell
                                                                colSpan={2}
                                                            >
                                                                {item}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                            )}
                                        </>
                                    )}
                                    {selectedIns.features.length > 0 && (
                                        <>
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <Typography variant="h6">
                                                        Insurance Additional
                                                        Features
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            {selectedIns.features.map(
                                                (item) => {
                                                    if (!item) return;
                                                    return (
                                                        <TableRow
                                                            key={item._id}
                                                        >
                                                            <TableCell>
                                                                {item.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.price}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                            )}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </form>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={() =>
                        setModal((prev) => {
                            return { ...prev, open: false };
                        })
                    }
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={deleteInsurance}
                >
                    Delete
                </Button>
                <Button
                    variant="contained"
                    color={
                        selectedIns.status === 'suspended' ? 'primary' : 'error'
                    }
                    onClick={handleSuspend}
                >
                    {selectedIns.status === 'suspended'
                        ? 'unsuspend'
                        : 'suspend'}
                </Button>
            </DialogActions>
        </>
    );
};

const SuspendInsurance = ({ setModal, selectedIns, setRe }) => {
    const deleteInsurance = async () => {
        const { _id } = selectedIns;
        try {
            const res = await axios.patch(
                `${api_url}insurance/suspend/${_id}`,
                {},
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.log(error.response);
        }
        setModal((prev) => {
            return { ...prev, open: false };
        });
        setRe({});
    };
    return (
        <>
            <DialogContent>
                <DialogTitle>{'Suspend Insurance'}</DialogTitle>
                <DialogContentText
                    component={'div'}
                    sx={{ textAlign: 'center' }}
                >
                    Are you sure you want to suspend this insurance?
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
                <Button color="error" onClick={deleteInsurance}>
                    Suspend
                </Button>
            </DialogActions>
        </>
    );
};

export default AdminInsurances;
