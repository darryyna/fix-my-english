import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/constants/theme';

export default function AssessmentScreen() {
    return (
        <View style={styles.container}>
            <Ionicons name="construct-outline" size={40} color={colors.textMuted} />
            <Text style={[typography.h2, { marginTop: spacing.md }]}>Assessment quiz</Text>
            <Text style={[typography.bodySecondary, { marginTop: spacing.xs, textAlign: 'center' }]}>
                Under construction — grammar/vocabulary questions that will set your level, goal and weak topics.
            </Text>
            <Button
                title="Back"
                variant="secondary"
                onPress={() => router.back()}
                style={{ marginTop: spacing.lg }}
            />
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