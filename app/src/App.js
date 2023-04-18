import { useContext } from 'react';
import { EscrowContext } from './store/escrow-context';
import NewContractForm from './components/NewContractForm';
import ExistingContracts from './components/ExistingContracts';

export default function App() {
    const { provider, account } = useContext(EscrowContext);
    return provider ? (
        <main>
            <h1 className='main-title'>ESCROW CONTRACT FACTORY</h1>
            <p>
                <strong>Signer:</strong> {account}
            </p>
            <NewContractForm />
            <ExistingContracts />
        </main>
    ) : (
        <div className='fixed-container'>
            <p>You need to install a browser wallet to use the DApp</p>
        </div>
    );
}
