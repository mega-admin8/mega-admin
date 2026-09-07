// import React, { useState, useCallback } from "react";
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Switch,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   Trophy,
//   X,
//   AlertCircle,
//   Edit3,
//   Trash2,
//   Plus,
//   Clock,
// } from "lucide-react-native";
// import { useFocusEffect } from "@react-navigation/native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import api from "./api";
// import { theme } from "./theme";
// import Typography from "./components/Typography";

// const checkIsMarketOpenRightNow = (openTimeStr, closeTimeStr, isActive) => {
//   if (!isActive) return false;
//   if (!openTimeStr || !closeTimeStr) return false;

//   const now = new Date();

//   const [openHour, openMin] = openTimeStr.split(":").map(Number);
//   const openDate = new Date();
//   openDate.setHours(openHour, openMin, 0, 0);

//   const [closeHour, closeMin] = closeTimeStr.split(":").map(Number);
//   const closeDate = new Date();
//   closeDate.setHours(closeHour, closeMin, 0, 0);

//   return now >= openDate && now <= closeDate;
// };

// export default function AdminMarketsScreen() {
//   const [markets, setMarkets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Declare Result Modal State
//   const [declareModalVisible, setDeclareModalVisible] = useState(false);
//   const [selectedMarket, setSelectedMarket] = useState(null);
//   const [session, setSession] = useState("OPEN");
//   const [winningNumber, setWinningNumber] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Edit Market Modal State
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [editName, setEditName] = useState("");
//   const [editOpenTime, setEditOpenTime] = useState("");
//   const [editCloseTime, setEditCloseTime] = useState("");
//   const [editOpenResultTime, setEditOpenResultTime] = useState("");
//   const [editCloseResultTime, setEditCloseResultTime] = useState("");
//   const [editIsActive, setEditIsActive] = useState(true);
//   const [isSavingEdit, setIsSavingEdit] = useState(false);

//   // Add Market Modal State
//   const [addModalVisible, setAddModalVisible] = useState(false);
//   const [newName, setNewName] = useState("");
//   const [newOpenTime, setNewOpenTime] = useState("");
//   const [newCloseTime, setNewCloseTime] = useState("");
//   const [newOpenResultTime, setNewOpenResultTime] = useState("");
//   const [newCloseResultTime, setNewCloseResultTime] = useState("");
//   const [isCreating, setIsCreating] = useState(false);

//   // Time Pickers for Add Market
//   const [showOpenPicker, setShowOpenPicker] = useState(false);
//   const [showClosePicker, setShowClosePicker] = useState(false);

//   const fetchMarkets = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/admin/all");
//       setMarkets(response.data);
//     } catch (error) {
//       try {
//         const fallbackRes = await api.get("/markets");
//         setMarkets(fallbackRes.data);
//       } catch (err) {
//         Alert.alert("Error", "Failed to fetch markets");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchMarkets();
//     }, []),
//   );

//   // --- TOGGLE / PAUSE MARKET ---
//   const handleToggleActive = async (market) => {
//     const updatedStatus = !market.is_active;

//     setMarkets((prev) =>
//       prev.map((m) =>
//         m.id === market.id ? { ...m, is_active: updatedStatus } : m,
//       ),
//     );

//     try {
//       await api.patch(`/markets/toggle-status/${market.id}`, {
//         is_active: updatedStatus,
//       });
//     } catch (error) {
//       try {
//         await api.put(`/admin/markets/${market.id}`, {
//           is_active: updatedStatus,
//         });
//       } catch (err) {
//         try {
//           await api.put(`/markets/update/${market.id}`, {
//             is_active: updatedStatus,
//           });
//         } catch (finalErr) {
//           Alert.alert("Failed", "Could not update market status.");
//           fetchMarkets();
//         }
//       }
//     }
//   };

//   // --- DELETE MARKET ---
//   const handleDeleteMarket = (market) => {
//     Alert.alert(
//       "Delete Market",
//       `Are you sure you want to delete "${market.name}"? This action cannot be undone.`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await api.delete(`/markets/delete/${market.id}`);
//               fetchMarkets();
//             } catch (error) {
//               try {
//                 await api.delete(`/admin/markets/${market.id}`);
//                 fetchMarkets();
//               } catch (err) {
//                 try {
//                   await api.delete(`/markets/${market.id}`);
//                   fetchMarkets();
//                 } catch (finalErr) {
//                   Alert.alert("Error", "Failed to delete market.");
//                 }
//               }
//             }
//           },
//         },
//       ],
//     );
//   };

//   // --- TIME PICKER HELPERS ---
//   const formatTime = (date) => {
//     const hours = date.getHours().toString().padStart(2, "0");
//     const minutes = date.getMinutes().toString().padStart(2, "0");
//     return `${hours}:${minutes}:00`;
//   };

//   const onOpenTimeChange = (event, selectedDate) => {
//     setShowOpenPicker(Platform.OS === "ios");
//     if (selectedDate) {
//       setNewOpenTime(formatTime(selectedDate));
//     }
//   };

//   const onCloseTimeChange = (event, selectedDate) => {
//     setShowClosePicker(Platform.OS === "ios");
//     if (selectedDate) {
//       setNewCloseTime(formatTime(selectedDate));
//     }
//   };

//   // --- CREATE MARKET ---
//   const handleCreateMarket = async () => {
//     if (!newName.trim() || !newOpenTime || !newCloseTime) {
//       Alert.alert("Validation Error", "Please enter market name and betting times.");
//       return;
//     }

//     setIsCreating(true);
//     const payload = {
//       name: newName,
//       open_time: newOpenTime,
//       close_time: newCloseTime,
//       open_result_time: newOpenResultTime || newOpenTime,
//       close_result_time: newCloseResultTime || newCloseTime,
//     };

//     try {
//       await api.post("/markets/add", payload);
//       Alert.alert("Success", "New market created!");
//       setAddModalVisible(false);
//       resetNewMarketForm();
//       fetchMarkets();
//     } catch (error) {
//       try {
//         await api.post("/admin/markets", payload);
//         Alert.alert("Success", "New market created!");
//         setAddModalVisible(false);
//         resetNewMarketForm();
//         fetchMarkets();
//       } catch (err) {
//         Alert.alert("Error", err.response?.data?.error || "Failed to create market.");
//       }
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const resetNewMarketForm = () => {
//     setNewName("");
//     setNewOpenTime("");
//     setNewCloseTime("");
//     setNewOpenResultTime("");
//     setNewCloseResultTime("");
//   };

//   // --- EDIT MARKET ---
//   const openEditModal = (market) => {
//     setSelectedMarket(market);
//     setEditName(market.name || "");
//     setEditOpenTime(market.open_time || "");
//     setEditCloseTime(market.close_time || "");
//     setEditOpenResultTime(market.open_result_time || market.open_time || "");
//     setEditCloseResultTime(market.close_result_time || market.close_time || "");
//     setEditIsActive(market.is_active ?? true);
//     setEditModalVisible(true);
//   };

//   const handleSaveEditMarket = async () => {
//     if (!editName.trim()) {
//       Alert.alert("Validation Error", "Market name cannot be empty.");
//       return;
//     }

//     setIsSavingEdit(true);
//     const payload = {
//       name: editName,
//       open_time: editOpenTime,
//       close_time: editCloseTime,
//       open_result_time: editOpenResultTime,
//       close_result_time: editCloseResultTime,
//       is_active: editIsActive,
//     };

//     try {
//       await api.put(`/admin/markets/${selectedMarket.id}`, payload);
//       Alert.alert("Success", "Market updated successfully!");
//       setEditModalVisible(false);
//       fetchMarkets();
//     } catch (error) {
//       try {
//         await api.put(`/markets/update/${selectedMarket.id}`, payload);
//         Alert.alert("Success", "Market updated successfully!");
//         setEditModalVisible(false);
//         fetchMarkets();
//       } catch (err) {
//         Alert.alert("Error", "Failed to update market.");
//       }
//     } finally {
//       setIsSavingEdit(false);
//     }
//   };

//   // --- DECLARE RESULT (MANUAL DISTRIBUTION) ---
//   const openDeclareModal = (market) => {
//     setSelectedMarket(market);
//     setSession("OPEN");
//     setWinningNumber("");
//     setDeclareModalVisible(true);
//   };

//   const handleDeclareResult = async () => {
//     if (!winningNumber || !/^\d{1,3}$/.test(winningNumber)) {
//       Alert.alert("Invalid Input", "Please enter a valid number (1 to 3 digits).");
//       return;
//     }

//     Alert.alert(
//       "Confirm Result Declaration",
//       `Are you sure you want to declare ${winningNumber} as the ${session} result for ${selectedMarket.name}?\n\nNote: Funds will NOT be auto-distributed.`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Yes, Declare", style: "default", onPress: submitResult },
//       ],
//     );
//   };

//   const submitResult = async () => {
//     setIsSubmitting(true);
//     try {
//       const response = await api.post("/admin/markets/declare-result", {
//         market_id: selectedMarket.id,
//         session: session,
//         winning_number: winningNumber,
//         auto_distribute: false,
//         distribute_funds: false,
//       });

//       Alert.alert(
//         "Result Published",
//         `${response.data.message || "Result updated successfully."}\n\nNote: Automatic payout is disabled. Please distribute winnings manually.`,
//       );
//       setDeclareModalVisible(false);
//       fetchMarkets();
//     } catch (error) {
//       Alert.alert("Error", error.response?.data?.error || "Failed to declare result.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // 1. Updated helper function to check if current time is within result window
// const isTimeWithinWindow = (startTimeStr, endTimeStr, isActive) => {
//   if (!isActive || !startTimeStr || !endTimeStr) return false;

//   const now = new Date();

//   const [startHour, startMin] = startTimeStr.split(":").map(Number);
//   const startDate = new Date();
//   startDate.setHours(startHour, startMin, 0, 0);

//   const [endHour, endMin] = endTimeStr.split(":").map(Number);
//   const endDate = new Date();
//   endDate.setHours(endHour, endMin, 0, 0);

//   return now >= startDate && now <= endDate;
// };

//   const renderMarketCard = ({ item }) => {
//     const isTakingBetsRightNow = isTimeWithinWindow(
//     item.open_time,
//     item.close_time,
//     item.is_active
//   );

//   // Check if result declaration window is active
//   const isResultWindowOpen = isTimeWithinWindow(
//     item.open_result_time || item.open_time,
//     item.close_result_time || item.close_time,
//     item.is_active
//   );

//     // const isTakingBetsRightNow = checkIsMarketOpenRightNow(
//     //   item.open_time,
//     //   item.close_time,
//     //   item.is_active,
//     // );

//     return (
//       <View style={styles.card}>
//         <View style={styles.cardHeaderTop}>
//           <Typography weight="700" style={styles.marketName}>
//             {item.name}
//           </Typography>

//           <View style={styles.headerControls}>
//             <Switch
//               value={Boolean(item.is_active)}
//               onValueChange={() => handleToggleActive(item)}
//               trackColor={{
//                 false: theme.colors.border,
//                 true: theme.colors.success,
//               }}
//               thumbColor="#fff"
//             />
//             <TouchableOpacity
//               onPress={() => handleDeleteMarket(item)}
//               style={styles.deleteBtn}
//             >
//               <Trash2 color={theme.colors.danger} size={20} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.cardHeaderSub}>
//           <View>
//             <Typography style={styles.marketTime}>
//               Open: {item.open_time} | Close: {item.close_time}
//             </Typography>
//           </View>

//           <View
//             style={[
//               styles.statusBadge,
//               !item.is_active
//                 ? styles.statusPaused
//                 : isTakingBetsRightNow
//                 ? styles.statusActive
//                 : styles.statusClosed,
//             ]}
//           >
//             <Typography
//               weight="600"
//               style={[
//                 styles.statusText,
//                 !item.is_active
//                   ? styles.textPaused
//                   : isTakingBetsRightNow
//                   ? styles.textActive
//                   : styles.textClosed,
//               ]}
//             >
//               {!item.is_active
//                 ? "PAUSED"
//                 : isTakingBetsRightNow
//                 ? "LIVE"
//                 : "CLOSED"}
//             </Typography>
//           </View>
//         </View>

//         <View style={styles.actionRow}>
//           <TouchableOpacity
//             style={styles.editBtn}
//             onPress={() => openEditModal(item)}
//           >
//             <Edit3 color={theme.colors.primary} size={16} style={{ marginRight: 6 }} />
//             <Typography weight="700" style={styles.editBtnText}>
//               Edit Market
//             </Typography>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.declareBtn,
//               !canDeclare ? styles.declareBtnDisabled : null,
//             ]}
//             onPress={() => openDeclareModal(item)}
//             disabled={isTakingBetsRightNow}
//           >
//             <Trophy color="#fff" size={16} style={{ marginRight: 6 }} />
//             <Typography weight="700" style={styles.declareBtnText}>
//               {isTakingBetsRightNow ? "Bets Live" : "Declare"}
//             </Typography>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={["top"]}>
//       <View style={styles.header}>
//         <Typography weight="700" style={styles.headerTitle}>
//           Market Management
//         </Typography>
//       </View>

//       {loading ? (
//         <ActivityIndicator
//           size="large"
//           color={theme.colors.primary}
//           style={{ marginTop: 50 }}
//         />
//       ) : (
//         <FlatList
//           data={markets}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderMarketCard}
//           contentContainerStyle={styles.listContent}
//           refreshing={loading}
//           onRefresh={fetchMarkets}
//         />
//       )}

//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => setAddModalVisible(true)}
//         activeOpacity={0.8}
//       >
//         <Plus color="#fff" size={28} />
//       </TouchableOpacity>

//       {/* --- ADD MARKET MODAL --- */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={addModalVisible}
//         onRequestClose={() => setAddModalVisible(false)}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={styles.modalOverlay}
//         >
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Typography weight="700" style={styles.modalTitle}>
//                 New Market
//               </Typography>
//               <TouchableOpacity
//                 onPress={() => {
//                   setAddModalVisible(false);
//                   setShowOpenPicker(false);
//                   setShowClosePicker(false);
//                 }}
//               >
//                 <X color={theme.colors.textMuted} size={24} />
//               </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Market Name (e.g., Kalyan Morning)"
//                 placeholderTextColor={theme.colors.textMuted}
//                 value={newName}
//                 onChangeText={setNewName}
//               />

//               <Typography weight="700" style={styles.sectionHeader}>
//                 Betting Timing
//               </Typography>
//               <TouchableOpacity
//                 style={styles.timeSelector}
//                 onPress={() => setShowOpenPicker(true)}
//               >
//                 <Typography
//                   style={{
//                     color: newOpenTime
//                       ? theme.colors.textDark
//                       : theme.colors.textMuted,
//                   }}
//                 >
//                   {newOpenTime ? `Open Time: ${newOpenTime}` : "Select Open Time"}
//                 </Typography>
//                 <Clock color={theme.colors.textMuted} size={20} />
//               </TouchableOpacity>

//               {showOpenPicker && (
//                 <DateTimePicker
//                   value={new Date()}
//                   mode="time"
//                   display={Platform.OS === "ios" ? "spinner" : "default"}
//                   onChange={onOpenTimeChange}
//                 />
//               )}

//               <TouchableOpacity
//                 style={styles.timeSelector}
//                 onPress={() => setShowClosePicker(true)}
//               >
//                 <Typography
//                   style={{
//                     color: newCloseTime
//                       ? theme.colors.textDark
//                       : theme.colors.textMuted,
//                   }}
//                 >
//                   {newCloseTime
//                     ? `Close Time: ${newCloseTime}`
//                     : "Select Close Time"}
//                 </Typography>
//                 <Clock color={theme.colors.textMuted} size={20} />
//               </TouchableOpacity>

//               {showClosePicker && (
//                 <DateTimePicker
//                   value={new Date()}
//                   mode="time"
//                   display={Platform.OS === "ios" ? "spinner" : "default"}
//                   onChange={onCloseTimeChange}
//                 />
//               )}

//               <Typography weight="700" style={styles.sectionHeader}>
//                 Result Declaration Timing (Optional)
//               </Typography>
//               <View style={styles.timeRow}>
//                 <View style={{ flex: 1, marginRight: 8 }}>
//                   <Typography style={styles.label}>Open Result Time</Typography>
//                   <TextInput
//                     style={styles.textInput}
//                     value={newOpenResultTime}
//                     onChangeText={setNewOpenResultTime}
//                     placeholder="08:05:00"
//                     placeholderTextColor={theme.colors.textMuted}
//                   />
//                 </View>
//                 <View style={{ flex: 1, marginLeft: 8 }}>
//                   <Typography style={styles.label}>Close Result Time</Typography>
//                   <TextInput
//                     style={styles.textInput}
//                     value={newCloseResultTime}
//                     onChangeText={setNewCloseResultTime}
//                     placeholder="10:50:00"
//                     placeholderTextColor={theme.colors.textMuted}
//                   />
//                 </View>
//               </View>

//               <TouchableOpacity
//                 style={[styles.saveBtn, isCreating && { opacity: 0.7 }]}
//                 onPress={handleCreateMarket}
//                 disabled={isCreating}
//               >
//                 {isCreating ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Typography weight="700" style={styles.saveBtnText}>
//                     CREATE MARKET
//                   </Typography>
//                 )}
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>

//       {/* --- EDIT MARKET MODAL --- */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={editModalVisible}
//         onRequestClose={() => setEditModalVisible(false)}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={styles.modalOverlay}
//         >
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Typography weight="700" style={styles.modalTitle}>
//                 Edit Market Settings
//               </Typography>
//               <TouchableOpacity onPress={() => setEditModalVisible(false)}>
//                 <X color={theme.colors.textMuted} size={24} />
//               </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View style={styles.switchRow}>
//                 <Typography weight="600" style={styles.labelNoMargin}>
//                   Market Status ({editIsActive ? "Active" : "Paused"})
//                 </Typography>
//                 <Switch
//                   value={editIsActive}
//                   onValueChange={(val) => setEditIsActive(val)}
//                   trackColor={{
//                     false: theme.colors.border,
//                     true: theme.colors.success,
//                   }}
//                   thumbColor="#fff"
//                 />
//               </View>

//               <Typography style={styles.label}>Market Name</Typography>
//               <TextInput
//                 style={styles.textInput}
//                 value={editName}
//                 onChangeText={setEditName}
//                 placeholder="e.g. Kalyan Morning"
//                 placeholderTextColor={theme.colors.textMuted}
//               />

//               <Typography weight="700" style={styles.sectionHeader}>
//                 Betting Timing
//               </Typography>
//               <View style={styles.timeRow}>
//                 <View style={{ flex: 1, marginRight: 8 }}>
//                   <Typography style={styles.label}>Open Time (HH:MM:SS)</Typography>
//                   <TextInput
//                     style={styles.textInput}
//                     value={editOpenTime}
//                     onChangeText={setEditOpenTime}
//                     placeholder="08:00:00"
//                     placeholderTextColor={theme.colors.textMuted}
//                   />
//                 </View>
//                 <View style={{ flex: 1, marginLeft: 8 }}>
//                   <Typography style={styles.label}>Close Time (HH:MM:SS)</Typography>
//                   <TextInput
//                     style={styles.textInput}
//                     value={editCloseTime}
//                     onChangeText={setEditCloseTime}
//                     placeholder="10:40:00"
//                     placeholderTextColor={theme.colors.textMuted}
//                   />
//                 </View>
//               </View>

//               <Typography weight="700" style={styles.sectionHeader}>
//                 Result Declaration Timing
//               </Typography>
//               <View style={styles.timeRow}>
//                 <View style={{ flex: 1, marginRight: 8 }}>
//                   <Typography style={styles.label}>Open Result Time</Typography>
//                   <TextInput
//                     style={styles.textInput}
//                     value={editOpenResultTime}
//                     onChangeText={setEditOpenResultTime}
//                     placeholder="08:05:00"
//                     placeholderTextColor={theme.colors.textMuted}
//                   />
//                 </View>
//                 <View style={{ flex: 1, marginLeft: 8 }}>
//                   <Typography style={styles.label}>Close Result Time</Typography>
//                   <TextInput
//                     style={styles.textInput}
//                     value={editCloseResultTime}
//                     onChangeText={setEditCloseResultTime}
//                     placeholder="10:50:00"
//                     placeholderTextColor={theme.colors.textMuted}
//                   />
//                 </View>
//               </View>

//               <TouchableOpacity
//                 style={[styles.saveBtn, isSavingEdit && { opacity: 0.7 }]}
//                 onPress={handleSaveEditMarket}
//                 disabled={isSavingEdit}
//               >
//                 {isSavingEdit ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Typography weight="700" style={styles.saveBtnText}>
//                     SAVE CHANGES
//                   </Typography>
//                 )}
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>

//       {/* --- DECLARE RESULT MODAL --- */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={declareModalVisible}
//         onRequestClose={() => setDeclareModalVisible(false)}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={styles.modalOverlay}
//         >
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Typography weight="700" style={styles.modalTitle}>
//                 Declare Result
//               </Typography>
//               <TouchableOpacity onPress={() => setDeclareModalVisible(false)}>
//                 <X color={theme.colors.textMuted} size={24} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.infoBox}>
//               <AlertCircle color="#2563EB" size={20} style={{ marginRight: 8 }} />
//               <Typography style={styles.infoText}>
//                 Manual Payout Mode: Winning number will be published, but funds must be distributed manually.
//               </Typography>
//             </View>

//             <Typography style={styles.label}>Market</Typography>
//             <Typography weight="700" style={styles.marketHighlight}>
//               {selectedMarket?.name}
//             </Typography>

//             <Typography style={styles.label}>Session</Typography>
//             <View style={styles.sessionToggleRow}>
//               <TouchableOpacity
//                 style={[
//                   styles.sessionBtn,
//                   session === "OPEN" && styles.sessionBtnActive,
//                 ]}
//                 onPress={() => setSession("OPEN")}
//               >
//                 <Typography
//                   weight="600"
//                   style={[
//                     styles.sessionText,
//                     session === "OPEN" && styles.sessionTextActive,
//                   ]}
//                 >
//                   OPEN
//                 </Typography>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.sessionBtn,
//                   session === "CLOSE" && styles.sessionBtnActive,
//                 ]}
//                 onPress={() => setSession("CLOSE")}
//               >
//                 <Typography
//                   weight="600"
//                   style={[
//                     styles.sessionText,
//                     session === "CLOSE" && styles.sessionTextActive,
//                   ]}
//                 >
//                   CLOSE
//                 </Typography>
//               </TouchableOpacity>
//             </View>

//             <Typography style={styles.label}>Winning Number</Typography>
//             <TextInput
//               style={styles.numberInput}
//               keyboardType="number-pad"
//               maxLength={3}
//               value={winningNumber}
//               onChangeText={(text) => {
//                 const cleaned = text.replace(/[^0-9]/g, "");
//                 setWinningNumber(cleaned);
//               }}
//               placeholder="e.g., 4, 28, or 138"
//               placeholderTextColor={theme.colors.border}
//             />

//             <TouchableOpacity
//               style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
//               onPress={handleDeclareResult}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Typography weight="700" style={styles.submitBtnText}>
//                   PUBLISH RESULT
//                 </Typography>
//               )}
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: theme.colors.background },
//   header: {
//     padding: theme.spacing.m,
//     backgroundColor: theme.colors.surface,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border,
//   },
//   headerTitle: { fontSize: 24, color: theme.colors.textDark },
//   listContent: { padding: theme.spacing.m, paddingBottom: 100 },

//   card: {
//     backgroundColor: theme.colors.surface,
//     padding: theme.spacing.m,
//     borderRadius: theme.radius.l,
//     marginBottom: theme.spacing.m,
//     ...theme.shadows.card,
//   },
//   cardHeaderTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   marketName: {
//     fontSize: 18,
//     color: theme.colors.textDark,
//     textTransform: "uppercase",
//     flex: 1,
//   },
//   headerControls: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   deleteBtn: {
//     padding: 6,
//     marginLeft: 4,
//   },

//   cardHeaderSub: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 6,
//     marginBottom: 16,
//   },
//   marketTime: { fontSize: 12, color: theme.colors.textMuted },

//   statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
//   statusActive: { backgroundColor: theme.colors.success + "20" },
//   statusClosed: { backgroundColor: theme.colors.danger + "20" },
//   statusPaused: { backgroundColor: "#fee2e2" },
//   statusText: { fontSize: 10 },
//   textActive: { color: theme.colors.success },
//   textClosed: { color: theme.colors.danger },
//   textPaused: { color: "#ef4444" },

//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   editBtn: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: theme.colors.surface,
//     borderWidth: 1,
//     borderColor: theme.colors.primary,
//     paddingVertical: 10,
//     borderRadius: theme.radius.m,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   editBtnText: { color: theme.colors.primary, fontSize: 13 },

//   declareBtn: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: theme.colors.primary,
//     paddingVertical: 10,
//     borderRadius: theme.radius.m,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   declareBtnText: { color: theme.colors.surface, fontSize: 13 },
//   declareBtnDisabled: {
//     backgroundColor: theme.colors.border,
//     opacity: 0.7,
//   },

//   fab: {
//     position: "absolute",
//     bottom: 24,
//     right: 24,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: theme.colors.primary,
//     justifyContent: "center",
//     alignItems: "center",
//     ...theme.shadows.card,
//     elevation: 5,
//   },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: theme.colors.surface,
//     borderTopLeftRadius: theme.radius.xl,
//     borderTopRightRadius: theme.radius.xl,
//     padding: 24,
//     maxHeight: "85%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   modalTitle: { fontSize: 20, color: theme.colors.textDark },

//   sectionHeader: {
//     fontSize: 14,
//     color: theme.colors.primary,
//     marginTop: 16,
//     marginBottom: 6,
//   },
//   switchRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: theme.colors.background,
//     padding: 12,
//     borderRadius: theme.radius.m,
//     marginBottom: 12,
//   },
//   timeRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },

//   textInput: {
//     backgroundColor: theme.colors.background,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     borderRadius: theme.radius.m,
//     paddingHorizontal: 12,
//     height: 52,
//     fontSize: 15,
//     color: theme.colors.textDark,
//     marginBottom: 12,
//   },

//   timeSelector: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: theme.colors.background,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     borderRadius: theme.radius.m,
//     paddingHorizontal: 12,
//     height: 52,
//     marginBottom: 12,
//   },

//   saveBtn: {
//     backgroundColor: theme.colors.primary,
//     paddingVertical: 14,
//     borderRadius: theme.radius.l,
//     alignItems: "center",
//     marginTop: 16,
//     marginBottom: 24,
//   },
//   saveBtnText: { color: "#fff", fontSize: 15, letterSpacing: 1 },

//   infoBox: {
//     flexDirection: "row",
//     backgroundColor: "#EFF6FF",
//     padding: 12,
//     borderRadius: theme.radius.m,
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   infoText: { color: "#1D4ED8", fontSize: 12, fontWeight: "600", flex: 1 },

//   label: {
//     fontSize: 13,
//     color: theme.colors.textMuted,
//     marginBottom: 6,
//   },
//   labelNoMargin: {
//     fontSize: 14,
//     color: theme.colors.textDark,
//   },
//   marketHighlight: {
//     fontSize: 22,
//     color: theme.colors.primary,
//     textTransform: "uppercase",
//     marginBottom: 8,
//   },

//   sessionToggleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   sessionBtn: {
//     flex: 0.48,
//     paddingVertical: 12,
//     borderRadius: theme.radius.m,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     alignItems: "center",
//   },
//   sessionBtnActive: {
//     backgroundColor: theme.colors.primary + "15",
//     borderColor: theme.colors.primary,
//   },
//   sessionText: { color: theme.colors.textMuted, fontSize: 14 },
//   sessionTextActive: { color: theme.colors.primary },

//   numberInput: {
//     backgroundColor: theme.colors.background,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     borderRadius: theme.radius.m,
//     fontSize: 32,
//     color: theme.colors.textDark,
//     textAlign: "center",
//     height: 70,
//     marginBottom: 20,
//   },

//   submitBtn: {
//     backgroundColor: theme.colors.primary,
//     paddingVertical: 16,
//     borderRadius: theme.radius.l,
//     alignItems: "center",
//   },
//   submitBtnText: { color: "#fff", fontSize: 16, letterSpacing: 1 },
// });






















import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Trophy,
  X,
  AlertCircle,
  Edit3,
  Trash2,
  Plus,
  Clock,
} from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "./api";
import { theme } from "./theme";
import Typography from "./components/Typography";

const checkIsMarketOpenRightNow = (openTimeStr, closeTimeStr, isActive) => {
  if (!isActive) return false;
  if (!openTimeStr || !closeTimeStr) return false;

  const now = new Date();

  const [openHour, openMin] = openTimeStr.split(":").map(Number);
  const openDate = new Date();
  openDate.setHours(openHour, openMin, 0, 0);

  const [closeHour, closeMin] = closeTimeStr.split(":").map(Number);
  const closeDate = new Date();
  closeDate.setHours(closeHour, closeMin, 0, 0);

  return now >= openDate && now <= closeDate;
};

// Helper function to check if a specific time has passed today
const hasTimePassed = (timeStr) => {
  if (!timeStr) return false;

  const now = new Date();
  const [hour, min] = timeStr.split(":").map(Number);
  const targetDate = new Date();
  targetDate.setHours(hour, min, 0, 0);

  return now >= targetDate;
};

export default function AdminMarketsScreen() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Declare Result Modal State
  const [declareModalVisible, setDeclareModalVisible] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [session, setSession] = useState("OPEN");
  const [winningNumber, setWinningNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Market Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editOpenTime, setEditOpenTime] = useState("");
  const [editCloseTime, setEditCloseTime] = useState("");
  const [editOpenResultTime, setEditOpenResultTime] = useState("");
  const [editCloseResultTime, setEditCloseResultTime] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Add Market Modal State
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newOpenTime, setNewOpenTime] = useState("");
  const [newCloseTime, setNewCloseTime] = useState("");
  const [newOpenResultTime, setNewOpenResultTime] = useState("");
  const [newCloseResultTime, setNewCloseResultTime] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Time Pickers for Add Market
  const [showOpenPicker, setShowOpenPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/all");
      setMarkets(response.data);
    } catch (error) {
      try {
        const fallbackRes = await api.get("/markets");
        setMarkets(fallbackRes.data);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch markets");
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMarkets();
    }, []),
  );

  // --- TOGGLE / PAUSE MARKET ---
  const handleToggleActive = async (market) => {
    const updatedStatus = !market.is_active;

    setMarkets((prev) =>
      prev.map((m) =>
        m.id === market.id ? { ...m, is_active: updatedStatus } : m,
      ),
    );

    try {
      await api.patch(`/markets/toggle-status/${market.id}`, {
        is_active: updatedStatus,
      });
    } catch (error) {
      try {
        await api.put(`/admin/markets/${market.id}`, {
          is_active: updatedStatus,
        });
      } catch (err) {
        try {
          await api.put(`/markets/update/${market.id}`, {
            is_active: updatedStatus,
          });
        } catch (finalErr) {
          Alert.alert("Failed", "Could not update market status.");
          fetchMarkets();
        }
      }
    }
  };

  // --- DELETE MARKET ---
  const handleDeleteMarket = (market) => {
    Alert.alert(
      "Delete Market",
      `Are you sure you want to delete "${market.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/markets/delete/${market.id}`);
              fetchMarkets();
            } catch (error) {
              try {
                await api.delete(`/admin/markets/${market.id}`);
                fetchMarkets();
              } catch (err) {
                try {
                  await api.delete(`/markets/${market.id}`);
                  fetchMarkets();
                } catch (finalErr) {
                  Alert.alert("Error", "Failed to delete market.");
                }
              }
            }
          },
        },
      ],
    );
  };

  // --- TIME PICKER HELPERS ---
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}:00`;
  };

  const onOpenTimeChange = (event, selectedDate) => {
    setShowOpenPicker(Platform.OS === "ios");
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

  // --- CREATE MARKET ---
  const handleCreateMarket = async () => {
    if (!newName.trim() || !newOpenTime || !newCloseTime) {
      Alert.alert("Validation Error", "Please enter market name and betting times.");
      return;
    }

    setIsCreating(true);
    const payload = {
      name: newName,
      open_time: newOpenTime,
      close_time: newCloseTime,
      open_result_time: newOpenResultTime || newOpenTime,
      close_result_time: newCloseResultTime || newCloseTime,
    };

    try {
      await api.post("/markets/add", payload);
      Alert.alert("Success", "New market created!");
      setAddModalVisible(false);
      resetNewMarketForm();
      fetchMarkets();
    } catch (error) {
      try {
        await api.post("/admin/markets", payload);
        Alert.alert("Success", "New market created!");
        setAddModalVisible(false);
        resetNewMarketForm();
        fetchMarkets();
      } catch (err) {
        Alert.alert("Error", err.response?.data?.error || "Failed to create market.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const resetNewMarketForm = () => {
    setNewName("");
    setNewOpenTime("");
    setNewCloseTime("");
    setNewOpenResultTime("");
    setNewCloseResultTime("");
  };

  // --- EDIT MARKET ---
  const openEditModal = (market) => {
    setSelectedMarket(market);
    setEditName(market.name || "");
    setEditOpenTime(market.open_time || "");
    setEditCloseTime(market.close_time || "");
    setEditOpenResultTime(market.open_result_time || market.open_time || "");
    setEditCloseResultTime(market.close_result_time || market.close_time || "");
    setEditIsActive(market.is_active ?? true);
    setEditModalVisible(true);
  };

  const handleSaveEditMarket = async () => {
    if (!editName.trim()) {
      Alert.alert("Validation Error", "Market name cannot be empty.");
      return;
    }

    setIsSavingEdit(true);
    const payload = {
      name: editName,
      open_time: editOpenTime,
      close_time: editCloseTime,
      open_result_time: editOpenResultTime,
      close_result_time: editCloseResultTime,
      is_active: editIsActive,
    };

    try {
      await api.put(`/admin/markets/${selectedMarket.id}`, payload);
      Alert.alert("Success", "Market updated successfully!");
      setEditModalVisible(false);
      fetchMarkets();
    } catch (error) {
      try {
        await api.put(`/markets/update/${selectedMarket.id}`, payload);
        Alert.alert("Success", "Market updated successfully!");
        setEditModalVisible(false);
        fetchMarkets();
      } catch (err) {
        Alert.alert("Error", "Failed to update market.");
      }
    } finally {
      setIsSavingEdit(false);
    }
  };

  // --- DECLARE RESULT (MANUAL DISTRIBUTION) ---
  const openDeclareModal = (market) => {
    setSelectedMarket(market);
    setWinningNumber("");

    const isOpenTimePassed = hasTimePassed(market.open_result_time || market.open_time);
    const isCloseTimePassed = hasTimePassed(market.close_result_time || market.close_time);

    // Auto-select session based on which result timing has passed
    if (isCloseTimePassed) {
      setSession("CLOSE");
    } else if (isOpenTimePassed) {
      setSession("OPEN");
    } else {
      setSession("OPEN");
    }

    setDeclareModalVisible(true);
  };

  const handleDeclareResult = async () => {
    if (!winningNumber || !/^\d{1,3}$/.test(winningNumber)) {
      Alert.alert("Invalid Input", "Please enter a valid number (1 to 3 digits).");
      return;
    }

    Alert.alert(
      "Confirm Result Declaration",
      `Are you sure you want to declare ${winningNumber} as the ${session} result for ${selectedMarket.name}?\n\nNote: Funds will NOT be auto-distributed.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, Declare", style: "default", onPress: submitResult },
      ],
    );
  };

  const submitResult = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post("/admin/markets/declare-result", {
        market_id: selectedMarket.id,
        session: session,
        winning_number: winningNumber,
        auto_distribute: false,
        distribute_funds: false,
      });

      Alert.alert(
        "Result Published",
        `${response.data.message || "Result updated successfully."}\n\nNote: Automatic payout is disabled. Please distribute winnings manually.`,
      );
      setDeclareModalVisible(false);
      fetchMarkets();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to declare result.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check result session status for currently selected market
  const isOpenResultActive = selectedMarket
    ? hasTimePassed(selectedMarket.open_result_time || selectedMarket.open_time)
    : false;

  const isCloseResultActive = selectedMarket
    ? hasTimePassed(selectedMarket.close_result_time || selectedMarket.close_time)
    : false;

  const renderMarketCard = ({ item }) => {
    const isTakingBetsRightNow = checkIsMarketOpenRightNow(
      item.open_time,
      item.close_time,
      item.is_active,
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderTop}>
          <Typography weight="700" style={styles.marketName}>
            {item.name}
          </Typography>

          <View style={styles.headerControls}>
            <Switch
              value={Boolean(item.is_active)}
              onValueChange={() => handleToggleActive(item)}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.success,
              }}
              thumbColor="#fff"
            />
            <TouchableOpacity
              onPress={() => handleDeleteMarket(item)}
              style={styles.deleteBtn}
            >
              <Trash2 color={theme.colors.danger} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardHeaderSub}>
          <View>
            <Typography style={styles.marketTime}>
              Open: {item.open_time} | Close: {item.close_time}
            </Typography>
          </View>

          <View
            style={[
              styles.statusBadge,
              !item.is_active
                ? styles.statusPaused
                : isTakingBetsRightNow
                ? styles.statusActive
                : styles.statusClosed,
            ]}
          >
            <Typography
              weight="600"
              style={[
                styles.statusText,
                !item.is_active
                  ? styles.textPaused
                  : isTakingBetsRightNow
                  ? styles.textActive
                  : styles.textClosed,
              ]}
            >
              {!item.is_active
                ? "PAUSED"
                : isTakingBetsRightNow
                ? "LIVE"
                : "CLOSED"}
            </Typography>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => openEditModal(item)}
          >
            <Edit3 color={theme.colors.primary} size={16} style={{ marginRight: 6 }} />
            <Typography weight="700" style={styles.editBtnText}>
              Edit Market
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.declareBtn,
              isTakingBetsRightNow ? styles.declareBtnDisabled : null,
            ]}
            onPress={() => openDeclareModal(item)}
            disabled={isTakingBetsRightNow}
          >
            <Trophy color="#fff" size={16} style={{ marginRight: 6 }} />
            <Typography weight="700" style={styles.declareBtnText}>
              {isTakingBetsRightNow ? "Bets Live" : "Declare"}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Typography weight="700" style={styles.headerTitle}>
          Market Management
        </Typography>
      </View>

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
          renderItem={renderMarketCard}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchMarkets}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus color="#fff" size={28} />
      </TouchableOpacity>

      {/* --- ADD MARKET MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
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
                  setAddModalVisible(false);
                  setShowOpenPicker(false);
                  setShowClosePicker(false);
                }}
              >
                <X color={theme.colors.textMuted} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.textInput}
                placeholder="Market Name (e.g., Kalyan Morning)"
                placeholderTextColor={theme.colors.textMuted}
                value={newName}
                onChangeText={setNewName}
              />

              <Typography weight="700" style={styles.sectionHeader}>
                Betting Timing
              </Typography>
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

              <Typography weight="700" style={styles.sectionHeader}>
                Result Declaration Timing (Optional)
              </Typography>
              <View style={styles.timeRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Typography style={styles.label}>Open Result Time</Typography>
                  <TextInput
                    style={styles.textInput}
                    value={newOpenResultTime}
                    onChangeText={setNewOpenResultTime}
                    placeholder="08:05:00"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Typography style={styles.label}>Close Result Time</Typography>
                  <TextInput
                    style={styles.textInput}
                    value={newCloseResultTime}
                    onChangeText={setNewCloseResultTime}
                    placeholder="10:50:00"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, isCreating && { opacity: 0.7 }]}
                onPress={handleCreateMarket}
                disabled={isCreating}
              >
                {isCreating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Typography weight="700" style={styles.saveBtnText}>
                    CREATE MARKET
                  </Typography>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- EDIT MARKET MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography weight="700" style={styles.modalTitle}>
                Edit Market Settings
              </Typography>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <X color={theme.colors.textMuted} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.switchRow}>
                <Typography weight="600" style={styles.labelNoMargin}>
                  Market Status ({editIsActive ? "Active" : "Paused"})
                </Typography>
                <Switch
                  value={editIsActive}
                  onValueChange={(val) => setEditIsActive(val)}
                  trackColor={{
                    false: theme.colors.border,
                    true: theme.colors.success,
                  }}
                  thumbColor="#fff"
                />
              </View>

              <Typography style={styles.label}>Market Name</Typography>
              <TextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="e.g. Kalyan Morning"
                placeholderTextColor={theme.colors.textMuted}
              />

              <Typography weight="700" style={styles.sectionHeader}>
                Betting Timing
              </Typography>
              <View style={styles.timeRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Typography style={styles.label}>Open Time (HH:MM:SS)</Typography>
                  <TextInput
                    style={styles.textInput}
                    value={editOpenTime}
                    onChangeText={setEditOpenTime}
                    placeholder="08:00:00"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Typography style={styles.label}>Close Time (HH:MM:SS)</Typography>
                  <TextInput
                    style={styles.textInput}
                    value={editCloseTime}
                    onChangeText={setEditCloseTime}
                    placeholder="10:40:00"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>

              <Typography weight="700" style={styles.sectionHeader}>
                Result Declaration Timing
              </Typography>
              <View style={styles.timeRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Typography style={styles.label}>Open Result Time</Typography>
                  <TextInput
                    style={styles.textInput}
                    value={editOpenResultTime}
                    onChangeText={setEditOpenResultTime}
                    placeholder="08:05:00"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Typography style={styles.label}>Close Result Time</Typography>
                  <TextInput
                    style={styles.textInput}
                    value={editCloseResultTime}
                    onChangeText={setEditCloseResultTime}
                    placeholder="10:50:00"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, isSavingEdit && { opacity: 0.7 }]}
                onPress={handleSaveEditMarket}
                disabled={isSavingEdit}
              >
                {isSavingEdit ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Typography weight="700" style={styles.saveBtnText}>
                    SAVE CHANGES
                  </Typography>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- DECLARE RESULT MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={declareModalVisible}
        onRequestClose={() => setDeclareModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography weight="700" style={styles.modalTitle}>
                Declare Result
              </Typography>
              <TouchableOpacity onPress={() => setDeclareModalVisible(false)}>
                <X color={theme.colors.textMuted} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <AlertCircle color="#2563EB" size={20} style={{ marginRight: 8 }} />
              <Typography style={styles.infoText}>
                Manual Payout Mode: Winning number will be published, but funds must be distributed manually.
              </Typography>
            </View>

            <Typography style={styles.label}>Market</Typography>
            <Typography weight="700" style={styles.marketHighlight}>
              {selectedMarket?.name}
            </Typography>

            <Typography style={styles.label}>Session</Typography>
            <View style={styles.sessionToggleRow}>
              <TouchableOpacity
                style={[
                  styles.sessionBtn,
                  session === "OPEN" && styles.sessionBtnActive,
                  !isOpenResultActive && styles.sessionBtnDisabled,
                ]}
                onPress={() => setSession("OPEN")}
                disabled={!isOpenResultActive}
              >
                <Typography
                  weight="600"
                  style={[
                    styles.sessionText,
                    session === "OPEN" && styles.sessionTextActive,
                    !isOpenResultActive && styles.sessionTextDisabled,
                  ]}
                >
                  OPEN
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sessionBtn,
                  session === "CLOSE" && styles.sessionBtnActive,
                  !isCloseResultActive && styles.sessionBtnDisabled,
                ]}
                onPress={() => setSession("CLOSE")}
                disabled={!isCloseResultActive}
              >
                <Typography
                  weight="600"
                  style={[
                    styles.sessionText,
                    session === "CLOSE" && styles.sessionTextActive,
                    !isCloseResultActive && styles.sessionTextDisabled,
                  ]}
                >
                  CLOSE
                </Typography>
              </TouchableOpacity>
            </View>

            <Typography style={styles.label}>Winning Number</Typography>
            <TextInput
              style={styles.numberInput}
              keyboardType="number-pad"
              maxLength={3}
              value={winningNumber}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, "");
                setWinningNumber(cleaned);
              }}
              placeholder="e.g., 4, 28, or 138"
              placeholderTextColor={theme.colors.border}
            />

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handleDeclareResult}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Typography weight="700" style={styles.submitBtnText}>
                  PUBLISH RESULT
                </Typography>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: { fontSize: 24, color: theme.colors.textDark },
  listContent: { padding: theme.spacing.m, paddingBottom: 100 },

  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.radius.l,
    marginBottom: theme.spacing.m,
    ...theme.shadows.card,
  },
  cardHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marketName: {
    fontSize: 18,
    color: theme.colors.textDark,
    textTransform: "uppercase",
    flex: 1,
  },
  headerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 4,
  },

  cardHeaderSub: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  marketTime: { fontSize: 12, color: theme.colors.textMuted },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusActive: { backgroundColor: theme.colors.success + "20" },
  statusClosed: { backgroundColor: theme.colors.danger + "20" },
  statusPaused: { backgroundColor: "#fee2e2" },
  statusText: { fontSize: 10 },
  textActive: { color: theme.colors.success },
  textClosed: { color: theme.colors.danger },
  textPaused: { color: "#ef4444" },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: theme.radius.m,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtnText: { color: theme.colors.primary, fontSize: 13 },

  declareBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: theme.radius.m,
    justifyContent: "center",
    alignItems: "center",
  },
  declareBtnText: { color: theme.colors.surface, fontSize: 13 },
  declareBtnDisabled: {
    backgroundColor: theme.colors.border,
    opacity: 0.7,
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.card,
    elevation: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, color: theme.colors.textDark },

  sectionHeader: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 16,
    marginBottom: 6,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: theme.radius.m,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  textInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: 12,
    height: 52,
    fontSize: 15,
    color: theme.colors.textDark,
    marginBottom: 12,
  },

  timeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 12,
  },

  saveBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: theme.radius.l,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  saveBtnText: { color: "#fff", fontSize: 15, letterSpacing: 1 },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: theme.radius.m,
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: { color: "#1D4ED8", fontSize: 12, fontWeight: "600", flex: 1 },

  label: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  labelNoMargin: {
    fontSize: 14,
    color: theme.colors.textDark,
  },
  marketHighlight: {
    fontSize: 22,
    color: theme.colors.primary,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  sessionToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sessionBtn: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: theme.radius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  sessionBtnActive: {
    backgroundColor: theme.colors.primary + "15",
    borderColor: theme.colors.primary,
  },
  sessionBtnDisabled: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    opacity: 0.4,
  },
  sessionText: { color: theme.colors.textMuted, fontSize: 14 },
  sessionTextActive: { color: theme.colors.primary },
  sessionTextDisabled: { color: theme.colors.textMuted },

  numberInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    fontSize: 32,
    color: theme.colors.textDark,
    textAlign: "center",
    height: 70,
    marginBottom: 20,
  },

  submitBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.radius.l,
    alignItems: "center",
  },
  submitBtnText: { color: "#fff", fontSize: 16, letterSpacing: 1 },
});