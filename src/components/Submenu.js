import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext, api_url } from '../context';

const Submenu = () => {
    const { isSubmenuOpen, submenuLocation, submenuData, closeSubmenu } =
        useGlobalContext();
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [style, setStyle] = useState({
        top: submenuLocation.bottom,
        left: submenuLocation.center,
    });
    const [anim, setAnime] = useState({});
    const list = useRef(null);

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                const res = await fetch(`${api_url}category`);
                const { categories: newCategories } = await res.json();
                setCategories(newCategories);

                const res2 = await fetch(`${api_url}company`);
                const { companies: newCompanies } = await res2.json();
                setCompanies(newCompanies);
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
        let timeoutId;
        if (isSubmenuOpen) {
            setStyle({
                top: submenuLocation.bottom,
                left: submenuLocation.center,
                height: 28 + 32 + 26 * (data.length + 1),
                //      h4 + padding + items
            });
            setAnime({ animation: 'opacity1 500ms ease' });
            timeoutId = setTimeout(() => {
                setAnime({ animation: '' });
            }, 501);
        }
        return () => clearTimeout(timeoutId);
    }, [data, isSubmenuOpen]);

    return (
        <aside
            className={`${isSubmenuOpen ? 'submenu show' : 'submenu'}`}
            style={style}
            onMouseLeave={closeSubmenu}
        >
            {
                <div style={anim} ref={list}>
                    <h4>{submenuData}</h4>
                    <div className={`submenu-center`}>
                        {data === []
                            ? 'Loading...'
                            : data.map((item) => {
                                  const page =
                                      submenuData === 'Companies'
                                          ? `company/${item._id}`
                                          : `insurances/${item.name}`;
                                  return (
                                      <Link to={page} key={item._id}>
                                          {item.name}
                                      </Link>
                                  );
                              })}
                        <hr />
                        <Link to={`/${submenuData}`}>Browse All</Link>
                    </div>
                </div>
            }
        </aside>
    );
};

export default Submenu;
