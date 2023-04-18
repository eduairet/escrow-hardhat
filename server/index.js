const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;

app.use(cors());
app.use(express.json());

let escrows = [];

app.post('/new-escrow', (req, res) => {
    const { address, arbiter, beneficiary, amount } = req.body;
    escrows.push({ address, arbiter, beneficiary, amount });
    res.send({ address, arbiter, beneficiary, amount });
});

app.get('/escrows', (req, res) => {
    res.send(escrows);
});

app.get('/escrows/:deployer', (req, res) => {
    const { deployer } = req.params;
    let deployerContracts = escrows.filter(
        escrow => escrow.arbiter.toLowerCase() === deployer.toLowerCase()
    );
    res.send(deployerContracts);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
