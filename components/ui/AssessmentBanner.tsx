import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { colors, spacing, radii, typography } from '@/constants/theme';

export function AssessmentBanner() {
    return (
        <View style={styles.banner}>
            <View style={styles.textBlock}>
                <View style={styles.titleRow}>
                    <Ionicons name="sparkles" size={16} color={colors.primary} />
                    <Text style={[typography.body, { fontWeight: '600', marginLeft: spacing.xs }]}>
                        Complete the quiz to start
                    </Text>
                </View>
                <Text style={[typography.caption, { marginTop: 2 }]}>
                    Sets your level, goal and learning path
                </Text>
            </View>
            <Button title="Start quiz" onPress={() => router.push('/assessment')} style={styles.button} />
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primaryMuted,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radii.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    textBlock: { flex: 1, marginRight: spacing.sm },
    titleRow: { flexDirection: 'row', alignItems: 'center' },
    button: { height: 40, paddingHorizontal: spacing.md },
});