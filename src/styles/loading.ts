import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../theme';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const LoadingOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
  z-index: ${theme.zIndex.modal};
  backdrop-filter: blur(4px);
`;

export const Spinner = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  border: 3px solid ${theme.colors.border};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;

  ${({ $size = 'md' }) => {
    const sizes = {
      sm: '24px',
      md: '40px',
      lg: '60px',
    };
    return `
      width: ${sizes[$size]};
      height: ${sizes[$size]};
    `;
  }}
`;

export const LoadingText = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.lg};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const ProgressBar = styled.div<{ $progress: number; $color?: string }>`
  width: 100%;
  height: 8px;
  background: ${theme.colors.backgroundTertiary};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ $progress }) => Math.min(100, Math.max(0, $progress))}%;
    background: ${({ $color }) => $color || theme.colors.primary};
    border-radius: ${theme.borderRadius.full};
    transition: width ${theme.transitions.normal};
  }
`;

export const SkeletonBox = styled.div<{ $width?: string; $height?: string; $radius?: string }>`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '20px'};
  border-radius: ${({ $radius }) => $radius || theme.borderRadius.md};
  background: linear-gradient(
    90deg,
    ${theme.colors.backgroundSecondary} 25%,
    ${theme.colors.backgroundTertiary} 50%,
    ${theme.colors.backgroundSecondary} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export const DotLoader = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};

  span {
    width: 12px;
    height: 12px;
    background: ${theme.colors.primary};
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

export const PulsingDot = styled.span`
  width: 8px;
  height: 8px;
  background: ${theme.colors.success};
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }
`;
