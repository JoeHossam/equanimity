import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import Loading from './pages/Loading';

const AppContext = React.createContext();
const api_url = 'http://localhost:3001/';

const AppProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const [submenuLocation, setSubmenuLocation] = useState({});
    const [submenuData, setSubmenuData] = useState();
    const [search, setSearch] = useState('');

    //authentication
    //user
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    //company
    const [isCompanyLogged, setIsCompanyLogged] = useState(false);
    const [companyUser, setCompanyUser] = useState({});
    //admin
    const [isAdminLogged, setIsAdminLogged] = useState(false);
    //loading
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            setUserLoading(true);
            try {
                const res = await axios.get(`${api_url}islogged`, {
                    withCredentials: true,
                });
                const api_user = res.data.user;
                if (res.data.islogged) {
                    if (api_user.company_id) {
                        setIsCompanyLogged(true);
                        const res2 = await axios.get(
                            `${api_url}company/${api_user.company_id}`
                        );
                        setCompanyUser(res2.data.company);
                    } else if (api_user.provider === 'admin') {
                        setIsAdminLogged(true);
                    } else {
                        setIsLoggedIn(true);
                        setUser(res.data.user);
                    }
                    setUserLoading(false);
                } else {
                    setIsLoggedIn(false);
                    setIsCompanyLogged(false);
                    setIsAdminLogged(false);
                    setUser({});
                    setCompanyUser({});

                    setUserLoading(false);
                }
            } catch (error) {
                setIsLoggedIn(false);
                setIsCompanyLogged(false);
                setIsAdminLogged(false);
                setUser({});
                setCompanyUser({});
                setUserLoading(false);
            }
        };

        checkLoggedIn();
    }, [isLoggedIn, isCompanyLogged, isAdminLogged]);

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

    if (userLoading) {
        return <Loading />;
    }

    return (
        <AppContext.Provider
            value={{
                isSidebarOpen,
                isSubmenuOpen,
                submenuLocation,
                submenuData,
                userLoading,
                user,
                isLoggedIn,
                companyUser,
                isCompanyLogged,
                isAdminLogged,
                search,
                setSearch,
                setIsAdminLogged,
                setCompanyUser,
                setIsCompanyLogged,
                setUser,
                setIsLoggedIn,
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
