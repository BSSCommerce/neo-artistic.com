import { styled } from '@mui/material/styles';
import { Grid, Paper, Container, Typography, Button, Card, CardContent, CardMedia, Avatar, Divider } from '@mui/material';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import Head from 'next/head';
import { useState, useCallback, useEffect, useContext } from 'react';
import bgHome from "src/public/static/img/bg_home.png";
import bg1 from "src/public/static/img/bg_1.png";
import bg2 from "src/public/static/img/bg_2.png";
import bg3 from "src/public/static/img/bg_3.png";
import BackupIcon from '@mui/icons-material/Backup';
import GavelIcon from '@mui/icons-material/Gavel';
import StoreIcon from '@mui/icons-material/Store';
import Router from "next/router";
import { appStore, onAppMount } from 'src/state/app';
import NftCard from 'src/components/nft/NftCard';
import CollectionCard from 'src/components/collection/CollectionCard';

const Index = () => {
	const [isFirstLoading, setIsFirstLoading] = useState(true);
	const { state, dispatch } = useContext(appStore);
	const { app } = state;
	const onMount = () => {
		dispatch(onAppMount());
	};

	const walletConnect = useWallet();
	const { connected, getNetworks } = walletConnect;

	const [walletNetwork, setWalletNetwork] = useState();

	const [listCollections, setListCollections] = useState([]);
	const [listNfts, setListNfts] = useState([]);

	const fetchWalletNetwork = useCallback(async () => {
		try {
			const result = await getNetworks();
			if (result.status === 'success') {
				setWalletNetwork(result.data?.defaultNetwork || null);
			}
		} catch (error) {
			console.error(error);
		}
	}, [getNetworks]);

	useEffect(() => {
		if (connected) {
			fetchWalletNetwork();
		} else {
			setWalletNetwork(null);
		}
	}, [connected, fetchWalletNetwork]);

	useEffect(() => {
		if (isFirstLoading) {
			setIsFirstLoading(false);
			const collectionPromise = fetch('/api/collection/all').catch(e => false);
			const nftPromise = fetch(`${process.env.apiurl}tokens`).catch(e => false);

			Promise.all([collectionPromise, nftPromise]).then(async ([collectionRes, nftRes]) => {
				if (collectionRes) {
					let collectionJson = await collectionRes.json();
					setListCollections(collectionJson.reverse().slice(0, 3));
				}
				if (nftRes) {
					let nftJson = await nftRes.json();
					console.log(nftJson)
					setListNfts(nftJson.reverse().slice(0, 8));
				}
			});
		}
	}, [isFirstLoading]);

	useEffect(onMount, [app.mounted]);

	return (
		<>
			<div className={'container'}>
				<Head>
					<title>Neo Artistic</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Container sx={{ py: 8 }} maxWidth="xl">
					<Grid container spacing={4}>
						<Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
							<Typography variant='h6' component="p" color='primary'>
								NEO ARTISTIC
							</Typography>
							<br />
							<Typography variant='h3' component="p">
								Create, sell or collect NFTs.
							</Typography>
							<br />
							<Typography variant='subtitle1' component="p">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
							</Typography>
							<br />
							<div>
								<Button variant='outlined' size='small' onClick={() => Router.push("/explore")}>Explore</Button>
							</div>
						</Grid>
						<Grid item xs={2} />
						<Grid item xs={4} sx={{
							bgcolor: 'background.paper',
							pt: 8,
							pb: 6,
							height: 512,
							backgroundImage: `url(${bgHome.src})`,
							backgroundSize: 'contain',
							backgroundRepeat: 'no-repeat'
						}} />
						<Grid item xs={4}>
							<Card sx={{ maxWidth: "100%" }}>
								<CardMedia
									component="img"
									height="190"
									image={bg1.src}
									alt="card banner"
								/>
								<CardContent>
									<Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mt: -5, mb: 1 }}>
										<BackupIcon color='white'/>
									</Avatar>
									<Typography align='center'>Create your own NFT</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={4}>
							<Card sx={{ maxWidth: "100%" }}>
								<CardMedia
									component="img"
									height="190"
									image={bg2.src}
									alt="card banner"
								/>
								<CardContent>
									<Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mt: -5, mb: 1 }}>
										<GavelIcon color='white' />
									</Avatar>
									<Typography align='center'>Setup NFT to sell or auction</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={4}>
							<Card sx={{ maxWidth: "100%" }}>
								<CardMedia
									component="img"
									height="190"
									image={bg3.src}
									alt="card banner"
								/>
								<CardContent>
									<Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mt: -5, mb: 1 }}>
										<StoreIcon color='white' />
									</Avatar>
									<Typography align='center'>Explore market</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
					<Divider sx={{ mt:6}} />
					<Grid container spacing={4} sx={{my: 4}}>
						<Grid item xs={12}>
							<Typography variant='h3' align='center'>New Collections</Typography>
						</Grid>
						{listCollections.length && listCollections.map(item =>
							<Grid item xs={4}>
								<CollectionCard {...item} />
							</Grid>
						)}
					</Grid>
					<Grid container spacing={4} sx={{ my: 6 }}>
						<Grid item xs={12}>
							<Typography variant='h3' align='center'>New Collectibles</Typography>
						</Grid>
						{listNfts.length && listNfts.map(item =>
							<Grid item xs={3}>
								<NftCard data={item} neoToUsd={app.neoToUsd} />
							</Grid>
						)}
					</Grid>
				</Container>
			</div>
		</>
	);
};

export default Index;
