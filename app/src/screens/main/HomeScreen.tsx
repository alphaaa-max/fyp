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

const HomeScreen: React.FC = () => {
  const { currentWeather, loading, error, fetchCurrentWeather } = useWeatherStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      // For demo purposes, using a default location
      // In production, this should use the user's actual location
      await fetchCurrentWeather('London');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to fetch weather data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeather();
    setRefreshing(false);
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return WeatherColors.temperature.extremeHot;
    if (temp >= 25) return WeatherColors.temperature.hot;
    if (temp >= 20) return WeatherColors.temperature.warm;
    if (temp >= 15) return WeatherColors.temperature.mild;
    if (temp >= 10) return WeatherColors.temperature.cool;
    return WeatherColors.temperature.cold;
  };

  return (
    <LinearGradient
      colors={WeatherColors.sky.clearDay}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.title}>ForeSight</Text>
          <Text style={styles.subtitle}>Weather Dashboard</Text>

          {loading && !currentWeather ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading weather data...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadWeather}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : currentWeather ? (
            <View style={styles.weatherCard}>
              <Text style={styles.location}>{currentWeather.location}</Text>
              <Text
                style={[
                  styles.temperature,
                  { color: getTemperatureColor(currentWeather.temperature) },
                ]}
              >
                {Math.round(currentWeather.temperature)}°C
              </Text>
              <Text style={styles.condition}>{currentWeather.condition}</Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Humidity</Text>
                  <Text style={styles.detailValue}>{currentWeather.humidity}%</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Wind Speed</Text>
                  <Text style={styles.detailValue}>{currentWeather.windSpeed} m/s</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Pressure</Text>
                  <Text style={styles.detailValue}>{currentWeather.pressure} hPa</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No weather data available</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadWeather}>
                <Text style={styles.retryButtonText}>Load Weather</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Welcome to ForeSight</Text>
            <Text style={styles.infoText}>
              Get accurate weather forecasts and predictions powered by advanced data analytics.
            </Text>
          </View>
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
    fontSize: 36,
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
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  location: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  temperature: {
    fontSize: 72,
    fontWeight: 'bold',
    marginVertical: Spacing.md,
  },
  condition: {
    fontSize: 20,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: Spacing.md,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: Spacing.lg,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  loadingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
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
    marginBottom: Spacing.lg,
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
    marginBottom: Spacing.lg,
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

export default HomeScreen;
