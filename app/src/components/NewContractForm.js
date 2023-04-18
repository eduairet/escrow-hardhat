import { useContext, useReducer } from 'react';
import { ethers } from 'ethers';
import { EscrowContext } from '../store/escrow-context';
import deploy from '../utils/deploy';

const initialEscrow = {
        arbiter: '',
        beneficiary: '',
        amount: '',
    },
    escrowReducer = (state, action) => {
        return {
            ...state,
            [action.type]: action.payload,
        };
    };

export default function NewContractForm() {
    const escrowCtx = useContext(EscrowContext),
        [newEscrow, dispatchEscrow] = useReducer(escrowReducer, initialEscrow),
        inputFields = [
            {
                label: 'Arbiter Address',
                id: 'arbiter',
                value: newEscrow.arbiter,
            },
            {
                label: 'Beneficiary Address',
                id: 'beneficiary',
                value: newEscrow.beneficiary,
            },
            {
                label: 'Deposit Amount (ETH)',
                id: 'amount',
                value: newEscrow.amount,
            },
        ];

    async function handleNewContract(e) {
        e.preventDefault();

        try {
            const escrowContract = await deploy(
                escrowCtx.signer,
                newEscrow.arbiter,
                newEscrow.beneficiary,
                ethers.utils.parseEther(newEscrow.amount)
            );

            const escrow = {
                address: escrowContract.address,
                arbiter: newEscrow.arbiter,
                beneficiary: newEscrow.beneficiary,
                amount: newEscrow.amount,
                handleApprove: async () => {
                    escrowContract.on('Approved', () => {
                        document.getElementById(
                            escrowContract.address
                        ).className = 'complete';
                        document.getElementById(
                            escrowContract.address
                        ).textContent = "✓ It's been approved!";
                    });
                    const approveTxn = await escrowContract
                        .connect(escrowCtx.signer)
                        .approve();
                    await approveTxn.wait();
                },
            };

            escrowCtx.setEscrows([...escrowCtx.escrows, escrow]);
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <form className='contract' onSubmit={handleNewContract}>
            <h1> New Contract </h1>
            {inputFields.map(input => (
                <label key={input.id}>
                    {input.label}
                    <input
                        type='text'
                        id={input.id}
                        value={input.value}
                        onChange={e =>
                            dispatchEscrow({
                                type: e.target.id,
                                payload: e.target.value,
                            })
                        }
                        required
                    />
                </label>
            ))}
            <button className='button' id='deploy' type='submit'>
                Deploy
            </button>
        </form>
    );
}
