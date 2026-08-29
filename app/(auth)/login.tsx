import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { colors, spacing, radii, typography } from '@/constants/theme';

export default function LoginScreen() {
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail);

  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isSignUp = mode === 'signUp';

  const handleSubmit = async () => {
    if (!email || !password) {
      setErrorMsg('Enter email and password');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    const action = isSignUp ? signUpWithEmail : signInWithEmail;
    const { error } = await action(email.trim(), password);
    setLoading(false);

    if (error) {
      setErrorMsg(error);
      return;
    }
    // onAuthStateChange in authStore updates the session automatically;
    // navigate once we have one.
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={typography.h1}>Fix My English</Text>
          <Text style={[typography.bodySecondary, { marginTop: spacing.xs }]}>
            {isSignUp ? 'Create an account to start' : 'Log in to your account to continue'}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

          <Button
            title={isSignUp ? 'Sign up' : 'Sign in'}
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: spacing.sm }}
          />

          <Pressable
            onPress={() => {
              setErrorMsg(null);
              setMode(isSignUp ? 'signIn' : 'signUp');
            }}
            style={styles.switchMode}
          >
            <Text style={typography.bodySecondary}>
              {isSignUp ? 'Already have an account? ' : 'Do not have an account? '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                {isSignUp ? 'Log in' : 'Sign up'}
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  input: {
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 15,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
  switchMode: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});
