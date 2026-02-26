import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Skull, Boss, Transaction, ScreenType, BattleLogEntry } from '@/types';

interface GameState {
  allSkulls: Skull[];
  userSkulls: Skull[];
  selectedSkull: Skull | null;
  boss: Boss | null;
  isBossDefeated: boolean;
  winnerAddress: string | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  currentScreen: ScreenType;
  battleLog: BattleLogEntry[];
  isInBattle: boolean;
}

const initialState: GameState = {
  allSkulls: [],
  userSkulls: [],
  selectedSkull: null,
  boss: null,
  isBossDefeated: false,
  winnerAddress: null,
  transactions: [],
  isLoading: false,
  error: null,
  currentScreen: 'connect',
  battleLog: [],
  isInBattle: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAllSkulls: (state, action: PayloadAction<Skull[]>) => {
      state.allSkulls = action.payload;
    },
    setUserSkulls: (state, action: PayloadAction<Skull[]>) => {
      state.userSkulls = action.payload;
    },
    setSelectedSkull: (state, action: PayloadAction<Skull | null>) => {
      state.selectedSkull = action.payload;
    },
    setBoss: (state, action: PayloadAction<Boss | null>) => {
      state.boss = action.payload;
    },
    setBossDefeated: (state, action: PayloadAction<boolean>) => {
      state.isBossDefeated = action.payload;
    },
    setWinnerAddress: (state, action: PayloadAction<string | null>) => {
      state.winnerAddress = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    updateTransaction: (
      state,
      action: PayloadAction<{ hash: string; status: Transaction['status'] }>
    ) => {
      const tx = state.transactions.find((t) => t.hash === action.payload.hash);
      if (tx) {
        tx.status = action.payload.status;
      }
    },
    setCurrentScreen: (state, action: PayloadAction<ScreenType>) => {
      state.currentScreen = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    startBattle: (state, action: PayloadAction<Skull>) => {
      state.selectedSkull = action.payload;
      state.isInBattle = true;
      state.currentScreen = 'bossFight';
      state.battleLog = [];
    },
    endBattle: (state, action: PayloadAction<{ victory: boolean; winner?: string }>) => {
      state.isInBattle = false;
      if (action.payload.victory) {
        state.currentScreen = 'victory';
        state.isBossDefeated = true;
        state.winnerAddress = action.payload.winner || null;
      } else {
        state.currentScreen = 'defeat';
      }
    },
    addBattleLog: (state, action: PayloadAction<BattleLogEntry>) => {
      state.battleLog.push(action.payload);
    },
    updateSkull: (state, action: PayloadAction<Skull>) => {
      const index = state.userSkulls.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.userSkulls[index] = action.payload;
      }
      if (state.selectedSkull?.id === action.payload.id) {
        state.selectedSkull = action.payload;
      }
    },
    resetGame: (state) => {
      state.selectedSkull = null;
      state.isInBattle = false;
      state.currentScreen = 'home';
      state.battleLog = [];
      state.isBossDefeated = false;
      state.winnerAddress = null;
    },
  },
});

export const {
  setLoading,
  setAllSkulls,
  setUserSkulls,
  setSelectedSkull,
  setBoss,
  setBossDefeated,
  setWinnerAddress,
  addTransaction,
  updateTransaction,
  setCurrentScreen,
  setError,
  startBattle,
  endBattle,
  addBattleLog,
  updateSkull,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
