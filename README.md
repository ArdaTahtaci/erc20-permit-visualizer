Permit Visualizer – ERC-20 Permit Explorer & Signer

A lightweight, modern UI for exploring ERC-20 Permit (EIP-2612) data, visualizing allowances, and generating gasless approval signatures using EIP-712 structured data. Then seamlessly submitting the permit on-chain.

This project demonstrates a complete end-to-end flow:

✔ Querying permit metadata via a custom on-chain AllowanceLens
✔ Generating EIP-712 permit signatures using wagmi + RainbowKit
✔ Submitting the signed permit() transaction on Base Sepolia
✔ Real-time allowance updates and nonce/domain visualization

This is a practical, minimal, production-ready example of “Approve Without Approval” — modern token UX used by systems like Uniswap, Aave, Permit2, etc.

🚀 Features
🔍 Permit View Extraction

A custom smart contract (AllowanceLens) fetches all permit-related info in one call:

allowance

nonce

DOMAIN_SEPARATOR

token name & symbol

owner / spender addresses

✍️ EIP-712 Permit Signature

Frontend generates structured signature:

Permit(owner, spender, value, nonce, deadline)


via signTypedData() — gasless and wallet-native.

🔗 On-Chain Permit Submission

Submit the signed message to the permit() function of the deployed ERC-20.

Allowance updates instantly.

💳 Wallet Integration (RainbowKit)

Connect any wallet (Metamask, Coinbase Wallet, WalletConnect, etc.)

🎨 Polished UI / UX

Tailwind CSS

Animated backgrounds

Live feedback for fetching, signing, and submitting

Clean two-panel layout

📦 Tech Stack

Smart Contracts

Solidity (Foundry)

Base Sepolia Testnet

Custom Permit-enabled ERC-20

AllowanceLens (view helper)

Frontend

React + Vite

TypeScript

Wagmi v2

RainbowKit

Viem

TailwindCSS

📜 Contract Addresses (Base Sepolia)
Contract	Address
PermitERC20	0xc3401990D12371AC87EE5C37774f693a9211f6B5
AllowanceLens	0xAce360Ef4E7f41540eACe13f999595FBDcebD174

Both contracts are successfully verified on Blockscout.

📁 Project Structure
contracts/
  ├── src/
  │    ├── tokens/PermitERC20.sol
  │    └── visualizer/AllowanceLens.sol
  └── script/Deploy.s.sol

frontend/
  ├── src/
  │    ├── components/
  │    │     ├── AddressInput.tsx
  │    │     ├── ViewCard.tsx
  │    │     ├── PermitSigner.tsx
  │    │     └── PermitSubmitter.tsx
  │    ├── hooks/usePermitView.ts
  │    ├── abi/
  │    └── App.tsx
  ├── public/
  └── main.tsx

🛠 Running Locally
1. Install deps
cd frontend
npm install

2. Create .env for wagmi / RPC
VITE_PUBLIC_RPC_URL=https://sepolia.base.org

3. Start dev server
npm run dev


Frontend will run on:

http://localhost:5173

🔄 How the Permit Flow Works
1. Fetch Permit Data

User submits token / owner / spender.
UI queries AllowanceLens → returns:

allowance

nonce

domain separator

metadata

addresses

2. Sign Permit (off-chain, gasless)

User enters:

value

deadline

RainbowKit requests signature via:

walletClient.signTypedData(...)


Result: v, r, s

3. Submit Permit Transaction

UI calls:

permit(owner, spender, value, deadline, v, r, s)


The ERC-20 updates allowance and nonce.
UI refreshes automatically.

You now have a working Approve-Without-Approval system.

📸 Screenshots

(You can add your own screenshots here later.)

🎯 Summary

This mini-project teaches every step of modern ERC-20 token UX:

Building a Permit-enabled ERC-20

Visualizing allowances & metadata

Creating EIP-712 signatures

Submitting on-chain permit transactions

Coordinating contracts + viem + wagmi

Deploying on Base Sepolia

Perfect for learning real-world token mechanics and for showcasing blockchain protocol engineering skills.
