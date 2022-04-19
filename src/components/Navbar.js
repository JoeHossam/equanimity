import React from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context';
import Submenu from './Submenu';

const Navbar = () => {
    const { openSubmenu, closeSubmenu, openSidebar } = useGlobalContext();
    const handleSubmenu = (e) => {
        if (!e.target.classList.contains('link-btn')) {
            closeSubmenu();
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
                            <FaBars />
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
                    <button className="btn signin-btn">Sign in</button>
                </div>
            </nav>
            <Submenu />
        </>
    );
};

export default Navbar;
