import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store';
import { Colors, WeatherColors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

const SettingsScreen: React.FC = () => {
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearAuth();
          },
        },
      ],
    );
  };

  return (
    <LinearGradient colors={WeatherColors.sky.clearDay} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{user?.name || 'Not set'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{user?.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingLabel}>Temperature Unit</Text>
                <Text style={styles.settingValue}>Celsius</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingLabel}>Wind Speed Unit</Text>
                <Text style={styles.settingValue}>m/s</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingValue}>Enabled</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Version</Text>
                <Text style={styles.value}>1.0.0</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.label}>App Name</Text>
                <Text style={styles.value}>ForeSight</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.white,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  label: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  settingValue: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  logoutButtonText: {
    color: Colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
