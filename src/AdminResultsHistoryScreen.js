// import React, { useState, useCallback } from 'react';

// import { 
//   View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, 
//   Modal, SafeAreaView as SafeAreaViewNative 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';
// import { History, X, Trophy, CheckCircle2, XCircle, User } from 'lucide-react-native';
// import api from './api';
// import { theme } from './theme';
// import Typography from './components/Typography';

// export default function AdminResultsHistoryScreen() {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Modal State for showing Winners/Losers
//   const [detailsModalVisible, setDetailsModalVisible] = useState(false);
//   const [selectedResult, setSelectedResult] = useState(null);
//   const [bids, setBids] = useState([]);
//   const [loadingBids, setLoadingBids] = useState(false);

//   const fetchResults = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('/admin/markets/results-history');
//       setResults(response.data);
//     } catch (error) {
//       console.log("Failed to fetch results history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(useCallback(() => { fetchResults(); }, []));

//   const openResultDetails = async (result) => {
//     setSelectedResult(result);
//     setDetailsModalVisible(true);
//     setLoadingBids(true);
//     try {
//       const response = await api.get(`/admin/markets/results/${result.id}/bids`);
//       setBids(response.data);
//     } catch (error) {
//       console.log("Failed to fetch bids");
//     } finally {
//       setLoadingBids(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString('en-IN', { 
//       day: '2-digit', month: 'short', year: 'numeric', 
//       hour: '2-digit', minute: '2-digit', hour12: true 
//     });
//   };

//   const renderResultCard = ({ item }) => (
//     <TouchableOpacity style={styles.card} onPress={() => openResultDetails(item)}>
//       <View style={styles.cardHeader}>
//         <View>
//           <Typography weight="700" style={styles.marketName}>{item.market_name}</Typography>
//           <Typography style={styles.dateText}>{formatDate(item.declared_at)}</Typography>
//         </View>
//         <View style={styles.sessionBadge}>
//           <Typography weight="600" style={styles.sessionText}>{item.session}</Typography>
//         </View>
//       </View>
      
//       <View style={styles.winningRow}>
//         <Typography style={styles.winningLabel}>Winning Number:</Typography>
//         <View style={styles.numberBox}>
//           <Typography weight="700" style={styles.winningNumber}>{item.winning_number}</Typography>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderBidCard = ({ item }) => {
//     const isWin = item.status === 'WIN';
//     return (
//       <View style={[styles.bidCard, isWin ? styles.bidCardWin : styles.bidCardLoss]}>
//         <View style={styles.bidUserInfo}>
//           <View style={[styles.avatar, isWin ? {backgroundColor: '#D1FAE5'} : {backgroundColor: '#FEE2E2'}]}>
//             <User color={isWin ? "#10B981" : "#EF4444"} size={16} />
//           </View>
//           <View>
//             <Typography weight="600" style={styles.bidUserName}>{item.full_name}</Typography>
//             <Typography style={styles.bidUserPhone}>{item.phone_number}</Typography>
//           </View>
//         </View>
        
//         <View style={styles.bidStats}>
//           <Typography style={styles.bidNumberLabel}>Played: <Typography weight="700" style={{color: '#333'}}>{item.bid_number}</Typography></Typography>
//           <Typography weight="700" style={styles.bidAmount}>₹{item.amount}</Typography>
//           <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
//             {isWin ? <CheckCircle2 color="#10B981" size={12} style={{marginRight: 4}}/> : <XCircle color="#EF4444" size={12} style={{marginRight: 4}}/>}
//             <Typography weight="700" style={{fontSize: 10, color: isWin ? '#10B981' : '#EF4444'}}>{item.status}</Typography>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <View style={styles.header}>
//         <Typography weight="700" style={styles.headerTitle}>Results History</Typography>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
//       ) : results.length === 0 ? (
//         <View style={styles.emptyState}>
//           <History color={theme.colors.textMuted} size={48} />
//           <Typography style={styles.emptyText}>No results declared yet.</Typography>
//         </View>
//       ) : (
//         <FlatList
//           data={results}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderResultCard}
//           contentContainerStyle={styles.listContent}
//           refreshing={loading}
//           onRefresh={fetchResults}
//         />
//       )}

//       {/* FULL SCREEN MODAL FOR BIDS (WINNERS/LOSERS) */}
//       <Modal animationType="slide" visible={detailsModalVisible} onRequestClose={() => setDetailsModalVisible(false)}>
//         <SafeAreaViewNative style={{ flex: 1, backgroundColor: theme.colors.background }}>
//           <View style={styles.modalHeader}>
//             <View>
//               <Typography weight="700" style={styles.modalTitle}>{selectedResult?.market_name}</Typography>
//               <Typography style={styles.modalSub}>{selectedResult?.session} • Num: {selectedResult?.winning_number}</Typography>
//             </View>
//             <TouchableOpacity onPress={() => setDetailsModalVisible(false)} style={styles.closeBtn}>
//               <X color={theme.colors.textDark} size={24} />
//             </TouchableOpacity>
//           </View>

//           {loadingBids ? (
//             <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
//           ) : bids.length === 0 ? (
//             <View style={styles.emptyState}>
//               <Typography style={styles.emptyText}>No bids were placed on this game.</Typography>
//             </View>
//           ) : (
//             <FlatList
//               data={bids}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={renderBidCard}
//               contentContainerStyle={styles.listContent}
//             />
//           )}
//         </SafeAreaViewNative>
//       </Modal>

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: theme.colors.background },
//   header: { padding: theme.spacing.m, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
//   headerTitle: { fontSize: 24, color: theme.colors.textDark },
//   listContent: { padding: theme.spacing.m, paddingBottom: 40 },
  
//   card: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: theme.radius.l, marginBottom: theme.spacing.m, ...theme.shadows.card },
//   cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: theme.colors.background, paddingBottom: 12, marginBottom: 12 },
//   marketName: { fontSize: 18, color: theme.colors.textDark, textTransform: 'uppercase' },
//   dateText: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
//   sessionBadge: { backgroundColor: theme.colors.primaryLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
//   sessionText: { color: theme.colors.primary, fontSize: 12 },
  
//   winningRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   winningLabel: { fontSize: 14, color: theme.colors.textMuted },
//   numberBox: { backgroundColor: theme.colors.success + '20', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
//   winningNumber: { fontSize: 20, color: theme.colors.success },

//   emptyState: { alignItems: 'center', marginTop: 100 },
//   emptyText: { color: theme.colors.textMuted, marginTop: 16, fontSize: 16 },

//   // Modal Styles
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.m, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
//   modalTitle: { fontSize: 20, color: theme.colors.textDark, textTransform: 'uppercase' },
//   modalSub: { fontSize: 14, color: theme.colors.primary, marginTop: 2, fontWeight: '600' },
//   closeBtn: { padding: 8, backgroundColor: theme.colors.background, borderRadius: 20 },

//   // Bid Card Styles
//   bidCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 12, borderRadius: theme.radius.m, marginBottom: 10, borderWidth: 1 },
//   bidCardWin: { borderColor: '#10B981' },
//   bidCardLoss: { borderColor: theme.colors.border },
//   bidUserInfo: { flexDirection: 'row', alignItems: 'center' },
//   avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   bidUserName: { fontSize: 14, color: theme.colors.textDark },
//   bidUserPhone: { fontSize: 11, color: theme.colors.textMuted },
//   bidStats: { alignItems: 'flex-end' },
//   bidNumberLabel: { fontSize: 12, color: theme.colors.textMuted },
//   bidAmount: { fontSize: 16, color: theme.colors.textDark, marginTop: 2 }
// });




import React, { useState, useCallback } from 'react';
import { 
  View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, 
  Modal, SafeAreaView as SafeAreaViewNative 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { History, X, CheckCircle2, XCircle, User } from 'lucide-react-native';
import api from './api';
import { theme } from './theme';
import Typography from './components/Typography';

export default function AdminResultsHistoryScreen() {
  const [activeTab, setActiveTab] = useState('MAIN'); // 'MAIN' or 'GALI_DESAWAR'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for showing Winners/Losers
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);

  const fetchResults = async (tab = activeTab) => {
    setLoading(true);
    try {
      const endpoint =
        tab === 'GALI_DESAWAR'
          ? '/gali-desawar/results-history'
          : '/admin/markets/results-history';

      const response = await api.get(endpoint);
      setResults(response.data);
    } catch (error) {
      console.log('Failed to fetch results history:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchResults(activeTab);
    }, [activeTab])
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchResults(tab);
  };

  const openResultDetails = async (result) => {
    setSelectedResult(result);
    setDetailsModalVisible(true);
    setLoadingBids(true);
    try {
      const endpoint =
        activeTab === 'GALI_DESAWAR'
          ? `/gali-desawar/results/${result.id}/bids`
          : `/admin/markets/results/${result.id}/bids`;

      const response = await api.get(endpoint);
      setBids(response.data);
    } catch (error) {
      console.log('Failed to fetch bids:', error);
      setBids([]);
    } finally {
      setLoadingBids(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-IN', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
  };

  const renderResultCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openResultDetails(item)}>
      <View style={styles.cardHeader}>
        <View>
          <Typography weight="700" style={styles.marketName}>
            {item.market_name || item.name}
          </Typography>
          <Typography style={styles.dateText}>{formatDate(item.declared_at)}</Typography>
        </View>

        {item.session ? (
          <View style={styles.sessionBadge}>
            <Typography weight="600" style={styles.sessionText}>
              {item.session}
            </Typography>
          </View>
        ) : (
          <View style={[styles.sessionBadge, styles.galiBadge]}>
            <Typography weight="600" style={styles.galiBadgeText}>
              GALI DESAWAR
            </Typography>
          </View>
        )}
      </View>
      
      <View style={styles.winningRow}>
        <Typography style={styles.winningLabel}>Winning Number:</Typography>
        <View style={styles.numberBox}>
          <Typography weight="700" style={styles.winningNumber}>
            {item.winning_number}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBidCard = ({ item }) => {
    const isWin = item.status === 'WIN';
    return (
      <View style={[styles.bidCard, isWin ? styles.bidCardWin : styles.bidCardLoss]}>
        <View style={styles.bidUserInfo}>
          <View style={[styles.avatar, isWin ? { backgroundColor: '#D1FAE5' } : { backgroundColor: '#FEE2E2' }]}>
            <User color={isWin ? '#10B981' : '#EF4444'} size={16} />
          </View>
          <View>
            <Typography weight="600" style={styles.bidUserName}>{item.full_name}</Typography>
            <Typography style={styles.bidUserPhone}>{item.phone_number}</Typography>
          </View>
        </View>
        
        <View style={styles.bidStats}>
          <Typography style={styles.bidNumberLabel}>
            Played: <Typography weight="700" style={{ color: '#333' }}>{item.bid_number}</Typography>
          </Typography>
          <Typography weight="700" style={styles.bidAmount}>₹{item.amount}</Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            {isWin ? (
              <CheckCircle2 color="#10B981" size={12} style={{ marginRight: 4 }} />
            ) : (
              <XCircle color="#EF4444" size={12} style={{ marginRight: 4 }} />
            )}
            <Typography weight="700" style={{ fontSize: 10, color: isWin ? '#10B981' : '#EF4444' }}>
              {item.status}
            </Typography>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Typography weight="700" style={styles.headerTitle}>Results History</Typography>
      </View>

      {/* TABS HEADER */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'MAIN' && styles.activeTabButton]}
          onPress={() => handleTabChange('MAIN')}
        >
          <Typography weight="700" style={[styles.tabText, activeTab === 'MAIN' && styles.activeTabText]}>
            MAIN MARKETS
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'GALI_DESAWAR' && styles.activeTabButton]}
          onPress={() => handleTabChange('GALI_DESAWAR')}
        >
          <Typography weight="700" style={[styles.tabText, activeTab === 'GALI_DESAWAR' && styles.activeTabText]}>
            GALI DESAWAR
          </Typography>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
      ) : results.length === 0 ? (
        <View style={styles.emptyState}>
          <History color={theme.colors.textMuted} size={48} />
          <Typography style={styles.emptyText}>No results declared yet.</Typography>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderResultCard}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={() => fetchResults(activeTab)}
        />
      )}

      {/* FULL SCREEN MODAL FOR BIDS */}
      <Modal animationType="slide" visible={detailsModalVisible} onRequestClose={() => setDetailsModalVisible(false)}>
        <SafeAreaViewNative style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <View style={styles.modalHeader}>
            <View>
              <Typography weight="700" style={styles.modalTitle}>
                {selectedResult?.market_name || selectedResult?.name}
              </Typography>
              <Typography style={styles.modalSub}>
                {selectedResult?.session ? `${selectedResult?.session} • ` : ''}Num: {selectedResult?.winning_number}
              </Typography>
            </View>
            <TouchableOpacity onPress={() => setDetailsModalVisible(false)} style={styles.closeBtn}>
              <X color={theme.colors.textDark} size={24} />
            </TouchableOpacity>
          </View>

          {loadingBids ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
          ) : bids.length === 0 ? (
            <View style={styles.emptyState}>
              <Typography style={styles.emptyText}>No bids were placed on this game.</Typography>
            </View>
          ) : (
            <FlatList
              data={bids}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderBidCard}
              contentContainerStyle={styles.listContent}
            />
          )}
        </SafeAreaViewNative>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: theme.spacing.m, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  headerTitle: { fontSize: 24, color: theme.colors.textDark },

  // Tabs
  tabContainer: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  tabButton: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTabButton: { borderBottomColor: theme.colors.primary },
  tabText: { fontSize: 13, color: theme.colors.textMuted },
  activeTabText: { color: theme.colors.primary },

  listContent: { padding: theme.spacing.m, paddingBottom: 40 },
  
  card: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: theme.radius.l, marginBottom: theme.spacing.m, ...theme.shadows.card },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: theme.colors.background, paddingBottom: 12, marginBottom: 12 },
  marketName: { fontSize: 18, color: theme.colors.textDark, textTransform: 'uppercase' },
  dateText: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
  sessionBadge: { backgroundColor: theme.colors.primaryLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  sessionText: { color: theme.colors.primary, fontSize: 12 },
  galiBadge: { backgroundColor: '#FEF3C7' },
  galiBadgeText: { color: '#D97706', fontSize: 11 },
  
  winningRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  winningLabel: { fontSize: 14, color: theme.colors.textMuted },
  numberBox: { backgroundColor: theme.colors.success + '20', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  winningNumber: { fontSize: 20, color: theme.colors.success },

  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: theme.colors.textMuted, marginTop: 16, fontSize: 16 },

  // Modal Styles
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.m, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  modalTitle: { fontSize: 20, color: theme.colors.textDark, textTransform: 'uppercase' },
  modalSub: { fontSize: 14, color: theme.colors.primary, marginTop: 2, fontWeight: '600' },
  closeBtn: { padding: 8, backgroundColor: theme.colors.background, borderRadius: 20 },

  // Bid Card Styles
  bidCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 12, borderRadius: theme.radius.m, marginBottom: 10, borderWidth: 1 },
  bidCardWin: { borderColor: '#10B981' },
  bidCardLoss: { borderColor: theme.colors.border },
  bidUserInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  bidUserName: { fontSize: 14, color: theme.colors.textDark },
  bidUserPhone: { fontSize: 11, color: theme.colors.textMuted },
  bidStats: { alignItems: 'flex-end' },
  bidNumberLabel: { fontSize: 12, color: theme.colors.textMuted },
  bidAmount: { fontSize: 16, color: theme.colors.textDark, marginTop: 2 }
});