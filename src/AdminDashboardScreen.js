import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Users, Wallet, TrendingUp, TrendingDown, Activity, ArrowDownCircle, Menu } from 'lucide-react-native';
import api from './api'; // Adjust path if needed
import { theme } from './theme'; // Adjust path if needed
import Typography from './components/Typography'; // Adjust path if needed

export default function AdminDashboardScreen({navigation}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.log("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const isProfit = stats?.todayProfit >= 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity 
          onPress={() => navigation.openDrawer()} 
          style={{ padding: 8, marginRight: 8, marginLeft: -8 }}
        >
          <Menu color={theme.colors.textDark} size={28} />
        </TouchableOpacity> */}
        <Typography weight="700" style={styles.headerTitle}>Overview</Typography>
        <Typography style={styles.headerSubtitle}>Real-time platform analytics</Typography>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Main Profit/Loss Card */}
        <View style={[styles.mainCard, isProfit ? styles.profitBg : styles.lossBg]}>
          <View style={styles.mainCardHeader}>
            <Typography weight="600" style={styles.mainCardLabel}>Today's P&L</Typography>
            {isProfit ? <TrendingUp color="#fff" size={24} /> : <TrendingDown color="#fff" size={24} />}
          </View>
          <Typography weight="700" style={styles.mainAmount}>
            {isProfit ? '+' : '-'}₹{Math.abs(stats?.todayProfit || 0)}
          </Typography>
          <Typography style={styles.mainSubText}>
            Based on today's bids and wins
          </Typography>
        </View>

        <Typography weight="700" style={styles.sectionTitle}>Today's Activity</Typography>
        
        {/* Grid Stats */}
        <View style={styles.grid}>
          {/* Total Played Today */}
          <View style={styles.gridCard}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '15' }]}>
              <Activity color={theme.colors.primary} size={20} />
            </View>
            <Typography style={styles.gridLabel}>Amount Played</Typography>
            <Typography weight="700" style={styles.gridValue}>₹{stats?.todayBidsAmount}</Typography>
            <Typography style={styles.gridSub}>Across {stats?.todayBidsCount} bids</Typography>
          </View>

          {/* Total Won Today */}
          <View style={styles.gridCard}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.danger + '15' }]}>
              <ArrowDownCircle color={theme.colors.danger} size={20} />
            </View>
            <Typography style={styles.gridLabel}>Amount Won</Typography>
            <Typography weight="700" style={[styles.gridValue, { color: theme.colors.danger }]}>
              ₹{stats?.todayWinsAmount}
            </Typography>
            <Typography style={styles.gridSub}>Paid out to users</Typography>
          </View>
        </View>

        <Typography weight="700" style={styles.sectionTitle}>Platform Health</Typography>
        
        <View style={styles.grid}>
          {/* Total Users */}
          <View style={styles.gridCard}>
            <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
              <Users color="#0284C7" size={20} />
            </View>
            <Typography style={styles.gridLabel}>Active Users</Typography>
            <Typography weight="700" style={styles.gridValue}>{stats?.totalUsers}</Typography>
          </View>

          {/* Total Liability */}
          <View style={styles.gridCard}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF9C3' }]}>
              <Wallet color="#CA8A04" size={20} />
            </View>
            <Typography style={styles.gridLabel}>Total Liability</Typography>
            <Typography weight="700" style={styles.gridValue}>₹{stats?.totalLiability}</Typography>
            <Typography style={styles.gridSub}>Total user balances</Typography>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  
  header: { padding: theme.spacing.m, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  headerTitle: { fontSize: 24, color: theme.colors.textDark },
  headerSubtitle: { fontSize: 14, color: theme.colors.textMuted, marginTop: 4 },
  
  scrollContent: { padding: theme.spacing.m, paddingBottom: 40 },
  
  // Main Card
  mainCard: { padding: 24, borderRadius: theme.radius.xl, marginBottom: 24, ...theme.shadows.card },
  profitBg: { backgroundColor: theme.colors.success },
  lossBg: { backgroundColor: theme.colors.danger },
  mainCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  mainCardLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 16 },
  mainAmount: { color: '#fff', fontSize: 36, marginBottom: 8 },
  mainSubText: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  
  sectionTitle: { fontSize: 18, color: theme.colors.textDark, marginBottom: 12, marginLeft: 4 },
  
  // Grid System
  grid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 24 },
  gridCard: { width: '48%', backgroundColor: theme.colors.surface, padding: 16, borderRadius: theme.radius.l, marginBottom: 16, ...theme.shadows.card },
  iconBox: { width: 40, height: 40, borderRadius: theme.radius.round, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  gridLabel: { fontSize: 12, color: theme.colors.textMuted, marginBottom: 4 },
  gridValue: { fontSize: 20, color: theme.colors.textDark, marginBottom: 4 },
  gridSub: { fontSize: 11, color: theme.colors.textMuted }
});