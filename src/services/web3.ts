import Web3 from 'web3';
import type { HttpProvider } from 'web3-core';
import GameContract from '@/contracts/GameContract.json';
import { NETWORKS, getNetworkById } from './config';
import type { Skull, Boss } from '@/types';

export interface Web3Service {
  web3: Web3;
  account: string;
  balance: string;
  networkId: number;
  networkConfig: (typeof NETWORKS)[number];
  contract: ReturnType<typeof import('web3').Contract>;
}

export class Web3ServiceError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'Web3ServiceError';
  }
}

let web3Instance: Web3 | null = null;

export const getWeb3Instance = (): Web3 => {
  if (!web3Instance) {
    if (typeof window !== 'undefined' && window.ethereum) {
      web3Instance = new Web3(window.ethereum as unknown as HttpProvider);
    } else if (import.meta.env.VITE_RPC_URL) {
      web3Instance = new Web3(import.meta.env.VITE_RPC_URL);
    } else {
      throw new Web3ServiceError('No Web3 provider available');
    }
  }
  return web3Instance;
};

export const connectWallet = async (): Promise<Web3Service> => {
  const web3 = getWeb3Instance();

  if (!window.ethereum) {
    throw new Web3ServiceError('MetaMask not installed', 'METAMASK_NOT_FOUND');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Web3ServiceError('No accounts found', 'NO_ACCOUNTS');
    }

    const account = accounts[0];
    const networkId = await window.ethereum.request({ method: 'net_version' });
    const networkIdNum = Number(networkId);

    const networkConfig = getNetworkById(networkIdNum);
    if (!networkConfig) {
      throw new Web3ServiceError(`Network ${networkId} not supported`, 'UNSUPPORTED_NETWORK');
    }

    const balance = await web3.eth.getBalance(account);
    const networkData = GameContract.networks[networkId];

    if (!networkData) {
      throw new Web3ServiceError(
        'Smart contract not deployed on this network',
        'CONTRACT_NOT_DEPLOYED'
      );
    }

    const contract = new web3.eth.Contract(GameContract.abi, networkData.address);

    return {
      web3,
      account,
      balance: web3.utils.fromWei(balance, 'ether'),
      networkId: networkIdNum,
      networkConfig,
      contract: contract as unknown as ReturnType<typeof import('web3').Contract>,
    };
  } catch (error) {
    if (error instanceof Web3ServiceError) {
      throw error;
    }
    throw new Web3ServiceError(
      error instanceof Error ? error.message : 'Failed to connect wallet',
      'CONNECTION_FAILED'
    );
  }
};

export const getUserSkulls = async (contract: unknown, owner: string): Promise<Skull[]> => {
  const gameContract = contract as {
    methods: {
      getUserSkulls(address: string): { call(): Promise<Skull[]> };
    };
  };
  return gameContract.methods.getUserSkulls(owner).call();
};

export const getAllSkulls = async (contract: unknown): Promise<Skull[]> => {
  const gameContract = contract as {
    methods: {
      getSkulls(): { call(): Promise<Skull[]> };
    };
  };
  return gameContract.methods.getSkulls().call();
};

export const getBossInfo = async (contract: unknown): Promise<Boss> => {
  const gameContract = contract as {
    methods: {
      getBossInfo(): { call(): Promise<Boss> };
    };
  };
  return gameContract.methods.getBossInfo().call();
};

export const createSkull = async (
  contract: unknown,
  account: string,
  name: string,
  value: string
): Promise<unknown> => {
  const gameContract = contract as {
    methods: {
      createSkull(name: string): {
        send(options: { from: string; value: string }): Promise<unknown>;
      };
    };
  };
  return gameContract.methods.createSkull(name).send({
    from: account,
    value,
  });
};

export const levelUpSkull = async (
  contract: unknown,
  account: string,
  skullId: number,
  value: string
): Promise<unknown> => {
  const gameContract = contract as {
    methods: {
      levelUpSkull(id: number): {
        send(options: { from: string; value: string }): Promise<unknown>;
      };
    };
  };
  return gameContract.methods.levelUpSkull(skullId).send({
    from: account,
    value,
  });
};

export const reviveSkull = async (
  contract: unknown,
  account: string,
  skullId: number,
  value: string
): Promise<unknown> => {
  const gameContract = contract as {
    methods: {
      reviveSkull(id: number): {
        send(options: { from: string; value: string }): Promise<unknown>;
      };
    };
  };
  return gameContract.methods.reviveSkull(skullId).send({
    from: account,
    value,
  });
};

export const attackBoss = async (
  contract: unknown,
  account: string,
  skullId: number,
  value: string
): Promise<unknown> => {
  const gameContract = contract as {
    methods: {
      attackSkull(id: number): {
        send(options: { from: string; value: string }): Promise<unknown>;
      };
    };
  };
  return gameContract.methods.attackSkull(skullId).send({
    from: account,
    value,
  });
};

export const claimReward = async (contract: unknown, account: string): Promise<unknown> => {
  const gameContract = contract as {
    methods: {
      withdrawWinner(): {
        send(options: { from: string }): Promise<unknown>;
      };
    };
  };
  return gameContract.methods.withdrawWinner().send({
    from: account,
  });
};

export const getContractBalance = async (contract: unknown): Promise<string> => {
  const gameContract = contract as {
    methods: {
      moneySmartContract(): { call(): Promise<string> };
    };
  };
  const balance = await gameContract.methods.moneySmartContract().call();
  return getWeb3Instance().utils.fromWei(balance, 'ether');
};

export const switchNetwork = async (chainId: number): Promise<void> => {
  const networkConfig = getNetworkById(chainId);
  if (!networkConfig) {
    throw new Web3ServiceError(`Network ${chainId} not supported`);
  }

  const chainIdHex = `0x${chainId.toString(16)}`;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (error: unknown) {
    const switchError = error as { code?: number };
    if (switchError.code === 4902) {
      await addNetwork(networkConfig);
    } else {
      throw error;
    }
  }
};

const addNetwork = async (networkConfig: (typeof NETWORKS)[number]): Promise<void> => {
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: `0x${networkConfig.chainId.toString(16)}`,
        chainName: networkConfig.name,
        nativeCurrency: {
          name: networkConfig.symbol,
          symbol: networkConfig.symbol,
          decimals: networkConfig.decimals,
        },
        rpcUrls: [networkConfig.rpcUrl],
        blockExplorerUrls: networkConfig.explorer ? [networkConfig.explorer] : [],
      },
    ],
  });
};

declare global {
  interface Window {
    ethereum?: {
      request(args: { method: string; params?: unknown[] }): Promise<unknown>;
      on(event: string, callback: (...args: unknown[]) => void): void;
      removeListener(event: string, callback: (...args: unknown[]) => void): void;
      isMetaMask?: boolean;
    };
  }
}
