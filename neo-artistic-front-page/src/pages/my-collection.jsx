import React, { useCallback, useEffect, useState, useContext } from 'react';
import {
    Box,
    Button,
    TextField,
    Grid,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    Typography
} from "@mui/material";
import ImageUpload from "src/components/nft/ImageUpload";
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import CollectionCard from 'src/components/collection/CollectionCard';
import NftCard from 'src/components/nft/NftCard';
import axios from "axios";
import { neofsCreateBearerToken, neofsCreateBearerTokenEacl } from "src//lib/neofs";
import { appStore, onAppMount } from 'src/state/app';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `collection-tab-${index}`,
        'aria-controls': `collection-tabpanel-${index}`,
    };
}


export default function MyCollection() {
    const { address, connected } = useWallet();
    if (!connected) return <div>Please connect your wallet</div>
    const { state, dispatch } = useContext(appStore);
    const { app } = state;
    const onMount = () => {
        dispatch(onAppMount());
    };
    const [isFirstLoading, setIsFirstLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState("");
    const [bio, setBio] = useState("");
    const [validBio, setValidBio] = useState("");
    const [website, setWebsite] = useState("");
    const [validWebsite, setValidWebsite] = useState("");
    const [logo, setLogo] = useState('');
    const [banner, setBanner] = useState('');
    const [validLogoMedia, setValidLogoMedia] = useState(true);
    const [validBannerMedia, setValidBannerMedia] = useState(true);
    const [collectionName, setCollectionName] = useState("");
    const [validName, setValidName] = useState("");
    const [isSuccessSave, setIsSuccessSave] = useState(0);
    const [list, setList] = useState([]);

    const [tab, setTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };


    const httpGateway = "https://neo-fs.bsscommerce.com";
    const privateKey = "L2ne1nFZLkCNtXhUw4LmgyFyu7hWLZKqpxWmZMmsSiMvTq3agXeu";
    const containerIds = [
        "49MbiVH1HoPPEZ3ZgBrp7verztWFNaVye4Zyngj4Lqvk",
        "77nkK94qpfjaKM81vEi2unwcHSGHf2pNSP9R5ZkiKbzW",
        "9TN3Tp8RS82wqv7bndeYgNGv5bYkFMXfVWgTV7spuup2",
        "HQGo9RS6zHeVbyMVat5jQATuFSukma2SyTpJdWX5Sk5t"
    ]

    function setRespone(data) {
        if (data) {
            setEmail(data.email);
            setBio(data.bio);
            setWebsite(data.website);
            setLogo(data.logo);
            setBanner(data.banner);
            setCollectionName(data.collection_name)
        }
    }

    useEffect(onMount, [app.mounted])

    useEffect(() => {
        if (isFirstLoading && address) {
            setIsFirstLoading(false);
            const collectionPromise = fetch(`/api/collection/${address}`);
            const listNFTsPromise = fetch(`${process.env.apiurl}tokens-of?address=${address}`);

            Promise.all([collectionPromise, listNFTsPromise]).then(async ([collectionData, listNFTs]) => {
                let collectionJson = await collectionData.json();
                let listJson = await listNFTs.json();
                console.log(listJson)
                setRespone(collectionJson);
                setList(listJson);
            });
        }
    }, [isFirstLoading]);

    const doSave = useCallback(async (logoResponse, bannerReponse) => {
        setIsLoading(true);
        let logoPath = `${httpGateway}/get/${logoResponse.container_id}/${logoResponse.object_id}`;
        let bannerPath = `${httpGateway}/get/${bannerReponse.container_id}/${bannerReponse.object_id}`;
        let res = await fetch("/api/collection/create-or-update", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account_id: address,
                email: email,
                bio: bio,
                website: website,
                logo: logoPath,
                banner: bannerPath,
                collectionName: collectionName
            })
        });
        if (res.status !== 200) {
            setIsSuccessSave(1);
        } else {
            setIsSuccessSave(2)
        }
        setIsLoading(false);
    }, [isLoading, email, bio, website, logo, banner, collectionName, isSuccessSave]);

    const handleSave = useCallback(async () => {
        if (!address || !connected) throw new WalletNotConnectedError();

        if (!collectionName) {
            setValidName("Please input your collection name");
            return;
        }
        setValidName("");
        if (!email) {
            setValidEmail("Please input your email");
            return;
        }
        setValidEmail("");

        if (!bio) {
            setValidBio("Please input your collection description");
            return;
        }
        setValidBio("");

        if (!website) {
            setValidWebsite("Please input your collection website reference");
            return;
        }
        setValidWebsite("");

        if (!logo) {
            setValidLogoMedia(false);
            return;
        }
        setValidLogoMedia(true);

        if (!banner) {
            setValidBannerMedia(false);
            return;
        }
        setValidBannerMedia(true);

        const logoForm = new FormData();
        const bannerForm = new FormData();

        let randomContainerIndex = Math.floor(Math.random() * 4);
        if (randomContainerIndex >= 4) {
            randomContainerIndex = 3;
        }
        const containerId = containerIds[randomContainerIndex];

        logoForm.append('File', logo);
        bannerForm.append('File', banner);

        const bearerToken = neofsCreateBearerToken(privateKey, neofsCreateBearerTokenEacl(containerId))
        const config = {
            headers: { Authorization: `Bearer ${bearerToken}` }
        };

        const logoPost = axios.post(
            `${httpGateway}/upload/${containerId}`, logoForm, config
        );
        const bannerPost = axios.post(
            `${httpGateway}/upload/${containerId}`, bannerForm, config
        );
        Promise.all([logoPost, bannerPost]).then(([logoResponse, bannerReponse]) => {
            doSave(logoResponse.data, bannerReponse.data);
        });
    }, [collectionName, email, bio, website, banner, logo, address, connected]);
    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={tab}
                    onChange={handleTabChange}
                    aria-label="My collections"
                    sx={{ borderRight: 1, borderColor: 'divider', pt: 2 }}
                >
                    <Tab label="Settings" {...a11yProps(0)} />
                    <Tab label="NFTs" {...a11yProps(1)} />
                </Tabs>
            </Grid>
            <Grid item xs={10}>
                <TabPanel value={tab} index={0}>
                    <Grid sx={{ mx: 'auto' }} container spacing={2} maxWidth='xl'>
                        <Grid item xs={6}>
                            <h4>Collection Settings</h4>
                            <div className={"form-control"}>
                                {
                                    isSuccessSave === 2 && <Alert severity="success">Save collection information successfully</Alert>
                                }
                                {
                                    isSuccessSave === 1 && <Alert severity="success">Fail to save collection information</Alert>
                                }
                            </div>
                            <div className={"form-control"}>
                                <TextField variant={"outlined"} fullWidth label={"Collection Name"} value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
                            </div>
                            {validName && <Alert severity={"error"}>{validName}</Alert>}
                            <div className={"form-control"}>
                                <TextField variant={"outlined"} fullWidth label={"Email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            {validEmail && <Alert severity={"error"}>{validEmail}</Alert>}
                            <div className={"form-control"}>
                                <TextField variant={"outlined"} fullWidth label={"Bio"} value={bio} onChange={(e) => setBio(e.target.value)} multiline={true} />
                            </div>
                            {validBio && <Alert severity={"error"}>{validBio}</Alert>}
                            <div className={"form-control"}>
                                <TextField variant={"outlined"} fullWidth label={"Website"} value={website} onChange={(e) => setWebsite(e.target.value)} multiline={true} />
                            </div>
                            {validWebsite && <Alert severity={"error"}>{validWebsite}</Alert>}
                            <br />
                            <div className={"form-control"}>
                                <label>Upload logo</label>
                                <ImageUpload setMedia={setLogo} />
                                {!validLogoMedia && <p>Image link is invalid.</p>}
                            </div>
                            <div className={"form-control"}>
                                <label>Upload collection banner</label>
                                <ImageUpload setMedia={setBanner} />
                                {!validBannerMedia && <p>Image link is invalid.</p>}
                            </div>
                            <br />
                            <Button disabled={isLoading} variant={"contained"} onClick={() => handleSave()}>
                                {isLoading && <CircularProgress size={14} />}
                                {!isLoading && 'Save'}
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <h4>Preview</h4>
                            <div className={"picasart-collection-banner"}>
                                <CollectionCard banner={banner} logo={logo} bio={bio} collectionName={collectionName} account_id={address} website={website} />
                            </div>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <Grid container spacing={2}>
                        {(list.length > 0) && list.map(item =>
                            <Grid item xs={3}>
                                <NftCard data={item} neoToUsd={app.neoToUsd} />
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>
            </Grid>
        </Grid>
    )
}

