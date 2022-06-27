import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    CardHeader,
    Checkbox,
    Divider,
    FormControlLabel,
    MenuItem,
    Paper,
    Rating,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Loading from '../Loading';
import axios from 'axios';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { api_url, useGlobalContext } from '../../context';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FeatureList from './FeatureList';
import CloseIcon from '@mui/icons-material/Close';
import { RichTextEditor } from '@mantine/rte';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CompanyDashboard = () => {
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
                const res = await axios.get(
                    `${api_url}insurance/company/${companyUser._id}`,
                    { withCredentials: true }
                );
                const insurances = res.data.insurances.map((item) => {
                    return { ...item, id: item._id };
                });
                setData(insurances);
                setLoading(false);
            } catch (error) {
                console.log(error.response);
            }
        };
        fetchInsData();
    }, [re]);

    const columns = [
        {
            field: 'title',
            headerName: 'Insurance Title',
            width: 150,
            flex: 1,
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
                    <Button
                        size="small"
                        onClick={() => {
                            setModal({
                                ...modal,
                                open: true,
                                type: 'Review',
                                size: 'md',
                            });
                            setSelectedIns(cellvalues.row);
                        }}
                    >
                        {cellvalues.formattedValue}
                    </Button>
                );
            },
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
            field: 'status',
            headerName: 'Status',
            width: 150,
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            minWidth: 150,
            align: 'center',
            type: 'actions',
            getActions: ({ row: ins }) => [
                <GridActionsCellItem
                    label="actions"
                    disableFocusRipple
                    disableRipple
                    icon={
                        <ButtonGroup>
                            <Button
                                size="small"
                                variant="contained"
                                color="info"
                                onClick={() => {
                                    console.log(ins);
                                    setModal({
                                        ...modal,
                                        open: true,
                                        type: 'edit',
                                        size: 'md',
                                    });
                                    setSelectedIns(ins);
                                    console.log(ins);
                                }}
                            >
                                <EditIcon />
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                color="warning"
                                onClick={() => {
                                    setModal({
                                        ...modal,
                                        open: true,
                                        type: 'hide',
                                        size: '',
                                    });
                                    setSelectedIns(ins);
                                }}
                            >
                                <VisibilityOffIcon />
                            </Button>
                            <Button
                                size="small"
                                color="error"
                                variant="contained"
                                onClick={() => {
                                    setModal({
                                        ...modal,
                                        open: true,
                                        type: 'delete',
                                        size: '',
                                    });
                                    setSelectedIns(ins);
                                }}
                            >
                                <ClearIcon />
                            </Button>
                        </ButtonGroup>
                    }
                />,
            ],
            flex: 1,
        },
    ];

    if (loading) {
        return <Loading />;
    }

    return (
        <div style={{ margin: '0 5rem' }}>
            <Box sx={{ marginX: '3rem', marginTop: '2rem' }}>
                <Typography variant="h3">Insurances</Typography>
                <div style={{ height: 400 }}>
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
                        // autoHeight
                        // rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection={false}
                        hideFooterSelectedRowCount
                        disableColumnSelector
                        disableSelectionOnClick={true}
                    />
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
                                size: 'full',
                            });
                        }}
                    >
                        <AddIcon /> Create new insurance
                    </Button>
                </Box>
                <Typography variant="h3">Purchases</Typography>
                <Purchases insurances={data} />
            </Box>
            <Dialog
                open={modal.open}
                TransitionComponent={Transition}
                keepMounted
                fullWidth={modal.size !== ''}
                maxWidth={modal.size}
                fullScreen={modal.size === 'full'}
                scroll="paper"
                onClose={() => setModal({ ...modal, open: false })}
                aria-describedby="alert-dialog-slide-description"
            >
                {modal.type === 'create' ? (
                    <Create setModal={setModal} setRe={setRe} />
                ) : modal.type === 'edit' ? (
                    <Edit
                        setModal={setModal}
                        selectedIns={selectedIns}
                        setRe={setRe}
                    />
                ) : modal.type === 'delete' ? (
                    <Delete
                        setModal={setModal}
                        selectedIns={selectedIns}
                        setRe={setRe}
                    />
                ) : modal.type === 'hide' ? (
                    <Hide
                        setModal={setModal}
                        selectedIns={selectedIns}
                        setRe={setRe}
                    />
                ) : (
                    <Reviews
                        setModal={setModal}
                        selectedIns={selectedIns}
                        setRe={setRe}
                    />
                )}
            </Dialog>
        </div>
    );
};

const Create = ({ setModal, setRe }) => {
    const { companyUser } = useGlobalContext();
    const [loading, setLoading] = useState(true);
    const [insurance, setInsurance] = useState({
        title: '',
        category: 'Life Insurance',
        createdBy: companyUser._id,
        basePrice: 0,
        features: [],
        hidden: false,
        description: '',
    });
    const [description, setDescription] = useState('');
    const [featureList, setFeatureList] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchCat = async () => {
            try {
                const res = await axios.get(`${api_url}category`, {
                    withCredentials: true,
                });
                setCategories(res.data.categories);
                setLoading(false);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchCat();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${api_url}insurance`,
                {
                    ...insurance,
                    description,
                    baseFeatures: featureList
                        .filter((item) => item.isBase)
                        .map((item) => {
                            return item.name;
                        }),
                    features: featureList
                        .filter((item) => !item.isBase)
                        .map((item) => {
                            return { name: item.name, price: item.price };
                        }),
                },
                {
                    withCredentials: true,
                }
            );
            console.log(res);
        } catch (error) {
            console.log(error.message);
        }
        setModal((prev) => {
            return { ...prev, open: false };
        });
        setRe({});
    };

    if (loading) {
        return '...';
    }

    if (categories.length === 0) {
        return 'some error occured';
    }

    return (
        <>
            <DialogTitle>{'Create a new Insurance'}</DialogTitle>
            <DialogContent dividers={true}>
                <DialogContentText component={'div'}>
                    <form
                        onSubmit={handleSubmit}
                        style={{ textAlign: 'start' }}
                    >
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
                                onChange={(e) =>
                                    setInsurance({
                                        ...insurance,
                                        title: e.target.value,
                                    })
                                }
                            />
                            <Select
                                fullWidth
                                value={insurance.category}
                                onChange={(e) =>
                                    setInsurance({
                                        ...insurance,
                                        category: e.target.value,
                                    })
                                }
                            >
                                {categories.map((item) => {
                                    return (
                                        <MenuItem
                                            key={item._id}
                                            value={item.name}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </div>
                        <TextField
                            fullWidth
                            label="Base Price"
                            type="number"
                            sx={{ marginBottom: '1rem' }}
                            onChange={(e) =>
                                setInsurance({
                                    ...insurance,
                                    basePrice: e.target.value,
                                })
                            }
                        />
                        <RichTextEditor
                            sx={{ width: '100%' }}
                            value={description}
                            onChange={setDescription}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={insurance.hidden}
                                    onChange={() =>
                                        setInsurance((prev) => {
                                            return {
                                                ...prev,
                                                hidden: !prev.hidden,
                                            };
                                        })
                                    }
                                />
                            }
                            label="Hide Insurance"
                        />
                        <FeatureList
                            list={featureList}
                            setList={setFeatureList}
                        />
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
const Edit = ({ setModal, selectedIns, setRe }) => {
    const [loading, setLoading] = useState(true);
    const [insurance, setInsurance] = useState({ ...selectedIns });
    const [featureList, setFeatureList] = useState([
        ...selectedIns.features.map((item) => {
            return { ...item, isBase: false };
        }),
        ...selectedIns.baseFeatures.map((item) => {
            return { name: item, isBase: true };
        }),
    ]);

    const [description, setDescription] = useState(selectedIns.description);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        console.log(featureList);
        setLoading(true);
        const fetchCat = async () => {
            try {
                const res = await axios.get(`${api_url}category`, {
                    withCredentials: true,
                });
                setCategories(res.data.categories);
                setLoading(false);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchCat();
    }, []);

    useEffect(() => {
        setInsurance({ ...selectedIns });
        setFeatureList([
            ...selectedIns.features.map((item) => {
                return { ...item, isBase: false };
            }),
            ...selectedIns.baseFeatures.map((item) => {
                return { name: item, isBase: true };
            }),
        ]);
        setDescription(selectedIns.description);
    }, [selectedIns]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(
                `${api_url}insurance/${insurance._id}`,
                {
                    ...insurance,
                    baseFeatures: featureList
                        .filter((item) => item.isBase)
                        .map((item) => {
                            return item.name;
                        }),
                    features: featureList
                        .filter((item) => !item.isBase)
                        .map((item) => {
                            return { name: item.name, price: item.price };
                        }),
                },
                {
                    withCredentials: true,
                }
            );
            setInsurance({ ...res.data.insurance });
            setFeatureList([
                ...res.data.insurance.features.map((item) => {
                    return { ...item, isBase: false };
                }),
                ...res.data.insurance.baseFeatures.map((item) => {
                    return { ...item, isBase: true };
                }),
            ]);
            setModal((prev) => {
                return { ...prev, open: false };
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
            <DialogTitle>{'Update Insurance'}</DialogTitle>
            <DialogContent dividers>
                <DialogContentText component={'div'}>
                    <form onSubmit={handleSubmit}>
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
                                value={insurance.title}
                                onChange={(e) =>
                                    setInsurance({
                                        ...insurance,
                                        title: e.target.value,
                                    })
                                }
                            />
                            <Select
                                fullWidth
                                value={insurance.category}
                                onChange={(e) =>
                                    setInsurance({
                                        ...insurance,
                                        category: e.target.value,
                                    })
                                }
                            >
                                {categories.map((item, index) => {
                                    return (
                                        <MenuItem
                                            key={item._id}
                                            value={item.name}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </div>
                        <TextField
                            fullWidth
                            label="Base Price"
                            type="number"
                            value={insurance.basePrice}
                            sx={{ marginBottom: '1rem' }}
                            onChange={(e) =>
                                setInsurance({
                                    ...insurance,
                                    basePrice: e.target.value,
                                })
                            }
                        />
                        <RichTextEditor
                            sx={{ width: '100%' }}
                            value={description}
                            onChange={setDescription}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={insurance.hidden}
                                    onChange={() =>
                                        setInsurance((prev) => {
                                            return {
                                                ...prev,
                                                hidden: !prev.hidden,
                                            };
                                        })
                                    }
                                />
                            }
                            label="Hide Insurance"
                        />
                        <FeatureList
                            list={featureList}
                            setList={setFeatureList}
                        />
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
                <Button variant="contained" onClick={handleSubmit}>
                    Update
                </Button>
            </DialogActions>
        </>
    );
};
const Delete = ({ setModal, selectedIns, setRe }) => {
    const deleteInsurance = async () => {
        const { _id } = selectedIns;
        try {
            await axios.delete(`${api_url}insurance/${_id}`, {
                withCredentials: true,
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
            <DialogContent>
                <DialogTitle>{'Delete Insurance'}</DialogTitle>
                <DialogContentText
                    component={'div'}
                    sx={{ textAlign: 'center' }}
                >
                    Are you sure you want to delete this insurance?
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
                    Delete
                </Button>
            </DialogActions>
        </>
    );
};
const Hide = ({ setModal, selectedIns, setRe }) => {
    const [isHidden, setIsHidden] = useState(selectedIns.hidden);

    useEffect(() => {
        setIsHidden(selectedIns.hidden);
    }, [selectedIns]);
    const toggleHide = async () => {
        const { _id } = selectedIns;
        try {
            await axios.patch(
                `${api_url}insurance/${_id}/toggleHide`,
                {
                    hidden: !isHidden,
                },
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
                <DialogTitle>{`${
                    isHidden ? 'Show' : 'Hide'
                } Insurance`}</DialogTitle>
                <DialogContentText
                    component={'div'}
                    sx={{ textAlign: 'center' }}
                >
                    Are you sure you want to {isHidden ? 'show' : 'hide'} this
                    insurance?
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
                <Button color="warning" onClick={toggleHide}>
                    {isHidden ? 'Show' : 'Hide'}
                </Button>
            </DialogActions>
        </>
    );
};

const Reviews = ({ setModal, selectedIns, setRe }) => {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [sortBy, setSortBy] = useState('dateup');
    useEffect(() => {
        setLoading(true);
        const fetchRev = async () => {
            try {
                const res = await axios.get(
                    `${api_url}review/${selectedIns._id}`
                );
                setReviews(res.data.reviews);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(error.response);
            }
        };
        fetchRev();
    }, [selectedIns]);

    useEffect(() => {
        switch (sortBy) {
            case 'ratingup':
                setReviews(reviews.sort((a, b) => b.rating - a.rating));
                break;

            case 'ratingdown':
                setReviews(reviews.sort((a, b) => a.rating - b.rating));
                break;

            case 'dateup':
                setReviews(
                    reviews.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
                );
                break;

            case 'datedown':
                setReviews(
                    reviews.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
                );
                break;
        }
    }, [sortBy]);

    if (loading) {
        return <Loading />;
    }
    return (
        <>
            <DialogActions sx={{ justifyContent: 'space-between' }}>
                <DialogTitle>{'Reviews'}</DialogTitle>
                <Select
                    size="small"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <MenuItem value="ratingup">Lower Rating</MenuItem>
                    <MenuItem value="ratingdown">Higher Rating</MenuItem>
                    <MenuItem value="dateup">Oldest</MenuItem>
                    <MenuItem value="datedown">Newest</MenuItem>
                </Select>
                <Button
                    onClick={() =>
                        setModal((prev) => {
                            return { ...prev, open: false };
                        })
                    }
                >
                    <CloseIcon />
                </Button>
            </DialogActions>
            <DialogContent>
                <DialogContentText component={'div'}>
                    <ul style={{}}>
                        {reviews.map((item) => {
                            return (
                                <>
                                    <li
                                        key={item._id}
                                        style={{
                                            backgroundColor: 'white',
                                        }}
                                    >
                                        <CardHeader
                                            sx={{ alignItems: 'flex-start' }}
                                            avatar={
                                                <Avatar
                                                    alt={item.name}
                                                    src={item.img}
                                                />
                                            }
                                            title={
                                                <>
                                                    <Typography variant="h6">
                                                        {item.name}
                                                    </Typography>

                                                    <Rating
                                                        name="read-only"
                                                        value={item.rating}
                                                        precision={0.5}
                                                        readOnly
                                                    />
                                                    {item.comment && (
                                                        <>
                                                            <Divider />
                                                            <p
                                                                style={{
                                                                    margin: '18px 0',
                                                                    whiteSpace:
                                                                        'pre',
                                                                }}
                                                            >
                                                                {item.comment}
                                                            </p>
                                                        </>
                                                    )}
                                                </>
                                            }
                                        />
                                    </li>
                                    <Divider />
                                </>
                            );
                        })}
                    </ul>
                </DialogContentText>
            </DialogContent>
        </>
    );
};

const Purchases = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await axios.get(`${api_url}payment/company`, {
                    withCredentials: true,
                });
                setData(res.data.payments);
                setLoading(false);
            } catch (error) {
                console.log(error.response);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <TableContainer sx={{ marginBottom: '3rem' }} component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Insurance name</TableCell>
                        <TableCell align="left">Phone</TableCell>
                        <TableCell align="left">Features Bought</TableCell>
                        <TableCell align="right">total price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell align="center" colSpan={4}>
                                <Typography variant="h5">
                                    No purchases have been made yet
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow
                                key={row._id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell
                                    sx={{ cursor: 'pointer' }}
                                    component="th"
                                    scope="row"
                                    onClick={() =>
                                        navigate(
                                            `/insurance/${row.insuranceId}`
                                        )
                                    }
                                >
                                    {row.insuranceName}
                                </TableCell>
                                <TableCell align="left">
                                    +20{row.phone}
                                </TableCell>
                                <TableCell align="left">
                                    {row.features.length === 0
                                        ? '-'
                                        : row.features.map((feature) => {
                                              return <li>{feature.name}</li>;
                                          })}
                                </TableCell>
                                <TableCell align="right">
                                    {row.totalPrice} EGP
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CompanyDashboard;
