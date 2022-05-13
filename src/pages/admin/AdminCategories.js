import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { api_url, useGlobalContext } from '../../context';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import Loading from '../Loading';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AdminCategories = () => {
    const [loading, setLoading] = useState(true);
    const [selectedCat, setSelectedCat] = useState({});
    const [data, setData] = useState({});
    const [modal, setModal] = useState({
        open: false,
        type: 'create',
        size: 'md',
    });
    useEffect(() => {
        setLoading(true);
        const fetchCat = async () => {
            try {
                const res = await axios.get(`${api_url}category`, {
                    withCredentials: true,
                });
                setData(res.data.categories);
                setLoading(false);
            } catch (error) {
                console.error(error.response);
            }
        };
        fetchCat();
    }, []);
    const [re, setRe] = useState(false);

    if (loading) {
        return <Loading />;
    }
    return (
        <div style={{ margin: '2rem 10rem' }}>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
                Categories
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Category Name</TableCell>
                            <TableCell align="center">Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => {
                            return (
                                <TableRow>
                                    <TableCell align="center">
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <ButtonGroup>
                                            <Button
                                                size="small"
                                                variant="contained"
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
                                                <EditIcon />
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
                                                    setSelectedCat(item);
                                                }}
                                            >
                                                <ClearIcon />
                                            </Button>
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
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
                            size: 'lg',
                        });
                    }}
                >
                    <AddIcon /> Add a new category
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
                {modal.type === 'create' ? (
                    <Create setModal={setModal} setRe={setRe} />
                ) : modal.type === 'edit' ? (
                    <Edit
                        setModal={setModal}
                        selectedCat={selectedCat}
                        setRe={setRe}
                    />
                ) : (
                    <Delete
                        setModal={setModal}
                        selectedCat={selectedCat}
                        setRe={setRe}
                    />
                )}
            </Dialog>
        </div>
    );
};

const Create = ({ setModal, setRe }) => {
    const [category, setCategory] = useState({ name: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${api_url}category`, category, {
                withCredentials: true,
            });
            console.log(res);
        } catch (error) {
            console.log(error.message);
        }
        setModal((prev) => {
            return { ...prev, modal: false };
        });
        setRe({});
    };

    return (
        <>
            <DialogTitle>{'Add a new Category'}</DialogTitle>
            <DialogContent dividers={true}>
                <DialogContentText component={'div'}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={category.name}
                            onChange={(e) =>
                                setCategory({
                                    ...category,
                                    name: e.target.value,
                                })
                            }
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
                    Add
                </Button>
            </DialogActions>
        </>
    );
};
const Edit = ({ setModal, selectedCat, setRe }) => {
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState({ ...selectedCat });

    useEffect(() => {
        setCategory({ ...selectedCat });
    }, [selectedCat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(
                `${api_url}category/${selectedCat._id}`,
                category,
                {
                    withCredentials: true,
                }
            );
            setCategory({ ...res.data.category });
            setModal((prev) => {
                return { ...prev, open: false };
            });
        } catch (error) {
            console.log(error.response);
            return;
        }
    };
    return (
        <>
            <DialogTitle>{'Update Category'}</DialogTitle>
            <DialogContent dividers>
                <DialogContentText component={'div'}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={category.name}
                            onChange={(e) =>
                                setCategory({
                                    ...category,
                                    name: e.target.value,
                                })
                            }
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
                <Button onClick={handleSubmit}>Update</Button>
            </DialogActions>
        </>
    );
};
const Delete = ({ setModal, selectedCat, setRe }) => {
    const deleteCategory = async () => {
        const { _id } = selectedCat;
        try {
            await axios.delete(`${api_url}category/${_id}`, {
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
                <DialogTitle>{'Delete category'}</DialogTitle>
                <DialogContentText
                    component={'div'}
                    sx={{ textAlign: 'center' }}
                >
                    Are you sure you want to delete this category?
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
                <Button color="error" onClick={deleteCategory}>
                    Delete
                </Button>
            </DialogActions>
        </>
    );
};

export default AdminCategories;
