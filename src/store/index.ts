import { configureStore } from '@reduxjs/toolkit';
import blockchainReducer from './slices/blockchainSlice';
import gameReducer from './slices/gameSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    blockchain: blockchainReducer,
    game: gameReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['blockchain/setContract', 'game/setLoading'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
