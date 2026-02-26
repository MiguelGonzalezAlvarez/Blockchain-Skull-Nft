import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: 'mint' | 'levelUp' | 'revive' | 'attack' | 'settings' | 'transaction' | null;
  data?: unknown;
}

interface UIState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  notifications: Notification[];
  modal: ModalState;
  isWalletModalOpen: boolean;
  isNetworkModalOpen: boolean;
  soundEnabled: boolean;
  animationEnabled: boolean;
}

const initialState: UIState = {
  theme: 'dark',
  sidebarOpen: false,
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
    data: undefined
  },
  isWalletModalOpen: false,
  isNetworkModalOpen: false,
  soundEnabled: true,
  animationEnabled: true
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({ ...action.payload, id });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (
      state,
      action: PayloadAction<{ type: ModalState['type']; data?: unknown }>
    ) => {
      state.modal.isOpen = true;
      state.modal.type = action.payload.type;
      state.modal.data = action.payload.data;
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.data = undefined;
    },
    setWalletModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWalletModalOpen = action.payload;
    },
    setNetworkModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isNetworkModalOpen = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    toggleAnimations: (state) => {
      state.animationEnabled = !state.animationEnabled;
    }
  });

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setWalletModalOpen,
  setNetworkModalOpen,
  toggleSound,
  toggleAnimations
} = uiSlice.actions;

export default uiSlice.reducer;
