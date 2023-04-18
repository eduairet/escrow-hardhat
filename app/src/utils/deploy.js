import { ethers } from 'ethers';
import artifacts from '../artifacts/contracts/Escrow.sol/Escrow';
const { abi, bytecode } = artifacts;

export default async function deploy(signer, arbiter, beneficiary, value) {
    const Escrow = new ethers.ContractFactory(abi, bytecode, signer),
        escrow = await Escrow.deploy(arbiter, beneficiary, {
            value,
        });
    await escrow.deployed();
    return escrow;
}
