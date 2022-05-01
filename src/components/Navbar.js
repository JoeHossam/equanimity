import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Avatar,
    Divider,
    Box,
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link, useNavigate } from 'react-router-dom';
import { api_url, useGlobalContext } from '../context';
import Submenu from './Submenu';
import { Logout } from '@mui/icons-material';
import StarRateIcon from '@mui/icons-material/StarRate';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const {
        openSubmenu,
        closeSubmenu,
        openSidebar,
        user,
        isLoggedIn,
        setIsLoggedIn,
    } = useGlobalContext();
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
        try {
            const res = await axios.get(`${api_url}auth/logout`, {
                withCredentials: 'true',
            });
            setIsLoggedIn(false);
            navigate('/');
        } catch (error) {
            console.log(error.message);
        }
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
                                <Link
                                    style={{
                                        color: 'white',
                                        fontSize: '1.1rem',
                                    }}
                                    to={'/about'}
                                >
                                    Aboutus
                                </Link>
                            </button>
                        </li>
                    </ul>

                    {isLoggedIn ? (
                        <Box sx={{ flexGrow: 0 }} className="signin-btn">
                            <Tooltip title="Open settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar alt={user.name} />
                                </IconButton>
                            </Tooltip>
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
                                <MenuItem
                                    onClick={() =>
                                        navigate('/profile/settings')
                                    }
                                >
                                    <ListItemIcon>
                                        <PersonIcon fontSize="small" />
                                    </ListItemIcon>
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    onClick={() =>
                                        navigate('/profile/favourites')
                                    }
                                >
                                    <ListItemIcon>
                                        <FavoriteIcon fontSize="small" />
                                    </ListItemIcon>
                                    Favorites
                                </MenuItem>
                                <MenuItem
                                    onClick={() => navigate('/profile/reviews')}
                                >
                                    <ListItemIcon>
                                        <StarRateIcon fontSize="small" />
                                    </ListItemIcon>
                                    Reviews
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={logout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Link to="/join">
                            <Button sx={{ color: 'white' }}>join</Button>
                        </Link>
                    )}
                </div>
            </nav>
            <Submenu />
        </>
    );
};

export default Navbar;
