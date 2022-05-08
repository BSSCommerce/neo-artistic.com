import React from "react";
import NftInfo from "src/components/nft/NftInfo";
import useSWR from 'swr';
import Skeleton from '@mui/material/Skeleton';

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

export default function NftPage({ id }) {
    const { data, error } = useSWR(`${process.env.apiurl}/get-token-by-id?token-id=${id}`,
        fetcher
    )

    if (error) return <div></div>

    if (!data) return <Skeleton />
    return (
        <NftInfo {...data} id={id} />
    )
}

NftPage.getInitialProps = async ({ query }) => {
    return {
        id: query.id
    }
}