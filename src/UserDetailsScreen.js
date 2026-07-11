// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ArrowLeft, User, Wallet, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react-native';
// import api from './api'; // Your Axios instance

// const PRIMARY_COLOR = '#1E293B'; // Slate 900 for Admin

// export default function UserDetailsScreen({ route, navigation }) {
//   const { userId } = route.params; // Passed from your previous screen
  
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchUserDetails = async () => {
//     try {
//       const response = await api.get(`/admin/users/${userId}/details`);
//       setData(response.data);
//     } catch (error) {
//       console.log("Failed to fetch user details:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchUserDetails();
//   }, []);

//   const formatDate = (dateString) => {
//     const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
//     return new Date(dateString).toLocaleString('en-GB', options);
//   };

//   const renderHeader = () => {
//     if (!data) return null;
//     const { user, stats } = data;

//     return (
//       <View style={styles.headerSection}>
//         {/* User Profile Card */}
//         <View style={styles.profileCard}>
//           <View style={styles.avatarCircle}>
//             <User color="#fff" size={32} />
//           </View>
//           <View style={styles.profileInfo}>
//             <Text style={styles.userName}>{user.name}</Text>
//             <Text style={styles.userMobile}>{user.mobile}</Text>
//             <Text style={styles.userJoined}>Joined: {formatDate(user.created_at)}</Text>
//           </View>
//         </View>

//         {/* Stats Grid */}
//         <View style={styles.statsGrid}>
//           <View style={styles.statBox}>
//             <Wallet color="#64748B" size={20} />
//             <Text style={styles.statValue}>₹{user.wallet_balance}</Text>
//             <Text style={styles.statLabel}>Current Balance</Text>
//           </View>
//           <View style={styles.statBox}>
//             <TrendingUp color="#3B82F6" size={20} />
//             <Text style={[styles.statValue, {color: '#3B82F6'}]}>₹{stats.totalAmountPlayed}</Text>
//             <Text style={styles.statLabel}>Total Played</Text>
//           </View>
//           <View style={[styles.statBox, { width: '100%', marginTop: 10 }]}>
//             <CheckCircle2 color="#10B981" size={20} />
//             <Text style={[styles.statValue, {color: '#10B981'}]}>₹{stats.totalAmountWon}</Text>
//             <Text style={styles.statLabel}>Estimated Total Won</Text>
//           </View>
//         </View>
        
//         <Text style={styles.sectionTitle}>Detailed Bid History</Text>
//       </View>
//     );
//   };

//   const renderBidCard = ({ item }) => {
//     const isWin = item.status === 'WIN';
//     const isLoss = item.status === 'LOSS';
//     const isPending = item.status === 'PENDING';

//     let statusColor = '#F59E0B'; // Amber
//     let statusBg = '#FEF3C7';
//     let StatusIcon = Clock;

//     if (isWin) {
//       statusColor = '#10B981'; statusBg = '#D1FAE5'; StatusIcon = CheckCircle2;
//     } else if (isLoss) {
//       statusColor = '#EF4444'; statusBg = '#FEE2E2'; StatusIcon = XCircle;
//     }

//     return (
//       <View style={styles.bidCard}>
//         <View style={styles.bidHeader}>
//           <View>
//             <Text style={styles.marketName}>{item.market_name}</Text>
//             <Text style={styles.dateText}>{formatDate(item.placed_at)}</Text>
//           </View>
//           <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
//             <StatusIcon color={statusColor} size={14} style={{ marginRight: 4 }} />
//             <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
//           </View>
//         </View>

//         <View style={styles.bidDetails}>
//           <View style={styles.detailCol}>
//             <Text style={styles.detailLabel}>Game Type</Text>
//             <Text style={styles.detailValue}>{item.game_type.replace('_', ' ')}</Text>
//           </View>
//           <View style={styles.detailCol}>
//             <Text style={styles.detailLabel}>Session</Text>
//             <Text style={styles.detailValue}>{item.session}</Text>
//           </View>
//           <View style={styles.detailCol}>
//             <Text style={styles.detailLabel}>Number</Text>
//             <Text style={styles.bidNumber}>{item.bid_number}</Text>
//           </View>
//           <View style={[styles.detailCol, { alignItems: 'flex-end' }]}>
//             <Text style={styles.detailLabel}>Amount</Text>
//             <Text style={styles.bidAmount}>₹{item.amount}</Text>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Top Navbar */}
//       <View style={styles.navBar}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8 }}>
//           <ArrowLeft color="#fff" size={24} />
//         </TouchableOpacity>
//         <Text style={styles.navTitle}>User Details</Text>
//         <View style={{ width: 40 }} />
//       </View>

//       {loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator size="large" color={PRIMARY_COLOR} />
//         </View>
//       ) : (
//         <FlatList
//           data={data?.bids || []}
//           keyExtractor={(item) => item.id.toString()}
//           ListHeaderComponent={renderHeader}
//           renderItem={renderBidCard}
//           contentContainerStyle={styles.listContent}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>This user hasn't placed any bids yet.</Text>
//           }
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F1F5F9' },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
//   navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: PRIMARY_COLOR, padding: 16 },
//   navTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  
//   listContent: { padding: 16, paddingBottom: 40 },
  
//   // Header Section Styles
//   headerSection: { marginBottom: 20 },
//   profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: PRIMARY_COLOR, padding: 20, borderRadius: 16, marginBottom: 16 },
//   avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
//   userName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
//   userMobile: { color: '#94A3B8', fontSize: 16, marginBottom: 4 },
//   userJoined: { color: '#64748B', fontSize: 12 },
  
//   statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
//   statBox: { width: '48%', backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', elevation: 1 },
//   statValue: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginTop: 8 },
//   statLabel: { fontSize: 12, color: '#64748B', marginTop: 4 },
  
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, marginLeft: 4 },
  
//   // Bid Card Styles
//   bidCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
//   bidHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 12, marginBottom: 12 },
//   marketName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', textTransform: 'uppercase' },
//   dateText: { fontSize: 12, color: '#64748B', marginTop: 2 },
//   statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
//   statusText: { fontSize: 12, fontWeight: 'bold' },
  
//   bidDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   detailCol: { flex: 1 },
//   detailLabel: { fontSize: 11, color: '#64748B', marginBottom: 4, textTransform: 'uppercase' },
//   detailValue: { fontSize: 14, color: '#334155', fontWeight: '600', textTransform: 'capitalize' },
//   bidNumber: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', letterSpacing: 1 },
//   bidAmount: { fontSize: 16, fontWeight: 'bold', color: PRIMARY_COLOR },
  
//   emptyText: { textAlign: 'center', color: '#64748B', marginTop: 40, fontSize: 16 }
// });















// After implementing filter and pagination in user card
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Wallet, CheckCircle2, XCircle, Clock, TrendingUp, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Assuming you use this standard library
import api from './api'; 
import Typography from "./components/Typography";

const PRIMARY_COLOR = '#1E293B'; 

export default function UserDetailsScreen({ route, navigation }) {
  const { userId } = route.params; 
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // --- Pagination & Filter States ---
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Default to today
  const [startDate, setStartDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [endDate, setEndDate] = useState(new Date(new Date().setHours(23, 59, 59, 999)));
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState('start'); // 'start' or 'end'

  // Assume you fetch this boolean when you load the user's details
  const [isSuspended, setIsSuspended] = useState(false); 
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleSuspend = () => {
    const action = isSuspended ? "Reactivate" : "Suspend";
    const warning = isSuspended 
      ? "This user will regain full access to the app." 
      : "This user will be immediately logged out and blocked from placing bets or withdrawing funds.";

    Alert.alert(`${action} User?`, warning, [
      { text: "Cancel", style: "cancel" },
      { 
        text: `Yes, ${action}`, 
        style: isSuspended ? "default" : "destructive",
        onPress: async () => {
          setIsToggling(true);
          try {
            const response = await api.put(`/admin/users/${userId}/toggle-suspend`);
            setIsSuspended(response.data.is_suspended);
            Alert.alert("Success", response.data.message);
          } catch (error) {
            Alert.alert("Error", "Failed to update user status.");
          } finally {
            setIsToggling(false);
          }
        }
      }
    ]);
  };

  const fetchUserDetails = async (currentPage = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users/${userId}/details`, {
        params: {
          page: currentPage,
          limit: 15,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      setData(response.data);
      setTotalPages(response.data.pagination.totalPages);
      setPage(response.data.pagination.currentPage);
    } catch (error) {
      console.log("Failed to fetch user details:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch when page or dates change
  useEffect(() => {
    fetchUserDetails(page);
  }, [page, startDate, endDate]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserDetails(1);
  }, [startDate, endDate]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (dateType === 'start') {
        selectedDate.setHours(0, 0, 0, 0);
        setStartDate(selectedDate);
      } else {
        selectedDate.setHours(23, 59, 59, 999);
        setEndDate(selectedDate);
      }
      setPage(1); // Reset to page 1 when filter changes
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  const formatShortDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderHeader = () => {
    if (!data) return null;
    const { user, stats } = data;

    return (
      <View style={styles.headerSection}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <User color="#fff" size={32} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userMobile}>{user.mobile}</Text>
            <Text style={styles.userJoined}>Joined: {formatDate(user.created_at)}</Text>
          </View>
        </View>

        <TouchableOpacity 
        style={[
          styles.suspendBtn, 
          isSuspended ? styles.suspendBtnActive : styles.suspendBtnDanger
        ]}
        onPress={handleToggleSuspend}
        disabled={isToggling}
      >
        <Typography weight="700" style={styles.suspendBtnText}>
          {isToggling ? "Updating..." : (isSuspended ? "UNBAN USER" : "SUSPEND USER")}
        </Typography>
      </TouchableOpacity>

        {/* Stats Grid (These are now lifetime stats!) */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Wallet color="#64748B" size={20} />
            <Text style={styles.statValue}>₹{user.wallet_balance}</Text>
            <Text style={styles.statLabel}>Current Balance</Text>
          </View>
          <View style={styles.statBox}>
            <TrendingUp color="#3B82F6" size={20} />
            <Text style={[styles.statValue, {color: '#3B82F6'}]}>₹{stats.totalAmountPlayed}</Text>
            <Text style={styles.statLabel}>Total Played</Text>
          </View>
          <View style={[styles.statBox, { width: '100%', marginTop: 10 }]}>
            <CheckCircle2 color="#10B981" size={20} />
            <Text style={[styles.statValue, {color: '#10B981'}]}>₹{stats.totalAmountWon}</Text>
            <Text style={styles.statLabel}>Total Won</Text>
          </View>
        </View>
        
        {/* Date Filter Row */}
        <View style={styles.filterRow}>
            <TouchableOpacity 
                style={styles.dateBtn} 
                onPress={() => { setDateType('start'); setShowDatePicker(true); }}
            >
                <CalendarIcon color="#64748B" size={16} style={{marginRight: 6}} />
                <Text style={styles.dateBtnText}>{formatShortDate(startDate)}</Text>
            </TouchableOpacity>
            
            <Text style={{color: '#94A3B8', marginHorizontal: 8}}>to</Text>
            
            <TouchableOpacity 
                style={styles.dateBtn} 
                onPress={() => { setDateType('end'); setShowDatePicker(true); }}
            >
                <CalendarIcon color="#64748B" size={16} style={{marginRight: 6}} />
                <Text style={styles.dateBtnText}>{formatShortDate(endDate)}</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Detailed Bid History</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!data || totalPages <= 1) return null;
    return (
        <View style={styles.paginationRow}>
            <TouchableOpacity 
                style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]} 
                disabled={page === 1} 
                onPress={() => setPage(page - 1)}
            >
                <ChevronLeft color={page === 1 ? "#94A3B8" : PRIMARY_COLOR} size={20} />
                <Text style={[styles.pageBtnText, page === 1 && {color: '#94A3B8'}]}>Prev</Text>
            </TouchableOpacity>
            
            <Text style={styles.pageInfo}>Page {page} of {totalPages}</Text>
            
            <TouchableOpacity 
                style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]} 
                disabled={page === totalPages} 
                onPress={() => setPage(page + 1)}
            >
                <Text style={[styles.pageBtnText, page === totalPages && {color: '#94A3B8'}]}>Next</Text>
                <ChevronRight color={page === totalPages ? "#94A3B8" : PRIMARY_COLOR} size={20} />
            </TouchableOpacity>
        </View>
    );
  }

  const renderBidCard = ({ item }) => {
    const isWin = item.status === 'WIN';
    const isLoss = item.status === 'LOSS';

    let statusColor = '#F59E0B'; 
    let statusBg = '#FEF3C7';
    let StatusIcon = Clock;

    if (isWin) {
      statusColor = '#10B981'; statusBg = '#D1FAE5'; StatusIcon = CheckCircle2;
    } else if (isLoss) {
      statusColor = '#EF4444'; statusBg = '#FEE2E2'; StatusIcon = XCircle;
    }

    return (
      <View style={styles.bidCard}>
        <View style={styles.bidHeader}>
          <View>
            <Text style={styles.marketName}>{item.market_name}</Text>
            <Text style={styles.dateText}>{formatDate(item.placed_at)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <StatusIcon color={statusColor} size={14} style={{ marginRight: 4 }} />
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.bidDetails}>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Game Type</Text>
            <Text style={styles.detailValue}>{item.game_type.replace('_', ' ')}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Session</Text>
            <Text style={styles.detailValue}>{item.session}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Number</Text>
            <Text style={styles.bidNumber}>{item.bid_number}</Text>
          </View>
          <View style={[styles.detailCol, { alignItems: 'flex-end' }]}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.bidAmount}>₹{item.amount}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8 }}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>User Details</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && !data ? (
        <View style={styles.center}><ActivityIndicator size="large" color={PRIMARY_COLOR} /></View>
      ) : (
        <FlatList
          data={data?.bids || []}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          renderItem={renderBidCard}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No bids found for this date range.</Text>
          }
        />
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={dateType === 'start' ? startDate : endDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: PRIMARY_COLOR, padding: 16 },
  navTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  listContent: { padding: 16, paddingBottom: 40 },
  
  headerSection: { marginBottom: 20 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: PRIMARY_COLOR, padding: 20, borderRadius: 16, marginBottom: 16 },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  userName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  userMobile: { color: '#94A3B8', fontSize: 16, marginBottom: 4 },
  userJoined: { color: '#64748B', fontSize: 12 },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { width: '48%', backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', elevation: 1 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 4 },

  // Filter Styles
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  dateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  dateBtnText: { color: '#334155', fontWeight: '600', fontSize: 14 },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, marginLeft: 4 },
  
  bidCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  bidHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 12, marginBottom: 12 },
  marketName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', textTransform: 'uppercase' },
  dateText: { fontSize: 12, color: '#64748B', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  
  bidDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailCol: { flex: 1 },
  detailLabel: { fontSize: 11, color: '#64748B', marginBottom: 4, textTransform: 'uppercase' },
  detailValue: { fontSize: 14, color: '#334155', fontWeight: '600', textTransform: 'capitalize' },
  bidNumber: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', letterSpacing: 1 },
  bidAmount: { fontSize: 16, fontWeight: 'bold', color: PRIMARY_COLOR },
  
  emptyText: { textAlign: 'center', color: '#64748B', marginTop: 40, fontSize: 16 },

  // Pagination Styles
  paginationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingHorizontal: 10 },
  pageBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: PRIMARY_COLOR },
  pageBtnDisabled: { borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  pageBtnText: { color: PRIMARY_COLOR, fontWeight: 'bold', fontSize: 14, marginHorizontal: 4 },
  pageInfo: { fontSize: 14, fontWeight: '600', color: '#64748B' },

  suspendBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 1,
  },
  suspendBtnDanger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  suspendBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  suspendBtnText: {
    fontSize: 14,
    color: '#333', // Default text color, you can change based on state if desired
  }
});