import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { store } from './store';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { setCurrentScreen } from './store/slices/gameSlice';
import { theme, GlobalStyles } from './styles';
import { Header, WalletModal, ToastContainer } from './components';
import { HomePage, MintPage, InventoryPage, BattlePage } from './pages';

type PageType = 'home' | 'mint' | 'inventory' | 'bossFight';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentScreen } = useAppSelector((state) => state.game);
  const { isConnected } = useAppSelector((state) => state.blockchain);
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  useEffect(() => {
    if (!isConnected) {
      setCurrentPage('home');
      dispatch(setCurrentScreen('home'));
    } else if (currentScreen === 'bossFight') {
      setCurrentPage('bossFight');
    }
  }, [isConnected, currentScreen, dispatch]);

  const handleNavigate = (page: string) => {
    const pageMap: Record<string, PageType> = {
      home: 'home',
      mint: 'mint',
      inventory: 'inventory',
      bossFight: 'bossFight',
    };
    const newPage = pageMap[page] || 'home';
    setCurrentPage(newPage);
    dispatch(setCurrentScreen(newPage));
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'mint':
        return <MintPage onNavigate={handleNavigate} />;
      case 'inventory':
        return <InventoryPage />;
      case 'bossFight':
        return <BattlePage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <WalletModal />
      <ToastContainer />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
