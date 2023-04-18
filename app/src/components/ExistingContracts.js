import { useContext } from 'react';
import { EscrowContext } from '../store/escrow-context';
import Escrow from './Escrow';

export default function ExistingContracts() {
    const escrowCtx = useContext(EscrowContext);
    return (
        <div className='existing-contracts'>
            <h1> Existing Contracts </h1>
            <div id='container'>
                {escrowCtx.escrows.map(escrow => {
                    return <Escrow key={escrow.address} {...escrow} />;
                })}
            </div>
        </div>
    );
}
