import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { LoadingButton } from '@mui/lab';
import {
    Avatar,
    Rating,
    CardHeader,
    TextField,
    Button,
    Checkbox,
    Divider,
    Typography,
    Snackbar,
    Alert,
    FormControlLabel,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Slide,
    Box,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGlobalContext } from '../context.js';
import { getData, api_url } from '../getData.js';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Check, Plus } from 'tabler-icons-react';
import { createStyles, Button as ButtonMantine } from '@mantine/core';
import Payment from '../components/Payment';
import { Close } from '@mui/icons-material';
import Loading from './Loading.js';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const useStyles = createStyles((theme) => ({
    wrapper: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12,1fr)',
        gap: '20px',
        margin: '0 40px',
        [theme.fn.smallerThan('md')]: {
            display: 'block',
        },
    },
    leftSide: {
        gridColumnStart: 1,
        gridColumnEnd: 8,
    },
    rightSide: {
        gridColumnStart: 9,
        gridColumnEnd: 13,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Insurance = () => {
    const { classes, theme } = useStyles();
    const { id } = useParams();
    const { user, userLoading, isLoggedIn } = useGlobalContext();
    const [loading, setLoading] = useState(true);
    const [companyLoading, setCompanyLoading] = useState(true);
    const [isFavourite, setIsFavourite] = useState(false);
    const [loadingFav, setLoadingFav] = useState(true);
    const [insuranceData, setInsuranceData] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [reviewData, setReviewData] = useState([]);
    const [selectedList, setSelectedList] = useState([]);
    const [baseList, setBaseList] = useState([]);
    const [dialog, setDialog] = useState({
        open: false,
        type: 'review',
        size: 'md',
    });
    const [notFound, setNotFound] = useState(false);
    const [favs, setFavs] = useState(0);

    useEffect(() => {
        if (userLoading) return;
        setLoadingFav(true);
        const man = async () => {
            try {
                const res = await axios.get(
                    `${api_url}user/isfavourite?insurance=${id}`,
                    { withCredentials: true }
                );
                setFavs(res.data.count);
                if (res.data.isFavourite) {
                    setIsFavourite(true);
                } else {
                    setIsFavourite(false);
                }
            } catch (error) {
                console.error(error);
            }
            setLoadingFav(false);
        };
        man();
    }, [userLoading, isFavourite]);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const insRes = await axios.get(`${api_url}insurance/${id}`);
                if (Object.keys(insRes.data.insurance).length === 0) {
                    setNotFound(true);
                }
                setInsuranceData(insRes.data);

                const revRes = await axios.get(`${api_url}review/${id}`);
                setReviewData(revRes.data);
            } catch (error) {
                setNotFound(true);
            }

            setLoading(false);
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (loading) {
            return;
        }
        if (notFound) {
            setCompanyLoading(false);
            return;
        }
        const fetchCompanyData = async () => {
            const createdBy = insuranceData.insurance.createdBy;
            const comRes = await fetch(`${api_url}company/${createdBy}`);
            const comData = await comRes.json();
            setCompanyData(comData);
            setSelectedList(
                insuranceData.insurance.features.map((item) => {
                    return { ...item, checked: false };
                })
            );
            setBaseList(insuranceData.insurance.baseFeatures);
            setCompanyLoading(false);
        };
        fetchCompanyData();
    }, [loading]);

    const toggleFavourite = async () => {
        try {
            const res1 = await axios.post(
                `${api_url}user/favourite/toggle`,
                {
                    favouriting: !isFavourite,
                    insurance: id,
                    user: user._id,
                    userType: user.provider === 'local' ? 'User' : 'OAuthUser',
                },
                { withCredentials: true, 'Content-Type': 'application/json' }
            );

            setIsFavourite(res1.data.msg);
        } catch (error) {
            console.log(error.response);
        }
    };

    if (notFound) {
        return (
            <Box textAlign={'center'}>
                <h2>404 Not Found</h2>
                <p>
                    There is no insurance here, maybe the URL is incorrect or
                    the insurance has been deleted.
                </p>
            </Box>
        );
    }

    if (loading || companyLoading || userLoading) {
        return <Loading />;
    }

    // Insurance
    const {
        title,
        category,
        createdBy,
        basePrice,
        rating,
        reviewCount,
        description,
    } = insuranceData.insurance;

    // Get Company
    const company = companyData.company.name;

    // Get Reviews
    const { reviews } = reviewData;

    return (
        <main className={classes.wrapper}>
            <section className={classes.leftSide}>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            variant="h2"
                            fontFamily={`-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji`}
                            fontWeight={400}
                            sx={{ textTransform: 'capitalize' }}
                            component="span"
                        >
                            {title}
                        </Typography>
                        <Typography
                            sx={{ display: 'flex', alignItems: 'center' }}
                            variant="h5"
                            component="span"
                        >
                            <Rating
                                name="read-only"
                                sx={{ margin: '0 1rem' }}
                                value={rating}
                                precision={0.5}
                                readOnly
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                {rating.toFixed(2)}
                                <div style={{ fontSize: '12px' }}>
                                    {reviewCount} reviews
                                </div>
                            </div>
                        </Typography>
                    </div>
                    <Typography variant="caption" ml="0.5rem">
                        <Link
                            style={{
                                textDecoration: 'underline',
                            }}
                            to={`/company/${companyData.company._id}`}
                        >
                            {company}
                        </Link>
                    </Typography>
                </div>
            </section>

            {/* save button */}
            <div
                className={classes.rightSide}
                style={{ display: 'flex', justifyContent: 'right', margin: 0 }}
            >
                <FormControlLabel
                    sx={{ margin: 0 }}
                    control={
                        <Checkbox
                            disableRipple
                            sx={{ padding: 0 }}
                            checked={isFavourite}
                            icon={
                                <Button
                                    disableRipple
                                    size="small"
                                    sx={{
                                        margin: 0,
                                        border: '2px solid #1976d2 !important',
                                    }}
                                    variant="outlined"
                                >
                                    <Plus size={20} />
                                    Save
                                </Button>
                            }
                            checkedIcon={
                                <Button
                                    disableRipple
                                    size="small"
                                    variant="contained"
                                    sx={{ margin: 0 }}
                                >
                                    <Check size={20} />
                                    Saved
                                </Button>
                            }
                            onClick={toggleFavourite}
                        />
                    }
                />
            </div>

            {/* description and features */}
            <div className={classes.leftSide} style={{ marginTop: '2rem' }}>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Description</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ overflow: 'auto' }}>
                        <Typography
                            dangerouslySetInnerHTML={{
                                __html: description,
                            }}
                            style={{
                                margin: '16px',
                                padding: 0,
                            }}
                        ></Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Base Services</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: '0 16px' }}>
                        <Typography component="div">
                            <ul
                                style={{ listStyle: 'inherit', margin: '16px' }}
                            >
                                {baseList.length === 0
                                    ? 'No items Here'
                                    : baseList.map((item, index) => {
                                          return (
                                              <li key={index}>
                                                  <Typography
                                                      component="div"
                                                      variant="body1"
                                                      sx={{ margin: '15px 0' }}
                                                  >
                                                      {item}
                                                  </Typography>
                                              </li>
                                          );
                                      })}
                            </ul>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Additional Services</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: '0 16px' }}>
                        <Typography component="div">
                            <ul
                                style={{ listStyle: 'inherit', margin: '16px' }}
                            >
                                {selectedList.length === 0
                                    ? 'No items Here'
                                    : selectedList.map((item, index) => {
                                          return (
                                              <li key={index}>
                                                  <Typography
                                                      sx={{
                                                          display: 'flex',
                                                          justifyContent:
                                                              'space-between',
                                                          margin: '15px 0',
                                                      }}
                                                      component="div"
                                                      variant="body1"
                                                  >
                                                      <div
                                                          style={{
                                                              width: '70%',
                                                          }}
                                                      >
                                                          {item.name}
                                                      </div>
                                                      <div>
                                                          {item.price.toLocaleString(
                                                              'en-US'
                                                          )}{' '}
                                                          EGP
                                                      </div>
                                                  </Typography>
                                              </li>
                                          );
                                      })}
                            </ul>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>

            <section
                className={classes.rightSide}
                style={{ marginTop: '2rem' }}
            >
                <div style={{ width: '100%' }}>
                    {/* <Typography variant="h5">Category: {category}</Typography> */}

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="h5">
                            Price: {basePrice.toLocaleString('en-US')} EGP
                        </Typography>

                        <ButtonMantine
                            onClick={() =>
                                setDialog({
                                    open: true,
                                    size: 'full',
                                    type: 'payment',
                                })
                            }
                            size="xs"
                            color="blue"
                        >
                            Proceed to payment
                        </ButtonMantine>
                    </div>
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginY: '1rem',
                            justifyContent: 'center',
                        }}
                    >
                        <InfoOutlinedIcon sx={{ marginX: '1rem' }} />
                        Note that this price is due to change based on the
                        information you might insert before showing the final
                        receipt, and also on any additional services you might
                        choose.
                    </Typography>
                    <Divider />
                    <Reviews
                        dialog={dialog}
                        setDialog={setDialog}
                        reviewsData={reviews}
                        insuranceId={id}
                        setReviewData={setReviewData}
                    />
                </div>
            </section>
            <Dialog
                open={dialog.open}
                onClose={() => setDialog({ ...dialog, open: false })}
                TransitionComponent={Transition}
                maxWidth={dialog.size === 'full' ? '' : 'md'}
                fullScreen={dialog.size === 'full' ? true : false}
                scroll={'paper'}
            >
                {dialog.type === 'review' ? (
                    <LeaveReview
                        setReviewData={setReviewData}
                        insuranceId={id}
                        setDialog={setDialog}
                        dialog={dialog}
                    />
                ) : (
                    <PaymentDialog
                        title={title}
                        companyName={company}
                        category={category}
                        selectedList={selectedList}
                        setSelectedList={setSelectedList}
                        basePrice={basePrice}
                        setDialog={setDialog}
                        dialog={dialog}
                        insuranceId={id}
                        companyId={createdBy}
                    />
                )}
            </Dialog>
        </main>
    );
};

const Reviews = ({ reviewsData, setDialog }) => {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (reviewsData === []) {
            return;
        }
        const fetchReviewData = async () => {
            let newReviews = [];

            for (const review of reviewsData) {
                const res = await fetch(
                    `${api_url}user/${review.user_type}/${review.userId}`
                );
                const { user } = await res.json();
                newReviews.push({ ...review, name: user.name, img: user.img });
            }
            setReviews(newReviews);
            setLoading(false);
        };
        fetchReviewData();
    }, [reviewsData]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4>Reviews</h4>

                <ButtonMantine
                    onClick={() =>
                        setDialog({
                            open: true,
                            size: 'md',
                            type: 'review',
                        })
                    }
                    size="xs"
                    color="blue"
                >
                    Leave a review
                </ButtonMantine>
            </div>
            <ul
                style={{
                    overflow: 'auto',
                    maxHeight: '60vh',
                    marginTop: '1rem',
                    border: '1px solid #f8f9fa',
                    boxShadow: `0px 2px 4px -1px rgb(0 0 0 / 5%),
        0px 4px 5px 0px rgb(0 0 0 / 4%), 0px 1px 10px 0px rgb(0 0 0 / 3%)`,
                }}
            >
                {reviews.length === 0
                    ? 'There are no reviews yet.'
                    : reviews.map((item) => {
                          return (
                              <div key={item._id}>
                                  <li
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
                              </div>
                          );
                      })}
            </ul>
        </div>
    );
};

const LeaveReview = ({ insuranceId, setReviewData, setDialog, dialog }) => {
    const { user } = useGlobalContext();
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { isLoggedIn } = useGlobalContext();
    const submitReview = async (e) => {
        e.preventDefault();
        setError('');
        if (userRating === 0) {
            setError('Rating is requierd');
            return;
        }
        setSubmitting(true);
        try {
            const res = await axios.post(
                `${api_url}review/${insuranceId}`,
                {
                    rating: userRating,
                    comment: userComment,
                },
                { withCredentials: true }
            );
            const revRes = await fetch(`${api_url}review/${insuranceId}`);
            const revData = await revRes.json();
            setReviewData(revData);
            setDialog({ ...dialog, open: false });
        } catch (error) {
            console.error(error.response);
            if (error.response.status === 401) {
                if (!isLoggedIn) {
                    setError('You must Login first');
                    setSubmitting(false);
                    return;
                }
                setError('There has been an error try again later');
                setSubmitting(false);
                return;
            } else if (error.response.status === 400) {
                setError('There has been an error try again later');
                setSubmitting(false);
                return;
            }
            setError('you have already reviewed this insurance');
        }
        setSubmitting(false);
    };
    return (
        <>
            <DialogContent dividers>
                <DialogContentText tabIndex={-1}>
                    <DialogTitle id="scroll-dialog-title">
                        Leave a Review
                    </DialogTitle>
                    <form
                        // className="leave-review"
                        onSubmit={submitReview}
                        style={{
                            backgroundColor: 'transparent',
                            height: 'auto',
                            padding: 0,
                            width: '100%',
                            minWidth: '300px',
                            // display: 'grid',
                        }}
                    >
                        <CardHeader
                            sx={{ alignItems: 'flex-start' }}
                            avatar={<Avatar alt={user.name} src={user.img} />}
                            title={
                                <>
                                    <Typography variant="h6">
                                        {user.name}
                                    </Typography>

                                    <Rating
                                        value={userRating}
                                        onChange={(event, newValue) => {
                                            setUserRating(newValue);
                                        }}
                                    />
                                </>
                            }
                        />
                        <TextField
                            multiline
                            fullWidth
                            size="small"
                            minRows="3"
                            maxRows="5"
                            id="review"
                            type="text"
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                        />

                        <Snackbar
                            open={error !== ''}
                            autoHideDuration={6000}
                            onClose={() => setError('')}
                        >
                            <Alert
                                onClose={() => setError('')}
                                severity="error"
                                sx={{ width: '100%' }}
                            >
                                {error}
                            </Alert>
                        </Snackbar>
                    </form>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialog({ ...dialog, open: false })}>
                    Cancel
                </Button>
                <LoadingButton
                    loading={submitting}
                    onClick={submitReview}
                    type="submit"
                    variant="contained"
                >
                    Submit
                </LoadingButton>
            </DialogActions>
        </>
    );
};

const PaymentDialog = ({
    selectedList,
    title,
    companyName,
    basePrice,
    setDialog,
    dialog,
    category,
    insuranceId,
    companyId,
}) => {
    const [price, setPrice] = useState(basePrice);
    const [fList, setFList] = useState(selectedList);
    const [equationData, setEquationData] = useState(0);
    const [equation, setEquation] = useState('w');
    const [total, setTotal] = useState(0);
    const { user } = useGlobalContext();

    useEffect(() => {
        if (equationData === 0) return;
        const { age, disease, model, manufacturer, price, year } = equationData;
        if (category === 'Life Insurance') {
            const extraAge = age - 21 < 0 ? 0 : age - 21;
            const extraDisease = disease === true ? 20 : 0;
            setEquation(extraAge * 0.5 + extraDisease);
        } else if (category === 'Motor Insurance') {
            setEquation((price * 0.0375) / year - 1);
        }
    }, [equationData]);

    useEffect(() => {
        if (equation === 'w') return;
        setPrice(basePrice * (1 + equation / 100));
        setFList(
            selectedList.map((item) => {
                return {
                    ...item,
                    price: item.price * (1 + equation / 100),
                };
            })
        );
    }, [equation]);

    useEffect(() => {
        setTotal(
            fList
                .reduce((total, current) => {
                    if (current.checked) total += current.price;
                    return total;
                }, price)
                .toFixed(2)
        );
    }, [fList]);

    const handlePayment = async () => {
        try {
            const res = await axios.post(
                `${api_url}payment`,
                {
                    insuranceId: insuranceId,
                    userId: user._id,
                    insuranceName: title,
                    companyName,
                    companyId: companyId,
                    totalPrice: total,
                    phone: user.phone,
                    features: fList
                        .filter((item) => item.checked === true)
                        .map((item) => {
                            return { name: item.name, price: item.price };
                        }),
                },
                { withCredentials: true }
            );
        } catch (error) {
            console.error('payment=>', error.response);
        }
    };

    return (
        <>
            <DialogContent>
                <DialogTitle
                    sx={{
                        paddingTop: 0,
                    }}
                    id="scroll-dialog-title"
                >
                    <Box
                        sx={{
                            marginBottom: '1rem',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Button
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                            }}
                            onClick={() =>
                                setDialog({ ...dialog, open: false })
                            }
                        >
                            <Close />
                        </Button>
                        <Typography variant="h4">Payment</Typography>
                    </Box>

                    <Divider />
                </DialogTitle>
                <DialogContentText tabIndex={-1}>
                    <Payment
                        type={category}
                        equationData={equationData}
                        handlePayment={handlePayment}
                        setEquationData={setEquationData}
                    >
                        <div>
                            <TableContainer elevation={0} component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" colSpan={2}>
                                                <Typography variant="h5">
                                                    Services
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="h5">
                                                    Price
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                style={{ width: 'min-width' }}
                                                align="right"
                                            >
                                                {/* <Typography variant="h5">Services</Typography> */}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                Base Services total
                                            </TableCell>
                                            <TableCell align="right">
                                                {price.toLocaleString('en-US')}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{ color: 'green' }}
                                            >
                                                {'+' +
                                                    price.toLocaleString(
                                                        'en-US'
                                                    )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <Typography variant="h5">
                                                    Additional Services
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right"></TableCell>
                                            <TableCell
                                                style={{ width: 'min-width' }}
                                                align="right"
                                            ></TableCell>
                                        </TableRow>
                                        {fList.map((row) => (
                                            <TableRow
                                                key={row._id}
                                                sx={{
                                                    '&:last-child td, &:last-child th':
                                                        {
                                                            border: 0,
                                                        },
                                                }}
                                            >
                                                <TableCell
                                                    style={{ width: 40 }}
                                                >
                                                    <Checkbox
                                                        checked={row.checked}
                                                        onClick={() =>
                                                            setFList(
                                                                fList.map(
                                                                    (item) => {
                                                                        if (
                                                                            item._id !==
                                                                            row._id
                                                                        )
                                                                            return item;
                                                                        return {
                                                                            ...item,
                                                                            checked:
                                                                                !item.checked,
                                                                        };
                                                                    }
                                                                )
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.price.toLocaleString(
                                                        'en-US'
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    sx={{ color: 'green' }}
                                                >
                                                    {row.checked &&
                                                        '+' +
                                                            row.price.toLocaleString(
                                                                'en-US'
                                                            )}
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <Typography variant="h5">
                                                    Estimated Price
                                                </Typography>
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell align="right">
                                                <Typography variant="h5">
                                                    {total.toLocaleString(
                                                        'en-US'
                                                    )}{' '}
                                                    EGP
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Payment>
                </DialogContentText>
            </DialogContent>
        </>
    );
};

export default Insurance;
