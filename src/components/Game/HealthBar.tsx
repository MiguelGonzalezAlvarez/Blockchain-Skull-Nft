import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HealthBarContainer,
  HealthBarLabel,
  HealthBarText,
  HealthBarValue,
  HealthBarTrack,
  HealthBarFill,
  HealthBarGlow,
} from '@/styles';

interface HealthBarProps {
  current: number;
  max: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  critical?: boolean;
}

const HealthBar: React.FC<HealthBarProps> = ({
  current,
  max,
  label = 'HP',
  size = 'md',
  showValue = true,
  animated = true,
  critical = false,
}) => {
  const [displayValue, setDisplayValue] = useState(current);
  const percentage = max > 0 ? (displayValue / max) * 100 : 0;
  const isLow = percentage <= 25;
  const isMedium = percentage <= 50 && percentage > 25;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayValue(current), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(current);
    }
  }, [current, animated]);

  const getColor = () => {
    if (isLow) return '#e04428';
    if (isMedium) return '#FFA500';
    return '#42FF33';
  };

  return (
    <HealthBarContainer $size={size}>
      {(label || showValue) && (
        <HealthBarLabel>
          {label && <HealthBarText>{label}</HealthBarText>}
          {showValue && (
            <HealthBarValue>
              {Math.round(displayValue)} / {max}
            </HealthBarValue>
          )}
        </HealthBarLabel>
      )}
      <HealthBarTrack $size={size}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current}-${max}`}
            initial={animated ? { width: '100%' } : false}
            animate={{ width: `${percentage}%` }}
            exit={animated ? { width: '100%' } : false}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            style={{
              height: '100%',
              borderRadius: 'inherit',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, ${getColor()}, ${getColor()}dd)`,
                borderRadius: 'inherit',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)',
                  borderRadius: 'inherit',
                }}
              />
            </div>

            <HealthBarGlow $percentage={percentage} style={{ background: getColor() }} />
          </motion.div>
        </AnimatePresence>

        {critical && isLow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(224, 68, 40, 0.3)',
              borderRadius: 'inherit',
              pointerEvents: 'none',
            }}
          />
        )}
      </HealthBarTrack>
    </HealthBarContainer>
  );
};

export default HealthBar;
