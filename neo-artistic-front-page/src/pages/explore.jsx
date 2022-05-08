import React, { useState, useContext, useEffect } from 'react';
import {
    Grid,
    Container,
    Box,
    IconButton,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    TextField,
    InputAdornment,
    Skeleton
} from '@mui/material';
import useSWR from 'swr';
import Head from 'next/head';
import SearchIcon from '@mui/icons-material/Search';
import NftCard from 'src/components/nft/NftCard';
import { appStore, onAppMount } from '../state/app';

const fetcher = async (url) => {
    let data = null;
    try {
        const res = await fetch(url);
        data = await res.json()
        if (res.status !== 200) {
            throw new Error(data.message)
        }
    } catch (e) {
        console.log(e)
    }
    return data
}

export default function Explore() {
    const { state, dispatch } = useContext(appStore);
    const { app } = state;
    const onMount = () => {
        dispatch(onAppMount());
    };
    const [age, setAge] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const { data, error } = useSWR(`${process.env.apiurl}tokens`,
        fetcher
    );

    useEffect(onMount, [app.mounted]);

    if (error) return <div></div>

    if (!data) return <Skeleton />

    return (
        <div className={'container'}>
            <Head>
                <title>Explore NFT</title>
            </Head>
            <Container sx={{ py: 8 }} maxWidth="xl">
                <Box sx={{ display: 'flex', my: 2 }}>
                    <Box
                        sx={{
                            width: 345,
                            maxWidth: '100%',
                            display: 'flex'
                        }}
                    >
                        <TextField fullWidth label="Search"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end" color="primary">
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box sx={{ minWidth: 150, mx: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>All Categories</InputLabel>
                            <Select
                                value={age}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 150, mx: 4 }}>
                        <FormControl fullWidth>
                            <InputLabel>All Items</InputLabel>
                            <Select
                                value={age}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 150, mx: 4 }}>
                        <FormControl fullWidth>
                            <InputLabel>All </InputLabel>
                            <Select
                                value={age}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Grid container spacing={2}>
                    {data.length && data.map(item => 
                        <Grid item xs={3}>
                            <NftCard data={item} neoToUsd={app.neoToUsd} />
                        </Grid>
                    )}
                </Grid>
            </Container>
        </div>
    );
};