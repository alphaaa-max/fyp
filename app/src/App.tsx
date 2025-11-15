import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useAuthStore } from './store';

/**
 * Main App Component for ForeSight
 * Weather forecasting application with AI-powered predictions
 */
export default function App() {
  const loadAuth = useAuthStore((state) => state.loadAuth);

  useEffect(() => {
    // Load authentication state on app start
    loadAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <StatusBar style="auto" />
        {/* TODO: Add Navigation Container and Screens */}
        {/* For now, displaying a placeholder */}
        {/* <NavigationContainer>
          {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer> */}
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
