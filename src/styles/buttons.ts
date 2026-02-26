import styled, { css, keyframes } from 'styled-components';
import { theme } from '../theme';

const shine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const ripple = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

export interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
  $size?: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
  $loading?: boolean;
  $disabled?: boolean;
  $glow?: boolean;
}

const buttonVariants = {
  primary: css`
    background: linear-gradient(
      135deg,
      ${theme.colors.primary} 0%,
      ${theme.colors.primaryHover} 100%
    );
    color: ${theme.colors.background};
    border: none;

    &:hover:not(:disabled) {
      box-shadow: ${theme.colors.glow.primary};
    }
  `,
  secondary: css`
    background: linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.info} 100%);
    color: ${theme.colors.background};
    border: none;

    &:hover:not(:disabled) {
      box-shadow: ${theme.colors.glow.secondary};
    }
  `,
  success: css`
    background: linear-gradient(135deg, ${theme.colors.success} 0%, #2ecc71 100%);
    color: ${theme.colors.background};
    border: none;

    &:hover:not(:disabled) {
      box-shadow: ${theme.colors.glow.success};
    }
  `,
  danger: css`
    background: linear-gradient(135deg, ${theme.colors.danger} 0%, #c0392b 100%);
    color: ${theme.colors.text};
    border: none;

    &:hover:not(:disabled) {
      box-shadow: ${theme.colors.glow.danger};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};

    &:hover:not(:disabled) {
      background: ${theme.colors.backgroundTertiary};
      border-color: ${theme.colors.borderLight};
    }
  `,
  outline: css`
    background: transparent;
    color: ${theme.colors.primary};
    border: 2px solid ${theme.colors.primary};

    &:hover:not(:disabled) {
      background: rgba(255, 181, 51, 0.1);
    }
  `,
};

const buttonSizes = {
  sm: css`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.fontSizes.sm};
  `,
  md: css`
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.base};
  `,
  lg: css`
    padding: ${theme.spacing.md} ${theme.spacing.xl};
    font-size: ${theme.fontSizes.lg};
  `,
};

export const Button = styled.button<ButtonProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.fonts.heading};
  font-weight: 600;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  overflow: hidden;
  white-space: nowrap;

  ${({ $variant = 'primary' }) => buttonVariants[$variant]}
  ${({ $size = 'md' }) => buttonSizes[$size]}
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
  ${({ $glow }) =>
    $glow &&
    css`
      animation: ${pulse} 2s ease-in-out infinite;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:not(:disabled):active {
    transform: scale(0.98);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity ${theme.transitions.normal};
  }

  &:not(:disabled):hover::before {
    opacity: 1;
    animation: ${shine} 2s linear infinite;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const IconButton = styled.button<{ $size?: 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.backgroundTertiary};
  color: ${theme.colors.text};
  transition: all ${theme.transitions.fast};

  ${({ $size = 'md' }) => {
    const sizes = {
      sm: css`
        width: 32px;
        height: 32px;
      `,
      md: css`
        width: 40px;
        height: 40px;
      `,
      lg: css`
        width: 48px;
        height: 48px;
      `,
    };
    return sizes[$size];
  }}

  &:hover:not(:disabled) {
    background: ${theme.colors.border};
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FloatingButton = styled(Button)`
  position: fixed;
  bottom: ${theme.spacing.xl};
  right: ${theme.spacing.xl};
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.full};
  box-shadow: ${theme.shadows.xl};
  z-index: ${theme.zIndex.sticky};

  &:hover {
    transform: scale(1.1);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
`;

export const ButtonSpinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
