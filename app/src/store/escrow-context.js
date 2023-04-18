import React, { useState, useEffect, useCallback } from 'react';
import useEthereum from '../hooks/useEthereum';
import server from '../utils/server';
import Spinner from '../components/Spinner';

export const EscrowContext = React.createContext({
    provider: {},
    account: {},
    signer: {},
    escrows: [],
    setEscrows: () => {},
});

export default function EscrowContextProvider({ children }) {
    const { provider, account, signer } = useEthereum(),
        [escrows, setEscrows] = useState([]),
        [loading, setLoading] = useState([]),
        getEscrows = useCallback(async () => {
            setLoading(true);
            try {
                const accountEscrows = await server.get(`/escrows/${account}`),
                    data = accountEscrows.data;
                setEscrows(data);
            } catch (err) {
                alert(err.message);
            }
            setLoading(false);
        }, [account]);

    useEffect(() => {
        getEscrows();
    }, [getEscrows]);

    return (
        <EscrowContext.Provider
            value={{
                provider,
                account,
                signer,
                escrows,
                setEscrows,
            }}
        >
            {loading ? <Spinner loading={loading} /> : children}
        </EscrowContext.Provider>
    );
}
