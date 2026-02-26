# Skull NFT Game

A professional NFT gaming platform built on blockchain where players can collect, battle, and earn rewards with unique skull NFTs.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎮 Features

- **NFT Collection**: Mint unique skull NFTs with randomly generated traits and rarities
- **Battle System**: Fight against powerful bosses and earn rewards
- **Level Up**: Enhance your skulls' stats through battles
- **Multi-Network**: Supports BSC Testnet, Polygon, and Ethereum

### Rarity System

| Rarity    | DNA Range | Chance |
| --------- | --------- | ------ |
| Common    | 0-49      | 50%    |
| Rare      | 50-79     | 30%    |
| Legendary | 80-94     | 15%    |
| Mythic    | 95-99     | 5%     |

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **Styled Components** - Styling
- **Solidity** - Smart contracts
- **Web3.js** - Blockchain interaction

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask wallet

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/        # React components
├── pages/           # Page components
├── services/        # Web3 services
├── store/           # Redux store
├── styles/          # Theme & styles
└── types/           # TypeScript types
```

## 🔒 Smart Contract

The smart contract includes:

- Reentrancy guards
- Pausable for emergencies
- Attack cooldowns
- User limits
- Event logging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React, TypeScript, and Solidity
