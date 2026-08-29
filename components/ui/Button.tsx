import { Pressable, Text, StyleSheet, ActivityIndicator, PressableProps } from 'react-native';
import { colors, radii, spacing, typography } from '@/constants/theme';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export function Button({ title, variant = 'primary', loading, disabled, style, ...rest }: ButtonProps) {
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isSecondary ? styles.secondary : styles.primary,
        pressed && !disabled && { opacity: 0.85 },
        (disabled || loading) && { opacity: 0.5 },
        style as object,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.primary : colors.white} />
      ) : (
        <Text style={[typography.button, isSecondary && { color: colors.primary }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
