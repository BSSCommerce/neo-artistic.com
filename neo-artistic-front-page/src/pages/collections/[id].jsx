import React, { useState, useEffect, useContext } from 'react';
import {
    Grid,
    Container,
    Box,
    Skeleton
} from '@mui/material';
import Head from 'next/head';
import NftCard from 'src/components/nft/NftCard';
import CollectionCard from 'src/components/collection/CollectionCard';
import { appStore, onAppMount } from 'src/state/app';

export default function CollectionPage({ account_id }) {
    const [isFirstLoading, setIsFirstLoading] = useState(true);
    const { state, dispatch } = useContext(appStore);
    const { app } = state;
    const onMount = () => {
        dispatch(onAppMount());
    };

    const [list, setList] = useState([]);
    const [data, setData] = useState({});

    useEffect(() => {
        if (isFirstLoading) {
            setIsFirstLoading(false);
            const collectionPromise = fetch(`/api/collection/${account_id}`);
            const listNFTsPromise = fetch(`${process.env.apiurl}tokens-of?address=${account_id}`);

            Promise.all([collectionPromise, listNFTsPromise]).then(async ([collectionData, listNFTs]) => {
                let collectionJson = await collectionData.json();
                let listJson = await listNFTs.json();
                setData(collectionJson);
                setList(listJson);
            });
        }
    }, [isFirstLoading, account_id]);
    
    useEffect(onMount, [app.mounted]);

    if (!data || !list) return <Skeleton />

    return (
        <div className={'container'}>
            <Head>
                <title>Explore Collection</title>
            </Head>
            <Container sx={{ py: 8 }} maxWidth="xl">
                <CollectionCard {...data} />
                <Grid container spacing={2} sx={{ my: 2 }}>
                    {(list.length > 0) && list.map(item =>
                        <Grid item xs={3}>
                            <NftCard data={item} neoToUsd={app.neoToUsd} />
                        </Grid>
                    )}
                </Grid>
            </Container>
        </div>
    );
};

CollectionPage.getInitialProps = async ({ query }) => {
    return {
        account_id: query.id
    }
}