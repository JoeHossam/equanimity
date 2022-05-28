import { Button, ButtonGroup, Link } from '@mui/material';
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
            <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
            <ul style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* <ButtonGroup> */}
                <Link
                    style={{
                        color: '#fff',
                        margin: '0 1rem',
                        cursor: 'pointer',
                    }}
                    variant="contained"
                    onClick={() => navigate('/admin/insurances')}
                >
                    Insurances
                </Link>
                <Link
                    style={{
                        color: '#fff',
                        margin: '0 1rem',
                        cursor: 'pointer',
                    }}
                    variant="contained"
                    onClick={() => navigate('/admin/companies')}
                >
                    Companies
                </Link>
                <Link
                    style={{
                        color: '#fff',
                        margin: '0 1rem',
                        cursor: 'pointer',
                    }}
                    variant="contained"
                    onClick={() => navigate('/admin/payments')}
                >
                    Payments
                </Link>
                <Link
                    style={{
                        color: '#fff',
                        margin: '0 1rem',
                        cursor: 'pointer',
                    }}
                    variant="contained"
                    onClick={() => navigate('/admin/reviews')}
                >
                    Reviews
                </Link>
                <Link
                    style={{
                        color: '#fff',
                        margin: '0 1rem',
                        cursor: 'pointer',
                    }}
                    variant="contained"
                    onClick={() => navigate('/admin/categories')}
                >
                    Categories
                </Link>
                <Link
                    style={{
                        color: '#fff',
                        margin: '0 1rem',
                        cursor: 'pointer',
                    }}
                    variant="contained"
                    onClick={() => navigate('/admin/contact')}
                >
                    Contacts
                </Link>
                <Link
                    style={{
                        color: '#fff',
                        margin: '0 1rem',
                        cursor: 'pointer',
                    }}
                    variant="contained"
                    onClick={() => navigate('/admin/users')}
                >
                    Users
                </Link>
                <Link
                    style={{
                        color: '#fff',
                        margin: '0 1rem',
                        cursor: 'pointer',
                    }}
                    variant="contained"
                    onClick={logout}
                >
                    Logout
                </Link>
                {/* </ButtonGroup> */}
            </ul>
        </div>
    );
};

export default AdminNav;
