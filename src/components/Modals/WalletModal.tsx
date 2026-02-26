import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, X, AlertCircle, Loader2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setWalletModalOpen } from '@/store/slices/uiSlice';
import {
  setConnecting,
  setConnected,
  setError,
  setDisconnected,
} from '@/store/slices/blockchainSlice';
import { connectWallet } from '@/services/web3';
import Modal from './Modal';
import { Button, Spacer, Title, Text } from '@/styles';

const WalletModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isWalletModalOpen } = useAppSelector((state) => state.ui);
  const { isConnecting, error } = useAppSelector((state) => state.blockchain);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleConnect = async (wallet: string) => {
    setSelectedWallet(wallet);
    dispatch(setConnecting(true));

    try {
      const result = await connectWallet();
      dispatch(
        setConnected({
          account: result.account,
          chainId: result.networkId,
          networkName: result.networkConfig.name,
          balance: result.balance,
          gameContract: result.contract,
          web3: result.web3,
        })
      );
      dispatch(setWalletModalOpen(false));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      dispatch(setError(errorMessage));
    } finally {
      setSelectedWallet(null);
    }
  };

  const closeModal = () => {
    dispatch(setWalletModalOpen(false));
    dispatch(setError(null));
  };

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '💰',
    },
  ];

  return (
    <Modal isOpen={isWalletModalOpen} onClose={closeModal} title="Connect Wallet" size="sm">
      <div style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFB533, #FF9500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            marginBottom: 24,
          }}
        >
          <Wallet size={40} color="#0a0a0a" />
        </motion.div>

        <Title $size="h3" $align="center">
          Connect Your Wallet
        </Title>
        <Spacer $size="sm" />
        <Text $color="secondary" $align="center">
          Select a wallet to connect to Skull NFT Game
        </Text>

        <Spacer $size="lg" />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px',
              background: 'rgba(224, 68, 40, 0.1)',
              border: '1px solid #e04428',
              borderRadius: 8,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#e04428',
              fontSize: 14,
            }}
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {wallets.map((wallet, index) => (
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                $variant="ghost"
                $fullWidth
                $size="lg"
                onClick={() => handleConnect(wallet.id)}
                disabled={isConnecting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: 24,
                }}
              >
                <span style={{ fontSize: 24, marginRight: 12 }}>{wallet.icon}</span>
                {wallet.name}
                {selectedWallet === wallet.id && (
                  <Loader2
                    size={18}
                    style={{
                      marginLeft: 'auto',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        <Spacer $size="md" />

        <Text $size="sm" $color="muted" $align="center">
          By connecting, you agree to our Terms of Service
        </Text>
      </div>
    </Modal>
  );
};

export default WalletModal;
