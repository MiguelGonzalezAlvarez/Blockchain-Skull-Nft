import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { parts } from '@/parts/skullParts';
import type { Skull, RarityTier } from '@/types';
import { NFTImageContainer, NFTRarityBadge, NFTLevelBadge } from '@/styles';

interface SkullRendererProps {
  skull: Skull;
  size?: number;
  animated?: boolean;
  showRarityBadge?: boolean;
  showLevelBadge?: boolean;
  onClick?: () => void;
}

const SkullRenderer: React.FC<SkullRendererProps> = ({
  skull,
  size = 200,
  animated = true,
  showRarityBadge = false,
  showLevelBadge = false,
  onClick,
}) => {
  const dnaString = useMemo(() => {
    let dna = String(skull.dna);
    while (dna.length < 16) dna = '0' + dna;
    return dna;
  }, [skull.dna]);

  const partsIndices = useMemo(
    () => ({
      back: Number(dnaString.substring(0, 2)) % 6,
      face: Number(dnaString.substring(2, 4)) % 6,
      mouth: Number(dnaString.substring(4, 6)) % 6,
      nose: Number(dnaString.substring(6, 8)) % 6,
      eye: Number(dnaString.substring(8, 10)) % 6,
      crown: Number(dnaString.substring(10, 12)) % 6,
    }),
    [dnaString]
  );

  const rarityTier = useMemo((): RarityTier => {
    if (skull.rarity >= 95) return 'mythic';
    if (skull.rarity >= 80) return 'legendary';
    if (skull.rarity >= 50) return 'rare';
    return 'common';
  }, [skull.rarity]);

  const rarityLabel = useMemo(() => {
    const labels: Record<RarityTier, string> = {
      common: 'Common',
      rare: 'Rare',
      legendary: 'Legendary',
      mythic: 'Mythic',
    };
    return labels[rarityTier];
  }, [rarityTier]);

  const containerVariants = animated
    ? {
        hover: {
          scale: 1.05,
          transition: { duration: 0.3 },
        },
      }
    : {};

  const skullParts = [
    { key: 'back', src: parts.backs[partsIndices.back], zIndex: 1 },
    { key: 'face', src: parts.faces[partsIndices.face], zIndex: 2 },
    { key: 'mouth', src: parts.mouths[partsIndices.mouth], zIndex: 3 },
    { key: 'nose', src: parts.noses[partsIndices.nose], zIndex: 4 },
    { key: 'eye', src: parts.eyes[partsIndices.eye], zIndex: 5 },
    { key: 'crown', src: parts.crowns[partsIndices.crown], zIndex: 6 },
  ];

  return (
    <motion.div
      variants={containerVariants}
      whileHover="hover"
      onClick={onClick}
      style={{
        position: 'relative',
        width: size,
        height: size,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <NFTImageContainer style={{ width: '100%', height: '100%' }}>
        {skullParts.map((part) => (
          <img
            key={part.key}
            src={part.src}
            alt={part.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              zIndex: part.zIndex,
            }}
          />
        ))}

        {showRarityBadge && <NFTRarityBadge $rarity={rarityTier}>{rarityLabel}</NFTRarityBadge>}
        {showLevelBadge && <NFTLevelBadge>Lv. {skull.level}</NFTLevelBadge>}
      </NFTImageContainer>
    </motion.div>
  );
};

export default SkullRenderer;
