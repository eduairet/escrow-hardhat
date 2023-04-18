const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;

app.use(cors());
app.use(express.json());

class Escrow {
    constructor(address, arbiter, beneficiary, amount) {
        this.address = address;
        this.arbiter = arbiter;
        this.beneficiary = beneficiary;
        this.amount = amount;
    }
}

let escrows = [];

app.post('/new-escrow', (req, res) => {
    const { address, arbiter, beneficiary, amount } = req.body;
    const newContract = new Escrow(address, arbiter, beneficiary, amount);
    escrows.push(newContract);
    res.send({ address, arbiter, beneficiary, amount });
});

app.get('/escrows/:deployer', (req, res) => {
    const { deployer } = req.params;
    let deployerContracts = escrows.filter(
        escrow => escrow.address === deployer
    );
    res.send(deployerContracts);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
