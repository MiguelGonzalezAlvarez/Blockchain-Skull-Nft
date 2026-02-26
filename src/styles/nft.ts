import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../theme';
import type { RarityTier } from '@/types';

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 181, 51, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 181, 51, 0.6); }
`;

export const NFTCard = styled(motion.div)<{ $rarity?: RarityTier }>`
  background: ${theme.colors.backgroundCard};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  ${({ $rarity }) => {
    if ($rarity === 'legendary') {
      return css`
        animation: ${glowPulse} 3s ease-in-out infinite;
        border: 2px solid ${theme.colors.rarity.legendary};
      `;
    }
    if ($rarity === 'mythic') {
      return css`
        animation: ${glowPulse} 2s ease-in-out infinite;
        border: 2px solid ${theme.colors.rarity.mythic};
      `;
    }
    if ($rarity === 'rare') {
      return css`
        border: 1px solid ${theme.colors.rarity.rare};
      `;
    }
    return css`
      border: 1px solid ${theme.colors.border};
    `;
  }}

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${theme.shadows.xl};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
    z-index: 1;
    pointer-events: none;
  }

  &:hover::before {
    left: 100%;
  }
`;

export const NFTImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: ${theme.colors.backgroundTertiary};
  overflow: hidden;
`;

export const NFTImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${theme.transitions.slow};

  ${NFTCard}:hover & {
    transform: scale(1.1);
  }
`;

export const NFTRarityBadge = styled.span<{ $rarity: RarityTier }>`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;

  ${({ $rarity }) => {
    const rarities = {
      common: css`
        background: ${theme.colors.rarity.common};
        color: ${theme.colors.background};
      `,
      rare: css`
        background: ${theme.colors.rarity.rare};
        color: ${theme.colors.background};
      `,
      legendary: css`
        background: ${theme.colors.rarity.legendary};
        color: ${theme.colors.background};
      `,
      mythic: css`
        background: ${theme.colors.rarity.mythic};
        color: ${theme.colors.text};
      `,
    };
    return rarities[$rarity];
  }}
`;

export const NFTLevelBadge = styled.span`
  position: absolute;
  top: ${theme.spacing.sm};
  left: ${theme.spacing.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: rgba(0, 0, 0, 0.7);
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: ${theme.colors.primary};
  z-index: 2;
`;

export const NFTInfo = styled.div`
  padding: ${theme.spacing.md};
`;

export const NFTName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NFTId = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
`;

export const NFTStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
`;

export const NFTStat = styled.div`
  text-align: center;
`;

export const NFTStatValue = styled.span`
  display: block;
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  color: ${theme.colors.text};
`;

export const NFTStatLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textMuted};
  text-transform: uppercase;
`;

export const NFTStatus = styled.div<{ $status?: 'alive' | 'dead' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;

  ${({ $status = 'alive' }) =>
    $status === 'alive'
      ? css`
          background: rgba(66, 255, 51, 0.15);
          color: ${theme.colors.success};
        `
      : css`
          background: rgba(224, 68, 40, 0.15);
          color: ${theme.colors.danger};
        `}
`;

export const NFTActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;
