import React, { useMemo } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

export default function CollectionCard({ banner, logo, collection_name, account_id, bio, website }) {
    const account = useMemo(() => {
        return account_id ? account_id.slice(0, 8) + "..." + account_id.slice(-8) : "";
    }, [account_id]);
    return (
        <Card sx={{ maxWidth: "100%" }}>
            {banner ?
                <CardMedia
                    component="img"
                    height="190"
                    image={(typeof banner === 'string') ? banner : URL.createObjectURL(banner)}
                    alt="green iguana"
                />
                : <CardMedia
                    component="img"
                    height="190"
                    image={"https://source.unsplash.com/random"}
                    alt="green iguana"
                />
            }
            <CardContent>
                <div className={"picasart-avatar"}>
                    {
                        logo ? <Avatar
                            alt="Remy Sharp"
                            src={(typeof logo === 'string') ? logo : URL.createObjectURL(logo)}
                            sx={{ width: 56, height: 56 }}
                        /> : <Avatar
                            alt="Remy Sharp"
                            src={"https://source.unsplash.com/random"}
                            sx={{ width: 56, height: 56 }}
                        />
                    }
                </div>
                <div className={"picasart-name-bio"}>
                    <NextLink href={`/collections/${account_id}`} as={`/collections/${account_id}`}>
                        <Typography gutterBottom variant="h5" component="div" sx={{ cursor: 'pointer' }}>
                            {collection_name ? collection_name : account_id}
                        </Typography>
                    </NextLink>
                    <Typography gutterBottom variant="p" component="div">
                        By {account}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {
                            bio ? bio : "[This is collection's bio description]"
                        }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Website: {
                            website &&
                            <NextLink href={`/collections/${account_id}`} as={`/collections/${account_id}`}>
                                {website}
                            </NextLink>
                        }
                    </Typography>

                </div>
            </CardContent>
        </Card>
    );
}
