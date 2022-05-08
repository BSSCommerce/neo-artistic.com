import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WalletButton, useWalletModal, WalletConnectButton, WalletIcon, WalletModalButton } from '@rentfuse-labs/neo-wallet-adapter-react-ui';

export const WalletConnectionButton = React.memo(function WalletConnectionButton({ children, ...props }) {
    const { address, wallet, disconnect, connected, select } = useWallet();
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = useState(false);
    const [active, setActive] = useState(false);
    const ref = useRef(null);

    const _address = useMemo(() => address, [address]);
    const content = useMemo(() => {
        if (children) return children;
        if (!wallet || !_address) return null;
        return _address;
    }, [children, wallet, _address]);

    const copyAddress = useCallback(async () => {
        if (_address) {
            await navigator.clipboard.writeText(_address);
            setCopied(true);
            setTimeout(() => setCopied(false), 400);
        }
    }, [_address]);

    const openDropdown = useCallback(() => setActive(true), [setActive]);

    const closeDropdown = useCallback(() => setActive(false), [setActive]);

    const openModal = useCallback(() => {
        setVisible(true);
        closeDropdown();
    }, [setVisible, closeDropdown]);

    const disconnectWallet = useCallback(() => {
        localStorage.removeItem("neoWalletType");
        disconnect();
    });

    useEffect(() => {
        if (connected && wallet.name) {
            localStorage.setItem("neoWalletType", wallet.name);
        }
    }, [connected, wallet]);
    
    useEffect(() => {
		setTimeout(() => {
            let neoWalletType = localStorage.getItem("neoWalletType");
            if (neoWalletType) {
                select(neoWalletType);
            }
		}, 2000)
	}, [])

    useEffect(() => {
        const listener = (event) => {
            const node = ref.current;

            // Do nothing if clicking dropdown or its descendants
            if (!node || node.contains(event.target)) return;

            closeDropdown();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, closeDropdown]);

    if (!wallet) return <WalletModalButton {...props}>{children}</WalletModalButton>;
    if (!_address) return <WalletConnectButton {...props}>{children}</WalletConnectButton>;

    return (
        <div className="wallet-adapter-dropdown">
            <WalletButton
                aria-expanded={active}
                className="wallet-adapter-button-trigger"
                style={{ pointerEvents: active ? 'none' : 'auto', ...props.style }}
                onClick={openDropdown}
                startIcon={<WalletIcon wallet={wallet} />}
                {...props}
            >
                {content}
            </WalletButton>
            <ul
                aria-label="dropdown-list"
                className={`wallet-adapter-dropdown-list ${active && 'wallet-adapter-dropdown-list-active'}`}
                ref={ref}
                role="menu"
            >
                <li onClick={copyAddress} className="wallet-adapter-dropdown-list-item" role="menuitem">
                    {copied ? 'Copied' : 'Copy address'}
                </li>
                <li onClick={openModal} className="wallet-adapter-dropdown-list-item" role="menuitem">
                    Connect a different wallet
                </li>
                <li onClick={disconnectWallet} className="wallet-adapter-dropdown-list-item" role="menuitem">
                    Disconnect
                </li>
            </ul>
        </div>
    );
});
