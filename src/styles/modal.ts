import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../theme';

export const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md};
  z-index: ${theme.zIndex.modal};
`;

export const ModalContainer = styled(motion.div)<{ $size?: 'sm' | 'md' | 'lg' | 'xl' }>`
  background: ${theme.colors.backgroundSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.xl};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  ${({ $size = 'md' }) => {
    const sizes = {
      sm: '400px',
      md: '500px',
      lg: '700px',
      xl: '900px',
    };
    return `
      width: 100%;
      max-width: ${sizes[$size]};
    `;
  }}
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
`;

export const ModalTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: ${theme.colors.text};
`;

export const ModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  background;
  color:: transparent ${theme.colors.textSecondary};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.backgroundTertiary};
    color: ${theme.colors.text};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const ModalBody = styled.div`
  padding: ${theme.spacing.lg};
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
`;

export const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: ${theme.zIndex.modal - 1};
`;

export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

export { AnimatePresence };
