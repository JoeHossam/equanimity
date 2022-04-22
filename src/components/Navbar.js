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
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context';
import Submenu from './Submenu';
import { Logout } from '@mui/icons-material';

const Navbar = () => {
    const { openSubmenu, closeSubmenu, openSidebar } = useGlobalContext();
    const handleSubmenu = (e) => {
        if (!e.target.classList.contains('link-btn')) {
            closeSubmenu();
        }
    };

    const settings = ['Profile', 'Favourites', 'Logout'];
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
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

                    {/* <Grid container>
                        <Grid item xs>
                            <Avatar
                                alt="Remy Sharp"
                                src="/static/images/avatar/1.jpg"
                                sx={{ width: 24, height: 24 }}
                            />
                        </Grid>
                        <Divider orientation="vertical" flexItem></Divider>
                        <Grid item xs>
                            <ArrowDropDownIcon />
                        </Grid>
                    </Grid> */}

                    <Box sx={{ flexGrow: 0 }} className="signin-btn">
                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/2.jpg"
                                />
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
                            <MenuItem>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </div>
            </nav>
            <Submenu />
        </>
    );
};

export default Navbar;
