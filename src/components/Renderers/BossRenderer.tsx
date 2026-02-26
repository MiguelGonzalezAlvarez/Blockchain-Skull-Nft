import React from 'react';
import { motion } from 'framer-motion';
import type { Boss as BossType } from '@/types';

interface BossRendererProps {
  boss: BossType;
  size?: number;
  isAttacking?: boolean;
  isHurt?: boolean;
}

const BossRenderer: React.FC<BossRendererProps> = ({
  boss,
  size = 150,
  isAttacking = false,
  isHurt = false,
}) => {
  const bossEmoji = (() => {
    const name = boss.name.toLowerCase();
    if (name.includes('tree')) return '🌳';
    if (name.includes('dragon')) return '🐉';
    if (name.includes('demon')) return '👹';
    if (name.includes('slime')) return '🟢';
    if (name.includes('skeleton')) return '💀';
    return '👾';
  })();

  const bounceAnimation = {
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  };

  const attackAnimation = {
    scale: [1, 1.2, 1],
    x: [0, 30, 0],
    transition: {
      duration: 0.3,
      repeat: 2,
    },
  };

  const hurtAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
    },
  };

  const containerVariants = {
    idle: {},
    attacking: attackAnimation,
    hurt: hurtAnimation,
  };

  const glowIntensity = isHurt ? 30 : 15;

  return (
    <motion.div
      variants={containerVariants}
      animate={isAttacking ? 'attacking' : isHurt ? 'hurt' : 'idle'}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <motion.div
        animate={!isAttacking && !isHurt ? bounceAnimation : {}}
        style={{
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(224, 68, 40, ${glowIntensity / 100}) 0%, transparent 70%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: `blur(${isHurt ? 5 : 0}px)`,
        }}
      >
        <motion.span
          style={{
            fontSize: size * 0.6,
            filter: isHurt ? 'hue-rotate(90deg)' : 'none',
            transition: 'filter 0.3s ease',
          }}
          animate={{
            rotate: isAttacking ? [0, -10, 10, 0] : 0,
          }}
        >
          {bossEmoji}
        </motion.span>
      </motion.div>

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: size * (0.5 + i * 0.2),
            height: size * (0.5 + i * 0.2),
            borderRadius: '50%',
            border: `1px solid rgba(224, 68, 40, ${0.3 - i * 0.1})`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.div>
  );
};

export default BossRenderer;
