import React, { useEffect, useRef } from 'react';
import HomeHero from '../components/HomeHero';
import HomeFeatures from '../components/HomeFeatures1';
import Subscribe from '../components/Subscribe';
import Categories from '../components/HomeCategories';
import HomePartners from '../components/HomePartners';
import { StatsGroup } from '../components/HomeStats.tsx';

const Home = () => {
    const browseSection = useRef(null);
    useEffect(() => {
        console.log(browseSection);
    }, [browseSection]);
    return (
        <>
            <HomeHero browseSection={browseSection} />
            <section
                ref={(el) => (browseSection.current = el)}
                style={{ margin: '0 5rem' }}
            >
                <HomeFeatures />
            </section>
            <Categories />
            {/* <div style={{ margin: '1rem 5rem' }}    >
                <StatsGroup
                    data={[
                        {
                            title: 'Page views',
                            stats: '456,133',
                            description:
                                '24% more than in the same month last year, 33% more that two years ago',
                        },
                        {
                            title: 'New users',
                            stats: '2,175',
                            description:
                                '13% less compared to last month, new user engagement up by 6%',
                        },
                        {
                            title: 'Completed orders',
                            stats: '1,994',
                            description:
                                '1994 orders were completed this month, 97% satisfaction rate',
                        },
                    ]}
                />
            </div> */}
            <div style={{ margin: '1rem 5rem' }}>
                <Subscribe />
            </div>
            <HomePartners />
        </>
    );
};

export default Home;
