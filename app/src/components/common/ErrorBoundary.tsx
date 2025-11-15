import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WeatherColors, Typography, Spacing } from '../../theme';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for graceful error handling
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // TODO: Log to error reporting service (e.g., Sentry)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback: FallbackComponent } = this.props;

      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback UI
 */
const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>⚠️</Text>
        <Text style={styles.title}>Oops! Something went wrong</Text>
        <Text style={styles.message}>
          We encountered an unexpected error. Don't worry, your data is safe.
        </Text>

        {__DEV__ && (
          <View style={styles.errorDetails}>
            <Text style={styles.errorTitle}>Error Details:</Text>
            <Text style={styles.errorText}>{error.message}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={resetError}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WeatherColors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.title,
    color: WeatherColors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  message: {
    ...Typography.body,
    color: WeatherColors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  errorDetails: {
    backgroundColor: WeatherColors.background.secondary,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  errorTitle: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: WeatherColors.text.primary,
    marginBottom: Spacing.sm,
  },
  errorText: {
    ...Typography.caption,
    color: WeatherColors.alerts.error,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: WeatherColors.accent.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.button,
    color: WeatherColors.text.inverse,
    fontSize: 14,
  },
});

export default ErrorBoundary;
