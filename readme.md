# Decentralized Escrow Application

[Alchemy University](https://university.alchemy.com) Week 5 final exercise by Eduardo Aire

## Content

1. Frontend - [`/app`](./app/)
2. Escrow contract - [`/contracts`](./contracts/Escrow.sol)
3. Contract tests - [`/tests`](./test/)

### Local Configuration

-   Run `npm install` for hardhat dependencies
-   Run `cd app && npm install` for frontend dependencies

## Hardhat

-   Configuration - [`hardhat.config.js`](./hardhat.config.js)

-   Compile contracts (artifacts will go to `/app`):
    ```Shell
    # With hardhat
    npx hardhat compile
    # With npm scripts
    npm run compile
    ```
-   Test contracts:
    ```Shell
    # With hardhat
    npx hardhat test
    # With npm scripts
    npm run test
    ```
-   Start local node:
    ```Shell
    # With hardhat
    npx hardhat node
    # With npm scripts
    npm run node
    ```

## Front-End

-   Start development host `npm start`
    -   At root level it runs the [npm script `start`](./package.json) which runs `cd app && npm start`
    -   You can `cd app` and run `npm start` as well
-   Go to `http://localhost:3000`
