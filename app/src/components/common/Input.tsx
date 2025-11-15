import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { WeatherColors, Typography, Spacing } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={WeatherColors.text.tertiary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodySmall,
    color: WeatherColors.text.secondary,
    marginBottom: Spacing.xs,
  },
  input: {
    ...Typography.input,
    backgroundColor: WeatherColors.background.secondary,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: WeatherColors.text.primary,
    minHeight: 50,
  },
  inputError: {
    borderColor: WeatherColors.alerts.error,
  },
  errorText: {
    ...Typography.caption,
    color: WeatherColors.alerts.error,
    marginTop: Spacing.xs,
  },
});
