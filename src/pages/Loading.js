import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress, {
    circularProgressClasses,
} from '@mui/material/CircularProgress';

function FacebookCircularProgress(props) {
    return (
        <Box sx={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) =>
                        theme.palette.grey[
                            theme.palette.mode === 'light' ? 200 : 800
                        ],
                }}
                size={80}
                thickness={5}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                    color: (theme) =>
                        theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={80}
                thickness={5}
                {...props}
            />
        </Box>
    );
}

const Loading = () => {
    // const [dots, setDots] = useState('.');
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (dots === '...') {
    //             setDots('');
    //         } else if (dots === '..') {
    //             setDots('...');
    //         } else if (dots === '.') {
    //             setDots('..');
    //         } else if (dots === '') {
    //             setDots('.');
    //         }
    //     }, 250);

    //     return () => clearInterval(interval);
    // });
    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* <h1 style={{ marginBottom: '3rem' }}>Loading</h1> */}
            <FacebookCircularProgress />
        </Box>
    );
};

export default Loading;
