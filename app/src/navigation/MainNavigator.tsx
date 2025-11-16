import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomeScreen from '../screens/main/HomeScreen';
import ForecastScreen from '../screens/main/ForecastScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import { Colors } from '../theme/colors';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Main Tab Navigator
 * Bottom tabs for authenticated users
 */
export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primary.main,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.text.white,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color }]}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Forecast"
        component={ForecastScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color }]}>📊</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color }]}>⚙️</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
});
