package com.neoartistic.nftmarketplace;

public class TokenJson {
    public String name;
    public String description;
    public String image;
    public String tokenURI;
    public String price;
    public String royalty;
    public String isAuction;

    public TokenJson(String name, String description, String image, String tokenURI, String price, String royalty,
            String isAuction) {
        this.name = name;
        this.description = description;
        this.tokenURI = tokenURI;
        this.image = image;
        this.price = price;
        this.royalty = royalty;
        this.isAuction = isAuction;
    }
}
