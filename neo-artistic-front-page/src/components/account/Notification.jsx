import React, { useState } from 'react';
import useSWR from 'swr';
import {
    Badge,
    Box,
    Popover,
    IconButton,
    Tooltip,
    Typography,
    Link
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import NotificationList from './NotificationList';

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

export default function Notification(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    // const { data, error } = useSWR(`/api/notification/${accountId}`,
    //     fetcher
    // )
    const data = [];
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title="Open notifications">
            <Badge color="secondary" overlap="circular" badgeContent=" " variant="dot" sx={{ mr: 1 }} >
                    <IconButton
                    onClick={handleClick}
                    sx={{ borderColor: 'primary.main', border: 2, size: 'small', color: 'primary.main' }}>
                        <NotificationsOutlinedIcon />
                    </IconButton>
            </Badge>
            </Tooltip>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ py: 2 }}>
                    <NotificationList
                        data={data ? data : []} />
                    <Typography align="center">
                        <Link href="/account/notification" underline="hover">
                            View All
                        </Link>
                    </Typography>
                </Box>
            </Popover>
        </>
    )
}