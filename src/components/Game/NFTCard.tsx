import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Heart, Sparkles } from 'lucide-react';
import type { Skull, RarityTier } from '@/types';
import SkullRenderer from '../Renderers/SkullRenderer';
import {
  NFTCard,
  NFTInfo,
  NFTName,
  NFTId,
  NFTStats,
  NFTStat,
  NFTStatValue,
  NFTStatLabel,
  NFTStatus,
  NFTActions,
} from '@/styles';
import { Button } from '@/styles';

interface NFTCardComponentProps {
  skull: Skull;
  onSelect?: (skull: Skull) => void;
  onLevelUp?: (skull: Skull) => void;
  onRevive?: (skull: Skull) => void;
  onFight?: (skull: Skull) => void;
  isSelected?: boolean;
}

const NFTCardComponent: React.FC<NFTCardComponentProps> = ({
  skull,
  onSelect,
  onLevelUp,
  onRevive,
  onFight,
  isSelected,
}) => {
  const isAlive = Number(skull.hpPoints) > 0;

  const rarityTier = (): RarityTier => {
    if (skull.rarity >= 95) return 'mythic';
    if (skull.rarity >= 80) return 'legendary';
    if (skull.rarity >= 50) return 'rare';
    return 'common';
  };

  const hpPercentage = (Number(skull.hpPoints) / Number(skull.maxHpPoints)) * 100;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    selected: {
      scale: 1.02,
      boxShadow: '0 0 30px rgba(255, 181, 51, 0.4)',
    },
  };

  return (
    <NFTCard
      $rarity={rarityTier()}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onSelect?.(skull)}
      style={{
        border: isSelected ? '2px solid #FFB533' : undefined,
      }}
    >
      <div style={{ position: 'relative' }}>
        <SkullRenderer skull={skull} showRarityBadge showLevelBadge size={200} />

        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            right: 8,
            height: 4,
            background: '#1a1a1a',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${hpPercentage}%`,
              height: '100%',
              background: hpPercentage > 50 ? '#42FF33' : hpPercentage > 25 ? '#FFA500' : '#e04428',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <NFTInfo>
        <NFTName>{skull.name}</NFTName>
        <NFTId>#{skull.id}</NFTId>

        <NFTStats>
          <NFTStat>
            <NFTStatValue>
              <Sword size={14} style={{ marginRight: 4 }} />
              {skull.attackPoints}
            </NFTStatValue>
            <NFTStatLabel>Attack</NFTStatLabel>
          </NFTStat>
          <NFTStat>
            <NFTStatValue>
              <Shield size={14} style={{ marginRight: 4 }} />
              {skull.maxHpPoints}
            </NFTStatValue>
            <NFTStatLabel>Max HP</NFTStatLabel>
          </NFTStat>
          <NFTStat>
            <NFTStatValue>
              <Sparkles size={14} style={{ marginRight: 4 }} />
              {skull.rarity}
            </NFTStatValue>
            <NFTStatLabel>Rarity</NFTStatLabel>
          </NFTStat>
        </NFTStats>

        <NFTStatus $status={isAlive ? 'alive' : 'dead'}>
          <Heart size={14} fill={isAlive ? '#42FF33' : '#e04428'} />
          {isAlive ? `HP: ${skull.hpPoints}/${skull.maxHpPoints}` : 'DEFEATED'}
        </NFTStatus>

        <NFTActions>
          {isAlive ? (
            <>
              {onLevelUp && (
                <Button
                  $variant="success"
                  $size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLevelUp(skull);
                  }}
                >
                  Level Up
                </Button>
              )}
              {onFight && (
                <Button
                  $variant="danger"
                  $size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFight(skull);
                  }}
                >
                  Fight Boss
                </Button>
              )}
            </>
          ) : (
            onRevive && (
              <Button
                $variant="outline"
                $fullWidth
                $size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRevive(skull);
                }}
              >
                Revive
              </Button>
            )
          )}
        </NFTActions>
      </NFTInfo>
    </NFTCard>
  );
};

export default NFTCardComponent;
