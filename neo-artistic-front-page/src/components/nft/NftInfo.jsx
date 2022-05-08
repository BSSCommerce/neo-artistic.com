import React, { useState, useMemo, useCallback, useEffect, useContext } from "react";
import {
    Box,
    Button,
    Container,
    Divider,
    Typography,
    List,
    Alert,
    Grid,
    TextField, CircularProgress,
} from "@mui/material";
import NeoIcon from '../common/NeoIcon';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import ShoppingBasketRoundedIcon from '@mui/icons-material/ShoppingBasketRounded';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NftCard from 'src/components/nft/NftCard';
import { sc, wallet } from "@cityofzion/neon-js";
import { waitTx, WitnessScope } from "@rentfuse-labs/neo-wallet-adapter-base";
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { appStore, onAppMount } from 'src/state/app';

export default function NftInfo({ name, description, originOf, ownerOf, price, royalty, image, auctions, isAuction, id }) {
    const { state, dispatch } = useContext(appStore);
    const { app } = state;
    const onMount = () => {
        dispatch(onAppMount());
    };

    const { address, connected, invoke, invokeMulti } = useWallet();
    const [activeTab, setActiveTab] = useState(1);
    const [neoToUsd, setNeoToUsd] = useState(app.neoToUsd);

    useEffect(() => {
        onMount()
    }, [])

    useEffect(() => {
        if (app.mounted) {
            console.log(app.neoToUsd)
            setNeoToUsd(app.neoToUsd);
        }
    }, [app])

    const neoToUsdPrice = useCallback( price => {
        return neoToUsd * price;
    }, [neoToUsd]);
    const neoPrice = useMemo(() => auctions && auctions.length ? auctions[auctions.length - 1].price : price, [auctions, price]);
    const usdPrice = useMemo(() => neoToUsdPrice(neoPrice).toFixed(2), [neoPrice, neoToUsd]);

    const [newPrice, setNewPrice] = useState(price);
    const [validatePrice, setValidatePrice] = useState("");
    const [newRoyalty, setNewRoyalty] = useState(royalty);
    const [validateRoyalty, setValidateRoyalty] = useState("");
    const [newAuction, setNewAuction] = useState(price);
    const [validateAuction, setValidateAuction] = useState("");
    const [relatedNfts, setRelatedNfts] = useState([]);
    const [isLoadingBuyItNow, setIsLoadingBuyItNow] = useState(false)
    const [isUpdatingPriceRoyalty, setIsUpdatingPriceRoyalty] = useState(false);
    const [isAcceptingAuction, setIsAcceptingAuction] = useState(false);
    const [isAddingAuction, setIsAddingAuction] = useState(false);

    const handleBuyNow = useCallback(async () => {
        let royaltyFee = 0;
        if (royalty) {
            royaltyFee = (parseInt(royalty) * parseInt(price)) / 100;
            royaltyFee = parseInt(royaltyFee.toString());
        }

        let remainPriceForOwner = price - royaltyFee;
        let invocations = [];
        if (royaltyFee > 0 && originOf !== ownerOf) {
            invocations.push(
                {
                    scriptHash: 'ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
                    operation: 'transfer',
                    args: [
                        {
                            type: 'Hash160',
                            value: sc.ContractParam.hash160(address).toJson().value,
                        },
                        {
                            type: 'Hash160',
                            value: sc.ContractParam.hash160(originOf).toJson().value,
                        },
                        {
                            type: 'Integer',
                            value: sc.ContractParam.integer(royaltyFee).toJson().value,
                        },
                        {
                            type: 'Any',
                            value: null,
                        },
                    ]
                }
            )
        }

        invocations.push(
            {
                scriptHash: 'ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
                operation: 'transfer',
                args: [
                    {
                        type: 'Hash160',
                        value: sc.ContractParam.hash160(address).toJson().value,
                    },
                    {
                        type: 'Hash160',
                        value: sc.ContractParam.hash160(ownerOf).toJson().value,
                    },
                    {
                        type: 'Integer',
                        value: sc.ContractParam.integer(remainPriceForOwner).toJson().value,
                    },
                    {
                        type: 'Any',
                        value: null,
                    },
                ]
            }
        )

        invocations.push(
            {
                scriptHash: '3b5d1449768a4d4f3aec219874d7ed6ae58d07e4',
                operation: 'transfer',
                args: [
                    {
                        type: 'Hash160',
                        value: sc.ContractParam.hash160(address).toJson().value,
                    },
                    {
                        type: 'String',
                        value: sc.ContractParam.string(id).toJson().value,
                    },
                    {
                        type: 'String',
                        value: sc.ContractParam.string("0,1").toJson().value,
                    },
                ],
                broadcastOverride: false
            }
        )
        setIsLoadingBuyItNow(true);
        const result = await invokeMulti({
            invocations: invocations,
            signers: [
                {
                    account: wallet.getScriptHashFromAddress(address),
                    scopes: WitnessScope.CalledByEntry,
                },
            ]
        });
        // Optional: Wait for the transaction to be confirmed onchain
        if (result.data?.txId) {
            await waitTx('http://seed2t4.neo.org:20332', result.data?.txId);
        } else {
            console.log("Transaction Data:", result.data);
        }
        setIsLoadingBuyItNow(false);
        location.reload();
    }, [isLoadingBuyItNow]);

    const updatePriceRoyalty = useCallback(async () => {
        if (isNaN(newPrice)) {
            setValidatePrice("Please input your NFT's price");
            return;
        }
        if (isNaN(newRoyalty)) {
            setValidateRoyalty("Please input your NFT's royalty");
            return;
        }
        setValidatePrice("");
        setValidateRoyalty("");

        let invocations = [];
        invocations.push(
            {
                scriptHash: '3b5d1449768a4d4f3aec219874d7ed6ae58d07e4',
                operation: 'setPriceAndRoyalty',
                args: [
                    {
                        type: 'Hash160',
                        value: sc.ContractParam.hash160(address).toJson().value,
                    },
                    {
                        type: 'String',
                        value: sc.ContractParam.string(id).toJson().value,
                    },
                    {
                        type: 'String',
                        value: sc.ContractParam.string(newPrice.toString()).toJson().value,
                    },
                    {
                        type: 'String',
                        value: sc.ContractParam.string(newRoyalty.toString()).toJson().value,
                    }

                ]
            }
        )
        setIsUpdatingPriceRoyalty(true);
        const result = await invokeMulti({
            invocations: invocations,
            signers: [
                {
                    account: wallet.getScriptHashFromAddress(address),
                    scopes: WitnessScope.CalledByEntry,
                },
            ]
        });
        // Optional: Wait for the transaction to be confirmed onchain
        if (result.data?.txId) {
            await waitTx('http://seed2t4.neo.org:20332', result.data?.txId);

        } else {
            console.log("Transaction Data:", result.data);
        }
        location.reload();
    }, [newPrice, newRoyalty, isUpdatingPriceRoyalty])


    const handleAcceptAuction = useCallback(async (bider, price) => {
        console.log("Owner Of:", ownerOf);
        console.log("Bidder:", bider);
        console.log("Price:", price)
        let royaltyFee = 0;
        if (royalty) {
            royaltyFee = (parseInt(royalty) * parseInt(price)) / 100;
            royaltyFee = parseInt(royaltyFee.toString());
        }

        let remainPriceForOwner = price - royaltyFee;
        let invocations = [];
        if (royaltyFee > 0 && originOf !== ownerOf) {
            invocations.push(
                {
                    scriptHash: 'ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
                    operation: 'transfer',
                    args: [
                        {
                            type: 'Hash160',
                            value: sc.ContractParam.hash160(bider).toJson().value,
                        },
                        {
                            type: 'Hash160',
                            value: sc.ContractParam.hash160(originOf).toJson().value,
                        },
                        {
                            type: 'Integer',
                            value: sc.ContractParam.integer(royaltyFee).toJson().value,
                        },
                        {
                            type: 'Any',
                            value: null,
                        },
                    ]
                }
            )
        }

        invocations.push(
            {
                scriptHash: 'ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
                operation: 'transfer',
                args: [
                    {
                        type: 'Hash160',
                        value: sc.ContractParam.hash160(bider).toJson().value,
                    },
                    {
                        type: 'Hash160',
                        value: sc.ContractParam.hash160(ownerOf).toJson().value,
                    },
                    {
                        type: 'Integer',
                        value: sc.ContractParam.integer(remainPriceForOwner).toJson().value,
                    },
                    {
                        type: 'Any',
                        value: null,
                    },
                ]
            }
        )

        invocations.push(
            {
                scriptHash: '3b5d1449768a4d4f3aec219874d7ed6ae58d07e4',
                operation: 'transfer',
                args: [
                    {
                        type: 'Hash160',
                        value: sc.ContractParam.hash160(bider).toJson().value,
                    },
                    {
                        type: 'String',
                        value: sc.ContractParam.string(id).toJson().value,
                    },
                    {
                        type: 'String',
                        value: sc.ContractParam.string("1," + price).toJson().value,
                    },
                ],
                broadcastOverride: false
            }
        )
        setIsAcceptingAuction(true);
        const result = await invokeMulti({
            invocations: invocations,
            signers: [
                {
                    account: wallet.getScriptHashFromAddress(address),
                    scopes: WitnessScope.CalledByEntry,
                },
            ]
        });
        // Optional: Wait for the transaction to be confirmed onchain
        if (result.data?.txId) {
            await waitTx('http://seed2t4.neo.org:20332', result.data?.txId);
        } else {
            console.log("Transaction Data:", result.data);
        }
        setIsAcceptingAuction(false);
        location.reload();
    }, [isAcceptingAuction])

    const addAuction = useCallback(async () => {
        if (isNaN(newAuction)) {
            setValidateAuction("Please input your bid");
            return;
        }
        if (newAuction <= neoPrice) {
            setValidateAuction("Your bid must be greater than last bid.");
            return;
        }
        setValidateAuction("");
        let invocations = [];
        invocations.push(
            {
                scriptHash: '3b5d1449768a4d4f3aec219874d7ed6ae58d07e4',
                operation: 'setAuction',
                args: [
                    {
                        type: 'Hash160',
                        value: sc.ContractParam.hash160(address).toJson().value,
                    },
                    {
                        type: 'String',
                        value: sc.ContractParam.string(id).toJson().value,
                    },
                    {
                        type: 'String',
                        value: sc.ContractParam.string(newAuction.toString()).toJson().value,
                    },

                ]
            }
        )
        setIsAddingAuction(true);
        const result = await invokeMulti({
            invocations: invocations,
            signers: [
                {
                    account: wallet.getScriptHashFromAddress(address),
                    scopes: WitnessScope.CalledByEntry,
                },
            ]
        });
        // Optional: Wait for the transaction to be confirmed onchain
        if (result.data?.txId) {
            await waitTx('http://seed2t4.neo.org:20332', result.data?.txId);
        } else {
            console.log("Transaction Data:", result.data);
        }

        setIsAddingAuction(false);
        location.reload();

    }, [newAuction, isAddingAuction])

    useEffect(() => {
        if (originOf) {
            fetch(`${process.env.apiurl}tokens-of?address=${originOf}`)
                .then(res => res.json())
                .then(newRelated => setRelatedNfts(newRelated.filter(item => item.id != id)))
                .catch(e => console.log(e))
        }
    }, [originOf]);

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}
        >
            <Container maxWidth="xl">
                <Grid container className={"token-information"} columns={{ xs: 12 }} spacing={4}>
                    <Grid item xs={6} className={"token-image-wrapper"}>
                        <img style={{ width: "100%" }} src={image} onLoad={() => { }} onError={
                            ({ target }) => { target.onerror = null; target.src = 'https://source.unsplash.com/random' }
                        } />
                    </Grid>
                    <Grid item xs={6} className={"token-information-main"}>
                        <div className={"section header"}>
                            <Typography component="div" variant="h4">
                                <strong>{name}</strong>
                            </Typography>
                        </div>
                        <div className={"section creator"}>
                            <p><span className="section-title">Owner:</span> <span style={{ fontSize: "12px", fontStyle: "italic" }}>{ownerOf}</span></p>
                            <p><span className="section-title">Creator:</span> <span style={{ fontSize: "12px", fontStyle: "italic" }}>{originOf}</span></p>
                        </div>
                        <Divider sx={{ my: 2 }} />
                        <Grid container columns={{ xs: 12 }} spacing={1}>
                            <Grid item xs={2}>
                                <Button fullWidth variant={activeTab == 1 ? "contained" : "outlined"} onClick={() => setActiveTab(1)}>Details</Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button fullWidth variant={activeTab == 2 ? "contained" : "outlined"} onClick={() => setActiveTab(2)}>Bids ({auctions.length})</Button>
                            </Grid>
                            <Grid item xs={12}>
                                {activeTab == 1 && (
                                    <div className={"section details"}>
                                        <h4 className="section-title">Description:</h4>
                                        <p>{description}</p>
                                        <br />
                                        <p><span className="section-title">Royalty:</span> {royalty} %</p>
                                        <p><span className="section-title">Price:</span> {price} <NeoIcon fontSize={'1'} /></p>
                                    </div>
                                )}
                                {activeTab == 2 && (
                                    <div className={"section history"}>

                                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', my: 0, py: 0 }}>
                                            {auctions && auctions.length > 0 ?
                                                auctions.map(({ bider, price }) =>
                                                    <>
                                                        {
                                                            (ownerOf !== bider) && <div style={{ display: "flex", alignItems: "center" }}>
                                                                <span>{price}</span>&nbsp;<NeoIcon fontSize={'small'} />&nbsp;
                                                                <Divider orientation="vertical" flexItem />&nbsp;
                                                                <span>{bider}</span>&nbsp;
                                                                {
                                                                    (ownerOf === address) && <Divider orientation="vertical" flexItem />
                                                                }
                                                                &nbsp;
                                                                {
                                                                    (ownerOf === address) && <Button variant={"contained"} onClick={() => handleAcceptAuction(bider, price)}>

                                                                        {isAcceptingAuction && <CircularProgress size={14} />}
                                                                        {!isAcceptingAuction && 'Accept'}

                                                                    </Button>
                                                                }
                                                                {bider == address && <span>(mine)</span>}
                                                            </div>
                                                        }
                                                    </>


                                                ) : null
                                            }
                                        </List>
                                    </div>
                                )}
                            </Grid>
                        </Grid>

                        {(address == ownerOf) &&
                            <div className={"section update-price"}>
                                <Divider sx={{ my: 2 }} />
                                <h4>Change Price & Royalty (percentage): <span style={{ color: "red" }}></span></h4>
                                <div className={"form-control"}>
                                    <h4>Price: <span style={{ color: "red" }}>*</span></h4>
                                    <TextField type={"number"} variant={"outlined"} fullWidth value={newPrice} onChange={(e) => setNewPrice(Math.floor(e.target.value))} />
                                </div>
                                {validatePrice && <Alert severity={"error"}>{validatePrice}</Alert>}
                                <div className={"form-control"}>
                                    <h4>Royalty: <span style={{ color: "red" }}>*</span></h4>
                                    <TextField type={"number"} variant={"outlined"} fullWidth value={newRoyalty} onChange={(e) => setNewRoyalty(Math.floor(e.target.value))} />
                                </div>
                                {validateRoyalty && <Alert severity={"error"}>{validateRoyalty}</Alert>}
                                <Button variant={"contained"} onClick={() => updatePriceRoyalty()}>
                                    {isUpdatingPriceRoyalty && <CircularProgress size={14} />}
                                    {!isUpdatingPriceRoyalty && 'Update'}

                                </Button>
                            </div>

                        }

                        <Divider sx={{ my: 2 }} />
                        <div className={"section price"}>
                            <p className="section-title">Price</p>
                            <Box sx={{ display: 'flex' }}>
                                <Box sx={{ mr: 1 }}>
                                    <strong className={"price"}> {neoPrice} </strong>
                                    <NeoIcon fontSize={'small'} />
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{ mx: 1 }}>
                                    <AttachMoneyIcon fontSize={'small'} />
                                    <strong className={"price"}> {usdPrice} </strong>
                                </Box>
                            </Box>
                        </div>
                        {
                            (address && (ownerOf !== address)) && <>
                                {
                                    (isAuction === "1") ? (
                                        <div>
                                            <div className={"section update-price"}>
                                                <Divider sx={{ my: 2 }} />
                                                <h4>Auction Price: <span style={{ color: "red" }}></span></h4>
                                                <div className={"form-control"}>
                                                    <TextField type={"number"} variant={"outlined"} fullWidth value={newAuction} onChange={(e) => setNewAuction(Math.floor(e.target.value))} />
                                                </div>
                                                {validateAuction && <Alert severity={"error"}>{validateAuction}</Alert>}
                                            </div>
                                            <Button variant="outlined" startIcon={<GavelRoundedIcon />} onClick={() => addAuction()}>
                                                {isAddingAuction && <CircularProgress size={14} />}
                                                {!isAddingAuction && 'PLACE A BID'}
                                            </Button>
                                        </div>

                                    ) : (
                                        <Button variant="contained" startIcon={<ShoppingBasketRoundedIcon />} onClick={() => handleBuyNow()}>


                                            {isLoadingBuyItNow && <CircularProgress size={14} />}
                                            {!isLoadingBuyItNow && 'Buy now'}

                                        </Button>
                                    )
                                }

                            </>
                        }
                    </Grid>
                    {(relatedNfts && relatedNfts.length > 0) &&
                        <Grid item xs={12}>
                            <Divider sx={{ my: 4 }} />
                            <Typography variant='h3' align='center'>Related NFTs</Typography>
                        </Grid>
                    }
                    {(relatedNfts && relatedNfts.length > 0) && relatedNfts.map(item =>
                        <Grid item xs={3}>
                            <NftCard data={item} neoToUsd={neoToUsd} />
                        </Grid>
                    )
                    }
                </Grid>
            </Container>
        </Box>

    );
}