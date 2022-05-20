import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate } from 'react-router-dom';

function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

export default function NavTabs() {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* <Tabs
                value={value}
                onChange={handleChange}
                aria-label="nav tabs example"
            >
                <LinkTab
                    onClick={() => navigate('/profile/settings')}
                    label="Profile Settings"
                />
                <LinkTab
                    onClick={() => navigate('/profile/favourites')}
                    label="Favourites"
                />
                <LinkTab
                    onClick={() => navigate('/profile/reviews')}
                    label="Reviews"
                />
                <LinkTab
                    onClick={() => navigate('/profile/purchases')}
                    label="Purchases"
                />
            </Tabs> */}
        </Box>
    );
}
