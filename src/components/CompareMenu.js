import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
    Divider,
    Slide,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const comps = [
    'title',
    'category',
    'createdBy',
    'price',
    'rating',
    'reviewCount',
];

export default function CompareMenu({
    openCompare,
    setOpenCompare,
    comparing1,
    comparing2,
    setComparing1,
    setComparing2,
    companies,
    setShowError,
}) {
    const handleClose = () => {
        setOpenCompare(false);
    };
    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (openCompare) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openCompare]);

    return (
        <div>
            <Dialog
                open={openCompare}
                onClose={handleClose}
                TransitionComponent={Transition}
                scroll={'paper'}
                sx={{
                    '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
                        maxWidth: '90vw !important',
                    },
                }}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>Compare</div>
                        <Button
                            onClick={() => {
                                setComparing1({});
                                setComparing2({});
                                setShowError({});
                            }}
                        >
                            Clear all
                        </Button>
                    </div>
                </DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <Table
                            sx={{ minWidth: 650, width: '100%' }}
                            aria-label="simple table"
                        >
                            <TableBody>
                                {comps.map((item) => {
                                    let half1 = comparing1[item];
                                    let half2 = comparing2[item];
                                    if (item === 'createdBy') {
                                        const company1 = companies.find(
                                            (company) =>
                                                company._id ===
                                                comparing1.createdBy
                                        );
                                        const company2 = companies.find(
                                            (company) =>
                                                company._id ===
                                                comparing2.createdBy
                                        );
                                        if (
                                            Object.keys(comparing1).length !== 0
                                        )
                                            half1 = company1.name;
                                        if (
                                            Object.keys(comparing2).length !== 0
                                        )
                                            half2 = company2.name;
                                        item = 'company';
                                    }
                                    if (item !== 'title') {
                                        if (
                                            Object.keys(comparing1).length === 0
                                        ) {
                                            half1 = '-';
                                        }
                                        if (
                                            Object.keys(comparing2).length === 0
                                        ) {
                                            half2 = '-';
                                        }
                                    }
                                    return (
                                        <TableRow
                                            sx={{
                                                '&:last-child td, &:last-child th':
                                                    { border: 0 },
                                            }}
                                        >
                                            <TableCell
                                                sx={{
                                                    paddingX: '0',
                                                    width: '20%',
                                                    minWidth: '80px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        textTransform:
                                                            'capitalize',
                                                    }}
                                                >
                                                    {item}
                                                </div>
                                            </TableCell>
                                            <Divider />
                                            <TableCell>
                                                <div>
                                                    {half1}
                                                    {Object.keys(comparing1)
                                                        .length !== 0 &&
                                                    item === 'title' ? (
                                                        <Button
                                                            onClick={() => {
                                                                setComparing1(
                                                                    {}
                                                                );
                                                                setShowError(
                                                                    {}
                                                                );
                                                            }}
                                                        >
                                                            X
                                                        </Button>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </TableCell>
                                            <Divider />
                                            <TableCell>
                                                <div>
                                                    {half2}
                                                    {Object.keys(comparing2)
                                                        .length !== 0 &&
                                                    item === 'title' ? (
                                                        <Button
                                                            onClick={() => {
                                                                setComparing2(
                                                                    {}
                                                                );
                                                                setShowError(
                                                                    {}
                                                                );
                                                            }}
                                                        >
                                                            X
                                                        </Button>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
