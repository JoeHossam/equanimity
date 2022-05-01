import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Pagination,
    Snackbar,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CompareMenu from '../components/CompareMenu';
import Filter from '../components/Filter';
import SingleInsurance from '../components/SingleInsurance';
import { api_url } from '../getData.js';
import Slide from '@mui/material/Slide';
import Loading from './Loading';

const searchContext = React.createContext();

function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

const InsuranceList = () => {
    const [loading, setLoading] = useState(true);
    const [insuranceLoading, setInsuranceLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [query, setQuery] = useState(``);
    const [data, setData] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [comparing1, setComparing1] = useState({});
    const [comparing2, setComparing2] = useState({});
    const [showError, setShowError] = useState({});
    const [openCompare, setOpenCompare] = useState(false);
    const { category: urlCategory } = useParams();

    //filtering

    useEffect(() => {
        setLoading(true);
        setInsuranceLoading(true);
        const fetchData = async () => {
            const res = await fetch(`${api_url}insurance/${query}`);
            const { insurances, count } = await res.json();
            setTotalPages(Math.ceil(count / 10));
            setData(insurances);
            setInsuranceLoading(false);

            const res2 = await fetch(`${api_url}company`);
            const { companies: companiesData } = await res2.json();
            setCompanies(companiesData);

            const res3 = await fetch(`${api_url}category`);
            const { categories: categoriesData } = await res3.json();
            setCategories(categoriesData);
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        setInsuranceLoading(true);
        const fetchData = async () => {
            const res = await fetch(`${api_url}insurance/${query}`);
            const { insurances, count } = await res.json();
            setTotalPages(Math.ceil(count / 10));
            setData(insurances);
            setInsuranceLoading(false);
        };
        fetchData();
    }, [query]);

    useEffect(() => {
        if (showError === true) {
        }
    }, [showError]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <searchContext.Provider
                    value={{ page, setQuery, companies, categories }}
                >
                    <Box className={'insurance-list-main'}>
                        <Filter
                            urlCategory={categories.find(
                                (item) => item.name === urlCategory
                            )}
                        />

                        {insuranceLoading ? (
                            <Box sx={{ display: 'flex' }}>
                                <CircularProgress />
                            </Box>
                        ) : data.length === 0 ? (
                            'No result matches'
                        ) : (
                            <div
                                style={{
                                    minHeight: 'calc(100vh - 5.5rem)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'auto',
                                }}
                            >
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid
                                        container
                                        spacing={{ xs: 2, md: 3 }}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                        sx={{
                                            width: '100%',
                                            margin: 'auto',
                                            padding: '1rem',
                                        }}
                                    >
                                        {data.map((item) => {
                                            const company = companies.find(
                                                (comp) =>
                                                    comp._id === item.createdBy
                                            );
                                            return (
                                                <Grid
                                                    item
                                                    xs={2}
                                                    sm={4}
                                                    md={4}
                                                    key={item._id}
                                                >
                                                    <SingleInsurance
                                                        key={item._id}
                                                        insurance={{ ...item }}
                                                        comparing1={comparing1}
                                                        comparing2={comparing2}
                                                        setComparing2={
                                                            setComparing2
                                                        }
                                                        setComparing1={
                                                            setComparing1
                                                        }
                                                        setShowError={
                                                            setShowError
                                                        }
                                                        company={company}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                                <Divider />
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    variant="outlined"
                                    shape="rounded"
                                    onChange={(e) => setPage(e.target.value)}
                                    sx={{
                                        '& .MuiPagination-ul': {
                                            justifyContent: 'center',
                                        },
                                        marginTop: '1rem',
                                    }}
                                />
                            </div>
                        )}
                    </Box>
                    <Button onClick={() => setOpenCompare(true)}>
                        Open Compare
                    </Button>
                    <CompareMenu
                        openCompare={openCompare}
                        setOpenCompare={setOpenCompare}
                        comparing1={comparing1}
                        comparing2={comparing2}
                        setComparing1={setComparing1}
                        setComparing2={setComparing2}
                        companies={companies}
                        setShowError={setShowError}
                    />
                    <Snackbar
                        open={showError.isError}
                        onClose={() =>
                            setShowError({ ...showError, isError: false })
                        }
                        TransitionComponent={SlideTransition}
                        autoHideDuration={2000}
                    >
                        <Alert
                            onClose={() =>
                                setShowError({ ...showError, isError: false })
                            }
                            severity={showError.type}
                            sx={{ width: '100%' }}
                        >
                            {showError.msg}
                        </Alert>
                    </Snackbar>
                </searchContext.Provider>
            )}
        </>
    );
};

export const useSearchContext = () => {
    return useContext(searchContext);
};

export default InsuranceList;
