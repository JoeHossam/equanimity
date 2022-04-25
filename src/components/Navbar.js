import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Avatar,
    Grid,
    Divider,
    Box,
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    ListItemIcon,
    Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { api_url, useGlobalContext } from '../context';
import Submenu from './Submenu';
import { Logout } from '@mui/icons-material';
import axios from 'axios';

const Navbar = () => {
    const { openSubmenu, closeSubmenu, openSidebar, user, isLoggedIn } =
        useGlobalContext();
    const handleSubmenu = (e) => {
        if (!e.target.classList.contains('link-btn')) {
            closeSubmenu();
        }
    };
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = async () => {
        const res = await axios.get(`${api_url}auth/logout`);
        console.log('logout', res);
    };
    return (
        <>
            <nav className="nav" onMouseOver={handleSubmenu}>
                <div className="nav-center">
                    <div className="nav-header">
                        <Link to={'/'}>
                            <h2 style={{ margin: 0 }}>LOGO</h2>
                        </Link>
                        <button
                            className="btn toggle-btn"
                            onClick={openSidebar}
                        >
                            <MenuIcon />
                        </button>
                    </div>
                    <ul className="nav-links">
                        <li>
                            <button
                                className="link-btn"
                                onMouseOver={openSubmenu}
                            >
                                Insurances
                            </button>
                        </li>
                        <li>
                            <button
                                className="link-btn"
                                onMouseOver={openSubmenu}
                            >
                                Companies
                            </button>
                        </li>
                        <li>
                            <button className="link-btn">
                                <Link to={'/about'}>Aboutus</Link>
                            </button>
                        </li>
                    </ul>

                    <Box sx={{ flexGrow: 0 }} className="signin-btn">
                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar alt={user.name} />
                            </IconButton>
                        </Tooltip>
                        {isLoggedIn ? (
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem>
                                    <ListItemIcon>
                                        <PersonIcon fontSize="small" />
                                    </ListItemIcon>
                                    Profile
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <FavoriteIcon fontSize="small" />
                                    </ListItemIcon>
                                    Favorites
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={logout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        ) : (
                            <Button>Sign in</Button>
                        )}
                    </Box>
                </div>
            </nav>
            <Submenu />
        </>
    );
};

export default Navbar;
