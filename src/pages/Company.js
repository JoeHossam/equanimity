import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api_url } from '../getData.js';

const Company = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [companyData, setCompanyData] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchCompanyData = async () => {
            const comRes = await fetch(`${api_url}company/${id}`);
            const { company } = await comRes.json();
            setCompanyData(company);
            setLoading(false);
        };
        fetchCompanyData();
    }, [id]);

    if (loading) {
        return 'loading...';
    }

    return (
        <>
            <h2>{companyData.name}</h2>
        </>
    );
};

export default Company;
