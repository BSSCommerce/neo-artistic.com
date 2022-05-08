import { waitTx, WitnessScope, WalletNotConnectedError } from '@rentfuse-labs/neo-wallet-adapter-base';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { u, sc, wallet } from '@cityofzion/neon-js';
import React, { useCallback } from 'react';

export const NeoSendButton = () => {
    const { address, connected, invoke } = useWallet();

    const onClick = useCallback(() => {
        if (!address || !connected) throw new WalletNotConnectedError();

        // Construct the request and invoke it
        invoke({
            scriptHash: 'ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
            operation: 'transfer',
            args: [
                {
                    type: 'Hash160',
                    value: sc.ContractParam.hash160(address).toJson().value,
                },
                {
                    type: 'Hash160',
                    value: sc.ContractParam.hash160('NaUjKgf5vMuFt7Ffgfffcpc41uH3adx1jq').toJson().value,
                },
                {
                    type: 'Integer',
                    value: sc.ContractParam.integer(1).toJson().value,
                },
                {
                    type: 'Any',
                    value: null,
                },
            ],
            signers: [
                {
                    account: wallet.getScriptHashFromAddress(address),
                    scopes: WitnessScope.CalledByEntry,
                },
            ],
        });
    }, [address, connected, invoke]);

    return (
        <button onClick={onClick} disabled={!address || !connected}>
            {'Send 1 Neo!'}
        </button>
    );
};