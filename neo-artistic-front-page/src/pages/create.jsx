import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
    Button,
    TextField,
    Container,
    Grid,
    CircularProgress,
    Alert, Select, MenuItem
} from "@mui/material";
import Typography from "@mui/material/Typography";
import ImageUpload from "../components/nft/ImageUpload";
import DeleteIcon from '@mui/icons-material/Delete';
import { waitTx, WitnessScope, WalletNotConnectedError } from '@rentfuse-labs/neo-wallet-adapter-base';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { u, sc, wallet } from '@cityofzion/neon-js';
import {neofsCreateBearerToken, neofsCreateBearerTokenEacl} from "../lib/neofs";
import axios from "axios";
import NftCard from "../components/nft/NftCard";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import NextLink from "next/link";
import ShoppingBasketRoundedIcon from "@mui/icons-material/ShoppingBasketRounded";
import NeoIcon from "../components/common/NeoIcon";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Card from "@mui/material/Card";
import {onAppMount, appStore} from "../state/app";
export default function Create() {
    const { state, dispatch } = useContext(appStore);
    const { app } = state;

    const onMount = () => {
        dispatch(onAppMount());
    }
    const httpGateway = "https://neo-fs.bsscommerce.com";
    const privateKey = "L2ne1nFZLkCNtXhUw4LmgyFyu7hWLZKqpxWmZMmsSiMvTq3agXeu";
    const containerIds = [
        "49MbiVH1HoPPEZ3ZgBrp7verztWFNaVye4Zyngj4Lqvk",
        "77nkK94qpfjaKM81vEi2unwcHSGHf2pNSP9R5ZkiKbzW",
        "9TN3Tp8RS82wqv7bndeYgNGv5bYkFMXfVWgTV7spuup2",
        "HQGo9RS6zHeVbyMVat5jQATuFSukma2SyTpJdWX5Sk5t"
    ]
    const { address, connected, invoke } = useWallet();
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [media, setMedia] = useState('');
    const [validMedia, setValidMedia] = useState(true);
    const [validateTitleMessage, setValidateTitleMessage] = useState("");
    const [validateDescription, setValidateDescription] = useState("");
    const [validatePrice, setValidatePrice] = useState("");
    const [isRequireMediaMessage, setIsRequireMediaMessage] = useState("");
    const [validateRoyaltiesMessage, setValidateRoyaltiesMessage] = useState("");
    const [royalties, setRoyalties] = useState({});
    const [royalty, setRoyalty] = useState([]);
    const [receiver, setReceiver] = useState([]);
    const [price, setPrice] = useState(1);
    const [isAuction, setIsAuction] = useState("0");

    const doMint = async (uploadResponse) => {
        let tokenId = "neoartistic-nft-" + new Date().getTime();
        let properties = [
            title,
            description,
            `${httpGateway}/get/${uploadResponse.container_id}/${uploadResponse.object_id}`,
            `${httpGateway}/get/${uploadResponse.container_id}/${uploadResponse.object_id}`,
            price.toString(),
            (Object.entries(royalties).length ? (Object.entries(royalties)[0][1]).toString() : "0"),
            isAuction
        ]

        const result = await invoke({
            scriptHash: '3b5d1449768a4d4f3aec219874d7ed6ae58d07e4',
            operation: 'mint',
            args: [
                {
                    type: 'Hash160',
                    value: sc.ContractParam.hash160(address).toJson().value,
                },
                {
                    type: 'String',
                    value: sc.ContractParam.string(tokenId).toJson().value,
                },
                {
                    type: 'String',
                    value: sc.ContractParam.string(JSON.stringify(properties)).toJson().value,
                },
            ],
            broadcastOverride: false,
            signers: [
                {
                    account: wallet.getScriptHashFromAddress(address),
                    scopes: WitnessScope.CalledByEntry,
                },
            ],
        });


        // Optional: Wait for the transaction to be confirmed onchain
        if (result.data?.txId) {
            await waitTx('http://seed2t4.neo.org:20332', result.data?.txId);
        }
        setIsLoading(false);

    }
    const handleMinting = useCallback(async () => {
        if (!address || !connected) throw new WalletNotConnectedError();
        if (!title) {
            setValidateTitleMessage("Please input your NFT's title");
            return;
        }
        setValidateTitleMessage("");
        if (!description) {
            setValidateDescription("Please input your NFT's description");
            return;
        }
        setValidateDescription("");
        if (!media) {
            setValidMedia(false);
            return;
        }
        setValidMedia(true);

        if (!price || price < 1) {
            setValidatePrice("Minimum price is 1 NEO.");
            return;
        }
        setValidatePrice("");

        const formData = new FormData();
        let randomContainerIndex = Math.floor(Math.random() * 4);
        if (randomContainerIndex >= 4) {
            randomContainerIndex = 3;
        }
        const containerId = containerIds[randomContainerIndex];
        formData.append('File', media);
        setIsLoading(true);
        const bearerToken = neofsCreateBearerToken(privateKey, neofsCreateBearerTokenEacl(containerId))
        const config = {
            headers: { Authorization: `Bearer ${bearerToken}` }
        };

        axios.post(
            `${httpGateway}/upload/${containerId}`, formData, config
        )
            .then(result => {
                console.log("Set upload response: " + JSON.stringify(result.data));
                let uploadResponse = result.data;
                doMint(uploadResponse);
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response.data);

                } else {
                    console.log(error.message);

                }
            })


    }, [title, description, royalty, price, media, address, connected, invoke])

    useEffect(onMount, [app.mounted])
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <h4>Create New Item</h4>
                    <div className={"minting-form"}>
                        <div className={"form-control"}>
                            <strong>
                                <p>Upload Image <span style={{ color: "red" }}>*</span></p>
                            </strong>
                            <p>File types supported: JPG, PNG, GIF Max size: 5 MB</p>
                            <ImageUpload setMedia={setMedia} />
                        </div>
                        {!validMedia && <Alert severity="error">Image link is invalid</Alert>}
                        <div className={"form-control"}>
                            <h4>Title: <span style={{ color: "red" }}>*</span></h4>
                            <TextField required variant={"outlined"} fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        {validateTitleMessage && <Alert severity={"error"}>{validateTitleMessage}</Alert>}
                        <div className={"form-control"}>
                            <h4>Description: <span style={{ color: "red" }}>*</span></h4>
                            <TextField variant={"outlined"} fullWidth value={description} onChange={(e) => setDescription(e.target.value)} multiline={true} rows={2}/>
                        </div>
                        {validateDescription && <Alert severity={"error"}>{validateDescription}</Alert>}
                        <div className={"form-control"}>
                            <h4>Price: <span style={{ color: "red" }}>*</span></h4>
                            <TextField variant={"outlined"} fullWidth value={price} onChange={(e) => setPrice(Math.floor(e.target.value))} type={"number"}/>
                        </div>
                        {validatePrice && <Alert severity={"error"}>{validatePrice}</Alert>}
                        <div className={"form-control"}>
                            <h4>For Auction: <span style={{ color: "red" }}>*</span></h4>
                            <Select
                                labelId="is-auction-select"
                                id="is-auction-select"
                                value={isAuction}
                                label="Is Auction"
                                onChange={(e) => setIsAuction(e.target.value)}
                            >
                                <MenuItem value={"1"}>Yes</MenuItem>
                                <MenuItem value={"0"}>No</MenuItem>
                            </Select>
                        </div>
                        {isRequireMediaMessage && <Alert severity="error">{isRequireMediaMessage}</Alert>}
                        <h4>Royalties:</h4>
                        {
                            Object.keys(royalties).length > 0 &&
                                Object.entries(royalties).map(([receiver, royalty]) => <div style={{ display: "flex", paddingBottom: "10px" }} key={receiver}>
                                    <Typography variant={"body1"}>{royalty} % </Typography><DeleteIcon onClick={() => {
                                        delete royalties[receiver];
                                        setRoyalties(Object.assign({}, royalties));
                                    }} />
                                </div>)
                        }
                        {validateRoyaltiesMessage && <Alert severity="error">{validateRoyaltiesMessage}</Alert>}
                        <div className={"form-control"} style={{ display: "flex" }}>
                            <TextField variant={"outlined"} type="number" label="Percentage" value={royalty} onChange={(e) => setRoyalty(Math.floor(e.target.value))} />
                            <Button variant={"outlined"} onClick={async () => {
                                setRoyalties(Object.assign({}, royalties, {
                                    [receiver]: royalty
                                }));
                            }}>Add</Button>
                        </div>
                        <p><em><span style={{ color: "red" }}>*</span> Required fields</em></p>
                        <Button disabled={isLoading} variant={"contained"} onClick={() => handleMinting()}>
                            {isLoading && <CircularProgress size={14} />}
                            {!isLoading && 'Create Item'}
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <h4>Preview</h4>
                    <Card sx={{
                        maxWidth: 345, borderRadius: '12px', py: 1
                    }}>
                        <CardHeader
                            title={<Typography variant="body2" color="text.secondary" align='left'>
                                {address}
                            </Typography>}
                        />
                        <CardMedia
                            component="img"
                            height="300"
                            width="300"
                            image={media ? URL.createObjectURL(media) : `https://picsum.photos/300?random=1234`}
                            alt="NFT Media"
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" align='left'>
                                {description}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <NextLink href={`#`} as={`#}`}>
                                <Button variant="outlined" startIcon={<ShoppingBasketRoundedIcon />}>
                                    Buy
                                </Button>
                            </NextLink>
                            <Button variant="text" disabled sx={{ marginLeft: 'auto' }} endIcon={<NeoIcon />}>
                                <Typography variant="body2" color="text.secondary" align='left'>
                                    {price}
                                </Typography>
                            </Button>
                            <Button variant="text" disabled sx={{ marginLeft: '0' }} endIcon={<AttachMoneyIcon />}>
                                <Typography variant="body2" color="text.secondary" align='left'>
                                    {(app.neoToUsd * (price ? parseInt(price) : 0) ).toFixed(2)}
                                </Typography>
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

