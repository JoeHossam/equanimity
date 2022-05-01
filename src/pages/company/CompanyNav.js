import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api_url, useGlobalContext } from '../../context';

const CompanyNav = () => {
    const navigate = useNavigate();
    const { isCompanyLogged, setIsCompanyLogged, companyUser } =
        useGlobalContext();
    useEffect(() => {
        if (!isCompanyLogged) return navigate('/companyadmin/login');
    }, []);
    const logout = async () => {
        const res = axios.get(`${api_url}auth/logout`, {
            withCredentials: true,
        });
        setIsCompanyLogged(false);
        navigate('/companyadmin/login');
    };

    return (
        <nav style={{ width: '100%', position: 'sticky' }}>
            <h2>{companyUser.name}</h2>
            <ul style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/companyadmin')}
                >
                    Dashboard
                </Button>
                <Button
                    variant="contained"
                    onClick={() => navigate('/companyadmin/profile')}
                >
                    Profile
                </Button>
                <Button variant="contained" onClick={logout}>
                    Logout
                </Button>
            </ul>
        </nav>
    );
};

export default CompanyNav;
