import {Grid, Paper, Container, Card, CardHeader, CardContent, Divider} from '@mui/material';
import BasicTable from "../components/nft/Table";
import {useEffect, useState} from "react";
import useSWR from 'swr';
import NeoIcon from "../components/common/NeoIcon";
import * as React from "react";
const fetcher = async (url) => {
	let totalNFTs = 0;
	let totalValue = 0;
	let totalAuctionedNFTs = 0;
	let totalExchangedNFTs = 0;
	let data = {};
	let collections = {}
	try {
		const res = await fetch(url);
		let resJson = await res.json();
		totalNFTs = resJson.length;
		for (let i=0; i < totalNFTs; i++) {
			let item = resJson[i];
			totalValue += parseInt(item.price);
			if (item.isAuction === "1") {
				totalAuctionedNFTs += 1;
			}
			if (item.ownerOf !== item.originOf) {
				totalExchangedNFTs += 1;
			}
			if (!collections[item.ownerOf]) {
				collections[item.ownerOf] = {
					tokens: 1,
					value: parseInt(item.price),
					auctions: item.isAuction === "1" ? 1 : 0
				};
			} else {
				collections[item.ownerOf] = {
					tokens: collections[item.ownerOf].tokens + 1,
					value: collections[item.ownerOf].value + parseInt(item.price),
					auctions: item.isAuction === "1" ? (collections[item.ownerOf].auctions + 1) :  collections[item.ownerOf].auctions
				};
			}
		}

		if (res.status !== 200) {
			throw new Error(data.message)
		}

	} catch (e) {
		console.log(e)
	}
	data = {
		totalNFTs: totalNFTs ,
		totalValue: totalValue,
		totalAuctionedNFTs: totalAuctionedNFTs,
		totalExchangedNFTs: totalExchangedNFTs,
		collections: collections
	};
	console.log(data)
	return data;
}
const Index = () => {
	const { data, error } = useSWR(`${process.env.apiurl}/tokens`,
		fetcher
	);
	const [firstLoading, setFirstLoading] = useState(true);
	// useEffect(() => {
	// 	if (totalNFTs) {
	// 		setFirstLoading(false);
	// 	}
	// }, [firstLoading])
	return (
		<>
			{data && <div className={'container'}>
				<Container sx={{py: 8}} maxWidth="xl">
					<h2>Overview</h2>
					<Grid container spacing={2}>
						<Grid item xs={3}>
							<Card title={"Total NFTs"}>
								<CardHeader key={"total-nft"} title="Total NFTs"/>
								<Divider orientation={"horizontal"}/>
								<CardContent>
									<h1 style={{color: "orange"}}>{data.totalNFTs}</h1>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={3}>
							<Card title={"Auctioned NFTs"}>
								<CardHeader key={"auctioned-nft"} title="Auctioned NFTs"/>
								<Divider orientation={"horizontal"}/>
								<CardContent>
									<h1 style={{color: "orange"}}>{data.totalAuctionedNFTs}</h1>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={3}>
							<Card title={"Total NFT Value"}>
								<CardHeader key={"total-nft-value"} title="Total NFT Value"/>
								<Divider orientation={"horizontal"}/>
								<CardContent>
									<h1 style={{color: "orange"}}>{data.totalValue} <NeoIcon fontSize={'small'} /></h1>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={3}>
							<Card title={"Exchanged NFTs"}>
								<CardHeader key={"exchanged-nft"} title="Exchanged NFTs"/>
								<Divider orientation={"horizontal"}/>
								<CardContent>
									<h1 style={{color: "orange"}}>{data.totalExchangedNFTs}</h1>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
					<br/>
					<br/>
					<h2>Top Collections</h2>
					<BasicTable collections={data.collections}/>
				</Container>
			</div>
			}
		</>
	);
};

export default Index;
