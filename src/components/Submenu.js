import Reac, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext, api_url } from '../context';

const Submenu = () => {
    const { isSubmenuOpen, submenuLocation, submenuData, closeSubmenu } =
        useGlobalContext();
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, isLoading] = useState(true);

    const [style, setStyle] = useState({
        top: submenuLocation.bottom,
        left: submenuLocation.center,
    });

    useEffect(() => {
        isLoading(true);
        const fetchNavData = async () => {
            try {
                const res = await fetch(`${api_url}category`);
                const { categories: newCategories } = await res.json();
                setCategories(newCategories);

                const res2 = await fetch(`${api_url}company`);
                const { companies: newCompanies } = await res2.json();
                setCompanies(newCompanies);
                isLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        fetchNavData();
    }, []);

    useEffect(() => {
        if (!isSubmenuOpen) {
            const timeout = setTimeout(() => {
                setStyle({ width: 38, height: 38 });
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [isSubmenuOpen]);

    useEffect(() => {
        if (submenuData === 'Insurances') setData(categories);
        if (submenuData === 'Companies') setData(companies);
    }, [submenuData]);

    useEffect(() => {
        if (isSubmenuOpen)
            setStyle({
                top: submenuLocation.bottom,
                left: submenuLocation.center,
                height: 100 + data.length * 41,
            });
    }, [data, isSubmenuOpen]);

    return (
        <aside
            className={`${isSubmenuOpen ? 'submenu show' : 'submenu'}`}
            style={style}
            onMouseLeave={closeSubmenu}
        >
            {loading ? (
                'Loading...'
            ) : (
                <>
                    <h4>{submenuData}</h4>
                    <div className={`submenu-center`}>
                        {data.map((item, index) => {
                            return <p key={index}>{item.name}</p>;
                        })}
                        <hr />
                        <Link to={`/${submenuData}`}>Browse All</Link>
                    </div>
                </>
            )}
        </aside>
    );
};

export default Submenu;
