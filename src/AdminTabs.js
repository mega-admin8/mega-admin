import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Users, CreditCard, LogOut, Trophy, HistoryIcon, PieChart } from 'lucide-react-native';
import AdminMarketScreen from './AdminMarketScreen';
import AdminUserScreen from './AdminUserScreen';
import AdminFundsScreen from './AdminFundsScreen';
import { theme } from './theme';
import AdminDashboardScreen from './AdminDashboardScreen';
import AdminMarketsScreen from './AdminMarketsScreen';
import AdminResultsHistoryScreen from './AdminResultsHistoryScreen';

const Tab = createBottomTabNavigator();

export default function AdminTabs({ adminData, onLogout }) {
  
  // Safe logout handler with confirmation
  // const handleLogoutPress = () => {
  //   Alert.alert(
  //     "Secure Logout",
  //     "Are you sure you want to log out of the Admin Portal?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       { 
  //         text: "Logout", 
  //         style: "destructive", 
  //         onPress: onLogout // This calls the function we passed from App.js
  //       }
  //     ]
  //   );
  // };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: { height: 65, paddingBottom: 10 },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { fontFamily: 'Inter_700Bold', color: theme.colors.textDark },
        // This places the global logout button on the top right of every tab
        // headerRight: () => (
        //   <TouchableOpacity onPress={handleLogoutPress} style={{ marginRight: 15, padding: 8 }}>
        //     <LogOut color={theme.colors.danger} size={24} />
        //   </TouchableOpacity>
        // )
      }}
    >
      <Tab.Screen 
        name="Winner" 
        component={AdminMarketsScreen} 
        options={{ headerShown: false, tabBarIcon: ({ color }) => <Trophy color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Markets" 
        component={AdminMarketScreen} 
        options={{ tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Users" 
        component={AdminUserScreen} 
        options={{ headerShown: false, tabBarIcon: ({ color }) => <Users color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Result History" 
        component={AdminResultsHistoryScreen} 
        options={{ headerShown: false, tabBarIcon: ({ color }) => <HistoryIcon color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={AdminDashboardScreen} 
        options={{ headerShown: false, tabBarIcon: ({ color }) => <PieChart color={color} size={24} />, title: 'Dashboard' }}
      />
    </Tab.Navigator>
  );
}