import { useState } from 'react';

export default function Escrow({
    address,
    arbiter,
    beneficiary,
    amount,
    handleApprove,
}) {
    const [isApproving, setIsApproving] = useState(false);

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
