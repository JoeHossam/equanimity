import { Clear, Delete, Edit } from '@mui/icons-material';
import { Button, IconButton, TextField } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import React, { useState } from 'react';

const FeatureList = ({ list, setList }) => {
    const [name, setName] = useState('');
    const [baseName, setBaseName] = useState('');

    const [price, setPrice] = useState(0);
    const [basePrice, setBasePrice] = useState(0);
    const [edit, setEdit] = useState({
        isEdit: false,
        name: '',
        price: 0,
        _id: '',
    });

    const addToList = async (isBase) => {
        const nameToEnter = isBase ? baseName : name;
        const priceToEnter = isBase ? basePrice : price;
        await setList([
            ...list,
            { name: nameToEnter, price: priceToEnter, isBase, _id: Date.now() },
        ]);
        console.log(list);
        if (isBase) {
            setBaseName('');
            setBasePrice(0);
        } else {
            setName('');
            setPrice(0);
        }
    };
    const editItem = (_id) => {
        const { name, price } = list.filter((item) => item._id === _id)[0];
        setEdit({ isEdit: true, name, price, _id });
    };

    const deleteItem = (_id) => {
        setList(list.filter((item) => item._id !== _id));
    };
    return (
        <>
            <TableContainer component={Paper}>
                <Table
                    sx={{ minWidth: 650, border: '2px solid #eee' }}
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Insurance Base Features</TableCell>
                            <TableCell></TableCell>
                            <TableCell style={{ width: 84 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((row) => {
                            if (!row.isBase) return;
                            return (
                                <TableRow
                                    key={row._id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    {edit.isEdit && edit._id === row._id ? (
                                        <>
                                            <TableCell colSpan={2}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    label="Feature"
                                                    value={edit.name}
                                                    onChange={(e) =>
                                                        setEdit({
                                                            ...edit,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </TableCell>
                                            {/* <TableCell>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    label="Price"
                                                    type="number"
                                                    value={edit.price}
                                                    onChange={(e) =>
                                                        setEdit({
                                                            ...edit,
                                                            price: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </TableCell> */}
                                            <TableCell>
                                                <IconButton
                                                    color="info"
                                                    onClick={() => {
                                                        setList(
                                                            list.map((item) => {
                                                                if (
                                                                    item._id ===
                                                                    edit._id
                                                                ) {
                                                                    return {
                                                                        ...item,
                                                                        name: edit.name,
                                                                        price: edit.price,
                                                                    };
                                                                }
                                                                return item;
                                                            })
                                                        );
                                                        setEdit({
                                                            ...edit,
                                                            isEdit: false,
                                                        });
                                                    }}
                                                >
                                                    <CheckIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => {
                                                        setEdit({
                                                            ...edit,
                                                            isEdit: false,
                                                        });
                                                    }}
                                                >
                                                    <Clear />
                                                </IconButton>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell
                                                colSpan={2}
                                                component="th"
                                                scope="row"
                                            >
                                                {row.name}
                                            </TableCell>
                                            {/* <TableCell>{row.price}</TableCell> */}
                                            <TableCell sx={{ padding: 0 }}>
                                                <IconButton
                                                    color="info"
                                                    onClick={() =>
                                                        editItem(row._id)
                                                    }
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        deleteItem(row._id)
                                                    }
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            );
                        })}
                        <TableRow>
                            <TableCell colSpan={2}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Feature"
                                    value={baseName}
                                    onChange={(e) =>
                                        setBaseName(e.target.value)
                                    }
                                />
                            </TableCell>
                            {/* <TableCell>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    value={basePrice}
                                    onChange={(e) =>
                                        setBasePrice(e.target.value)
                                    }
                                />
                            </TableCell> */}
                            <TableCell>
                                <IconButton
                                    color="success"
                                    onClick={() => addToList(true)}
                                >
                                    <AddIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Table
                    sx={{ minWidth: 650, border: '2px solid #eee' }}
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Insurance Additional Features</TableCell>
                            <TableCell></TableCell>
                            <TableCell style={{ width: 84 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((row) => {
                            if (row.isBase) return;
                            return (
                                <TableRow
                                    key={row._id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    {edit.isEdit && edit._id === row._id ? (
                                        <>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    label="Feature"
                                                    value={edit.name}
                                                    onChange={(e) =>
                                                        setEdit({
                                                            ...edit,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    label="Price"
                                                    type="number"
                                                    value={edit.price}
                                                    onChange={(e) =>
                                                        setEdit({
                                                            ...edit,
                                                            price: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="info"
                                                    onClick={() => {
                                                        setList(
                                                            list.map((item) => {
                                                                if (
                                                                    item._id ===
                                                                    edit._id
                                                                ) {
                                                                    return {
                                                                        ...item,
                                                                        name: edit.name,
                                                                        price: edit.price,
                                                                    };
                                                                }
                                                                return item;
                                                            })
                                                        );
                                                        setEdit({
                                                            ...edit,
                                                            isEdit: false,
                                                        });
                                                    }}
                                                >
                                                    <CheckIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => {
                                                        setEdit({
                                                            ...edit,
                                                            isEdit: false,
                                                        });
                                                    }}
                                                >
                                                    <Clear />
                                                </IconButton>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell>{row.price}</TableCell>
                                            <TableCell sx={{ padding: 0 }}>
                                                <IconButton
                                                    color="info"
                                                    onClick={() =>
                                                        editItem(row._id)
                                                    }
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        deleteItem(row._id)
                                                    }
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            );
                        })}
                        <TableRow>
                            <TableCell>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Feature"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    color="success"
                                    onClick={() => addToList(false)}
                                >
                                    <AddIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default FeatureList;
