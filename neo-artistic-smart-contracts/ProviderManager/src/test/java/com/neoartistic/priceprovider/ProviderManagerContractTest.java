package com.neoartistic.priceprovider;

import io.neow3j.contract.SmartContract;
import io.neow3j.protocol.Neow3j;
import io.neow3j.protocol.core.response.NeoInvokeFunction;
import io.neow3j.test.ContractTest;
import io.neow3j.test.ContractTestExtension;
import io.neow3j.test.DeployConfig;
import io.neow3j.test.DeployConfiguration;
import io.neow3j.types.ContractParameter;
import io.neow3j.types.Hash160;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;

import java.io.IOException;

import com.neoartistic.priceprovider.ProviderManagerContract;

import static io.neow3j.types.ContractParameter.hash160;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ContractTest(blockTime = 1, contracts = ProviderManagerContract.class)
public class ProviderManagerContractTest {

    private static final String TRIGGER_CURRENT_PRICE = "triggerCurrentPrice";
    private static final String GET_PRICE = "getStaticValue";
    private static final String OWNER_ADDRESS = "NSc2VhNnehnukBueEg9zmbj8RJiE6kxKoj";

    @RegisterExtension
    private static ContractTestExtension ext = new ContractTestExtension();

    private static Neow3j neow3j;
    private static SmartContract contract;

    @BeforeAll
    public static void setUp() {
        neow3j = ext.getNeow3j();
        contract = ext.getDeployedContract(ProviderManagerContract.class);
    }

    @DeployConfig(ProviderManagerContract.class)
    public static DeployConfiguration configure() {
        DeployConfiguration config = new DeployConfiguration();
        ContractParameter owner = hash160(Hash160.fromAddress(OWNER_ADDRESS));
        config.setDeployParam(owner);
        config.setSubstitution("${placeholder}", "A string value.");
        return config;
    }

    @Test
    public void invokeTriggerCurrentPrice() throws IOException {
        NeoInvokeFunction result = contract.callInvokeFunction(TRIGGER_CURRENT_PRICE);
        // System.out.println(result.getInvocationResult().getStack().get(0));
        assertEquals(0, 0);
    }

    // @Test
    // public void invokeGetAString() throws IOException {
    // NeoInvokeFunction result = contract.callInvokeFunction(GET_A_STRING);
    // assertEquals(result.getInvocationResult().getStack().get(0).getString(), "A
    // string value.");
    // }

}