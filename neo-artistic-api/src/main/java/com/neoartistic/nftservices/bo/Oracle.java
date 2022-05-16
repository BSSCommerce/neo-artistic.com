package com.neoartistic.nftservices.bo;

import java.io.IOException;

import io.neow3j.contract.SmartContract;
import io.neow3j.protocol.Neow3j;
import io.neow3j.protocol.core.response.InvocationResult;
import io.neow3j.protocol.http.HttpService;
import io.neow3j.types.Hash160;

public class Oracle {
	public static Neow3j NEOW3J_TESTNET = Neow3j.build(new HttpService("http://seed2t4.neo.org:20332"));
	public static String getNeoPrice() throws IOException {
		  	Hash160 contractHash = new Hash160("0x2df1b0ec5c5b15183fa26b0c10a098c9af0c829a");
	        SmartContract smartContract = new SmartContract(contractHash, NEOW3J_TESTNET);
	        InvocationResult result = smartContract.callInvokeFunction("getStoredResponse").getInvocationResult();
	        String storedResponse = result.getStack().get(0).getString();
	        System.out.println("Stored response: " + storedResponse);
//	        storedResponse = storedResponse.replaceAll("[", "");
//	        storedResponse = storedResponse.replaceAll("]", "");
	        return storedResponse;
	}
}
