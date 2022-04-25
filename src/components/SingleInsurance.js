import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Divider, Skeleton } from '@mui/material';

const InsuranceSkeleton = () => {
    return (
        <>
            <Skeleton variant="rectangular" />
            <br />
            <Skeleton variant="rectangular" height={118} />
            <Skeleton variant="text" />
            <Skeleton variant="rectangular" height={25} />
        </>
    );
};

const SingleInsurance = (props) => {
    const { _id, title, createdBy, category, price, description } =
        props.insurance;
    const {
        comparing1,
        comparing2,
        setComparing2,
        setComparing1,
        setShowError,
        company,
    } = props;

    const addToCompare = () => {
        if (
            Object.keys(comparing1).length !== 0 &&
            Object.keys(comparing2).length !== 0
        ) {
            return setShowError({
                isError: true,
                type: 'warning',
                msg: 'Compare List already full',
            });
        }
        if (Object.keys(comparing1).length === 0) {
            setComparing1({ ...props.insurance });
            setShowError({
                isError: true,
                type: 'success',
                msg: 'Item added successfully',
            });
            return;
        }
        if (Object.keys(comparing2).length === 0) {
            setComparing2({ ...props.insurance });
            setShowError({
                isError: true,
                type: 'success',
                msg: 'Item added successfully',
            });
            return;
        }
    };
    const [loading, setLoading] = useState(true);
    // const [company, setCompany] = useState('');
    useEffect(() => {
        if (company === undefined) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [company]);
    return (
        <div>
            {loading ? (
                <InsuranceSkeleton />
            ) : (
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {title}
                        </Typography>
                        <Typography variant="subtitle1">{category}</Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary">
                            {description}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{ marginTop: '0.5rem' }}
                        >
                            {price} EGP
                        </Typography>
                        <Typography variant="subtitle1">
                            <Link to={`/company/${createdBy}`}>
                                {company.name}
                            </Link>
                        </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button size="small">
                            <Link to={`/insurance/${_id}`}>See More</Link>
                        </Button>
                        <Button onClick={addToCompare} size="small">
                            Add to Compare
                        </Button>
                    </CardActions>
                </Card>
            )}
        </div>
    );
};

export default SingleInsurance;
