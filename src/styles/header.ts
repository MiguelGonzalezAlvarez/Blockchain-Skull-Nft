import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../theme';

export const HeaderContainer = styled(motion.header)`
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.sticky};
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${theme.colors.border};
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: ${theme.colors.text};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.primary};
  }

  span {
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

export const NavLink = styled.button<{ $active?: boolean }>`
  position: relative;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 500;
  color: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  transition: all ${theme.transitions.fast};
  padding: ${theme.spacing.sm} 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${({ $active }) => ($active ? '100%' : '0')};
    height: 2px;
    background: ${theme.colors.primary};
    transition: width ${theme.transitions.normal};
  }

  &:hover {
    color: ${theme.colors.primary};

    &::after {
      width: 100%;
    }
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

export const NetworkBadge = styled.button<{ $connected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.backgroundTertiary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  transition: all ${theme.transitions.fast};

  ${({ $connected }) =>
    $connected &&
    css`
      border-color: ${theme.colors.success};
      color: ${theme.colors.success};
    `}

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
  }
`;

export const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const WalletAddress = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.backgroundTertiary};
  border-radius: ${theme.borderRadius.md};
`;

export const Balance = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.primary};
`;

export const UserMenu = styled.div`
  position: relative;
`;

export const UserAvatar = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.background};
  transition: all ${theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${theme.colors.glow.primary};
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text};

  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
  }
`;

export const MobileNav = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${theme.colors.background};
  z-index: ${theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing.lg};
`;

export const MobileNavLink = styled.button<{ $active?: boolean }>`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 600;
  color: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.text)};
  padding: ${theme.spacing.md} 0;
  text-align: left;
  border-bottom: 1px solid ${theme.colors.border};
`;

export const HeaderSpacer = styled.div`
  height: 70px;
`;
