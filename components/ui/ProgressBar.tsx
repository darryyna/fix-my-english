import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/constants/theme.constants';

interface ProgressBarProps {
  label: string;
  // 1-100
  value: number;
  color?: string;
}

export function ProgressBar({ label, value, color = colors.primary }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={typography.body}>{label}</Text>
        <Text style={[typography.bodySecondary, { color }]}>{Math.round(clamped)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  track: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
  },
});
