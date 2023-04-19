const { ethers } = require('hardhat');
const { expect } = require('chai');
const { getSigners, getContractFactory } = ethers;

describe('Escrow', function () {
    let contract, depositor, beneficiary, arbiter;
    const deposit = ethers.utils.parseEther('1');
    beforeEach(async () => {
        [depositor, beneficiary, arbiter] = await getSigners();
        const Escrow = await getContractFactory('Escrow');
        contract = await Escrow.deploy(
            arbiter.getAddress(),
            beneficiary.getAddress(),
            {
                value: deposit,
            }
        );
        await contract.deployed();
    });

    it('should be funded initially', async function () {
        let balance = await ethers.provider.getBalance(contract.address);
        expect(balance).to.eq(deposit);
    });

    describe('after approval from address other than the arbiter', () => {
        it('should revert', async () => {
            await expect(contract.connect(beneficiary).approve()).to.be
                .reverted;
        });
    });

    describe('should be approved', () => {
        it('isApproved is true', async () => {
            const approveTxn = await contract.connect(arbiter).approve();
            await approveTxn.wait();
            const approved = await contract.isApproved();
            expect(approved).to.be.true;
        });
    });

    describe('should withdraw funds', () => {
        it('should transfer balance to beneficiary', async () => {
            const before = await ethers.provider.getBalance(
                beneficiary.getAddress()
            );
            await expect(contract.connect(beneficiary).withdraw()).to.be
                .reverted;
            const approveTxn = await contract.connect(arbiter).approve();
            await approveTxn.wait();
            await expect(contract.connect(arbiter).withdraw()).to.be.reverted;
            const withdrawTx = await contract.connect(beneficiary).withdraw(),
                receipt = await withdrawTx.wait(),
                after = await ethers.provider.getBalance(
                    beneficiary.getAddress()
                ),
                received = ethers.utils.formatEther(after.sub(before));
            expect(+received).to.be.greaterThan(0.9999);
            // Gas makes a slight difference between deposit
            const { events } = receipt,
                withdrawEvent = events.find(ev => ev.event == 'Withdraw'),
                eventVal = withdrawEvent.args[0];
            expect(eventVal).to.eq(deposit);
            expect(await contract.isFinished()).to.be.true;
        });
    });
});
