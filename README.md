# Permit Visualizer – ERC-20 Permit Explorer & Signer

A lightweight, modern UI for exploring **ERC-20 Permit (EIP-2612)** data, visualizing allowances, and generating **gasless approval signatures** using EIP-712 structured data — then seamlessly submitting the permit on-chain.

This project demonstrates a full end-to-end workflow:

✔ Query permit metadata through an on-chain **AllowanceLens**
✔ Generate EIP-712 permit signatures using **wagmi + RainbowKit**
✔ Submit signed `permit()` transactions on Base Sepolia
✔ Visualize allowances, nonces, domain separator, and metadata

---
<img width="1887" height="988" alt="image" src="https://github.com/user-attachments/assets/ed1e7354-8787-4164-8e81-4f3525c8b6af" />


## 🚀 Features

###  Permit View Extraction

A custom smart contract (`AllowanceLens`) returns:

* Allowance
* Nonce
* DOMAIN_SEPARATOR
* Token name & symbol
* Owner / spender addresses

### EIP-712 Permit Signature

Generates a fully compliant EIP-712 typed data signature:

```
Permit(owner, spender, value, nonce, deadline)
```

### 🔗 On-Chain Permit Submission

Submits the signed permit to the deployed ERC-20 Permit contract on Base Sepolia.

### Wallet Integration

Uses **RainbowKit + Wagmi** for wallet connection, signing, and transaction submission.

### UI / UX

* TailwindCSS design
* Animated background
* Clean data visualization
* Real-time fetch → sign → submit flow

---

## Tech Stack

**Smart Contracts**

* Solidity (Foundry)
* Base Sepolia Testnet
* PermitERC20
* AllowanceLens (view aggregator)

**Frontend**

* React + Vite
* TypeScript
* Wagmi v2
* Viem
* RainbowKit
* TailwindCSS

---

## Contract Addresses (Base Sepolia)

| Contract      | Address                                      |
| ------------- | -------------------------------------------- |
| PermitERC20   | `0xc3401990D12371AC87EE5C37774f693a9211f6B5` |
| AllowanceLens | `0xAce360Ef4E7f41540eACe13f999595FBDcebD174` |

Both contracts are verified via Blockscout.

---

## 📁 Project Structure

```
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
```

---

## Running Locally

### 1. Install dependencies

```
cd frontend
npm install
```

### 2. Environment variables

```
VITE_PUBLIC_RPC_URL=https://sepolia.base.org
```

### 3. Start development server

```
npm run dev
```

Visit:

```
http://localhost:5173
```

---

## Permit Flow Breakdown

### **1. Query Permit Data**

The UI calls `AllowanceLens.getView(token, owner, spender)` which returns structured permit-related data.

### **2. Sign Permit (off-chain)**

User enters:

* value (uint256)
* deadline (timestamp)

Wagmi generates an EIP-712 signature using:

```
signTypedData()
```

which outputs `v`, `r`, `s`.

### **3. Submit Permit Transaction**

The signed data is sent via:

```
permit(owner, spender, value, deadline, v, r, s)
```

Allowance + nonce update instantly.

---

##  Summary

This project is a practical, production-style demonstration of modern token UX powered by EIP-2612.

It showcases:

* Permit-enabled ERC-20 tokens
* Off-chain EIP-712 signing
* On-chain allowance updates
* Smooth frontend integration with wagmi + viem
* Real-world patterns used by major DeFi protocols

Ideal for learning, experimentation, or extending into a fully-fledged token interaction dashboard.

---

(You can add screenshots or demo GIFs later to enrich the README.)
