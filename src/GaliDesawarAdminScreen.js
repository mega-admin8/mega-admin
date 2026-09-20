import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import { Plus, Edit2, Trash2, PauseCircle, PlayCircle, Clock, ShieldAlert } from 'lucide-react-native';
import api from './api'; // Adjust import path to your Axios API instance
import { theme } from './theme'; // Adjust import path to your theme object

export default function AdminMarketManagerScreen() {
  const [activeTab, setActiveTab] = useState('GALI_DESAWAR'); // 'STANDARD' | 'GALI_DESAWAR'
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formOpenTime, setFormOpenTime] = useState('');
  const [formCloseTime, setFormCloseTime] = useState('');
  const [formResultTime, setFormResultTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Markets
  const fetchMarkets = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'GALI_DESAWAR' 
        ? '/admin/gali-desawar/markets' 
        : '/admin/standard/markets';
      const response = await api.get(endpoint);
      setMarkets(response.data || []);
    } catch (error) {
      console.error('Fetch Markets Error:', error);
      Alert.alert('Error', 'Failed to fetch markets list.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingMarket(null);
    setFormName('');
    setFormOpenTime('');
    setFormCloseTime('');
    setFormResultTime('');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (market) => {
    setEditingMarket(market);
    setFormName(market.name);
    setFormOpenTime(market.open_time);
    setFormCloseTime(market.close_time);
    setFormResultTime(market.result_time);
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveMarket = async () => {
    if (!formName.trim() || !formOpenTime.trim() || !formCloseTime.trim() || !formResultTime.trim()) {
      return Alert.alert('Validation Error', 'Please fill in all market details.');
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        open_time: formOpenTime.trim(),
        close_time: formCloseTime.trim(),
        result_time: formResultTime.trim(),
      };

      if (editingMarket) {
        await api.put(`/admin/gali-desawar/markets/${editingMarket.id}`, payload);
        Alert.alert('Success', 'Market updated successfully.');
      } else {
        await api.post('/admin/gali-desawar/markets', payload);
        Alert.alert('Success', 'Market added successfully.');
      }

      setIsModalOpen(false);
      fetchMarkets();
    } catch (error) {
      console.error('Save Market Error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to save market.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Pause/Resume
  const handleToggleStatus = async (market) => {
    const newStatus = market.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
    try {
      await api.patch(`/admin/gali-desawar/markets/${market.id}/status`, { status: newStatus });
      fetchMarkets();
    } catch (error) {
      Alert.alert('Error', 'Failed to update market status.');
    }
  };

  // Delete Market
  const handleDeleteMarket = (marketId, name) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/admin/gali-desawar/markets/${marketId}`);
              Alert.alert('Deleted', 'Market has been removed.');
              fetchMarkets();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete market.');
            }
          },
        },
      ]
    );
  };

  const renderMarketItem = ({ item }) => {
    const isPaused = item.status === 'PAUSED';

    return (
      <View style={[styles.card, isPaused && styles.cardPaused]}>
        <View style={styles.cardHeader}>
          <Text style={styles.marketName}>{item.name}</Text>
          <View style={[styles.statusBadge, isPaused ? styles.badgePaused : styles.badgeActive]}>
            <Text style={[styles.statusText, isPaused ? styles.statusPaused : styles.statusActive]}>
              {isPaused ? 'PAUSED' : 'RUNNING'}
            </Text>
          </View>
        </View>

        <View style={styles.timeRow}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Open Time</Text>
            <Text style={styles.timeValue}>{item.open_time}</Text>
          </View>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Close Time</Text>
            <Text style={styles.timeValue}>{item.close_time}</Text>
          </View>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Result Time</Text>
            <Text style={styles.timeValue}>{item.result_time}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, isPaused ? styles.resumeBtn : styles.pauseBtn]}
            onPress={() => handleToggleStatus(item)}
          >
            {isPaused ? (
              <PlayCircle size={16} color={theme.colors.success} />
            ) : (
              <PauseCircle size={16} color={theme.colors.danger} />
            )}
            <Text style={[styles.actionBtnText, isPaused ? { color: theme.colors.success } : { color: theme.colors.danger }]}>
              {isPaused ? 'Resume' : 'Pause'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleOpenEditModal(item)}>
            <Edit2 size={16} color={theme.colors.primary} />
            <Text style={[styles.actionBtnText, { color: theme.colors.primary }]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteMarket(item.id, item.name)}>
            <Trash2 size={16} color={theme.colors.danger} />
            <Text style={[styles.actionBtnText, { color: theme.colors.danger }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Main Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'STANDARD' && styles.activeTab]}
          onPress={() => setActiveTab('STANDARD')}
        >
          <Text style={[styles.tabText, activeTab === 'STANDARD' && styles.activeTabText]}>
            Standard Markets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'GALI_DESAWAR' && styles.activeTab]}
          onPress={() => setActiveTab('GALI_DESAWAR')}
        >
          <Text style={[styles.tabText, activeTab === 'GALI_DESAWAR' && styles.activeTabText]}>
            Gali Desawar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeTab === 'GALI_DESAWAR' ? 'Gali Desawar Markets' : 'Standard Markets'}
        </Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleOpenAddModal}>
          <Plus size={18} color={theme.colors.surface} />
          <Text style={styles.addBtnText}>Add Market</Text>
        </TouchableOpacity>
      </View>

      {/* Markets List */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={markets}
          keyExtractor={(item) => item.id}
          renderItem={renderMarketItem}
          contentContainerStyle={styles.listPadding}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No markets found. Click "Add Market" to create one.</Text>
          }
        />
      )}

      {/* Add / Edit Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingMarket ? 'Edit Gali Desawar Market' : 'Add Gali Desawar Market'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Market Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. DELHI BAZAR"
                placeholderTextColor={theme.colors.textMuted}
                value={formName}
                onChangeText={setFormName}
              />

              <Text style={styles.label}>Opening Time</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 06:00 AM"
                placeholderTextColor={theme.colors.textMuted}
                value={formOpenTime}
                onChangeText={setFormOpenTime}
              />

              <Text style={styles.label}>Closing Time</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 02:55 PM"
                placeholderTextColor={theme.colors.textMuted}
                value={formCloseTime}
                onChangeText={setFormCloseTime}
              />

              <Text style={styles.label}>Result Time</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 03:15 PM"
                placeholderTextColor={theme.colors.textMuted}
                value={formResultTime}
                onChangeText={setFormResultTime}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveModalBtn}
                onPress={handleSaveMarket}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={theme.colors.surface} />
                ) : (
                  <Text style={styles.saveModalBtnText}>Save Market</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: theme.colors.primary },
  tabText: { color: theme.colors.textMuted, fontWeight: 'bold', fontSize: 14 },
  activeTabText: { color: theme.colors.primary },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textDark },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radius.s,
  },
  addBtnText: { color: theme.colors.surface, fontWeight: '600', marginLeft: 6 },

  listPadding: { paddingHorizontal: theme.spacing.m, paddingBottom: theme.spacing.xl },
  emptyText: { textAlign: 'center', color: theme.colors.textMuted, marginTop: 40, fontSize: 14 },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.m,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  cardPaused: { opacity: 0.75, backgroundColor: '#f1f5f9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.m },
  marketName: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textDark },
  statusBadge: { paddingHorizontal: theme.spacing.s, paddingVertical: 2, borderRadius: theme.radius.s },
  badgeActive: { backgroundColor: theme.colors.successLight },
  badgePaused: { backgroundColor: theme.colors.dangerLight },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  statusActive: { color: theme.colors.success },
  statusPaused: { color: theme.colors.danger },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.s,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
  },
  timeBlock: { alignItems: 'center' },
  timeLabel: { fontSize: 11, color: theme.colors.textMuted, marginBottom: 2 },
  timeValue: { fontSize: 13, fontWeight: '600', color: theme.colors.textDark },

  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: theme.spacing.s },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.s,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pauseBtn: { borderColor: theme.colors.dangerLight },
  resumeBtn: { borderColor: theme.colors.successLight },
  actionBtnText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: theme.spacing.m,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.m,
    padding: theme.spacing.l,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textDark, marginBottom: theme.spacing.m },
  label: { fontSize: 13, fontWeight: '600', color: theme.colors.textDark, marginBottom: 4, marginTop: theme.spacing.s },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.s,
    padding: theme.spacing.m,
    fontSize: 15,
    color: theme.colors.textDark,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: theme.spacing.l, gap: theme.spacing.m },
  cancelModalBtn: { paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.l, borderRadius: theme.radius.s },
  cancelModalBtnText: { color: theme.colors.textMuted, fontWeight: 'bold' },
  saveModalBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.s,
  },
  saveModalBtnText: { color: theme.colors.surface, fontWeight: 'bold' },
});