import styled, { css, keyframes } from 'styled-components';
import { theme } from './theme';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background};
`;

export const MainContent = styled.main`
  flex: 1;
  padding: ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

export const Grid = styled.div<{ $columns?: number; $gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 1}, 1fr);
  gap: ${({ $gap }) => $gap || theme.spacing.md};

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  }

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(${({ $columns }) => $columns || 3}, 1fr);
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(${({ $columns }) => $columns || 4}, 1fr);
  }
`;

export const Flex = styled.div<{
  $direction?: 'row' | 'column';
  $justify?: string;
  $align?: string;
  $gap?: string;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction || 'row'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  align-items: ${({ $align }) => $align || 'stretch'};
  gap: ${({ $gap }) => $gap || '0'};
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
`;

export const Card = styled.div<{
  $variant?: 'default' | 'elevated' | 'outlined';
  $glow?: boolean;
  $hoverable?: boolean;
}>`
  background: ${theme.colors.backgroundCard};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  transition: all ${theme.transitions.normal};
  position: relative;
  overflow: hidden;

  ${({ $variant }) =>
    $variant === 'outlined' &&
    css`
      border: 1px solid ${theme.colors.border};
    `}

  ${({ $variant }) =>
    $variant === 'elevated' &&
    css`
      box-shadow: ${theme.shadows.card};
    `}

  ${({ $glow }) =>
    $glow &&
    css`
      animation: ${pulse} 2s ease-in-out infinite;
      box-shadow: ${theme.shadows.glow};
    `}

  ${({ $hoverable }) =>
    $hoverable &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-4px);
        box-shadow: ${theme.shadows.card}, ${theme.colors.glow.primary};
      }
    `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${theme.colors.primary}, transparent);
    opacity: 0;
    transition: opacity ${theme.transitions.normal};
  }

  &:hover::before {
    opacity: 1;
  }
`;

export const Skeleton = styled.div<{ $width?: string; $height?: string }>`
  background: linear-gradient(
    90deg,
    ${theme.colors.backgroundSecondary} 25%,
    ${theme.colors.backgroundTertiary} 50%,
    ${theme.colors.backgroundSecondary} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '20px'};
  border-radius: ${theme.borderRadius.md};
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${theme.colors.border};
  margin: ${theme.spacing.lg} 0;
`;

export const Badge = styled.span<{
  $variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${({ $variant = 'default' }) => {
    const variants = {
      default: css`
        background: ${theme.colors.backgroundTertiary};
        color: ${theme.colors.textSecondary};
      `,
      success: css`
        background: rgba(66, 255, 51, 0.15);
        color: ${theme.colors.success};
      `,
      warning: css`
        background: rgba(255, 165, 0, 0.15);
        color: ${theme.colors.warning};
      `,
      danger: css`
        background: rgba(224, 68, 40, 0.15);
        color: ${theme.colors.danger};
      `,
      info: css`
        background: rgba(51, 161, 255, 0.15);
        color: ${theme.colors.info};
      `,
    };
    return variants[$variant];
  }}
`;

export const Avatar = styled.div<{ $size?: 'sm' | 'md' | 'lg'; $src?: string }>`
  border-radius: ${theme.borderRadius.full};
  background: ${({ $src }) => ($src ? `url(${$src})` : theme.colors.backgroundTertiary)};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;

  ${({ $size = 'md' }) => {
    const sizes = {
      sm: css`
        width: 32px;
        height: 32px;
      `,
      md: css`
        width: 48px;
        height: 48px;
      `,
      lg: css`
        width: 64px;
        height: 64px;
      `,
    };
    return sizes[$size];
  }}
`;

export const Text = styled.p<{
  $size?: keyof typeof theme.fontSizes;
  $color?: keyof typeof theme.colors | 'primary' | 'secondary' | 'muted';
  $weight?: number;
  $align?: string;
  $transform?: 'uppercase' | 'lowercase' | 'capitalize';
}>`
  font-size: ${({ $size }) => ($size ? theme.fontSizes[$size] : theme.fontSizes.base)};
  font-weight: ${({ $weight }) => $weight || 400};
  text-align: ${({ $align }) => $align || 'left'};
  text-transform: ${({ $transform }) => $transform || 'none'};
  color: ${({ $color = 'text' }) =>
    $color === 'primary'
      ? theme.colors.primary
      : $color === 'secondary'
        ? theme.colors.textSecondary
        : $color === 'muted'
          ? theme.colors.textMuted
          : theme.colors[$color as keyof typeof theme.colors] || theme.colors.text};
`;

export const Title = styled.h1<{
  $size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  $color?: keyof typeof theme.colors;
  $align?: string;
}>`
  font-family: ${theme.fonts.heading};
  font-weight: 700;
  line-height: 1.2;
  color: ${({ $color = 'text' }) =>
    theme.colors[$color as keyof typeof theme.colors] || theme.colors.text};
  text-align: ${({ $align }) => $align || 'left'};

  ${({ $size = 'h1' }) => {
    const sizes = {
      h1: css`
        font-size: ${theme.fontSizes['5xl']};
      `,
      h2: css`
        font-size: ${theme.fontSizes['4xl']};
      `,
      h3: css`
        font-size: ${theme.fontSizes['3xl']};
      `,
      h4: css`
        font-size: ${theme.fontSizes['2xl']};
      `,
      h5: css`
        font-size: ${theme.fontSizes.xl};
      `,
      h6: css`
        font-size: ${theme.fontSizes.lg};
      `,
    };
    return sizes[$size];
  }}
`;

export const Spacer = styled.div<{ $size?: keyof typeof theme.spacing }>`
  height: ${({ $size = 'md' }) => theme.spacing[$size]};
  width: 100%;
`;

export const GlassCard = styled.div`
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
`;
