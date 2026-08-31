import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants/theme.constants';

export default function GrammarScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="school-outline" size={40} color={colors.textMuted} />
      <Text style={[typography.h2, { marginTop: spacing.md }]}>Grammar</Text>
      <Text style={[typography.bodySecondary, { marginTop: spacing.xs, textAlign: 'center' }]}>
        Different topics (Tenses, Articles, Conditionals...)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
});
