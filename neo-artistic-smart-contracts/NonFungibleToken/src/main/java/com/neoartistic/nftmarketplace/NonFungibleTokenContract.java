package com.neoartistic.nftmarketplace;

import java.util.ArrayList;

import io.neow3j.devpack.ByteString;
import io.neow3j.devpack.Contract;
import io.neow3j.devpack.Hash160;
import io.neow3j.devpack.Helper;
import io.neow3j.devpack.Iterator;
import io.neow3j.devpack.List;
import io.neow3j.devpack.Map;
import io.neow3j.devpack.Runtime;
import io.neow3j.devpack.Storage;
import io.neow3j.devpack.StorageContext;
import io.neow3j.devpack.StorageMap;
import io.neow3j.devpack.StringLiteralHelper;
import io.neow3j.devpack.annotations.DisplayName;
import io.neow3j.devpack.annotations.ManifestExtra;
import io.neow3j.devpack.annotations.OnDeployment;
import io.neow3j.devpack.annotations.Permission;
import io.neow3j.devpack.annotations.Safe;
import io.neow3j.devpack.annotations.SupportedStandard;
import io.neow3j.devpack.constants.CallFlags;
import io.neow3j.devpack.constants.FindOptions;
import io.neow3j.devpack.contracts.ContractManagement;
import io.neow3j.devpack.contracts.NeoToken;
import io.neow3j.devpack.contracts.StdLib;
import io.neow3j.devpack.events.Event3Args;
import io.neow3j.devpack.events.Event4Args;
import io.neow3j.devpack.constants.NeoStandard;

@DisplayName("BSS.NeoArtistic.NFTMarket")
@ManifestExtra(key = "author", value = "nghiatt@bsscommerce.com")
@SupportedStandard(neoStandard = NeoStandard.NEP_11)
@Permission(contract = "*")
public class NonFungibleTokenContract {

    static final Hash160 contractOwner = StringLiteralHelper.addressToScriptHash("Nj8kmumTe8y4vLt4tmtvHva9U81m8tiz85");

    static final StorageContext ctx = Storage.getStorageContext();
    static final StorageMap contractMap = new StorageMap(ctx, 0);
    static final StorageMap registryMap = new StorageMap(ctx, 1);
    static final StorageMap ownerOfMap = new StorageMap(ctx, 2);
    static final StorageMap balanceMap = new StorageMap(ctx, 3);
    static final StorageMap originOfMap = new StorageMap(ctx, 4);
    // Keys of key-value pairs in NFT properties
    static final String propName = "name";
    static final String propDescription = "description";
    static final String propImage = "image";
    static final String propTokenURI = "tokenURI";
    static final String propPrice = "price";
    static final String propRoyalty = "royalty";

    static final StorageMap propertiesNameMap = new StorageMap(ctx, 8);
    static final StorageMap propertiesDescriptionMap = new StorageMap(ctx, 9);
    static final StorageMap propertiesImageMap = new StorageMap(ctx, 10);
    static final StorageMap propertiesTokenURIMap = new StorageMap(ctx, 11);
    static final StorageMap propertiesPriceMap = new StorageMap(ctx, 12);
    static final StorageMap propertiesRoyaltyMap = new StorageMap(ctx, 13);
    static final StorageMap propertiesIsAuctionMap = new StorageMap(ctx, 14);
    static final byte[] totalSupplyKey = new byte[] { 0x10 };
    static final byte[] tokensOfKey = new byte[] { 0x11 };
    static final byte[] auctionOfKey = new byte[] { 0x12 };

    // NEP-11 Methods

    @Safe
    public static String symbol() {
        return "NEOARTISTIC";
    }

    @Safe
    public static int decimals() {
        return 0;
    }

    @Safe
    public static int totalSupply() {
        return contractMap.getInt(totalSupplyKey);
    }

    @Safe
    public static int balanceOf(Hash160 owner) {
        return balanceMap.getIntOrZero(owner.toByteArray());
    }

    @Safe
    public static List<NFTToken> tokensOf(Hash160 owner) {
        Iterator<ByteString> tokens = (Iterator<ByteString>) Storage.find(ctx.asReadOnly(), createTokensOfPrefix(owner),
                (byte) (FindOptions.KeysOnly | FindOptions.RemovePrefix));
        List<NFTToken> tks = new List<>();
        while(tokens.next()) {
            
                String id = tokens.get().toString();
                String name = propertiesNameMap.get(tokens.get()).toString();
                String image = propertiesImageMap.get(tokens.get()).toString();
                String description = propertiesDescriptionMap.get( tokens.get()).toString();
                String tokenURI = propertiesTokenURIMap.get(tokens.get()).toString();
                String price = propertiesPriceMap.get(tokens.get()).toString();
                String royalty = propertiesRoyaltyMap.get(tokens.get()).toString();
                List<Auction> autionsList = new List<>();
                String originOf = originOfMap.get(tokens.get()).toString();
                String ownerOf = ownerOfMap.get(tokens.get()).toString();
                String isAuction = propertiesIsAuctionMap.get( tokens.get()).toString();
                // Iterator<Iterator.Struct<ByteString, ByteString>> auctions =
                // Storage.find(ctx.asReadOnly(), createAuctionOfPrefix(pair.value),
                // (byte) (FindOptions.KeysOnly | FindOptions.RemovePrefix));
    
                // while(auctions.next()) {
                // Iterator.Struct<ByteString, ByteString> auction = auctions.get();
                // autionsList.put(new Auction(ac, pair.value.toString()));
    
                // }
                tks.add(
                        new NFTToken(id, name, description, image, tokenURI, price, royalty, autionsList, originOf,
                                ownerOf, isAuction));
        }        
        return tks;
    }

    public static boolean transfer(Hash160 to, ByteString tokenId, Object data) {
        Hash160 owner = ownerOf(tokenId);
        assert owner != null : "This token id does not exist.";

        // Hash160 origin = originOf(tokenId);
        // String royalty = propertiesRoyaltyMap.getString(tokenId);
        String price = propertiesPriceMap.getString(tokenId);
        String[] userData = StdLib.stringSplit((String) data, ",");
        String isAuction = userData[0];
        String auctionPrice = userData[1];
        if (isAuction == "1") {
            // Remove Auction
            Iterator<Iterator.Struct<ByteString, ByteString>> tokenAuctions = (Iterator<Iterator.Struct<ByteString, ByteString>>) Storage
                    .find(
                            ctx.asReadOnly(), createAuctionOfPrefix(tokenId), FindOptions.RemovePrefix);

            while (tokenAuctions.next()) {
                Iterator.Struct<ByteString, ByteString> auction = tokenAuctions.get();
                new StorageMap(ctx, createAuctionOfPrefix(tokenId)).delete(auction.key);
            }

            propertiesPriceMap.put(tokenId, auctionPrice);
        }

        // Change price

        // String auctionPrice = null;
        // Iterator<Iterator.Struct<ByteString, ByteString>> tokenAuctions =
        // (Iterator<Iterator.Struct<ByteString, ByteString>>) Storage
        // .find(
        // ctx.asReadOnly(), createAuctionOfPrefix(tokenId), FindOptions.RemovePrefix);

        // while (tokenAuctions.next()) {
        // Iterator.Struct<ByteString, ByteString> auction = tokenAuctions.get();
        // // auctions.add(new Auction(auction.key.toString(),
        // auction.value.toString()));
        // if (isAcceptAuction == "1" && auction.key.toString() == toAddress) {
        // auctionPrice = auction.value.toString();
        // }
        // }

        // boolean ownerIsOrigin = (originOfMap.get(tokenId) ==
        // ownerOfMap.get(tokenId));
        // if (ownerIsOrigin) {
        // Runtime.log("OWNER is ORIGIN");
        // }
        // // Start Transfer Here
        // if (auctionPrice != null) {

        // onTransferFT.fire(to, owner, StdLib.atoi(auctionPrice, 10));
        // // Contract.call(NeoTo, "onNEP17Payment", CallFlags.All, data);
        // NeoToken.transfer(to, owner, StdLib.atoi(auctionPrice, 10), data);
        // if (ownerIsOrigin) {
        // // Do nothing
        // } else {
        // if (royalty != null) {
        // int royaltyPrice = (StdLib.atoi(auctionPrice, 10) * StdLib.atoi(royalty, 10)
        // / 100);
        // NeoToken.transfer(owner, origin, royaltyPrice, data);
        // }

        // }

        // } else {
        // onTransferFT.fire(to, owner, StdLib.atoi(price, 10));
        // // Contract.call(NeoTo, "onNEP17Payment", CallFlags.All, data);
        // NeoToken.transfer(to, owner, StdLib.atoi(price, 10), data);
        // if (ownerIsOrigin) {
        // // Do nothing
        // } else {
        // if (royalty != null) {
        // int royaltyPrice = (StdLib.atoi(price, 10) * StdLib.atoi(royalty, 10) / 100);
        // NeoToken.transfer(owner, origin, royaltyPrice, data);
        // }

        // }
        // }

        ownerOfMap.put(tokenId, to.toByteArray());

        new StorageMap(ctx, createTokensOfPrefix(owner)).delete(tokenId);
        new StorageMap(ctx, createTokensOfPrefix(to)).put(tokenId, 1);

        decreaseBalanceByOne(owner);
        increaseBalanceByOne(to);

        onTransfer.fire(owner, to, StdLib.atoi(price, 10), tokenId);
        return true;
    }

    @Safe
    public static Hash160 ownerOf(ByteString tokenId) {
        ByteString owner = ownerOfMap.get(tokenId);
        if (owner == null) {
            return null;
        }
        return new Hash160(owner);
    }

    @Safe
    public static Hash160 originOf(ByteString tokenId) {
        ByteString origin = originOfMap.get(tokenId);
        if (origin == null) {
            return null;
        }
        return new Hash160(origin);
    }

    @Safe
    public static List<NFTToken> getTokens() {
        // return (Iterator<Iterator.Struct<ByteString, ByteString>>)
        // registryMap.find(FindOptions.None);
        // Runtime.log("Before");
        List<NFTToken> tks = new List<>();
        Iterator<Iterator.Struct<ByteString, ByteString>> tok = (Iterator<Iterator.Struct<ByteString, ByteString>>) registryMap
                .find(FindOptions.RemovePrefix);
        // Runtime.log("After");
        while (tok.next()) {
            Iterator.Struct<ByteString, ByteString> pair = tok.get();
            String id = pair.key.toString();
            String name = propertiesNameMap.get(pair.value).toString();
            String image = propertiesImageMap.get(pair.value).toString();
            String description = propertiesDescriptionMap.get(pair.value).toString();
            String tokenURI = propertiesTokenURIMap.get(pair.value).toString();
            String price = propertiesPriceMap.get(pair.value).toString();
            String royalty = propertiesRoyaltyMap.get(pair.value).toString();
            List<Auction> autionsList = new List<>();
            String originOf = originOfMap.get(pair.key).toString();
            String ownerOf = ownerOfMap.get(pair.key).toString();
            String isAuction = propertiesIsAuctionMap.get(pair.value).toString();
            // Iterator<Iterator.Struct<ByteString, ByteString>> auctions =
            // Storage.find(ctx.asReadOnly(), createAuctionOfPrefix(pair.value),
            // (byte) (FindOptions.KeysOnly | FindOptions.RemovePrefix));

            // while(auctions.next()) {
            // Iterator.Struct<ByteString, ByteString> auction = auctions.get();
            // autionsList.put(new Auction(ac, pair.value.toString()));

            // }
            tks.add(
                    new NFTToken(id, name, description, image, tokenURI, price, royalty, autionsList, originOf,
                            ownerOf, isAuction));
        }

        return tks;
    }

    @Safe
    public static NFTToken properties(ByteString tokenId) {
        String id = tokenId.toString();
        String name = null;
        String description = null;
        String image = null;
        String uri = null;
        String price = null;
        String royalty = null;
        String isAuction = null;
        List<Auction> auctions = new List<>();

        ByteString tokenName = propertiesNameMap.get(tokenId);
        assert tokenName != null : "This token id does not exist.";
        name = tokenName.toString();
        ByteString tokenDescription = propertiesDescriptionMap.get(tokenId);
        if (tokenDescription != null) {
            description = tokenDescription.toString();
        }
        ByteString tokenImage = propertiesImageMap.get(tokenId);
        if (tokenImage != null) {
            image = tokenImage.toString();
        }
        ByteString tokenURI = propertiesTokenURIMap.get(tokenId);
        if (tokenURI != null) {
            uri = tokenURI.toString();
        }
        ByteString tokenPrice = propertiesPriceMap.get(tokenId);
        if (tokenPrice != null) {
            price = tokenPrice.toString();
        }

        ByteString tokenRoyalty = propertiesRoyaltyMap.get(tokenId);
        if (tokenRoyalty != null) {
            royalty = tokenRoyalty.toString();
        }

        ByteString tokenIsAuction = propertiesIsAuctionMap.get(tokenId);
        if (tokenIsAuction != null) {
            isAuction = tokenIsAuction.toString();
        }

        Iterator<Iterator.Struct<ByteString, ByteString>> tokenAuctions = (Iterator<Iterator.Struct<ByteString, ByteString>>) Storage
                .find(
                        ctx.asReadOnly(), createAuctionOfPrefix(tokenId), FindOptions.RemovePrefix);

        while (tokenAuctions.next()) {
            Iterator.Struct<ByteString, ByteString> auction = tokenAuctions.get();
            auctions.add(new Auction(auction.key.toString(), auction.value.toString()));

        }

        NFTToken token = new NFTToken(
                id,
                name,
                description,
                image,
                uri,
                price,
                royalty,
                auctions,
                originOfMap.get(tokenId).toString(),
                ownerOfMap.get(tokenId).toString(),
                isAuction);
        return token;
    }

    @Safe
    public static Iterator<ByteString> auctionsOf(ByteString tokenId) {
        return (Iterator<ByteString>) Storage.find(
                ctx.asReadOnly(), createAuctionOfPrefix(tokenId), FindOptions.RemovePrefix);
    }

    // Events

    @DisplayName("Mint")
    private static Event3Args<Hash160, ByteString, String> onMint;

    @DisplayName("Transfer")
    static Event4Args<Hash160, Hash160, Integer, ByteString> onTransfer;

    @DisplayName("TransferFT")
    static Event3Args<Hash160, Hash160, Integer> onTransferFT;
    // Custom Methods

    @Safe
    public static Hash160 contractOwner() {
        return contractOwner;
    }

    public static void mint(Hash160 owner, ByteString tokenId, String properties) {
        assert registryMap.get(tokenId) == null : "This token id already exists.";

        TokenJson tokenJson = (TokenJson) StdLib.jsonDeserialize(properties);

        assert tokenJson.name != null : "The properties must contain a value for the key 'name'.";

        String tokenName = tokenJson.name;
        propertiesNameMap.put(tokenId, tokenName);

        if (tokenJson.description != null) {
            String description = tokenJson.description;
            propertiesDescriptionMap.put(tokenId, description);
        }
        if (tokenJson.image != null) {
            String image = tokenJson.image;
            propertiesImageMap.put(tokenId, image);
        }
        if (tokenJson.tokenURI != null) {
            String tokenURI = tokenJson.tokenURI;
            propertiesTokenURIMap.put(tokenId, tokenURI);
        }

        if (tokenJson.price != null) {
            String price = tokenJson.price;
            propertiesPriceMap.put(tokenId, price);
        }

        if (tokenJson.royalty != null) {
            String royalty = tokenJson.royalty;
            propertiesRoyaltyMap.put(tokenId, royalty);
        }

        if (tokenJson.isAuction != null) {
            String isAuction = tokenJson.isAuction;
            propertiesIsAuctionMap.put(tokenId, isAuction);
        }
        Runtime.log("End of properties settings");
        registryMap.put(tokenId, tokenId.toByteArray());
        ownerOfMap.put(tokenId, owner.toByteArray());
        originOfMap.put(tokenId, owner.toByteArray());
        new StorageMap(ctx, createTokensOfPrefix(owner)).put(tokenId, 1);
        Runtime.log("End of properties set MAP");
        increaseBalanceByOne(owner);
        incrementTotalSupplyByOne();
        onMint.fire(owner, tokenId, properties);
    }

    public static boolean setAuction(Hash160 bider, ByteString tokenId, String auctionPrice) {
        assert auctionPrice != null : "Auction Price can't not be null";
        // Need to validate
        // float ap = Float.valueOf(auctionPrice);
        // ByteString tokenPrice = propertiesPriceMap.get(tokenId);
        // float price = Float.parseFloat(tokenPrice.toString());
        // assert (ap > price) : "Auction Price must be greater than token price";

        // Need to check latest aution price must be greater than previous auction price
        new StorageMap(ctx, createAuctionOfPrefix(tokenId)).put(bider.toByteArray(), auctionPrice);
        return true;
    }

    public static boolean setPriceAndRoyalty(Hash160 address, ByteString tokenId, String price, String royalty) {
        Hash160 owner = ownerOf(tokenId);
        assert owner != null : "This token id does not exist.";
        if (price != null) {
            propertiesPriceMap.put(tokenId, price);
        }

        if (royalty != null) {
            propertiesRoyaltyMap.put(tokenId, royalty);
        }
        return true;
    }

    public static boolean burn(ByteString tokenId) {
        Hash160 owner = ownerOf(tokenId);
        assert owner != null : "This token id does not exist.";
        throwIfSignerIsNotOwner(owner);

        registryMap.delete(tokenId);
        propertiesNameMap.delete(tokenId);
        propertiesDescriptionMap.delete(tokenId);
        propertiesImageMap.delete(tokenId);
        propertiesTokenURIMap.delete(tokenId);
        ownerOfMap.delete(tokenId);

        new StorageMap(ctx, createTokensOfPrefix(owner)).delete(tokenId);
        decreaseBalanceByOne(owner);
        decrementTotalSupplyByOne();
        return true;
    }

    // Private Helper Methods

    private static void throwIfSignerIsNotContractOwner() {
        assert Runtime.checkWitness(contractOwner) : "No authorization.";
    }

    private static void throwIfSignerIsNotOwner(Hash160 owner) {
        assert Runtime.checkWitness(owner) : "No authorization.";
    }

    private static void increaseBalanceByOne(Hash160 owner) {
        balanceMap.put(owner.toByteArray(), balanceOf(owner) + 1);
    }

    private static void decreaseBalanceByOne(Hash160 owner) {
        balanceMap.put(owner.toByteArray(), balanceOf(owner) - 1);
    }

    private static void incrementTotalSupplyByOne() {
        int updatedTotalSupply = contractMap.getInt(totalSupplyKey) + 1;
        contractMap.put(totalSupplyKey, updatedTotalSupply);
    }

    private static void decrementTotalSupplyByOne() {
        int updatedTotalSupply = contractMap.getInt(totalSupplyKey) - 1;
        contractMap.put(totalSupplyKey, updatedTotalSupply);
    }

    private static byte[] createTokensOfPrefix(Hash160 owner) {
        return Helper.concat(tokensOfKey, owner.toByteArray());
    }

    private static byte[] createAuctionOfPrefix(ByteString tokenId) {
        return Helper.concat(auctionOfKey, tokenId);
    }

    // Deploy, Update, and Destroy

    @OnDeployment
    public static void deploy(Object data, boolean update) {
        if (!update) {
            contractMap.put(totalSupplyKey, 0);
        }
    }

    public static void update(ByteString script, String manifest) {
        throwIfSignerIsNotContractOwner();
        ContractManagement.update(script, manifest);
    }

    public static void destroy() {
        throwIfSignerIsNotContractOwner();
        ContractManagement.destroy();
    }

}