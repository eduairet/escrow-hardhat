import { useState, useEffect, useCallback, useContext } from 'react';
import { EscrowContext } from '../store/escrow-context';
import { ethers } from 'ethers';
import artifacts from '../artifacts/contracts/Escrow.sol/Escrow.json';
const { abi } = artifacts;

export default function Escrow({ address, arbiter, beneficiary, amount }) {
    const { signer } = useContext(EscrowContext),
        [isApproving, setIsApproving] = useState(false),
        [isApproved, setApproved] = useState(false),
        checkApproved = useCallback(async () => {
            const escrowContract = new ethers.Contract(address, abi, signer);
            const approved = await escrowContract.isApproved();
            return { escrowContract, approved };
        }, [address, signer]),
        handleApprove = async () => {
            setIsApproving(true);
            try {
                const { escrowContract, approved } = await checkApproved();
                if (approved) {
                    setApproved(approved);
                } else {
                    escrowContract.on('Approved', setApproved);
                    const approveTxn = await escrowContract
                        .connect(signer)
                        .approve();
                    await approveTxn.wait();
                    setApproved(true);
                }
            } catch (err) {
                alert(err.message);
                setIsApproving(false);
            }
        };

    useEffect(() => {
        (async () => {
            const { approved } = await checkApproved();
            setApproved(approved);
        })();
    }, [checkApproved, setApproved]);

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
                {!isApproved ? (
                    <button
                        className='button'
                        id={address}
                        onClick={async e => {
                            e.preventDefault();
                            await handleApprove();
                        }}
                        disabled={isApproving}
                    >
                        {isApproving ? 'Wait...' : 'Approve'}
                    </button>
                ) : (
                    <div id='approved' className='complete'>
                        ✓ It's been approved!
                    </div>
                )}
            </ul>
        </div>
    );
}
