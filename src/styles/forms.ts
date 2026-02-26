import styled, { css } from 'styled-components';
import { theme } from '../theme';

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  color: ${theme.colors.textSecondary};
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.backgroundSecondary};
  border: 1px solid ${({ $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  transition: all ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? theme.colors.danger : theme.colors.primary)};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) => ($hasError ? 'rgba(224, 68, 40, 0.2)' : 'rgba(255, 181, 51, 0.2)')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.backgroundSecondary};
  border: 1px solid ${({ $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  font-family: inherit;
  resize: vertical;
  transition: all ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? theme.colors.danger : theme.colors.primary)};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) => ($hasError ? 'rgba(224, 68, 40, 0.2)' : 'rgba(255, 181, 51, 0.2)')};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.backgroundSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23b0b0b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${theme.spacing.sm} center;
  background-size: 20px;
  padding-right: ${theme.spacing.xl};

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(255, 181, 51, 0.2);
  }

  option {
    background: ${theme.colors.backgroundSecondary};
    color: ${theme.colors.text};
  }
`;

export const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: ${theme.colors.primary};
  cursor: pointer;
`;

export const ErrorMessage = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.danger};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

export const InputAddon = styled.span`
  display: flex;
  align-items: center;
  padding: 0 ${theme.spacing.md};
  background: ${theme.colors.backgroundTertiary};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;

  &:first-child {
    border-right: none;
    border-radius: ${theme.borderRadius.md} 0 0 ${theme.borderRadius.md};
  }

  &:last-child {
    border-left: none;
    border-radius: 0 ${theme.borderRadius.md} ${theme.borderRadius.md} 0;
  }
`;

export const InputWithAddon = styled.div`
  display: flex;
  align-items: stretch;

  input {
    border-radius: 0;
    flex: 1;

    &:first-child {
      border-radius: ${theme.borderRadius.md} 0 0 ${theme.borderRadius.md};
    }

    &:last-child {
      border-radius: 0 ${theme.borderRadius.md} ${theme.borderRadius.md} 0;
    }
  }
`;

export const HelperText = styled.span<{ $error?: boolean }>`
  font-size: ${theme.fontSizes.xs};
  color: ${({ $error }) => ($error ? theme.colors.danger : theme.colors.textMuted)};
  margin-top: ${theme.spacing.xs};
`;
