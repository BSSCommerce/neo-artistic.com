package com.neoartistic.binance;

import io.neow3j.devpack.Block;
import io.neow3j.devpack.ByteString;
import io.neow3j.devpack.Contract;
import io.neow3j.devpack.Hash160;
import io.neow3j.devpack.Runtime;
import io.neow3j.devpack.Storage;
import io.neow3j.devpack.StringLiteralHelper;
import io.neow3j.devpack.annotations.DisplayName;
import io.neow3j.devpack.annotations.ManifestExtra;
import io.neow3j.devpack.annotations.Permission;
import io.neow3j.devpack.annotations.Safe;
import io.neow3j.devpack.constants.CallFlags;
import io.neow3j.devpack.constants.NativeContract;
import io.neow3j.devpack.constants.OracleResponseCode;
import io.neow3j.devpack.contracts.ContractManagement;
import io.neow3j.devpack.contracts.LedgerContract;
import io.neow3j.devpack.contracts.OracleContract;
import io.neow3j.devpack.contracts.StdLib;
import io.neow3j.devpack.Helper;

@DisplayName("bss.neo.BinanceManagerContract")
@Permission(contract = "*")
public class BinanceProviderContract {

    static final Hash160 contractOwner = StringLiteralHelper.addressToScriptHash("Nj8kmumTe8y4vLt4tmtvHva9U81m8tiz85");
    // Original Contract Hex must be removed first two character (0x) then this
    // address must be converted to little-endian
    // static final Hash160 providerRegistry = new Hash160(
    // Helper.reverse(
    // StringLiteralHelper.hexToBytes("c678f501e840dcac9d64a489db9531f57a721922").toByteArray()));
    static int gasForResponse = OracleContract.MinResponseFee;

    public static void getPriceRequest(String symbol) {
        String prefixPriceUrl = "https://api.binance.com/api/v3/klines?interval=1m&limit=1";
        String prefixPriceInstId = "&symbol=";
        String prefixPriceTime = "&endTime=";
        String filter = "$[0][4]";
        String newSymbol = standardizeSymbol(symbol);
        int currentIndex = LedgerContract.currentIndex();
        Block block = LedgerContract.getBlock(currentIndex);
        if (block == null) {
            Runtime.log("Could not find block");
        }
        int timestamp = block.timestamp;
        String symbolUrl = prefixPriceUrl + prefixPriceInstId + newSymbol + prefixPriceTime
                + StdLib.itoa(timestamp, 10);
        OracleContract.request(symbolUrl, filter, "callback", null, gasForResponse);
    }

    public static void callback(String url, Object userData, int responseCode, ByteString response) {
        Storage.put(Storage.getStorageContext(), 0, url);
        Storage.put(Storage.getStorageContext(), 1, responseCode);
        Storage.put(Storage.getStorageContext(), 2, response);
    }

    public static String getStoredUrl() {
        return Storage.getString(Storage.getReadOnlyContext(), 0);
    }

    public static int getStoredResponseCode() {
        return Storage.getIntOrZero(Storage.getReadOnlyContext(), 1);
    }

    public static ByteString getStoredResponse() {
        return Storage.get(Storage.getReadOnlyContext(), 2);
    }

    private static void throwIfSignerIsNotContractOwner() {
        assert Runtime.checkWitness(contractOwner) : "No authorization.";
    }

    public static void destroy() {
        throwIfSignerIsNotContractOwner();
        ContractManagement.destroy();
    }

    private static String standardizeSymbol(String symbol) {
        String[] data = StdLib.stringSplit(symbol, "-");
        return data[0] + data[1];
    }
}