import { Box, Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <Zoom in={isVisible}>
            <Box
                onClick={scrollToTop}
                role="presentation"
                sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: '999' }}
            >
                <Fab
                    disableRipple
                    color="primary"
                    size="small"
                    aria-label="scroll back to top"
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            </Box>
        </Zoom>
    );
};

export default ScrollToTop;
