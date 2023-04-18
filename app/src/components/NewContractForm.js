import { useState, useContext, useReducer } from 'react';
import { ethers } from 'ethers';
import { EscrowContext } from '../store/escrow-context';
import deploy from '../utils/deploy';
import server from '../utils/server';

const initialEscrow = {
        arbiter: '',
        arbiterIsValid: null,
        beneficiary: '',
        beneficiaryIsValid: null,
        amount: '',
        amountIsValid: null,
    },
    escrowReducer = (state, action) => {
        return action.type === 'submit'
            ? { ...initialEscrow }
            : {
                  ...state,
                  [action.type]: action.payload,
                  [`${action.type}IsValid`]:
                      action.type === 'amount'
                          ? /^\d+(?:\.\d+)?$/.test(action.payload)
                          : ethers.utils.isAddress(action.payload),
              };
    };

export default function NewContractForm() {
    const escrowCtx = useContext(EscrowContext),
        [newEscrow, dispatchEscrow] = useReducer(escrowReducer, initialEscrow),
        [isDeploying, setIsDeploying] = useState(false),
        isValid = () => {
            const { arbiterIsValid, beneficiaryIsValid, amountIsValid } =
                newEscrow;
            return arbiterIsValid && beneficiaryIsValid && amountIsValid;
        },
        inputFields = [
            {
                label: 'Arbiter Address',
                id: 'arbiter',
                value: newEscrow.arbiter,
                isValid: newEscrow.arbiterIsValid,
            },
            {
                label: 'Beneficiary Address',
                id: 'beneficiary',
                value: newEscrow.beneficiary,
                isValid: newEscrow.beneficiaryIsValid,
            },
            {
                label: 'Deposit Amount (ETH)',
                id: 'amount',
                value: newEscrow.amount,
                isValid: newEscrow.amountIsValid,
            },
        ];

    async function handleNewContract(e) {
        e.preventDefault();
        setIsDeploying(true);
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
            };
            await server.post('/new-escrow', escrow);
            escrowCtx.setEscrows([...escrowCtx.escrows, escrow]);
            dispatchEscrow({ type: 'submit', payload: null });
        } catch (err) {
            alert(err.message);
        }
        setIsDeploying(false);
    }

    return (
        <form className='contract' onSubmit={handleNewContract}>
            <h1> New Contract </h1>
            {inputFields.map(input => (
                <label
                    key={input.id}
                    className={
                        input.isValid || input.isValid == null
                            ? ''
                            : 'invalid-text'
                    }
                >
                    {input.label}
                    <input
                        className={
                            input.isValid || input.isValid == null
                                ? ''
                                : 'invalid-border invalid-text'
                        }
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
            <button
                className='button'
                id='deploy'
                type='submit'
                disabled={!isValid() || isDeploying}
            >
                {isDeploying ? 'Wait...' : 'Deploy'}
            </button>
        </form>
    );
}
