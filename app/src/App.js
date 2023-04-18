import { useContext } from 'react';
import { EscrowContext } from './store/escrow-context';
import NewContractForm from './components/NewContractForm';
import ExistingContracts from './components/ExistingContracts';

export default function App() {
    const escrowCtx = useContext(EscrowContext);
    return escrowCtx.provider ? (
        <>
            <NewContractForm />
            <ExistingContracts />
        </>
    ) : (
        <p>You need to install a browser wallet to build the escrow dapp</p>
    );
}
