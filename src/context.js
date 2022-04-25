import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';

const AppContext = React.createContext();
const api_url = 'http://localhost:3001/';

const AppProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const [submenuLocation, setSubmenuLocation] = useState({});
    const [submenuData, setSubmenuData] = useState();
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const res = await axios.get(`${api_url}islogged`, {
                    withCredentials: true,
                });
                if (res.data.islogged) {
                    setIsLoggedIn(true);
                    setUser(res.data.user);
                    console.log(res);
                }
            } catch (error) {
                setIsLoggedIn(false);
            }
        };

        checkLoggedIn();
    }, []);

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    const openSidebar = () => {
        setIsSidebarOpen(true);
    };
    const closeSubmenu = () => {
        setIsSubmenuOpen(false);
    };
    const openSubmenu = (e) => {
        const tempBtn = e.target.getBoundingClientRect();
        const center = (tempBtn.left + tempBtn.right) / 2;
        const bottom = tempBtn.bottom - 3 + document.documentElement.scrollTop;
        setSubmenuLocation({ center, bottom });
        setSubmenuData(e.target.textContent);
        setIsSubmenuOpen(true);
    };

    return (
        <AppContext.Provider
            value={{
                isSidebarOpen,
                isSubmenuOpen,
                submenuLocation,
                submenuData,
                user,
                isLoggedIn,
                closeSidebar,
                closeSubmenu,
                openSidebar,
                openSubmenu,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext);
};

export { AppContext, AppProvider, api_url };
