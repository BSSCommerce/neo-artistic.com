package com.neoartistic.priceprovider;

import io.neow3j.devpack.annotations.DisplayName;
import io.neow3j.devpack.annotations.ManifestExtra;
import io.neow3j.devpack.annotations.OnDeployment;
import io.neow3j.devpack.annotations.Permission;
import io.neow3j.devpack.annotations.Permission.Permissions;
import io.neow3j.devpack.constants.CallFlags;
import io.neow3j.devpack.constants.FindOptions;
import io.neow3j.devpack.contracts.ContractManagement;
import io.neow3j.devpack.contracts.CryptoLib;
import io.neow3j.devpack.contracts.LedgerContract;
import io.neow3j.devpack.contracts.StdLib;
import io.neow3j.utils.BigIntegers;

import java.math.BigInteger;

import io.neow3j.devpack.ByteString;
import io.neow3j.devpack.Contract;
import io.neow3j.devpack.Hash160;
import io.neow3j.devpack.Helper;
import io.neow3j.devpack.Iterator;
import io.neow3j.devpack.List;
import io.neow3j.devpack.Map;
import io.neow3j.devpack.Runtime;
import io.neow3j.devpack.Storage;
import io.neow3j.devpack.StorageMap;
import io.neow3j.devpack.StringLiteralHelper;


@DisplayName("bss.neo.ProviderManagerContract")
@Permission(contract = "*")
public class ProviderManagerContract {

    private static final ByteString prefixProvider = new ByteString(0x01);
    private static final ByteString prefixSymbol = new ByteString(0x02);
    private static final String prefixBlock = "block";

    private static final String prefixPrice = "price";

    private static StorageMap providers = new StorageMap(Storage.getStorageContext(), prefixProvider);

    private static StorageMap symbols = new StorageMap(Storage.getStorageContext(), prefixSymbol);

    private static final int oneYear = 365 * 24 * 3600 * 1000;

    static final Hash160 contractOwner = StringLiteralHelper.addressToScriptHash("NiHoJqP5t6BFpC1EbsQVq9T8gthDg4tSMT");

    @OnDeployment
    public static void deploy(Object data, boolean update) {
        if (update) {
            return;
        }
        symbols.put("BTC-USDT", 0);
        symbols.put("ETH-USDT", 0);
        symbols.put("NEO-USDT", 0);
        symbols.put("GAS-USDT", 0);
        Storage.put(Storage.getStorageContext(), prefixBlock, 0);

    }

    private static void throwIfSignerIsNotContractOwner() {
        assert Runtime.checkWitness(contractOwner) : "No authorization.";
    }

    public static void destroy() {
        throwIfSignerIsNotContractOwner();
        ContractManagement.destroy();
    }

    public static void update(ByteString nefFile, String manifest, Object data) {
        throwIfSignerIsNotContractOwner();
        ContractManagement.update(nefFile, manifest, data);
    }

    private static ByteString getKey(String data) {
        return CryptoLib.ripemd160(new ByteString(data));
    }

    // Handle Price only

    public static int triggerCurrentPrice(String symbol) {
        throwIfSignerIsNotContractOwner();
        assert (symbols.get(symbol) != null) : "Symbol has not registered";
        Runtime.log("Trigger price 1");
        List<String> registeredProviders = getRegisteredProviders();
        int currentIndex = LedgerContract.currentIndex();
        Runtime.log("Trigger price 2");
        for (String provider : registeredProviders.toArray()) {
            Runtime.log("Trigger 3");
            int it = StdLib.atoi(provider, 16);
            byte[] bytearray = BigIntegers.toLittleEndianByteArray(it);
            Hash160 providerAddress = new Hash160(StringLiteralHelper.hexToBytes(provider));
            Runtime.log("Trigger 4");
            Contract.call(providerAddress, "getPriceRequest", CallFlags.All, new Object[] {
                    currentIndex,
                    symbol

            });
            Runtime.log("Trigger 5");
        }
        return currentIndex;
    }

    public static void updatePriceByProvider(String blockIndex, String symbol, String currentPrice) {
        assert (symbols.get(symbol) != null) : "The symbol does not exist";
        Hash160 provider = Runtime.getCallingScriptHash();
        assert (providers.get(provider.toByteString()) != null) : "The provider does not exist";
        StorageMap priceList = new StorageMap(Storage.getStorageContext(), provider.toByteString());

        PriceState state = new PriceState(currentPrice, Runtime.getTime() + oneYear);

        byte[] key = Helper.concat(getKey(symbol).toByteArray(), getKey(blockIndex).toByteArray());
        Storage.put(Storage.getStorageContext(), prefixBlock, blockIndex);
        priceList.put(key, StdLib.serialize(state));
        Storage.put(Storage.getStorageContext(), prefixPrice, blockIndex + "_" + currentPrice);
    }

    public static Object getPrice(String symbol, String blockIndex, String[] requiredProviders) {
        assert (symbols.get(symbol) != null) : "The symbol does not exist";
        Map<String, String> priceMap = new Map<>();
        byte[] recordKey = Helper.concat(getKey(symbol).toByteArray(), getKey(blockIndex).toByteArray());

        if (providers != null && requiredProviders.length > 0) {
            for (String key : requiredProviders) {
                assert (providers.get(key) != null) : "The provider does not exist";
                getPriceByProvider(key, recordKey, priceMap);
            }
        } else {
            String[] registeredProvider = getRegisteredProviders().toArray();
            for (String provider : registeredProvider) {
                getPriceByProvider(provider, recordKey, priceMap);
            }
        }

        return priceMap;

    }

    private static void getPriceByProvider(String provider, byte[] recordKey, Map<String, String> priceMap) {
        StorageMap priceList = new StorageMap(Storage.getStorageContext(), provider);
        assert (priceList.get(recordKey) != null) : "The price of the symbol and blockIndex does not exist";
        PriceState price = (PriceState) StdLib.deserialize(priceList.get(recordKey));
        price.ensureNotExpired();
        priceMap.put(provider, price.getCurrentPrice());
    }

    // Handle Registered Providers
    public static boolean registerProvider(String provider) {
        throwIfSignerIsNotContractOwner();
        assert (providers.get(provider) == null) : "The provider is already exist";
        providers.put(provider, provider);
        return true;
    }

    public static boolean unRegisterProvider(String provider) {
        throwIfSignerIsNotContractOwner();
        assert (providers.get(provider) != null) : "The provider does not exist";
        providers.delete(provider);
        return true;
    }

    public static List<String> getRegisteredProviders() {
        List<String> rps = new List<>();
        Iterator providerList = providers.find(FindOptions.RemovePrefix);
        while (providerList.next()) {
            rps.add((String) providerList.get());
        }
        return rps;
    }

    // Handle Symbols

    public static boolean addSymbol(String symbol) {
        throwIfSignerIsNotContractOwner();
        assert (symbols.get(symbol) == null) : "The symbol already exists";
        symbols.put(symbol, 0);
        return true;
    }

    public static boolean removeSymbol(String symbol) {
        throwIfSignerIsNotContractOwner();
        assert (symbols.get(symbol) != null) : "The symbol does not exist";
        symbols.delete(symbol);
        return true;
    }

    public static List<String> getRegisteredSymbols() {
        Runtime.log("Get Registered Symbols");
        List<String> rps = new List<>();
        Iterator symbolList = symbols.find(FindOptions.RemovePrefix);
        while (symbolList.next()) {
        rps.add((String) symbolList.get());
        }
        return rps;
    }
}