package com.neoartistic.nftservices.bo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.neoartistic.nftservices.entity.Auction;
import com.neoartistic.nftservices.entity.NFTToken;

import io.neow3j.contract.SmartContract;
import io.neow3j.crypto.WIF;
import io.neow3j.protocol.Neow3j;
import io.neow3j.protocol.core.response.InvocationResult;
import io.neow3j.protocol.core.response.NeoInvokeFunction;
import io.neow3j.protocol.core.response.NeoSendRawTransaction;
import io.neow3j.protocol.core.stackitem.StackItem;
import io.neow3j.protocol.http.HttpService;
import io.neow3j.transaction.AccountSigner;
import io.neow3j.transaction.Transaction;
import io.neow3j.transaction.TransactionBuilder;
import io.neow3j.types.ContractParameter;
import io.neow3j.types.Hash160;
import io.neow3j.types.Hash256;
import io.neow3j.types.StackItemType;
import io.neow3j.utils.Await;
import io.neow3j.utils.Numeric;
import io.neow3j.wallet.Account;

public class NFT {
	public static Neow3j NEOW3J = Neow3j.build(new HttpService("http://seed2t4.neo.org:20332"));
	public static Hash160 contractHash = new Hash160("0x3b5d1449768a4d4f3aec219874d7ed6ae58d07e4");
	public static Account account = Account.fromWIF("L2ne1nFZLkCNtXhUw4LmgyFyu7hWLZKqpxWmZMmsSiMvTq3agXeu");
	public static SmartContract smartContract = new SmartContract(contractHash, NEOW3J);

	public static boolean trackSentTransaction(NeoSendRawTransaction response) throws IOException {

		System.out.println("####################\n");
		if (response.hasError()) {
			System.out.printf("The neo-node responded with the error message '%s'.%n",
					response.getError().getMessage());
			return false;
		} else {
			Hash256 txHash = response.getSendRawTransaction().getHash();
			System.out.printf("Successfully transmitted the transaction with hash '%s'.%n", txHash);
			System.out.println("Result:" + response.getResult());
			System.out.println("Waiting until transaction is persisted in a block...");
			Await.waitUntilTransactionIsExecuted(txHash, NEOW3J);
			System.out.println(NEOW3J.getTransaction(txHash).send().getTransaction());
			// To check the transaction's status, you can check its application log.
			// -> see the example `GetApplicationLogsForTx.java`
			System.out.println("\n####################");
			return true;
		}
	}

	public static List<NFTToken> getTokens() throws IOException {
		List<NFTToken> tokens = new ArrayList<NFTToken>();
		NeoInvokeFunction response = smartContract.callInvokeFunction("getTokens");
		InvocationResult result = response.getInvocationResult();
		List<StackItem> items = result.getStack().get(0).getList();
		for (StackItem stackItem : items) {
			List<Auction> auctions = new ArrayList<Auction>();
			List<String> attributes = new ArrayList<String>();
			
			for (StackItem nftTokenAttribute : stackItem.getList()) {
			
				if (nftTokenAttribute.getValue() != null) {

					if (nftTokenAttribute.getType() != StackItemType.ARRAY) {

						try {
							attributes.add(nftTokenAttribute.getAddress());
						} catch(Exception e) {
							attributes.add(nftTokenAttribute.getString());	
						}
					} else {
						for (StackItem auctionAttribute : nftTokenAttribute.getList()) {
							if (auctionAttribute.getValue() != null) {

								auctions.add(new Auction(auctionAttribute.getList().get(0).getString(),
										auctionAttribute.getList().get(1).getString()));

							}

						}

					}

				}
				
			}
			if (attributes.size() > 0) {
				NFTToken token = new NFTToken(attributes.get(0), attributes.get(1), attributes.get(2), attributes.get(3),
						attributes.get(4), attributes.get(5), attributes.get(6), auctions, attributes.get(7),
						attributes.get(8), attributes.get(9));
				tokens.add(token);
			}
			
		}

		return tokens;
	}

	public static List<NFTToken> getTokensOf(String address) throws IOException {
		
		Account account = Account.fromAddress(address);
		ContractParameter accountParam = ContractParameter.hash160(account);
		List<ContractParameter> params = Arrays.asList(accountParam);
		NeoInvokeFunction response = smartContract.callInvokeFunction("tokensOf", params);
		List<NFTToken> tokens = new ArrayList<NFTToken>();
		InvocationResult result = response.getInvocationResult();
		List<StackItem> items = result.getStack().get(0).getList();
		for (StackItem stackItem : items) {
			List<Auction> auctions = new ArrayList<Auction>();
			List<String> attributes = new ArrayList<String>();
			
			for (StackItem nftTokenAttribute : stackItem.getList()) {
			
				if (nftTokenAttribute.getValue() != null) {

					if (nftTokenAttribute.getType() != StackItemType.ARRAY) {
						try {
							attributes.add(nftTokenAttribute.getAddress());
						} catch(Exception e) {
							attributes.add(nftTokenAttribute.getString());	
						}
					

					} else {
						for (StackItem auctionAttribute : nftTokenAttribute.getList()) {
							if (auctionAttribute.getValue() != null) {

								auctions.add(new Auction(auctionAttribute.getList().get(0).getString(),
										auctionAttribute.getList().get(1).getString()));

							}

						}

					}

				}
				
			}
			if (attributes.size() > 0) {
				NFTToken token = new NFTToken(attributes.get(0), attributes.get(1), attributes.get(2), attributes.get(3),
						attributes.get(4), attributes.get(5), attributes.get(6), auctions, attributes.get(7).toString(),
						attributes.get(8), attributes.get(9));
				tokens.add(token);
			}
			
		}

		return tokens;

	}

	public static boolean mint(NFTToken nftToken) throws Throwable {
		ContractParameter owner = ContractParameter.hash160(account.getScriptHash());
		String tokenIdString = "token-" + new Date().getTime();
		ContractParameter tokenId = ContractParameter.byteArrayFromString(tokenIdString);
		System.out.println(tokenIdString);

		Map<String, String> propertiesMap = new HashMap<>();
//		propertiesMap.put("name", nftToken.name);
//		propertiesMap.put("description", nftToken.description);
//		propertiesMap.put("image", nftToken.image);
//		propertiesMap.put("tokenURI", nftToken.tokenURI);
//		propertiesMap.put("price", nftToken.price);
//		propertiesMap.put("royalty", nftToken.royalty);
		
		
		propertiesMap.put("name", "My First NFT in My Collection");
		propertiesMap.put("description", "An example for Cyber Punk");
		propertiesMap.put("image", "https://crustwebsites.net/ipfs/QmWDe74f5wNmz7FUEs6RL7S2yoCznPjWd3L2kqmoyNN34x");
		propertiesMap.put("tokenURI", "https://crustwebsites.net/ipfs/QmWDe74f5wNmz7FUEs6RL7S2yoCznPjWd3L2kqmoyNN34x");
		propertiesMap.put("price", "2");
		propertiesMap.put("royalty", "10");

		ContractParameter properties = ContractParameter.map(propertiesMap);

		List<ContractParameter> params = Arrays.asList(owner, tokenId, properties);

		TransactionBuilder transactionBuilder = new TransactionBuilder(NEOW3J);

		byte[] invokeScript = smartContract.buildInvokeFunctionScript("mint",
				ContractParameter.hash160(account.getScriptHash()),
				ContractParameter.byteArrayFromString(tokenIdString), ContractParameter.map(propertiesMap));
		transactionBuilder.extendScript(invokeScript);
		Transaction tx = transactionBuilder.signers(AccountSigner.calledByEntry(account)).sign();
		NeoSendRawTransaction response = tx.send();
		Boolean result = trackSentTransaction(response);
		return result;
	}

	public NFTToken getProperties(String tokenIdString) throws IOException {
		ContractParameter tokenId = ContractParameter.byteArrayFromString(tokenIdString);
		List<ContractParameter> params = Arrays.asList(tokenId);
		NeoInvokeFunction response = smartContract.callInvokeFunction("properties", params);
		StackItem stackItem = response.getInvocationResult().getStack().get(0);
		List<Auction> auctions = new ArrayList<Auction>();
		List<String> attributes = new ArrayList<String>();
		for (StackItem nftTokenAttribute : stackItem.getList()) {
			if (nftTokenAttribute.getValue() != null) {

				if (nftTokenAttribute.getType() != StackItemType.ARRAY) {

					try {
						attributes.add(nftTokenAttribute.getAddress());
					} catch(Exception e) {
						attributes.add(nftTokenAttribute.getString());	
					}

				} else {
					for (StackItem auctionAttribute : nftTokenAttribute.getList()) {
						if (auctionAttribute.getValue() != null) {

							auctions.add(new Auction(auctionAttribute.getList().get(0).getAddress(),
									auctionAttribute.getList().get(1).getString()));

						}

					}

				}

			}

		}
		if (attributes.size() > 0) {
			NFTToken token = new NFTToken(attributes.get(0), attributes.get(1), attributes.get(2), attributes.get(3),
					attributes.get(4), attributes.get(5), attributes.get(6), auctions, attributes.get(7),
					attributes.get(8), attributes.get(9));
			return token;
		}

		return null;
	}
	
	public boolean setAuction(String tokenIdString, String auctionPriceString) throws Throwable {
		Account account = Account.fromWIF("KxY5ZnMoUQsTmfut6Sa5Xi9LHeAGs7bMACxx3smFzESXHo8jM29E");
		ContractParameter bider = ContractParameter.hash160(account);
		ContractParameter tokenId = ContractParameter.byteArrayFromString(tokenIdString);
		ContractParameter auctionPrice = ContractParameter.string(auctionPriceString);
		System.out.println(tokenIdString);
		
		TransactionBuilder transactionBuilder = new TransactionBuilder(NEOW3J);
			
		byte[] invokeScript = smartContract.buildInvokeFunctionScript("setAuction",
				bider,
				tokenId,
				auctionPrice
				);
		transactionBuilder.extendScript(invokeScript);
		
		Transaction tx = transactionBuilder.signers(AccountSigner.calledByEntry(account)).sign();
		
		NeoSendRawTransaction response = tx.send();
		
		return trackSentTransaction(response);
	}

}
