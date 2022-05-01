import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api_url, useGlobalContext } from '../../context';

const AdminNav = () => {
    const navigate = useNavigate();
    const { isAdminLogged, setIsAdminLogged } = useGlobalContext();
    useEffect(() => {
        if (!isAdminLogged) return navigate('/admin/login');
    }, []);
    const logout = async () => {
        const res = axios.get(`${api_url}auth/logout`, {
            withCredentials: true,
        });
        setIsAdminLogged(false);
        navigate('/companyadmin/login');
    };

    return (
        <nav style={{ width: '100%', position: 'sticky' }}>
            <h2>Admin Dashboard</h2>
            <ul style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/admin/insurances')}
                >
                    Insurances
                </Button>
                <Button
                    variant="contained"
                    onClick={() => navigate('/admin/categories')}
                >
                    Categories
                </Button>
                <Button
                    variant="contained"
                    onClick={() => navigate('/admin/companies')}
                >
                    Companies
                </Button>
                <Button variant="contained" onClick={logout}>
                    Logout
                </Button>
            </ul>
        </nav>
    );
};

export default AdminNav;
