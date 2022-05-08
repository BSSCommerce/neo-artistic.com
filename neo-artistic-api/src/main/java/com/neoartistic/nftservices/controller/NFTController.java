package com.neoartistic.nftservices.controller;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neoartistic.nftservices.bo.NFT;
import com.neoartistic.nftservices.bo.Oracle;
import com.neoartistic.nftservices.entity.NFTToken;

@RestController
public class NFTController {

	private static final String template = "Hello, %s!";
	private final AtomicLong counter = new AtomicLong();

	@GetMapping("/greeting")
	public String greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format(template, name);
	}
	
	@GetMapping("/neo-price")
	public String getNeoPrice() throws IOException {
		Oracle oracle = new Oracle();
		return oracle.getNeoPrice();
	}
	
	@GetMapping("/tokens")
	public List<NFTToken> getTokens() throws IOException {
		NFT nft = new NFT();
		List<NFTToken> tokens = nft.getTokens();
		return tokens;
	}
	
	@PostMapping("/mint")
	public boolean mintToken() throws Throwable {
		NFT nft = new NFT();
		return nft.mint(null);
	}
	@GetMapping("/tokens-of")
	public List<NFTToken> getTokensOf(@RequestParam(value = "address", defaultValue = "World") String address) throws IOException {
		NFT nft = new NFT();
		List<NFTToken> tokens = nft.getTokensOf(address);
		return tokens;
	}
	
	@PostMapping("/set-auctions") 
	public boolean setAuctions() throws Throwable {
		NFT nft = new NFT();
		return nft.setAuction("token-1651659675389", "20");
	}
	
	@GetMapping("/get-token-by-id")
	public NFTToken getTokenById(@RequestParam(value = "token-id", defaultValue = "") String TokenId) throws IOException {
		NFT nft = new NFT();
		return nft.getProperties(TokenId);
	}
}
