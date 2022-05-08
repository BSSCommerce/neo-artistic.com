import React, { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import ShoppingBasketRoundedIcon from '@mui/icons-material/ShoppingBasketRounded';
import NextLink from 'next/link';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NeoIcon from '../common/NeoIcon';
import { u } from '@cityofzion/neon-js';

export default function NftCard({ data, neoToUsd }) {
    const neoToUsdPrice = price => {
        return neoToUsd * price;
    }

    const neoPrice = useMemo(() => data.auctions && data.auctions.length ? data.auctions[data.auctions.length - 1].price : data.price, [data]);
    const usdPrice = useMemo(() => neoToUsdPrice(neoPrice).toFixed(2), [neoPrice]);
    const description = useMemo(() => data.description.length > 40 ? (data.description.slice(0, 40) + "...") : data.description, [data]);

    return (
        <Card sx={{
            maxWidth: 345, borderRadius: '12px', py: 1
        }}>
            <CardHeader
                title={
                    <NextLink href={`/nft/${data.id}`} as={`/nft/${data.id}`}>
                        <Typography variant="subtitile1" fontSize='medium' fontWeight={700} color="text.secondary" align='left' sx={{cursor: 'pointer'}}>
                            {data.name}
                        </Typography>
                    </NextLink>
                }
            />
            <CardMedia
                component="img"
                height="360"
                width="360"
                image={data.image ? data.image : `https://picsum.photos/300?random=${data.id}`}
                alt="NFT Media"
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary" align='left' component='p'>
                    {description}
                </Typography>
                <Typography variant="body2" color="text.secondary" align='left' component='p'>
                    <strong>Owner:</strong> {data.ownerOf}
                </Typography>
                <Typography variant="body2" color="text.secondary" align='left' component='p'>
                    <strong>Creator:</strong> {data.originOf}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <NextLink href={`/nft/${data.id}`} as={`/nft/${data.id}`}>
                    <Button variant="outlined" startIcon={<ShoppingBasketRoundedIcon />}>
                        Buy
                    </Button>
                </NextLink>
                <Button variant="text" disabled sx={{ marginLeft: 'auto' }} endIcon={<NeoIcon />}>
                    <Typography variant="body2" color="text.secondary" align='left'>
                        {neoPrice}
                    </Typography>
                </Button>
                <Button variant="text" disabled sx={{ marginLeft: '0' }} endIcon={<AttachMoneyIcon />}>
                    <Typography variant="body2" color="text.secondary" align='left'>
                        {usdPrice}
                    </Typography>
                </Button>
            </CardActions>
        </Card>
    );
}
