import React from 'react';
import {
    Grid,
    Container,
    Box,
    Skeleton,
    Typography
} from '@mui/material';
import useSWR from 'swr';
import Head from 'next/head';
import CollectionCard from 'src/components/collection/CollectionCard';

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

export default function Index() {
    const { data, error } = useSWR('/api/collection/all',
        fetcher
    );

    if (error) return <div></div>

    if (!data) return <Skeleton />

    return (
        <div className={'container'}>
            <Head>
                <title>Explore NFT</title>
            </Head>
            <Container sx={{ py: 8 }} maxWidth="xl">
                <Typography variant='h4' align='center'>All Collections</Typography>
                <Grid container spacing={2} sx={{my:2}}>
                    {(data.length > 0) && data.map(item =>
                        <Grid item xs={3}>
                            <CollectionCard {...item}/>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </div>
    );
};