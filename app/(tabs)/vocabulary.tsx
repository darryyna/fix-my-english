import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants/theme.constants';

export default function VocabularyScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="book-outline" size={40} color={colors.textMuted} />
      <Text style={[typography.h2, { marginTop: spacing.md }]}>Vocabulary</Text>
      <Text style={[typography.bodySecondary, { marginTop: spacing.xs, textAlign: 'center' }]}>
        Words flipcards, "I know" / "Need practice" та spaced repetition — soon
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
