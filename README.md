# PolyKye Marketplace Frontend

This repository contains the frontend application for the PolyKye Onchain system, which allows users to submit disease targets, process them through an AI platform, and store results on the blockchain for transparency and provenance.

## Prerequisites

Before running this application, make sure you have:
- [Node.js](https://nodejs.org/) (version 15 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/PolyKye-Onchain.git
cd PolyKye-Onchain/frontend
```

2. Install dependencies:
```bash
npm install
```

## Common Issues

### "vite is not recognized" Error

If you encounter the following error when running `npm run dev`:
```
'vite' is not recognized as an internal or external command,
operable program or batch file.
```

This means the Vite package is not properly installed. To fix this:

1. Make sure you've installed all dependencies:
```bash
npm install
```

2. If the issue persists, try installing Vite explicitly:
```bash
npm install vite
```

3. Alternatively, you can use npx to run Vite:
```bash
npx vite
```

## Running the Application

After installing dependencies, you can start the development server:

```bash
npm run dev
```

The application should now be running at [http://localhost:5173](http://localhost:5173).

## Project Structure

This frontend application is part of the larger PolyKye Onchain system that includes:

- **Smart Contracts**: Solidity contracts for recording disease targets and results
- **Frontend**: React application for user interaction 
- **Off-Chain Processing**: System that processes targets and generates optimal ligands (not in this repo)

## Features

- Submit disease targets to the blockchain
- View processing results including ligand SMILES strings
- Access synthesis pathways stored on IPFS
- Track submission history and status

## Technology Stack

- React.js - Frontend framework
- Vite - Build tool and development server
- ethers.js - Ethereum interaction library
- Solidity - Smart contract language (backend)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
