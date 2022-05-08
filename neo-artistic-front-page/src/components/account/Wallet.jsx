import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Popover,
    IconButton,
    Tooltip,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Snackbar,
    Typography
} from '@mui/material';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { WalletButton, useWalletModal, WalletIcon } from '@rentfuse-labs/neo-wallet-adapter-react-ui';
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CollectionsIcon from '@mui/icons-material/Collections';
import NextLink from 'next/link';

export default function Wallet({ children, ...props }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const { address, wallet, disconnect, connected, select } = useWallet();
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = useState(false);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const _address = useMemo(() => address, [address]);
    const content = useMemo(() => {
        if (children) return children;
        if (!wallet || !_address) return null;
        return _address.slice(0, 8) + "..." + _address.slice(-8);
    }, [children, wallet, _address]);

    const copyAddress = useCallback(async () => {
        if (_address) {
            await navigator.clipboard.writeText(_address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [_address]);

    const openModal = useCallback(() => {
        setAnchorEl(null);
        setVisible(true);
    }, [setVisible, setAnchorEl]);

    const disconnectWallet = useCallback(() => {
        localStorage.removeItem("neoWalletType");
        disconnect();
    });

    useEffect(() => {
        if (connected && wallet.name) {
            localStorage.setItem("neoWalletType", wallet.name);
        }
    }, [connected, wallet]);

    useEffect(() => {
        setTimeout(() => {
            let neoWalletType = localStorage.getItem("neoWalletType");
            if (neoWalletType) {
                select(neoWalletType);
            }
        }, 2000)
    }, [])
    return (
        <>
            <Tooltip title="Open and connect wallet">
                <IconButton
                    onClick={handleClick}
                    sx={{ borderColor: 'primary.main', border: 2, size: 'small', color: 'primary.main' }}>
                    <PersonIcon />
                </IconButton>
            </Tooltip>

            <Popover
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {!connected ?
                    (
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={openModal}>
                                    <ListItemIcon>
                                        <AccountBalanceWalletTwoToneIcon />
                                    </ListItemIcon>
                                    <ListItemText>Connect Wallet</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    ) :
                    (
                        <List>
                            <ListItem disablePadding>
                                <Tooltip title="Copy Address">
                                    <WalletButton
                                        className="wallet-adapter-button-trigger"
                                        onClick={copyAddress}
                                        startIcon={<WalletIcon wallet={wallet} />}
                                        {...props}
                                    >
                                        <Typography textOverflow={'ellipsis'} overflow={'hidden'} whiteSpace={'nowrap'} maxWidth={150}>
                                            {content}
                                        </Typography>
                                    </WalletButton>
                                </Tooltip>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AddCircleOutlineIcon />
                                    </ListItemIcon>
                                    <NextLink href={"/create"} as={'/create'} >
                                        <ListItemText>Create new NFT</ListItemText>
                                    </NextLink> 
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <CollectionsIcon />
                                    </ListItemIcon>
                                    <NextLink href={"/my-collection"} as={'/my-collection'} >
                                        <ListItemText>My Collection</ListItemText>
                                    </NextLink>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={disconnectWallet}>
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    <ListItemText>Disconnect Wallet</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    )
                }
            </Popover>
            <Snackbar
                open={copied}
                autoHideDuration={6000}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => setCopied(false)}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
                message="Copy Address Successful"
            />
        </>
    )
}