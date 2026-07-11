// src/AdminMarketScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Plus, Trash2, X, Clock } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "./api";
import { theme } from "./theme";
import Typography from "./components/Typography";

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

export default function AdminMarketScreen() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newOpenTime, setNewOpenTime] = useState("");
  const [newCloseTime, setNewCloseTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time Picker State
  const [showOpenPicker, setShowOpenPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/all");
      setMarkets(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load markets.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMarketStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/markets/toggle-status/${id}`, {
        is_active: !currentStatus,
      });
      fetchMarkets();
    } catch (error) {
      console.log(error)
      Alert.alert("Failed", "Could not update market status.");
    }
  };

  const deleteMarket = (id) => {
    Alert.alert("Delete Market", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/markets/delete/${id}`);
            fetchMarkets();
          } catch (e) {
            Alert.alert("Error", "Failed to delete");
            console.log(e)
          }
        },
      },
    ]);
  };

  // Helper to format Date object to HH:MM:SS
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}:00`;
  };

  const onOpenTimeChange = (event, selectedDate) => {
    setShowOpenPicker(Platform.OS === "ios"); // Keep open on iOS until dismissed
    if (selectedDate) {
      setNewOpenTime(formatTime(selectedDate));
    }
  };

  const onCloseTimeChange = (event, selectedDate) => {
    setShowClosePicker(Platform.OS === "ios");
    if (selectedDate) {
      setNewCloseTime(formatTime(selectedDate));
    }
  };

  const handleAddMarket = async () => {
    if (!newName || !newOpenTime || !newCloseTime) {
      Alert.alert("Required", "Please provide a name and select both times.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/markets/add", {
        name: newName,
        open_time: newOpenTime,
        close_time: newCloseTime,
      });

      setNewName("");
      setNewOpenTime("");
      setNewCloseTime("");
      setModalVisible(false);
      fetchMarkets();
    } catch (error) {
      console.log(error)
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to create market",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAdminMarket = ({ item }) => (
    <View style={styles.adminCard}>
      <View style={styles.cardInfo}>
        <Typography weight="700" style={styles.marketName}>
          {item.name}
        </Typography>
        <Typography style={styles.marketTimes}>
          Open: {item.open_time} | Close: {item.close_time}
        </Typography>
      </View>
      <View style={styles.cardActions}>
        <Switch
          value={item.is_active}
          onValueChange={() => toggleMarketStatus(item.id, item.is_active)}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.success,
          }}
        />
        <TouchableOpacity
          onPress={() => deleteMarket(item.id)}
          style={styles.deleteBtn}
        >
          <Trash2 color={theme.colors.danger} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={markets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAdminMarket}
          contentContainerStyle={{ padding: theme.spacing.m }}
          refreshing={loading}
          onRefresh={fetchMarkets}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus color="#fff" size={30} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography weight="700" style={styles.modalTitle}>
                New Market
              </Typography>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setShowOpenPicker(false);
                  setShowClosePicker(false);
                }}
              >
                <X color={theme.colors.textMuted} size={24} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Market Name (e.g., Kalyan Morning)"
              placeholderTextColor={theme.colors.textMuted}
              value={newName}
              onChangeText={setNewName}
            />

            {/* Open Time Selector */}
            <TouchableOpacity
              style={styles.timeSelector}
              onPress={() => setShowOpenPicker(true)}
            >
              <Typography
                style={{
                  color: newOpenTime
                    ? theme.colors.textDark
                    : theme.colors.textMuted,
                }}
              >
                {newOpenTime ? `Open Time: ${newOpenTime}` : "Select Open Time"}
              </Typography>
              <Clock color={theme.colors.textMuted} size={20} />
            </TouchableOpacity>

            {showOpenPicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onOpenTimeChange}
              />
            )}

            {/* Close Time Selector */}
            <TouchableOpacity
              style={styles.timeSelector}
              onPress={() => setShowClosePicker(true)}
            >
              <Typography
                style={{
                  color: newCloseTime
                    ? theme.colors.textDark
                    : theme.colors.textMuted,
                }}
              >
                {newCloseTime
                  ? `Close Time: ${newCloseTime}`
                  : "Select Close Time"}
              </Typography>
              <Clock color={theme.colors.textMuted} size={20} />
            </TouchableOpacity>

            {showClosePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onCloseTimeChange}
              />
            )}

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleAddMarket}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.surface} />
              ) : (
                <Typography weight="600" style={styles.submitText}>
                  Create Market
                </Typography>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  adminCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.m,
    alignItems: "center",
    justifyContent: "space-between",
    ...theme.shadows.card,
  },
  cardInfo: { flex: 1 },
  marketName: { fontSize: 16, color: theme.colors.textDark, marginBottom: 4 },
  marketTimes: { fontSize: 12, color: theme.colors.textMuted },
  cardActions: { flexDirection: "row", alignItems: "center" },
  deleteBtn: { marginLeft: theme.spacing.m, padding: 5 },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    ...theme.shadows.card,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.l,
  },
  modalTitle: { fontSize: 20, color: theme.colors.textDark },

  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: theme.spacing.m,
    height: 52,
    marginBottom: theme.spacing.m,
    color: theme.colors.textDark,
    fontFamily: "Inter_400Regular",
  },

  // New Time Selector Style
  timeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: theme.spacing.m,
    height: 52,
    marginBottom: theme.spacing.m,
  },

  submitBtn: {
    backgroundColor: theme.colors.primary,
    height: 52,
    borderRadius: theme.radius.m,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.s,
  },
  submitText: { color: theme.colors.surface, fontSize: 16 },
});
