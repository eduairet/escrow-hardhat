import { useState, useContext } from 'react';
import { EscrowContext } from '../store/escrow-context';
import { ethers } from 'ethers';
import artifacts from '../artifacts/contracts/Escrow.sol/Escrow.json';
const { abi } = artifacts;

export default function Escrow({ address, arbiter, beneficiary, amount }) {
    const escrowCtx = useContext(EscrowContext),
        [isApproving, setIsApproving] = useState(false),
        handleApprove = async () => {
            setIsApproving(true);
            try {
                const escrowContract = new ethers.Contract(
                    address,
                    abi,
                    escrowCtx.signer
                );
                escrowContract.on('Approved', () => {
                    document.getElementById(address).classList.add('invisible');
                    const successEl = document.getElementById('approved');
                    successEl.className = 'complete';
                    successEl.textContent = "✓ It's been approved!";
                });
                const approveTxn = await escrowContract
                    .connect(escrowCtx.signer)
                    .approve();
                await approveTxn.wait();
            } catch (err) {
                alert(err.message);
                setIsApproving(false);
            }
        };

    return (
        <div className='existing-contract'>
            <ul className='fields'>
                <li>
                    <div> Arbiter </div>
                    <div> {arbiter} </div>
                </li>
                <li>
                    <div> Beneficiary </div>
                    <div> {beneficiary} </div>
                </li>
                <li>
                    <div> Value </div>
                    <div> {amount} </div>
                </li>
                <button
                    className='button'
                    id={address}
                    onClick={async e => {
                        e.preventDefault();
                        await handleApprove(setIsApproving);
                    }}
                    disabled={isApproving}
                >
                    {isApproving ? 'Wait...' : 'Approve'}
                </button>
                <div id='approved' className='invisible'></div>
            </ul>
        </div>
    );
}
