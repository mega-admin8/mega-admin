import React from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Settings, Home, LogOut, IndianRupee, TrendingUp } from 'lucide-react-native';
import { theme } from './theme';

import AdminTabs from './AdminTabs'; 
import AdminSettingsScreen from './AdminSettingsScreen';
import AdminGameRatesScreen from './AdminGameRatesScreen';

const Drawer = createDrawerNavigator();

// 1. CREATE THE CUSTOM DRAWER COMPONENT
function CustomDrawerContent(props) {
  // Extract the onLogout function we passed down from App.js
  const { onLogout } = props;

  const handleLogoutPress = () => {
    Alert.alert(
      "Secure Logout",
      "Are you sure you want to log out of the Admin Portal?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: onLogout // Triggers the logout in App.js
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      {/* Top Section: Standard Menu Items */}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Bottom Section: Pinned Logout Button */}
      <View style={styles.logoutSection}>
        <DrawerItem
          label="Secure Logout"
          icon={({ size }) => <LogOut color={theme.colors.danger} size={size} />}
          labelStyle={styles.logoutText}
          onPress={handleLogoutPress}
          style={styles.logoutItem}
        />
      </View>
    </SafeAreaView>
  );
}

// 2. MAIN DRAWER NAVIGATOR
export default function AdminDrawer({ adminData, onLogout }) {
  return (
    <Drawer.Navigator 
      // Instruct the Drawer to use our custom UI
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} />}
      screenOptions={{
        headerShown: false, 
        drawerActiveBackgroundColor: theme.colors.primaryLight,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.textDark,
      }}
    >
      <Drawer.Screen 
        name="AdminHome" 
        options={{ 
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => <Home color={color} size={size} />
        }} 
      >
        {(props) => <AdminTabs {...props} adminData={adminData} />}
      </Drawer.Screen>
      
      <Drawer.Screen 
        name="GlobalSettings" 
        component={AdminSettingsScreen} 
        options={{ 
          drawerLabel: 'App Settings',
          drawerIcon: ({ color, size }) => <Settings color={color} size={size} />
        }} 
      />

      {/* NEW: Game Rates Screen */}
      <Drawer.Screen 
        name="GameRates" 
        component={AdminGameRatesScreen} 
        options={{ 
          drawerLabel: 'Game Rates',
          drawerIcon: ({ color, size }) => <TrendingUp color={color} size={size} />
        }} 
      />
    </Drawer.Navigator>
  );
}

// 3. STYLES FOR THE LOGOUT BUTTON
const styles = StyleSheet.create({
  logoutSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 20, 
    paddingTop: 10,
  },
  logoutText: {
    color: theme.colors.danger,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 0, // <-- REMOVED the negative margin
  },
  logoutItem: {
    backgroundColor: '#FEF2F2', 
    borderRadius: 24, // <-- MATCHES the rounded pill shape of "Home"
    marginHorizontal: 10, // <-- Aligns it perfectly with the upper menu items
    paddingLeft: 8, // Adds a little breathing room inside the button
  }
});