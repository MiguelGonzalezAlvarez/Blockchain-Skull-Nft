import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BlockchainState {
  account: string | null;
  chainId: number | null;
  networkName: string;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  gameContract: unknown | null;
  web3: unknown | null;
}

const initialState: BlockchainState = {
  account: null,
  chainId: null,
  networkName: '',
  balance: '0',
  isConnected: false,
  isConnecting: false,
  error: null,
  gameContract: null,
  web3: null,
};

const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setConnected: (
      state,
      action: PayloadAction<{
        account: string;
        chainId: number;
        networkName: string;
        balance: string;
        gameContract: unknown;
        web3: unknown;
      }>
    ) => {
      state.account = action.payload.account;
      state.chainId = action.payload.chainId;
      state.networkName = action.payload.networkName;
      state.balance = action.payload.balance;
      state.isConnected = true;
      state.isConnecting = false;
      state.gameContract = action.payload.gameContract;
      state.web3 = action.payload.web3;
      state.error = null;
    },
    setDisconnected: (state) => {
      state.account = null;
      state.chainId = null;
      state.networkName = '';
      state.balance = '0';
      state.isConnected = false;
      state.isConnecting = false;
      state.gameContract = null;
      state.web3 = null;
    },
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
    },
    setBalance: (state, action: PayloadAction<string>) => {
      state.balance = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnecting = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
  },
});

export const {
  setConnecting,
  setConnected,
  setDisconnected,
  setAccount,
  setBalance,
  setError,
  clearError,
  setChainId,
} = blockchainSlice.actions;

export default blockchainSlice.reducer;
