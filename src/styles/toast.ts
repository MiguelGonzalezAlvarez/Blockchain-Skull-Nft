import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../theme';

export const ToastContainer = styled(motion.div)`
  position: fixed;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  z-index: ${theme.zIndex.toast};
  max-width: 400px;
`;

export const Toast = styled(motion.div)<{
  $type?: 'success' | 'error' | 'warning' | 'info';
}>`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.backgroundSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  min-width: 300px;

  ${({ $type = 'info' }) => {
    const types = {
      success: css`
        border-left: 4px solid ${theme.colors.success};
        .toast-icon {
          color: ${theme.colors.success};
        }
      `,
      error: css`
        border-left: 4px solid ${theme.colors.danger};
        .toast-icon {
          color: ${theme.colors.danger};
        }
      `,
      warning: css`
        border-left: 4px solid ${theme.colors.warning};
        .toast-icon {
          color: ${theme.colors.warning};
        }
      `,
      info: css`
        border-left: 4px solid ${theme.colors.info};
        .toast-icon {
          color: ${theme.colors.info};
        }
      `,
    };
    return types[$type];
  }}
`;

export const ToastIcon = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ToastTitle = styled.p`
  font-weight: 600;
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs};
`;

export const ToastMessage = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  line-height: 1.4;
`;

export const ToastClose = styled.button`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.textMuted};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.backgroundTertiary};
    color: ${theme.colors.text};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ToastProgress = styled(motion.div)<{
  $type?: 'success' | 'error' | 'warning' | 'info';
}>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  border-radius: 0 0 ${theme.borderRadius.lg} ${theme.borderRadius.lg};

  ${({ $type = 'info' }) => {
    const colors = {
      success: theme.colors.success,
      error: theme.colors.danger,
      warning: theme.colors.warning,
      info: theme.colors.info,
    };
    return css`
      background: ${colors[$type]};
    `;
  }}
`;
