import React, { useState, useEffect, useCallback } from 'react';
import useEthereum from '../hooks/useEthereum';
import server from '../utils/server';

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
        getEscrows = useCallback(async () => {
            try {
                const accountEscrows = await server.get(`/escrows/${account}`),
                    data = accountEscrows.data;
                setEscrows(data);
            } catch (err) {
                alert(err.message);
            }
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
            {children}
        </EscrowContext.Provider>
    );
}
