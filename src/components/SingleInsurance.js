import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api_url } from '../context';

const SingleInsurance = (props) => {
    const { _id, title, createdBy, category, company } = props;
    const [loading, setLoading] = useState(false);
    // const [company, setCompany] = useState('');
    useEffect(() => {
        if (company === undefined) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [company]);
    return (
        <div className="section">
            {loading ? (
                'loading'
            ) : (
                <>
                    <h3>{title}</h3>
                    <h4>{category}</h4>
                    <p>
                        <Link to={`/company/${createdBy}`}>{company.name}</Link>
                    </p>
                    <Link to={`/insurance/${_id}`}>See More</Link>
                </>
            )}
        </div>
    );
};

export default SingleInsurance;
