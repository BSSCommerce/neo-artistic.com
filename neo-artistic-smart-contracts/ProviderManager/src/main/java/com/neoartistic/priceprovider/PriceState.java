package com.neoartistic.priceprovider;

import io.neow3j.devpack.Runtime;

public class PriceState {
    private String currentPrice;
    private int expiration;

    public String getCurrentPrice() {
        return currentPrice;
    }

    public int getExpiration() {
        return expiration;
    }

    public void setCurrentPrice(String currentPrice) {
        this.currentPrice = currentPrice;
    }

    public void setExpiration(int expiration) {
        this.expiration = expiration;
    }

    public PriceState(String currentPrice, int expiration) {
        this.currentPrice = currentPrice;
        this.expiration = expiration;
    }

    public void ensureNotExpired() {
        assert (Runtime.getTime() >= expiration) : "The name has expired.";
    }
}
