import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../theme';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

export const HealthBarContainer = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};

  ${({ $size = 'md' }) => {
    const sizes = {
      sm: css`
        height: 8px;
        font-size: ${theme.fontSizes.xs};
      `,
      md: css`
        height: 16px;
        font-size: ${theme.fontSizes.sm};
      `,
      lg: css`
        height: 24px;
        font-size: ${theme.fontSizes.base};
      `,
    };
    return sizes[$size];
  }}
`;

export const HealthBarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HealthBarText = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const HealthBarValue = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
`;

export const HealthBarTrack = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  width: 100%;
  background: ${theme.colors.backgroundTertiary};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  position: relative;

  ${({ $size = 'md' }) => {
    const sizes = {
      sm: css`
        height: 8px;
      `,
      md: css`
        height: 16px;
      `,
      lg: css`
        height: 24px;
      `,
    };
    return sizes[$size];
  }}
`;

export const HealthBarFill = styled(motion.div)<{
  $percentage: number;
  $variant?: 'health' | 'mana' | 'xp';
}>`
  height: 100%;
  border-radius: ${theme.borderRadius.full};
  position: relative;
  overflow: hidden;

  ${({ $percentage, $variant = 'health' }) => {
    let color;
    if ($variant === 'health') {
      color =
        $percentage > 50
          ? theme.colors.success
          : $percentage > 25
            ? theme.colors.warning
            : theme.colors.danger;
    } else if ($variant === 'mana') {
      color = theme.colors.info;
    } else {
      color = theme.colors.primary;
    }

    return css`
      background: linear-gradient(90deg, ${color}, ${color}dd);
      width: ${Math.max(0, Math.min(100, $percentage))}%;
    `;
  }}

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent);
    border-radius: ${theme.borderRadius.full} ${theme.borderRadius.full} 0 0;
  }
`;

export const HealthBarGlow = styled.div<{ $percentage: number }>`
  position: absolute;
  top: 50%;
  left: 0;
  height: 100%;
  transform: translateY(-50%);
  border-radius: ${theme.borderRadius.full};
  filter: blur(8px);
  opacity: 0.5;
  transition: all ${theme.transitions.normal};

  ${({ $percentage }) => {
    const color =
      $percentage > 50
        ? theme.colors.success
        : $percentage > 25
          ? theme.colors.warning
          : theme.colors.danger;
    return css`
      background: ${color};
      width: ${Math.max(0, Math.min(100, $percentage))}%;
    `;
  }}
`;

export const HealthBarCritical = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 0.5s ease-in-out infinite;
`;

export const HealthBarHit = styled(motion.div)<{ $damage: number }>`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  background: ${theme.colors.danger};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  color: ${theme.colors.text};
  animation: ${shake} 0.3s ease-in-out;
`;

export const MiniHealthBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  span {
    font-size: ${theme.fontSizes.xs};
    color: ${theme.colors.textSecondary};
  }
`;

export const MiniHealthBarFill = styled.div<{ $percentage: number }>`
  width: 40px;
  height: 4px;
  background: ${theme.colors.backgroundTertiary};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $percentage }) => Math.max(0, Math.min(100, $percentage))}%;
    background: ${({ $percentage }) =>
      $percentage > 50
        ? theme.colors.success
        : $percentage > 25
          ? theme.colors.warning
          : theme.colors.danger};
    border-radius: ${theme.borderRadius.full};
  }
`;
