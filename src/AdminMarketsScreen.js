import React, { useState, useCallback } from 'react';
import { 
  View, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, 
  Modal, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Clock, X, AlertCircle } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from './api';
import { theme } from './theme';
import Typography from './components/Typography';

// Helper to check if current time is between open and close times
const checkIsMarketOpenRightNow = (openTimeStr, closeTimeStr, isActive) => {
  // If the admin manually turned off the master switch, it's immediately closed.
  if (!isActive) return false; 
  if (!openTimeStr || !closeTimeStr) return false; // Safety fallback

  const now = new Date();
  
  // Parse Open Time (e.g., "08:00:00")
  const [openHour, openMin] = openTimeStr.split(':').map(Number);
  const openDate = new Date();
  openDate.setHours(openHour, openMin, 0, 0);

  // Parse Close Time (e.g., "23:59:00")
  const [closeHour, closeMin] = closeTimeStr.split(':').map(Number);
  const closeDate = new Date();
  closeDate.setHours(closeHour, closeMin, 0, 0);

  // It is ONLY open if current time is after open AND before close
  return now >= openDate && now <= closeDate;
};

export default function AdminMarketsScreen() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [session, setSession] = useState('OPEN'); // 'OPEN' or 'CLOSE'
  const [winningNumber, setWinningNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [liabilityData, setLiabilityData] = useState({ totalCollected: 0, liabilities: [] });
  const [isLoadingLiability, setIsLoadingLiability] = useState(false);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/markets');
      setMarkets(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch markets");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchMarkets(); }, []));

  React.useEffect(() => {
    const fetchLiability = async () => {
      if (!modalVisible || !selectedMarket) return;
      
      setIsLoadingLiability(true);
      try {
        const response = await api.get(`/admin/markets/${selectedMarket.id}/liability?session=${session}`);
        setLiabilityData(response.data);
      } catch (error) {
        console.log("Failed to fetch liability", error);
      } finally {
        setIsLoadingLiability(false);
      }
    };

    fetchLiability();
  }, [modalVisible, session, selectedMarket]);

  const openDeclareModal = (market) => {
    setSelectedMarket(market);
    setSession('OPEN');
    setWinningNumber('');
    setModalVisible(true);
  };

  const handleDeclareResult = async () => {
    if (!winningNumber) {
      Alert.alert("Invalid Input", "Please enter a winning number.");
      return;
    }

    Alert.alert(
      "Confirm Declaration",
      `Are you absolutely sure you want to declare ${winningNumber} as the ${session} result for ${selectedMarket.name}?\n\nThis will immediately distribute funds to winners and cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Declare", 
          style: "destructive", 
          onPress: submitResult 
        }
      ]
    );
  };

  const submitResult = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/admin/markets/declare-result', {
        market_id: selectedMarket.id,
        session: session,
        winning_number: winningNumber
      });
      
      Alert.alert("Success", `${response.data.message}\nTotal Winners: ${response.data.totalWinners}`);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to declare result.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMarketCard = ({ item }) => {
    // 1. Get the TRUE real-time status using our helper function
    const isTakingBetsRightNow = checkIsMarketOpenRightNow(
      item.open_time, 
      item.close_time, 
      item.is_active
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Typography weight="700" style={styles.marketName}>{item.name}</Typography>
            
            {/* Show the actual schedule */}
            <Typography style={styles.marketTime}>
              {item.open_time?.substring(0,5)} - {item.close_time?.substring(0,5)}
            </Typography>
          </View>
          
          <View style={{ alignItems: 'flex-end' }}>
            {/* LIVE STATUS INDICATOR */}
            <View style={[styles.statusBadge, isTakingBetsRightNow ? styles.statusActive : styles.statusClosed, { marginBottom: 8 }]}>
              <Typography weight="600" style={[styles.statusText, isTakingBetsRightNow ? styles.textActive : styles.textClosed]}>
                {isTakingBetsRightNow ? "LIVE: TAKING BETS" : "BETTING CLOSED"}
              </Typography>
            </View>
          </View>
        </View>

        {/* 
          DECLARE RESULT BUTTON LOGIC:
          You can ONLY declare a result if the market is NOT currently taking bets.
        */}
        <TouchableOpacity 
          style={[
            styles.declareBtn, 
            isTakingBetsRightNow ? styles.declareBtnDisabled : null 
          ]}
          onPress={() => openDeclareModal(item)}
          disabled={isTakingBetsRightNow} // Locked while bets are live!
        >
          <Trophy color="#fff" size={18} style={{ marginRight: 8 }} />
          <Typography weight="700" style={styles.declareBtnText}>
             {isTakingBetsRightNow ? "Wait for Close Time" : "Declare Result"}
          </Typography>
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Typography weight="700" style={styles.headerTitle}>Market Results</Typography>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={markets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMarketCard}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchMarkets}
        />
      )}

      {/* DECLARE RESULT MODAL */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography weight="700" style={styles.modalTitle}>Declare Result</Typography>
              <TouchableOpacity onPress={() => setModalVisible(false)}><X color={theme.colors.textMuted} size={24} /></TouchableOpacity>
            </View>

            <View style={styles.warningBox}>
              <AlertCircle color="#D97706" size={20} style={{ marginRight: 8 }} />
              <Typography style={styles.warningText}>This action distributes real funds.</Typography>
            </View>

            <Typography style={styles.label}>Market</Typography>
            <Typography weight="700" style={styles.marketHighlight}>{selectedMarket?.name}</Typography>

            <Typography style={styles.label}>Session</Typography>
            <View style={styles.sessionToggleRow}>
              <TouchableOpacity 
                style={[styles.sessionBtn, session === 'OPEN' && styles.sessionBtnActive]}
                onPress={() => setSession('OPEN')}
              >
                <Typography weight="600" style={[styles.sessionText, session === 'OPEN' && styles.sessionTextActive]}>OPEN</Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sessionBtn, session === 'CLOSE' && styles.sessionBtnActive]}
                onPress={() => setSession('CLOSE')}
              >
                <Typography weight="600" style={[styles.sessionText, session === 'CLOSE' && styles.sessionTextActive]}>CLOSE</Typography>
              </TouchableOpacity>
            </View>

            <Typography style={styles.label}>Winning Number (Single Digit)</Typography>
            <TextInput
              style={styles.numberInput}
              keyboardType="number-pad"
              maxLength={1} // Assuming single digit game (Jodi/Panna requires adjusting UI)
              value={winningNumber}
              onChangeText={setWinningNumber}
              placeholder="0-9"
              placeholderTextColor={theme.colors.border}
            />

            {/* --- LIVE LIABILITY DASHBOARD --- */}
            {winningNumber !== '' && !isLoadingLiability && (
              <View style={styles.liabilityContainer}>
                {(() => {
                  // Find the math for the specific number they just typed
                  const currentRisk = liabilityData.liabilities.find(l => l.bid_number === winningNumber);
                  const payoutAmount = currentRisk ? currentRisk.potential_payout : 0;
                  const profitLoss = liabilityData.totalCollected - payoutAmount;
                  const isLoss = profitLoss < 0;

                  return (
                    <>
                      <View style={styles.liabilityRow}>
                        <Typography style={styles.liabilityLabel}>Total Collected Today:</Typography>
                        <Typography weight="700" style={{ color: theme.colors.textDark }}>
                          ₹{liabilityData.totalCollected.toFixed(2)}
                        </Typography>
                      </View>
                      
                      <View style={styles.liabilityRow}>
                        <Typography style={styles.liabilityLabel}>Estimated Payout:</Typography>
                        <Typography weight="700" style={{ color: theme.colors.danger }}>
                          - ₹{payoutAmount.toFixed(2)}
                        </Typography>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.liabilityRow}>
                        <Typography weight="700" style={{ color: theme.colors.textDark }}>Platform Profit/Loss:</Typography>
                        <View style={[styles.profitBadge, isLoss ? styles.lossBg : styles.profitBg]}>
                          <Typography weight="800" style={isLoss ? styles.lossText : styles.profitText}>
                            {isLoss ? '-' : '+'} ₹{Math.abs(profitLoss).toFixed(2)}
                          </Typography>
                        </View>
                      </View>
                    </>
                  );
                })()}
              </View>
            )}
            {/* --------------------------------- */}

            <TouchableOpacity 
              style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handleDeclareResult}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Typography weight="700" style={styles.submitBtnText}>PUBLISH RESULT</Typography>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: theme.spacing.m, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  headerTitle: { fontSize: 24, color: theme.colors.textDark },
  listContent: { padding: theme.spacing.m, paddingBottom: 40 },
  
  card: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: theme.radius.l, marginBottom: theme.spacing.m, ...theme.shadows.card },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  marketName: { fontSize: 18, color: theme.colors.textDark, textTransform: 'uppercase' },
  marketTime: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusActive: { backgroundColor: theme.colors.success + '20' },
  statusClosed: { backgroundColor: theme.colors.danger + '20' },
  statusText: { fontSize: 10 },
  textActive: { color: theme.colors.success },
  textClosed: { color: theme.colors.danger },

  declareBtn: { flexDirection: 'row', backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: theme.radius.m, justifyContent: 'center', alignItems: 'center' },
  declareBtnText: { color: theme.colors.surface, fontSize: 14 },
  declareBtnDisabled: {
    backgroundColor: theme.colors.border, // Makes it look greyed out
    opacity: 0.7,
  },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, color: theme.colors.textDark },
  
  warningBox: { flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 12, borderRadius: theme.radius.m, marginBottom: 20, alignItems: 'center' },
  warningText: { color: '#D97706', fontSize: 12, fontWeight: '600' },

  label: { fontSize: 14, color: theme.colors.textMuted, marginBottom: 8, marginTop: 12 },
  marketHighlight: { fontSize: 22, color: theme.colors.primary, textTransform: 'uppercase', marginBottom: 8 },

  sessionToggleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sessionBtn: { flex: 0.48, paddingVertical: 12, borderRadius: theme.radius.m, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
  sessionBtnActive: { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary },
  sessionText: { color: theme.colors.textMuted, fontSize: 14 },
  sessionTextActive: { color: theme.colors.primary },

  numberInput: { backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.m, fontSize: 32, fontFamily: 'Inter_700Bold', color: theme.colors.textDark, textAlign: 'center', height: 80, marginBottom: 24 },
  
  submitBtn: { backgroundColor: theme.colors.danger, paddingVertical: 16, borderRadius: theme.radius.l, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, letterSpacing: 1 },

  liabilityContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    padding: 16,
    marginBottom: 24,
  },
  liabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liabilityLabel: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },
  profitBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  profitBg: { backgroundColor: '#D1FAE5' }, // Light Green
  lossBg: { backgroundColor: '#FEE2E2' },   // Light Red
  profitText: { color: '#059669', fontSize: 16 },
  lossText: { color: '#DC2626', fontSize: 16 },
});