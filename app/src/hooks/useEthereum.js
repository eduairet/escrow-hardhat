import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const useEthereum = () => {
    const [provider, setProvider] = useState(null),
        [account, setAccount] = useState(null),
        [signer, setSigner] = useState(null),
        getEthereum = useCallback(async () => {
            try {
                const _provider = new ethers.providers.Web3Provider(
                        window.ethereum
                    ),
                    accounts = await _provider.send('eth_requestAccounts', []);
                setProvider(_provider);
                setAccount(accounts[0]);
                setSigner(_provider.getSigner(accounts[0]));
            } catch (err) {
                console.log(err);
            }
        }, []);

    useEffect(() => {
        getEthereum();
    }, [getEthereum]);

    return { provider, account, signer };
};

export default useEthereum;
