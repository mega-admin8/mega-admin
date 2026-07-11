import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native'; // <-- Add this import
import { theme } from '../theme'; 
import Typography from './Typography';

// Remove 'navigation' from the props here!
export default function AdminHeader({ title }) {
  // Grab the navigation object automatically using the hook
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        // Use dispatch(DrawerActions.openDrawer()) for maximum reliability
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
        style={styles.menuButton}
        activeOpacity={0.7}
      >
        <Menu color={theme.colors.textDark} size={28} />
      </TouchableOpacity>

      <Typography weight="700" style={styles.headerTitle}>
        {title}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { 
    padding: theme.spacing.m, 
    backgroundColor: theme.colors.surface, 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border,
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  menuButton: {
    padding: 8, 
    marginRight: 12, 
    marginLeft: -8 
  },
  headerTitle: { 
    fontSize: 24, 
    color: theme.colors.textDark 
  }
});