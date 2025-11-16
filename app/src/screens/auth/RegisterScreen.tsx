import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store';
import { authService } from '../../services/api';
import { Colors, WeatherColors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({ email, password, name });
      await setAuth(response.token, response.user);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={WeatherColors.sky.clearDay}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join ForeSight today</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={Colors.text.secondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.text.secondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
              placeholderTextColor={Colors.text.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creating account...' : 'Register'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.linkText}>
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.xl * 2,
    opacity: 0.9,
  },
  form: {
    gap: Spacing.md,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text.primary,
  },
  button: {
    backgroundColor: Colors.primary.dark,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: Colors.text.white,
    textAlign: 'center',
    marginTop: Spacing.md,
    fontSize: 14,
  },
});

export default RegisterScreen;
