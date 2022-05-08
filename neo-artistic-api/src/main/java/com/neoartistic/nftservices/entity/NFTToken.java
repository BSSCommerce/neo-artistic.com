package com.neoartistic.nftservices.entity;

import java.util.List;

public class NFTToken {
	 	public String id;
	    public String name;
	    public String description;
	    public String image;
	    public String tokenURI;
	    public String price;
	    public String royalty;
	    public List<Auction> auctions;
	    public String originOf;
	    public String ownerOf;
	    public String isAuction;
	    
	    public NFTToken(String id, String name, String description, String image, String tokenURI, String price, String royalty, List<Auction> auctions, String originOf, String ownerOf, String isAuction) {
	        this.id = id;
	        this.name = name;
	        this.description = description;
	        this.tokenURI = tokenURI;
	        this.image = image;
	        this.price = price;
	        this.royalty = royalty;
	        this.auctions = auctions;
	        this.originOf = originOf;
	        this.ownerOf = ownerOf;
	        this.isAuction = isAuction;
	    }
	    
	    @Override
	    public String toString() {
	    	// TODO Auto-generated method stub
	    	String string = "";
	    	string += this.id + ",";
	    	string += this.name + ",";
	    	string += this.description + ",";
	    	string += this.image + ",";
	    	string += this.tokenURI + ",";
	    	string += this.price + ",";
	    	string += this.royalty + ",";
	    	string += this.name + ",";
	    	for (Auction auction : this.auctions) {
				string += "Auction:";
				string += auction.bider + ",";
				string += auction.price + ",";
			}
	    	string += this.isAuction + ",";
	    	return string;
	    }
}
