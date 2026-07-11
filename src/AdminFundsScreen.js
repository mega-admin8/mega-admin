import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from './theme';
import Typography from './components/Typography';

export default function AdminFundsScreen() {
  return (
    <View style={styles.container}>
      <Typography weight="700" style={styles.title}>Fund Requests</Typography>
      <Typography style={styles.subtitle}>Approve or reject WhatsApp deposits here.</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, color: theme.colors.textDark },
  subtitle: { color: theme.colors.textMuted, marginTop: theme.spacing.s }
});