import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeatherStore } from '../../store';
import { Colors, WeatherColors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { format } from 'date-fns';

const ForecastScreen: React.FC = () => {
  const { forecast, loading, error, fetchForecast } = useWeatherStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    try {
      await fetchForecast('London', 7);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to fetch forecast data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadForecast();
    setRefreshing(false);
  };

  return (
    <LinearGradient colors={WeatherColors.sky.clearDay} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.title}>7-Day Forecast</Text>
          <Text style={styles.subtitle}>London</Text>

          {loading && !forecast.length ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading forecast...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadForecast}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : forecast.length > 0 ? (
            <View style={styles.forecastList}>
              {forecast.map((day, index) => (
                <View key={index} style={styles.forecastCard}>
                  <View style={styles.forecastHeader}>
                    <Text style={styles.forecastDate}>
                      {format(new Date(day.date), 'EEE, MMM d')}
                    </Text>
                  </View>
                  <View style={styles.forecastBody}>
                    <Text style={styles.forecastTemp}>
                      {Math.round(day.temperature)}°C
                    </Text>
                    <Text style={styles.forecastCondition}>{day.condition}</Text>
                  </View>
                  <View style={styles.forecastDetails}>
                    <Text style={styles.forecastDetailText}>
                      💧 {day.humidity}%
                    </Text>
                    <Text style={styles.forecastDetailText}>
                      💨 {day.windSpeed} m/s
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No forecast data available</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadForecast}>
                <Text style={styles.retryButtonText}>Load Forecast</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    opacity: 0.9,
  },
  forecastList: {
    gap: Spacing.md,
  },
  forecastCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: Spacing.lg,
  },
  forecastHeader: {
    marginBottom: Spacing.sm,
  },
  forecastDate: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  forecastBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  forecastTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary.main,
  },
  forecastCondition: {
    fontSize: 16,
    color: Colors.text.secondary,
    textTransform: 'capitalize',
  },
  forecastDetails: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  forecastDetailText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  loadingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  retryButtonText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForecastScreen;
