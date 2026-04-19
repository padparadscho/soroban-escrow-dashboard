> [!IMPORTANT]  
> This project is in active development and may not have been fully tested. Use at your own risk.

> [!WARNING]
> This project and involved contributors are not affiliated with, endorsed by, or sponsored by Stronghold or any of its affiliates. This is an independent personal project developed for educational and experimental purposes only.

# Soroban Escrow Dashboard

An intuitive dashboard for monitoring a specified **Soroban escrow smart contract**, visualizing historical data, real-time events and transactions.

## Overview

This dashboard displays events emitted by the [Stronghold (SHx) escrow contract](https://stellar.expert/explorer/public/contract/CCA5HAZCPEYXD7JBKAJCVUZUXAK7V5ZFU3QMJO33OJH2OHL3OGLS2P7M) and _first‑hop_ transactions submitted by contract participants.

This project is an extension of the [Soroban Escrow Notifier](https://github.com/padparadscho/soroban-escrow-notifier), providing a comprehensive interface for monitoring escrow activities in real time.

## Features

- Monitors escrow contract events (`lock`, `unlock`) and participant transactions.
- Displays **summary** metrics, including escrowed amount, total value, unit price, total escrows, and contract addresses.
- Renders an interactive time-series **chart** of the escrow balance with selectable time ranges.
- Presents a detailed **events** feed showing amounts, recipients, memos, timestamps, transaction links, etc.

Track ongoing tasks and project progress through the [GitHub Project](https://github.com/users/padparadscho/projects/4/views/2) board and participate in conversations or share your feedback in the dedicated [GitHub Discussions](https://github.com/padparadscho/soroban-escrow-dashboard/discussions) space.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) package manager
- A [soroban-escrow-notifier](https://github.com/padparadscho/soroban-escrow-notifier) instance configured and running
- A populated PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/padparadscho/soroban-escrow-dashboard.git

cd soroban-escrow-dashboard
```

2. Install dependencies:

```bash
pnpm install
```

3. Create and configure the `.env` file with your environment variables:

```bash
cp .env.example .env
```

- For the `SOROBAN_ESCROW_CONTRACT_ID`, refer to the [soroban-escrow-contract](https://github.com/padparadscho/soroban-escrow-contract) repository **OR** download the [WASM code](https://stellar.expert/explorer/public/contract/CCA5HAZCPEYXD7JBKAJCVUZUXAK7V5ZFU3QMJO33OJH2OHL3OGLS2P7M?filter=interface) from the official Stronghold (SHx) escrow contract on mainnet.
- For the `STELLAR_ASSET_CONTRACT_ID`, refer to the [stellar-asset-contract-deployer](https://github.com/padparadscho/stellar-asset-contract-deployer) repository **OR** use the [SHx SAC (Stellar Asset Contract)](https://stellar.expert/explorer/public/contract/CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ) on mainnet.

4. Prepare the database schema, if applicable:

```bash
# Run all pending migrations up
pnpm migrate

# Generate TypeScript types for database tables
pnpm generate-schema
```

### Usage

1. Run in development mode:

```bash
pnpm dev
```

2. Build and run production output:

```bash
pnpm build

pnpm start
```

## Contributing

If you're interested in helping improve this project, see [CONTRIBUTING](/CONTRIBUTING.md).

## License

This project is licensed under the [GPL-3.0 License](/LICENSE).
