import { Button, Link } from '@mui/material';
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
        <div
            style={{
                width: '100%',
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: '99',
                backgroundColor: '#1976d2',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem',
            }}
        >
            <h2 style={{ margin: 0 }}>{companyUser.name}</h2>
            <ul style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link
                    style={{ color: '#fff', margin: '0 1rem' }}
                    variant="contained"
                    onClick={() => navigate('/companyadmin')}
                >
                    Dashboard
                </Link>
                <Link
                    style={{ color: '#fff', margin: '0 1rem' }}
                    variant="contained"
                    onClick={() => navigate('/companyadmin/profile')}
                >
                    Profile
                </Link>
                <Link
                    style={{ color: '#fff', margin: '0 1rem' }}
                    variant="contained"
                    onClick={logout}
                >
                    Logout
                </Link>
            </ul>
        </div>
    );
};

export default CompanyNav;
