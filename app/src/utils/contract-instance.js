import { ethers } from 'ethers';
import artifacts from '../artifacts/contracts/Escrow.sol/Escrow.json';
const { abi } = artifacts;

const contractInstance = (address, signer) => {
    return new ethers.Contract(address, abi, signer);
};

export default contractInstance;
