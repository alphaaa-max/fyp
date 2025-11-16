import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthNavigator, MainNavigator } from './navigation';
import { useAuthStore } from './store';

/**
 * Main App Component for ForeSight
 * Weather forecasting application with AI-powered predictions
 */
export default function App() {
  const { isAuthenticated, loadAuth } = useAuthStore();

  useEffect(() => {
    // Load authentication state on app start
    loadAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <NavigationContainer>
          <StatusBar style="light" />
          {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
