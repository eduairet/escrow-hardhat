import { useContext, useReducer } from 'react';
import { EscrowContext } from '../store/escrow-context';
import deploy from '../utils/deploy';

const initialEscrow = {
    arbiter: '',
    beneficiary: '',
    amount: '',
};

const escrowReducer = (state, action) => {
    return { ...state, [action.type]: action.payload };
};

export default function NewContractForm() {
    const escrowCtx = useContext(EscrowContext),
        [newEscrow, dispatchEscrow] = useReducer(escrowReducer, initialEscrow);

    async function handleNewContract(e) {
        e.preventDefault();

        const escrowContract = deploy(
            escrowCtx.signer,
            newEscrow.arbiter,
            newEscrow.beneficiary,
            newEscrow.value
        );

        const escrow = {
            address: escrowContract.address,
            arbiter: newEscrow.arbiter,
            beneficiary: newEscrow.beneficiary,
            value: newEscrow.value.toString(),
            handleApprove: async () => {
                escrowContract.on('Approved', () => {
                    document.getElementById(escrowContract.address).className =
                        'complete';
                    document.getElementById(escrowContract.address).innerText =
                        "✓ It's been approved!";
                });
                const approveTxn = await escrowContract
                    .connect(escrowCtx.signer)
                    .approve();
                await approveTxn.wait();
            },
        };

        escrowCtx.setEscrows([...escrowCtx.escrows, escrow]);
    }

    return (
        <form className='contract' onSubmit={handleNewContract}>
            <h1> New Contract </h1>
            <label>
                Arbiter Address
                <input
                    type='text'
                    id='arbiter'
                    value={newEscrow.arbiter}
                    onChange={e =>
                        dispatchEscrow(newEscrow, {
                            type: e.target.id,
                            payload: e.target.value,
                        })
                    }
                    required
                />
            </label>
            <label>
                Beneficiary Address
                <input
                    type='text'
                    id='beneficiary'
                    value={newEscrow.beneficiary}
                    onChange={e =>
                        dispatchEscrow(newEscrow, {
                            type: e.target.id,
                            payload: e.target.value,
                        })
                    }
                    required
                />
            </label>
            <label>
                Deposit Amount (in ETH)
                <input
                    type='number'
                    id='amount'
                    min='0.0001'
                    value={newEscrow.amount}
                    onChange={e =>
                        dispatchEscrow(newEscrow, {
                            type: e.target.id,
                            payload: e.target.value,
                        })
                    }
                    required
                />
            </label>
            <button className='button' id='deploy' type='submit'>
                Deploy
            </button>
        </form>
    );
}
