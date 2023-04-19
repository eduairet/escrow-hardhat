import { useState, useEffect, useCallback, useContext } from 'react';
import { EscrowContext } from '../store/escrow-context';
import contractInstance from '../utils/contract-instance';

export default function Escrow({ address, arbiter, beneficiary, amount }) {
    const { signer } = useContext(EscrowContext),
        [isApproving, setIsApproving] = useState(false),
        [isApproved, setApproved] = useState(false),
        [isWithdrawing, setIsWithdrawing] = useState(false),
        [isFinished, setFinished] = useState(false),
        checkState = useCallback(async () => {
            const escrowContract = contractInstance(address, signer),
                approved = await escrowContract.isApproved(),
                finished = await escrowContract.isFinished();
            return { escrowContract, approved, finished };
        }, [address, signer]),
        handleApprove = async () => {
            setIsApproving(true);
            try {
                const escrowContract = contractInstance(address, signer);
                const tx = await escrowContract.connect(signer).approve();
                await tx.wait();
                setApproved(true);
            } catch (err) {
                alert(err.message);
            }
            setIsApproving(false);
        },
        handleWithdraw = async () => {
            setIsWithdrawing(true);
            try {
                const escrowContract = contractInstance(address, signer),
                    tx = await escrowContract.connect(signer).withdraw(),
                    receipt = await tx.wait();
                setFinished(true);
                alert(`Success with hash ${receipt.transactionHash}`);
            } catch (err) {
                alert(err.message);
            }
            setIsWithdrawing(false);
        };

    useEffect(() => {
        (async () => {
            const { approved, finished } = await checkState();
            setApproved(approved);
            setFinished(finished);
        })();
    }, [checkState]);

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
                    <div id='approved' className='approved'>
                        <p className='approved-el'>
                            <strong>✓ It's been approved!</strong>
                        </p>
                        {isFinished ? (
                            <p className='approved-el'>
                                <strong>✓ It's isFinished!</strong>
                            </p>
                        ) : (
                            <button
                                className='button approved-el'
                                onClick={async e => {
                                    e.preventDefault();
                                    await handleWithdraw();
                                }}
                                disabled={isWithdrawing}
                            >
                                Withdraw
                            </button>
                        )}
                    </div>
                )}
            </ul>
        </div>
    );
}
