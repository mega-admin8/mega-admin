// After implementing sidebar
// App.js

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import 'react-native-gesture-handler';

import AdminLoginScreen from './src/AdminLoginScreen';
import { theme } from './src/theme';
import UserDetailsScreen from './src/UserDetailsScreen';
import AdminDrawer from './src/AdminDrawer'; // We ONLY need AdminDrawer here now
import GaliDesawarAdminScreen from './src/GaliDesawarAdminScreen'; // Import the new screen

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      const data = await AsyncStorage.getItem('adminData');
      if (token && data) {
        setAdminData(JSON.parse(data));
        setIsAdminLoggedIn(true);
      }
    } catch (e) {
      console.log('Failed to fetch admin token', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (user) => {
    setAdminData(user);
    setIsAdminLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('adminToken');
    await AsyncStorage.removeItem('adminData');
    setIsAdminLoggedIn(false);
    setAdminData(null);
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAdminLoggedIn ? (
          <Stack.Screen name="AdminLogin">
            {(props) => <AdminLoginScreen {...props} onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
        ) : (
          <>
            {/* FIX: We load the DRAWER here, not the Tabs! */}
            <Stack.Screen name="AdminDashboard">
              {(props) => <AdminDrawer {...props} adminData={adminData} onLogout={handleLogout} />}
            </Stack.Screen>

            <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}