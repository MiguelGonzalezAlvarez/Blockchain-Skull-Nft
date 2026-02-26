import type { NetworkConfig } from '@/types';

export const NETWORKS: Record<number, NetworkConfig> = {
  1: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`,
    explorer: 'https://etherscan.io',
    symbol: 'ETH',
    decimals: 18,
  },
  5: {
    chainId: 5,
    name: 'Goerli Testnet',
    rpcUrl: `https://eth-goerli.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`,
    explorer: 'https://goerli.etherscan.io',
    symbol: 'ETH',
    decimals: 18,
  },
  56: {
    chainId: 56,
    name: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',
    symbol: 'BNB',
    decimals: 18,
  },
  97: {
    chainId: 97,
    name: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    explorer: 'https://testnet.bscscan.com',
    symbol: 'BNB',
    decimals: 18,
  },
  137: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    symbol: 'MATIC',
    decimals: 18,
  },
  80001: {
    chainId: 80001,
    name: 'Mumbai Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorer: 'https://mumbai.polygonscan.com',
    symbol: 'MATIC',
    decimals: 18,
  },
  1337: {
    chainId: 1337,
    name: 'Local Ganache',
    rpcUrl: 'http://localhost:7545',
    explorer: '',
    symbol: 'ETH',
    decimals: 18,
  },
};

export const SUPPORTED_CHAIN_IDS = [1, 5, 56, 97, 137, 80001, 1337];

export const DEFAULT_NETWORK = Number(import.meta.env.VITE_DEFAULT_NETWORK || 97);

export const getNetworkById = (chainId: number): NetworkConfig | undefined => {
  return NETWORKS[chainId];
};

export const getNetworkName = (chainId: number): string => {
  return NETWORKS[chainId]?.name || `Unknown Network (${chainId})`;
};

export const isSupportedNetwork = (chainId: number): boolean => {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
};
