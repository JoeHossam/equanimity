import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Rating,
    Select,
    Slider,
    Switch,
    TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchContext } from '../pages/InsuranceList';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const Filter = ({ urlCategory, search }) => {
    const { page, setQuery, companies, categories } = useSearchContext();
    const [priceRange, setPriceRange] = useState([500, 5000]);
    const [rating, setRating] = useState(1);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sort, setSort] = useState('Alphabetic');

    const [addPrice, setAddPrice] = useState(false);
    const [addRating, setAddRating] = useState(false);
    const [addCompanies, setAddCompanies] = useState(false);
    const [addCategories, setAddCategories] = useState(false);

    const applyQuery = () => {
        let query = `title=${search}`;
        const priceQuery = `basePrice>=${priceRange[0]},basePrice<=${priceRange[1]}`;
        const ratingQuery = `rating>=${rating}`;
        const companiesQuery = `company=${selectedCompanies
            .map((item) => item._id)
            .join(',')
            .replace(/\s/g, '%20')}`;
        const categoriesQuery = `category=${selectedCategories
            .map((item) => item.name)
            .join(',')
            .replace(/\s/g, '%20')}`;

        if (addPrice || addRating) {
            query += `&numericFilters=`;
            if (addPrice) query += priceQuery;
            if (addRating && addPrice) query += `,${ratingQuery}`;
            else if (addRating) query += ratingQuery;
        }
        if (addCompanies) query += `&${companiesQuery}`;
        if (addCategories) query += `&${categoriesQuery}`;
        if (sort != 'Alphabetic') query += `&sort=${sort}`;
        console.log(query);
        setQuery(query);
    };

    const [fixer, setFixer] = useState(true);
    useEffect(() => {
        if (!urlCategory) return setFixer(false);
        setAddCategories(true);
        setSelectedCategories([urlCategory]);
        setFixer(false);
    }, [urlCategory]);

    useEffect(() => {
        if (fixer) return;
        applyQuery();
    }, [fixer]);

    useEffect(() => {
        if (fixer) return;
        applyQuery();
    }, [search]);

    return (
        <Box
            sx={{
                maxWidth: '500px',
                minWidth: '285px',
                gridColumnStart: 1,
                gridColumnEnd: 4,
                ['@media (max-width:880px)']: {
                    margin: 'auto',
                },
            }}
        >
            <Typography mx={'0.5rem'} fontSize="1.5rem">
                Filters
            </Typography>
            <Accordion
                // disabled={!addPrice}
                expanded={addPrice}
                disableGutters={true}
            >
                <AccordionSummary
                    sx={{
                        '& .MuiAccordionSummary-expandIconWrapper': {
                            transform: 'none !important',
                        },
                    }}
                    expandIcon={
                        <Switch
                            checked={addPrice}
                            onClick={() => setAddPrice(!addPrice)}
                        />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>
                        price between: {`${priceRange[0]} - ${priceRange[1]}`}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <Slider
                            min={0}
                            max={5000}
                            step={100}
                            getAriaLabel={() => 'Temperature range'}
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            valueLabelDisplay="auto"
                        />
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion
                // disabled={!addRating}
                expanded={addRating}
                disableGutters={true}
            >
                <AccordionSummary
                    sx={{
                        '& .MuiAccordionSummary-expandIconWrapper': {
                            transform: 'none !important',
                        },
                    }}
                    expandIcon={
                        <Switch
                            checked={addRating}
                            onClick={() => setAddRating(!addRating)}
                        />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>
                        Rating: {rating} {rating === 5 ? '' : 'or higher'}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            precision={0.5}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                        />
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion
                // disabled={!addCompanies}
                expanded={addCompanies}
                disableGutters={true}
            >
                <AccordionSummary
                    sx={{
                        '& .MuiAccordionSummary-expandIconWrapper': {
                            transform: 'none !important',
                        },
                    }}
                    expandIcon={
                        <Switch
                            checked={addCompanies}
                            onClick={() => setAddCompanies(!addCompanies)}
                        />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Companies</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Autocomplete
                        multiple
                        value={selectedCompanies}
                        onChange={(event, newValue) => {
                            setSelectedCompanies(newValue);
                            console.log(selectedCompanies);
                        }}
                        id="checkboxes-tags-demo"
                        options={companies}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={
                                        <CheckBoxOutlineBlankIcon fontSize="small" />
                                    }
                                    checkedIcon={
                                        <CheckBoxIcon fontSize="small" />
                                    }
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option.name}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                size="small"
                                {...params}
                                label="Companies"
                                placeholder="company"
                            />
                        )}
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={addCategories} disableGutters={true}>
                <AccordionSummary
                    sx={{
                        '& .MuiAccordionSummary-expandIconWrapper': {
                            transform: 'none !important',
                        },
                    }}
                    expandIcon={
                        <Switch
                            checked={addCategories}
                            onClick={() => setAddCategories(!addCategories)}
                        />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Categories</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Autocomplete
                        multiple
                        value={selectedCategories}
                        onChange={(event, newValue) => {
                            setSelectedCategories(newValue);
                            console.log(newValue);
                        }}
                        id="checkboxes-tags-demo"
                        options={categories}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={
                                        <CheckBoxOutlineBlankIcon fontSize="small" />
                                    }
                                    checkedIcon={
                                        <CheckBoxIcon fontSize="small" />
                                    }
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option.name}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                size="small"
                                {...params}
                                label="Categories"
                                placeholder="category"
                            />
                        )}
                    />
                </AccordionDetails>
            </Accordion>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    marginTop: '0.5rem',
                }}
            >
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        label="Age"
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <MenuItem value={'Alphabetic'} selected>
                            Alphabetic
                        </MenuItem>
                        <MenuItem value={'basePrice'}>
                            Price <ArrowDownwardIcon fontSize="1px" />
                        </MenuItem>
                        <MenuItem value={'-basePrice'}>
                            Price <ArrowUpwardIcon fontSize="1px" />
                        </MenuItem>
                        <MenuItem value={'rating'}>
                            Rating <ArrowDownwardIcon fontSize="1px" />
                        </MenuItem>
                        <MenuItem value={'-rating'}>
                            Rating <ArrowUpwardIcon fontSize="1px" />
                        </MenuItem>
                        <MenuItem value={'reviewCount'}>
                            Review Count <ArrowDownwardIcon fontSize="1px" />
                        </MenuItem>
                        <MenuItem value={'-reviewCount'}>
                            Review Count <ArrowUpwardIcon fontSize="1px" />
                        </MenuItem>
                        <MenuItem value={'createdAt'}>Newest</MenuItem>
                        <MenuItem value={'-createdAt'}>Oldest</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    disableRipple
                    size="medium"
                    sx={{ fontSize: '0.75rem' }}
                    onClick={applyQuery}
                >
                    Apply Filters
                </Button>
            </Box>
        </Box>
    );
};

export default Filter;
