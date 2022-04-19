import React, { useEffect, useState, useContext } from 'react';

const AppContext = React.createContext();
const api_url = 'http://localhost:3001/';

const AppProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const [submenuLocation, setSubmenuLocation] = useState({});
    const [submenuData, setSubmenuData] = useState();

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
        const bottom = tempBtn.bottom - 3;
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
