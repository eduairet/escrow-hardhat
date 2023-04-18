import React, { useState } from 'react';
import useEthereum from '../hooks/useEthereum';

export const EscrowContext = React.createContext({
    provider: {},
    account: {},
    signer: {},
    escrows: [],
    setEscrows: () => {},
});

export default function EscrowContextProvider({ children }) {
    const { provider, account, signer } = useEthereum(),
        [escrows, setEscrows] = useState([]);

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
