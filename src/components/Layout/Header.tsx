import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Menu, X, Hexagon, Activity, Users } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setWalletModalOpen, setNetworkModalOpen } from '@/store/slices/uiSlice';
import {
  HeaderContainer,
  HeaderContent,
  Logo,
  Nav,
  NavLink,
  HeaderActions,
  NetworkBadge,
  WalletInfo,
  WalletAddress,
  Balance,
  UserAvatar,
  MobileMenuButton,
  MobileNav,
  MobileNavLink,
  HeaderSpacer,
} from '@/styles';
import { Button } from '@/styles';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const dispatch = useAppDispatch();
  const { account, balance, isConnected, networkName } = useAppSelector(
    (state) => state.blockchain
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Hexagon },
    { id: 'mint', label: 'Mint', icon: Activity },
    { id: 'inventory', label: 'Inventory', icon: Users },
  ];

  return (
    <>
      <HeaderContainer
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{
          background: scrolled ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.8)',
        }}
      >
        <HeaderContent>
          <Logo onClick={() => onNavigate('home')}>
            <Hexagon size={32} color="#FFB533" />
            <span>Skull NFT</span>
          </Logo>

          <Nav>
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                $active={currentPage === item.id}
                onClick={() => onNavigate(item.id)}
              >
                <item.icon size={18} style={{ marginRight: 8 }} />
                {item.label}
              </NavLink>
            ))}
          </Nav>

          <HeaderActions>
            <NetworkBadge
              $connected={isConnected}
              onClick={() => dispatch(setNetworkModalOpen(true))}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: isConnected ? '#42FF33' : '#666',
                }}
              />
              {networkName || 'Not Connected'}
            </NetworkBadge>

            {isConnected ? (
              <WalletInfo>
                <Balance>{parseFloat(balance).toFixed(4)} BNB</Balance>
                <WalletAddress>{formatAddress(account || '')}</WalletAddress>
                <UserAvatar>{account?.slice(2, 4).toUpperCase()}</UserAvatar>
              </WalletInfo>
            ) : (
              <Button
                $variant="primary"
                $size="sm"
                onClick={() => dispatch(setWalletModalOpen(true))}
              >
                <Wallet size={18} />
                Connect
              </Button>
            )}

            <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </MobileMenuButton>
          </HeaderActions>
        </HeaderContent>
      </HeaderContainer>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileNav
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <MobileMenuButton onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </MobileMenuButton>
            </div>
            {navItems.map((item, index) => (
              <MobileNavLink
                key={item.id}
                $active={currentPage === item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <item.icon size={24} style={{ marginRight: 12 }} />
                {item.label}
              </MobileNavLink>
            ))}
          </MobileNav>
        )}
      </AnimatePresence>

      <HeaderSpacer />
    </>
  );
};

export default Header;
