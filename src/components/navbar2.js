import React, { useState } from 'react';
import {
    createStyles,
    Header,
    Autocomplete,
    Group,
    Burger,
} from '@mantine/core';
import { Coin, Search } from 'tabler-icons-react';
import {
    Avatar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
} from '@mui/material';
// import { MantineLogo } from '../../shared/MantineLogo';
import StarRateIcon from '@mui/icons-material/StarRate';
import { AddBox, Logout, Paid } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';

import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ScrollToTop from './ScrollToTop';
import { Link, useNavigate } from 'react-router-dom';
import { api_url, useGlobalContext } from '../context';
import axios from 'axios';

const useStyles = createStyles((theme) => ({
    header: {
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        position: 'sticky',
        top: '0',
        left: '0',
    },

    inner: {
        height: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    links: {
        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    burger: {
        display: 'none',
        [theme.fn.smallerThan('md')]: {
            display: 'block',
        },
    },

    search: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
        },
    },
}));

const list = (items) => (
    <Box
        sx={{ width: 250 }}
        // onClick={setOpened(false)}
        // onKeyDown={setOpened(false)}
    >
        <List>
            {items.map((text, index) => (
                <ListItem disableRipple key={text} disablePadding>
                    <ListItemButton disableRipple>
                        <ListItemText primary={text} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Box>
);

export function HeaderSearch({ links }) {
    const [opened, setOpened] = useState(false);
    const navigate = useNavigate();
    const { user, isLoggedIn, setIsLoggedIn, search, setSearch } =
        useGlobalContext();
    const [searchNav, setSearchNav] = useState('');
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

    const { classes } = useStyles();

    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={classes.link}
            // onClick={(event) => event.preventDefault()}
        >
            {link.label}
        </a>
    ));

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('searched');
        setSearch(searchNav);
        navigate('/insurances');
    };

    return (
        <React.Fragment>
            <Drawer open={opened} onClose={() => setOpened(false)}>
                {list(items)}
            </Drawer>

            <Header height={56} className={classes.header}>
                <div className={classes.inner}>
                    <Group>
                        <Burger
                            className={classes.burger}
                            opened={opened}
                            onClick={() => setOpened(!opened)}
                            size="sm"
                        />
                        {/* <MantineLogo /> */}
                        logo
                        <Group ml={50} spacing={5} className={classes.links}>
                            {items}
                        </Group>
                    </Group>
                    <Group>
                        <form onSubmit={handleSearchSubmit}>
                            <Autocomplete
                                className={classes.search}
                                placeholder="Search"
                                value={searchNav}
                                onChange={setSearchNav}
                                icon={<Search size={16} />}
                                data={[]}
                            />
                        </form>
                        {isLoggedIn ? (
                            <Box sx={{ flexGrow: 0 }} className="signin-btn">
                                <Tooltip title="Open settings">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <Avatar
                                            alt={user.name}
                                            src={user.img}
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
                                            <AddBox fontSize="small" />
                                        </ListItemIcon>
                                        Saved
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            navigate('/profile/purchases')
                                        }
                                    >
                                        <ListItemIcon>
                                            <Paid fontSize="small" />
                                        </ListItemIcon>
                                        Purchases
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            navigate('/profile/reviews')
                                        }
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
                                <Button disableRipple>join</Button>
                            </Link>
                        )}
                    </Group>
                </div>
            </Header>
            <ScrollToTop />
        </React.Fragment>
    );
}
