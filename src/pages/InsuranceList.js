import { Box, Pagination } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Filter from '../components/Filter';
import SingleInsurance from '../components/SingleInsurance';
import { api_url } from '../getData.js';

const searchContext = React.createContext();

const InsuranceList = () => {
    const [loading, setLoading] = useState(true);
    const [insuranceLoading, setInsuranceLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [query, setQuery] = useState(``);
    const [data, setData] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [categories, setCategories] = useState([]);
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
    return (
        <>
            {loading ? (
                'Loading...'
            ) : (
                <searchContext.Provider
                    value={{ page, setQuery, companies, categories }}
                >
                    <Box>
                        <Filter
                            urlCategory={categories.find(
                                (item) => item.name === urlCategory
                            )}
                        />
                        {insuranceLoading ? (
                            'loading..'
                        ) : data.length === 0 ? (
                            'No result matches'
                        ) : (
                            <div>
                                <div
                                    className="insurance-list"
                                    style={{ width: '100%' }}
                                >
                                    {data.map((item) => {
                                        const company = companies.find(
                                            (comp) =>
                                                comp._id === item.createdBy
                                        );
                                        return (
                                            <SingleInsurance
                                                key={item._id}
                                                {...item}
                                                company={company}
                                            />
                                        );
                                    })}
                                </div>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    variant="outlined"
                                    shape="rounded"
                                    onChange={(e) => setPage(e.target.value)}
                                />
                            </div>
                        )}
                    </Box>
                </searchContext.Provider>
            )}
        </>
    );
};

export const useSearchContext = () => {
    return useContext(searchContext);
};

export default InsuranceList;
