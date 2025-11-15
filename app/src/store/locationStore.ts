import { create } from 'zustand';
import { Location } from '../types/user.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationState {
  locations: Location[];
  currentLocation: { latitude: number; longitude: number } | null;
  selectedLocation: Location | null;
  loading: boolean;

  // Actions
  setLocations: (locations: Location[]) => void;
  addLocation: (location: Location) => void;
  removeLocation: (locationId: string) => void;
  setCurrentLocation: (coords: { latitude: number; longitude: number }) => Promise<void>;
  setSelectedLocation: (location: Location | null) => void;
  loadCurrentLocation: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  locations: [],
  currentLocation: null,
  selectedLocation: null,
  loading: false,

  setLocations: (locations: Location[]) => {
    set({ locations });
  },

  addLocation: (location: Location) => {
    set((state) => ({
      locations: [...state.locations, location],
    }));
  },

  removeLocation: (locationId: string) => {
    set((state) => ({
      locations: state.locations.filter((loc) => loc.id !== locationId),
    }));
  },

  setCurrentLocation: async (coords: { latitude: number; longitude: number }) => {
    try {
      await AsyncStorage.setItem('currentLocation', JSON.stringify(coords));
      set({ currentLocation: coords });
    } catch (error) {
      console.error('Failed to save current location:', error);
    }
  },

  setSelectedLocation: (location: Location | null) => {
    set({ selectedLocation: location });
  },

  loadCurrentLocation: async () => {
    try {
      const locationStr = await AsyncStorage.getItem('currentLocation');
      if (locationStr) {
        const coords = JSON.parse(locationStr);
        set({ currentLocation: coords });
      }
    } catch (error) {
      console.error('Failed to load current location:', error);
    }
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },
}));
