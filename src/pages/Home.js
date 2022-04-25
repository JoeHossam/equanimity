import axios from 'axios';
import React from 'react';
import { api_url } from '../context';

const Home = () => {
    const check = () => {
        const checkLoggedIn = async () => {
            try {
                const res = await axios.get(`${api_url}islogged`, {
                    withCredentials: true,
                });
                if (res.data.islogged) {
                    console.log(res);
                }
            } catch (error) {
                console.log(error);
            }
        };

        checkLoggedIn();
    };
    return <div onClick={check}>Home</div>;
};

export default Home;
