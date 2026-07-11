// import React, { useState, useEffect } from 'react';
// import { View, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
// import { Search, Plus, Minus, X, User, History } from 'lucide-react-native';
// import api from './api';
// import { theme } from './theme';
// import Typography from './components/Typography';

// export default function AdminUserScreen({ navigation }) {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);

//   // Fund Modal State
//   const [fundModalVisible, setFundModalVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [fundAction, setFundAction] = useState('add'); 
//   const [amount, setAmount] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Passbook Modal State
//   const [passbookModalVisible, setPassbookModalVisible] = useState(false);
//   const [passbookData, setPassbookData] = useState([]);
//   const [isLoadingPassbook, setIsLoadingPassbook] = useState(false);

//   useEffect(() => { fetchUsers(); }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('/admin/users/all');
//       setUsers(response.data);
//       setFilteredUsers(response.data);
//     } catch (error) {
//       Alert.alert("Error", "Failed to fetch users.");
//     } finally { setLoading(false); }
//   };

//   const handleSearch = (text) => {
//     setSearchQuery(text);
//     if (text) {
//       const newData = users.filter(user => {
//         const name = user.full_name ? user.full_name.toUpperCase() : '';
//         const phone = user.phone_number ? user.phone_number : '';
//         return `${name} ${phone}`.indexOf(text.toUpperCase()) > -1;
//       });
//       setFilteredUsers(newData);
//     } else { setFilteredUsers(users); }
//   };

//   // --- FUND LOGIC ---
//   const openFundModal = (user, action) => {
//     setSelectedUser(user);
//     setFundAction(action);
//     setAmount('');
//     setFundModalVisible(true);
//   };

//   const handleFundSubmit = async () => {
//     if (!amount || isNaN(amount) || amount <= 0) {
//       Alert.alert("Invalid", "Please enter a valid amount.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const response = await api.patch('/admin/users/update-funds', {
//         user_id: selectedUser.id,
//         amount: parseInt(amount),
//         action: fundAction
//       });
//       Alert.alert("Success", response.data.message);
//       setFundModalVisible(false);
//       fetchUsers(); 
//     } catch (error) {
//       Alert.alert("Error", error.response?.data?.error || "Failed to update");
//     } finally { setIsSubmitting(false); }
//   };

//   // --- PASSBOOK LOGIC ---
//   const openPassbook = async (user) => {
//     setSelectedUser(user);
//     setPassbookModalVisible(true);
//     setIsLoadingPassbook(true);
//     try {
//       const response = await api.get(`/admin/users/${user.id}/passbook`);
//       setPassbookData(response.data);
//     } catch (error) {
//       Alert.alert("Error", "Failed to fetch ledger");
//     } finally { setIsLoadingPassbook(false); }
//   };

//   const renderTransaction = ({ item }) => {
//     // Safely check if the transaction is some kind of credit (handles variations from Postman testing)
//     const txType = item.type ? item.type.toUpperCase() : 'UNKNOWN';
//     const isCredit = ['CREDIT', 'WIN', 'ADMIN_CREDIT', 'DEPOSIT', 'ADD'].includes(txType);
    
//     const date = new Date(item.created_at);
    
//     // Formatting Date safely
//     const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
//     const formattedTime = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

//     return (
//       <View style={styles.txCard}>
//         <View style={styles.txIconBox}>
//           {isCredit ? <Plus color={theme.colors.success} size={20} /> : <Minus color={theme.colors.danger} size={20} />}
//         </View>
//         <View style={styles.txDetails}>
//           {/* CRITICAL FIX: Display the actual database type so old Postman tests show up accurately */}
//           <Typography weight="700" style={styles.txType}>{txType}</Typography>
//           <Typography style={styles.txDate}>{formattedDate} at {formattedTime}</Typography>
//         </View>
//         <Typography weight="700" style={[styles.txAmount, { color: isCredit ? theme.colors.success : theme.colors.textDark }]}>
//           {isCredit ? '+' : '-'}{item.amount}
//         </Typography>
//       </View>
//     );
//   };

//   // const renderUserCard = ({ item }) => (
//   //   <View style={styles.userCard}>
//   //     <View style={styles.userInfoRow}>
//   //       <View style={styles.avatar}><User color={theme.colors.surface} size={20} /></View>
//   //       <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
//   //         <Typography weight="700" style={styles.userName}>{item.full_name}</Typography>
//   //         <Typography style={styles.userPhone}>{item.phone_number}</Typography>
//   //       </View>
//   //       <View style={styles.balanceBadge}>
//   //         <Typography weight="700" style={styles.balanceText}>{item.wallet_balance} Pts</Typography>
//   //       </View>
//   //     </View>
      
//   //     {/* 3-Button Action Row */}
//   //     <View style={styles.actionRow}>
//   //       <TouchableOpacity style={[styles.actionBtn, styles.addBtn]} onPress={() => openFundModal(item, 'add')}>
//   //         <Plus color={theme.colors.success} size={16} />
//   //         <Typography weight="600" style={styles.addBtnText}> Add</Typography>
//   //       </TouchableOpacity>
        
//   //       <TouchableOpacity style={[styles.actionBtn, styles.deductBtn]} onPress={() => openFundModal(item, 'deduct')}>
//   //         <Minus color={theme.colors.danger} size={16} />
//   //         <Typography weight="600" style={styles.deductBtnText}> Deduct</Typography>
//   //       </TouchableOpacity>

//   //       <TouchableOpacity style={[styles.actionBtn, styles.ledgerBtn]} onPress={() => openPassbook(item)}>
//   //         <History color={theme.colors.primary} size={16} />
//   //         <Typography weight="600" style={styles.ledgerBtnText}> Ledger</Typography>
//   //       </TouchableOpacity>
//   //     </View>
//   //   </View>
//   // );


//   const renderUserCard = ({ item }) => (
//     <View style={styles.userCard}>
      
//       {/* CHANGED: Made this top row a TouchableOpacity to navigate to Details */}
//       <TouchableOpacity 
//         style={styles.userInfoRow} 
//         onPress={() => navigation.navigate('UserDetailsScreen', { userId: item.id })}
//       >
//         <View style={styles.avatar}><User color={theme.colors.surface} size={20} /></View>
//         <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
//           <Typography weight="700" style={styles.userName}>{item.full_name}</Typography>
//           <Typography style={styles.userPhone}>{item.phone_number}</Typography>
//         </View>
//         <View style={styles.balanceBadge}>
//           <Typography weight="700" style={styles.balanceText}>{item.wallet_balance} Pts</Typography>
//         </View>
//       </TouchableOpacity>
      
//       {/* 3-Button Action Row (Stays exactly the same) */}
//       <View style={styles.actionRow}>
//         <TouchableOpacity style={[styles.actionBtn, styles.addBtn]} onPress={() => openFundModal(item, 'add')}>
//           <Plus color={theme.colors.success} size={16} />
//           <Typography weight="600" style={styles.addBtnText}> Add</Typography>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={[styles.actionBtn, styles.deductBtn]} onPress={() => openFundModal(item, 'deduct')}>
//           <Minus color={theme.colors.danger} size={16} />
//           <Typography weight="600" style={styles.deductBtnText}> Deduct</Typography>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.actionBtn, styles.ledgerBtn]} onPress={() => openPassbook(item)}>
//           <History color={theme.colors.primary} size={16} />
//           <Typography weight="600" style={styles.ledgerBtnText}> Ledger</Typography>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );


//   return (
//     <View style={styles.container}>
//       <View style={styles.searchContainer}>
//         <Search color={theme.colors.textMuted} size={20} style={{ marginLeft: 12 }} />
//         <TextInput style={styles.searchInput} placeholder="Search by name or phone..." placeholderTextColor={theme.colors.textMuted} value={searchQuery} onChangeText={handleSearch} />
//       </View>

//       {loading ? <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} /> : (
//         <FlatList data={filteredUsers} keyExtractor={(item) => item.id.toString()} renderItem={renderUserCard} contentContainerStyle={{ padding: theme.spacing.m }} refreshing={loading} onRefresh={fetchUsers} />
//       )}

//       {/* --- ADD/DEDUCT FUNDS MODAL --- */}
//       <Modal animationType="fade" transparent={true} visible={fundModalVisible} onRequestClose={() => setFundModalVisible(false)}>
//         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Typography weight="700" style={styles.modalTitle}>{fundAction === 'add' ? 'Add Funds' : 'Deduct Funds'}</Typography>
//               <TouchableOpacity onPress={() => setFundModalVisible(false)}><X color={theme.colors.textMuted} size={24} /></TouchableOpacity>
//             </View>
//             <Typography style={styles.modalTargetText}>Target: <Typography weight="700" style={{ color: theme.colors.textDark }}>{selectedUser?.full_name}</Typography></Typography>
//             <View style={styles.inputWrapper}>
//               <Typography weight="700" style={styles.currencyPrefix}>Pts</Typography>
//               <TextInput style={styles.amountInput} placeholder="0" placeholderTextColor={theme.colors.border} value={amount} onChangeText={setAmount} keyboardType="numeric" autoFocus />
//             </View>
//             <TouchableOpacity style={[styles.submitBtn, fundAction === 'add' ? styles.submitBtnAdd : styles.submitBtnDeduct]} onPress={handleFundSubmit} disabled={isSubmitting}>
//               {isSubmitting ? <ActivityIndicator color={theme.colors.surface} /> : <Typography weight="700" style={styles.submitText}>Confirm</Typography>}
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>

//       {/* --- PASSBOOK / LEDGER MODAL --- */}
//       <Modal animationType="slide" transparent={true} visible={passbookModalVisible} onRequestClose={() => setPassbookModalVisible(false)}>
//         <View style={styles.modalOverlaySlide}>
//           <View style={styles.passbookContent}>
//             <View style={styles.modalHeader}>
//               <View>
//                 <Typography weight="700" style={styles.modalTitle}>{selectedUser?.full_name}'s Ledger</Typography>
//                 <Typography style={styles.modalTargetText}>Recent Transactions</Typography>
//               </View>
//               <TouchableOpacity onPress={() => setPassbookModalVisible(false)} style={styles.closeBtn}>
//                 <X color={theme.colors.textDark} size={24} />
//               </TouchableOpacity>
//             </View>

//             {isLoadingPassbook ? (
//               <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
//             ) : passbookData.length === 0 ? (
//               <View style={{ alignItems: 'center', marginTop: 50 }}>
//                 <History color={theme.colors.textMuted} size={48} />
//                 <Typography style={{ color: theme.colors.textMuted, marginTop: 10 }}>No transactions found.</Typography>
//               </View>
//             ) : (
//               <FlatList
//                 data={passbookData}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={renderTransaction}
//                 showsVerticalScrollIndicator={false}
//               />
//             )}
//           </View>
//         </View>
//       </Modal>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: theme.colors.background },
//   searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, margin: theme.spacing.m, borderRadius: theme.radius.m, borderWidth: 1, borderColor: theme.colors.border, height: 50 },
//   searchInput: { flex: 1, height: '100%', paddingHorizontal: theme.spacing.m, color: theme.colors.textDark, fontFamily: 'Inter_400Regular' },
  
//   userCard: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: theme.radius.m, marginBottom: theme.spacing.m, ...theme.shadows.card },
//   userInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.m, paddingBottom: theme.spacing.m, borderBottomWidth: 1, borderBottomColor: theme.colors.background },
//   avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
//   userName: { fontSize: 16, color: theme.colors.textDark },
//   userPhone: { fontSize: 12, color: theme.colors.textMuted },
//   balanceBadge: { backgroundColor: theme.colors.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: theme.radius.round },
//   balanceText: { color: theme.colors.primary, fontSize: 14 },
  
//   // 3 Action Buttons
//   actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   actionBtn: { flex: 0.31, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: theme.radius.s, borderWidth: 1 },
//   addBtn: { backgroundColor: theme.colors.success + '10', borderColor: theme.colors.success + '40' },
//   addBtnText: { color: theme.colors.success, fontSize: 12 },
//   deductBtn: { backgroundColor: theme.colors.danger + '10', borderColor: theme.colors.danger + '40' },
//   deductBtnText: { color: theme.colors.danger, fontSize: 12 },
//   ledgerBtn: { backgroundColor: theme.colors.primary + '10', borderColor: theme.colors.primary + '40' },
//   ledgerBtnText: { color: theme.colors.primary, fontSize: 12 },

//   // Shared Modal Elements
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: theme.spacing.xl },
//   modalOverlaySlide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
//   modalContent: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.l, padding: theme.spacing.xl, ...theme.shadows.card },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.m },
//   modalTitle: { fontSize: 20, color: theme.colors.textDark },
//   modalTargetText: { color: theme.colors.textMuted, marginBottom: theme.spacing.l },
//   closeBtn: { padding: theme.spacing.xs, backgroundColor: theme.colors.background, borderRadius: theme.radius.round },

//   // Fund Specific
//   inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, borderRadius: theme.radius.m, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: theme.spacing.m, height: 64, marginBottom: theme.spacing.l },
//   currencyPrefix: { fontSize: 20, color: theme.colors.textMuted, marginRight: theme.spacing.s },
//   amountInput: { flex: 1, fontSize: 32, fontFamily: 'Inter_700Bold', color: theme.colors.textDark },
//   submitBtn: { height: 56, borderRadius: theme.radius.m, justifyContent: 'center', alignItems: 'center' },
//   submitBtnAdd: { backgroundColor: theme.colors.success },
//   submitBtnDeduct: { backgroundColor: theme.colors.danger },
//   submitText: { color: theme.colors.surface, fontSize: 16 },

//   // Passbook Specific
//   passbookContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl, padding: theme.spacing.xl, height: '80%' },
//   txCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.m, borderBottomWidth: 1, borderBottomColor: theme.colors.background },
//   txIconBox: { width: 40, height: 40, borderRadius: theme.radius.round, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.m },
//   txDetails: { flex: 1 },
//   txType: { fontSize: 14, color: theme.colors.textDark, marginBottom: 4 },
//   txDate: { fontSize: 12, color: theme.colors.textMuted },
//   txAmount: { fontSize: 16 }
// });


















// After applying pagination in user page of admin app
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Search, Plus, Minus, X, User, History, Trash2, Menu } from 'lucide-react-native';
import api from './api';
import { theme } from './theme';
import Typography from './components/Typography';
import AdminHeader from './components/AdminHeader';

export default function AdminUserScreen({ navigation }) {
  // --- PAGINATION & SEARCH STATES ---
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [loading, setLoading] = useState(true); // For initial load or fresh search
  const [isFetchingMore, setIsFetchingMore] = useState(false); // For infinite scroll

  // Fund Modal State
  const [fundModalVisible, setFundModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fundAction, setFundAction] = useState('add'); 
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Passbook Modal State
  const [passbookModalVisible, setPassbookModalVisible] = useState(false);
  const [passbookData, setPassbookData] = useState([]);
  const [isLoadingPassbook, setIsLoadingPassbook] = useState(false);

  // --- SEARCH DEBOUNCE EFFECT ---
  // Waits 500ms after the user stops typing before making the API call
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1); // Reset to page 1 on new search
      fetchUsers(1, searchQuery, false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);


  // --- FETCH LOGIC ---
  const fetchUsers = async (pageNumber = 1, search = '', isLoadMore = false) => {
    if (isLoadMore) {
      setIsFetchingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await api.get(`/admin/users/all?page=${pageNumber}&limit=20&search=${search}`);
      const fetchedUsers = response.data.users;
      
      if (isLoadMore) {
        setUsers(prevUsers => [...prevUsers, ...fetchedUsers]); // Append new data
      } else {
        setUsers(fetchedUsers); // Replace data (for refresh or new search)
      }
      
      setTotalPages(response.data.pagination.totalPages);
      setPage(pageNumber);

    } catch (error) {
      Alert.alert("Error", "Failed to fetch users.");
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Called when FlatList hits the bottom
  const loadMoreUsers = () => {
    if (!isFetchingMore && page < totalPages) {
      fetchUsers(page + 1, searchQuery, true);
    }
  };

  // --- FUND LOGIC ---
  const openFundModal = (user, action) => {
    setSelectedUser(user);
    setFundAction(action);
    setAmount('');
    setFundModalVisible(true);
  };

  const handleFundSubmit = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid", "Please enter a valid amount.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.patch('/admin/users/update-funds', {
        user_id: selectedUser.id,
        amount: parseInt(amount),
        action: fundAction
      });
      Alert.alert("Success", response.data.message);
      setFundModalVisible(false);
      
      // Silently refresh current page data to update the wallet balance
      fetchUsers(1, searchQuery, false); 
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to update");
    } finally { setIsSubmitting(false); }
  };

  // --- PASSBOOK LOGIC ---
  const openPassbook = async (user) => {
    setSelectedUser(user);
    setPassbookModalVisible(true);
    setIsLoadingPassbook(true);
    try {
      const response = await api.get(`/admin/users/${user.id}/passbook`);
      setPassbookData(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch ledger");
    } finally { setIsLoadingPassbook(false); }
  };

  const renderTransaction = ({ item }) => {
    const txType = item.type ? item.type.toUpperCase() : 'UNKNOWN';
    const isCredit = ['CREDIT', 'WIN', 'ADMIN_CREDIT', 'DEPOSIT', 'ADD'].includes(txType);
    const date = new Date(item.created_at);
    const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
      <View style={styles.txCard}>
        <View style={styles.txIconBox}>
          {isCredit ? <Plus color={theme.colors.success} size={20} /> : <Minus color={theme.colors.danger} size={20} />}
        </View>
        <View style={styles.txDetails}>
          <Typography weight="700" style={styles.txType}>{txType}</Typography>
          <Typography style={styles.txDate}>{formattedDate} at {formattedTime}</Typography>
        </View>
        <Typography weight="700" style={[styles.txAmount, { color: isCredit ? theme.colors.success : theme.colors.textDark }]}>
          {isCredit ? '+' : '-'}{item.amount}
        </Typography>
      </View>
    );
  };

  const handleDeleteUser = (userId, userName) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to permanently delete ${userName}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => confirmDelete(userId) 
        }
      ]
    );
  };

  const confirmDelete = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      Alert.alert("Success", "User deleted successfully.");
      
      // Refresh the list to remove the deleted user
      setPage(1);
      fetchUsers(1, searchQuery, false);
    } catch (error) {
      console.log(error)
      Alert.alert("Error", error.response?.data?.error || "Failed to delete user");
    }
  };

  // const renderUserCard = ({ item }) => (
  //   <View style={styles.userCard}>
  //     <TouchableOpacity 
  //       style={styles.userInfoRow} 
  //       onPress={() => navigation.navigate('UserDetailsScreen', { userId: item.id })}
  //     >
  //       <View style={styles.avatar}><User color={theme.colors.surface} size={20} /></View>
  //       <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
  //         <Typography weight="700" style={styles.userName}>{item.full_name}</Typography>
  //         <Typography style={styles.userPhone}>{item.phone_number}</Typography>
  //       </View>
  //       <View style={styles.balanceBadge}>
  //         <Typography weight="700" style={styles.balanceText}>{item.wallet_balance} Pts</Typography>
  //       </View>
  //     </TouchableOpacity>
      
  //     <View style={styles.actionRow}>
  //       <TouchableOpacity style={[styles.actionBtn, styles.addBtn]} onPress={() => openFundModal(item, 'add')}>
  //         <Plus color={theme.colors.success} size={16} />
  //         <Typography weight="600" style={styles.addBtnText}> Add</Typography>
  //       </TouchableOpacity>
        
  //       <TouchableOpacity style={[styles.actionBtn, styles.deductBtn]} onPress={() => openFundModal(item, 'deduct')}>
  //         <Minus color={theme.colors.danger} size={16} />
  //         <Typography weight="600" style={styles.deductBtnText}> Deduct</Typography>
  //       </TouchableOpacity>

  //       <TouchableOpacity style={[styles.actionBtn, styles.ledgerBtn]} onPress={() => openPassbook(item)}>
  //         <History color={theme.colors.primary} size={16} />
  //         <Typography weight="600" style={styles.ledgerBtnText}> Ledger</Typography>
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  // Spinner for the bottom of the list when loading more
  
  const renderUserCard = ({ item }) => (
    <View style={styles.userCard}>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.m, paddingBottom: theme.spacing.m, borderBottomWidth: 1, borderBottomColor: theme.colors.background }}>
        {/* We keep the main info clickable to go to details */}
        <TouchableOpacity 
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} 
          onPress={() => navigation.navigate('UserDetailsScreen', { userId: item.id })}
        >
          <View style={styles.avatar}><User color={theme.colors.surface} size={20} /></View>
          <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
            <Typography weight="700" style={styles.userName}>{item.full_name}</Typography>
            <Typography style={styles.userPhone}>{item.phone_number}</Typography>
          </View>
        </TouchableOpacity>

        {/* Right side: Balance and Delete Button */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.balanceBadge}>
            <Typography weight="700" style={styles.balanceText}>{item.wallet_balance} Pts</Typography>
          </View>
          
          <TouchableOpacity 
            style={{ marginLeft: 12, padding: 4 }} 
            onPress={() => handleDeleteUser(item.id, item.full_name)}
          >
            <Trash2 color={theme.colors.danger} size={22} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* 3-Button Action Row (Stays exactly the same) */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.addBtn]} onPress={() => openFundModal(item, 'add')}>
          <Plus color={theme.colors.success} size={16} />
          <Typography weight="600" style={styles.addBtnText}> Add</Typography>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtn, styles.deductBtn]} onPress={() => openFundModal(item, 'deduct')}>
          <Minus color={theme.colors.danger} size={16} />
          <Typography weight="600" style={styles.deductBtnText}> Deduct</Typography>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.ledgerBtn]} onPress={() => openPassbook(item)}>
          <History color={theme.colors.primary} size={16} />
          <Typography weight="600" style={styles.ledgerBtnText}> Ledger</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AdminHeader title="Users"/>
      <View style={styles.searchContainer}>
        <Search color={theme.colors.textMuted} size={20} style={{ marginLeft: 12 }} />
        {/* CHANGED: Just update the state, the Debounce useEffect will handle the API call automatically */}
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search by name or phone..." 
          placeholderTextColor={theme.colors.textMuted} 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList 
          data={users} 
          keyExtractor={(item) => item.id.toString()} 
          renderItem={renderUserCard} 
          contentContainerStyle={{ padding: theme.spacing.m, paddingBottom: 100 }} 
          
          // Pull to refresh
          refreshing={loading} 
          onRefresh={() => { setPage(1); fetchUsers(1, searchQuery, false); }} 
          
          // Infinite Scroll Triggers
          onEndReached={loadMoreUsers}
          onEndReachedThreshold={0.5} // Trigger fetch when halfway through the last items
          ListFooterComponent={renderFooter}
          
          ListEmptyComponent={
            <Text style={{textAlign: 'center', marginTop: 20, color: theme.colors.textMuted}}>No users found.</Text>
          }
        />
      )}

      {/* --- ADD/DEDUCT FUNDS MODAL --- */}
      <Modal animationType="fade" transparent={true} visible={fundModalVisible} onRequestClose={() => setFundModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography weight="700" style={styles.modalTitle}>{fundAction === 'add' ? 'Add Funds' : 'Deduct Funds'}</Typography>
              <TouchableOpacity onPress={() => setFundModalVisible(false)}><X color={theme.colors.textMuted} size={24} /></TouchableOpacity>
            </View>
            <Typography style={styles.modalTargetText}>Target: <Typography weight="700" style={{ color: theme.colors.textDark }}>{selectedUser?.full_name}</Typography></Typography>
            <View style={styles.inputWrapper}>
              <Typography weight="700" style={styles.currencyPrefix}>Pts</Typography>
              <TextInput style={styles.amountInput} placeholder="0" placeholderTextColor={theme.colors.border} value={amount} onChangeText={setAmount} keyboardType="numeric" autoFocus />
            </View>
            <TouchableOpacity style={[styles.submitBtn, fundAction === 'add' ? styles.submitBtnAdd : styles.submitBtnDeduct]} onPress={handleFundSubmit} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator color={theme.colors.surface} /> : <Typography weight="700" style={styles.submitText}>Confirm</Typography>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- PASSBOOK / LEDGER MODAL --- */}
      <Modal animationType="slide" transparent={true} visible={passbookModalVisible} onRequestClose={() => setPassbookModalVisible(false)}>
        <View style={styles.modalOverlaySlide}>
          <View style={styles.passbookContent}>
            <View style={styles.modalHeader}>
              <View>
                <Typography weight="700" style={styles.modalTitle}>{selectedUser?.full_name}'s Ledger</Typography>
                <Typography style={styles.modalTargetText}>Recent Transactions</Typography>
              </View>
              <TouchableOpacity onPress={() => setPassbookModalVisible(false)} style={styles.closeBtn}>
                <X color={theme.colors.textDark} size={24} />
              </TouchableOpacity>
            </View>

            {isLoadingPassbook ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
            ) : passbookData.length === 0 ? (
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <History color={theme.colors.textMuted} size={48} />
                <Typography style={{ color: theme.colors.textMuted, marginTop: 10 }}>No transactions found.</Typography>
              </View>
            ) : (
              <FlatList
                data={passbookData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTransaction}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, margin: theme.spacing.m, borderRadius: theme.radius.m, borderWidth: 1, borderColor: theme.colors.border, height: 50 },
  searchInput: { flex: 1, height: '100%', paddingHorizontal: theme.spacing.m, color: theme.colors.textDark, fontFamily: 'Inter_400Regular' },
  
  userCard: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: theme.radius.m, marginBottom: theme.spacing.m, ...theme.shadows.card },
  userInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.m, paddingBottom: theme.spacing.m, borderBottomWidth: 1, borderBottomColor: theme.colors.background },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  userName: { fontSize: 16, color: theme.colors.textDark },
  userPhone: { fontSize: 12, color: theme.colors.textMuted },
  balanceBadge: { backgroundColor: theme.colors.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: theme.radius.round },
  balanceText: { color: theme.colors.primary, fontSize: 14 },
  
  // 3 Action Buttons
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 0.31, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: theme.radius.s, borderWidth: 1 },
  addBtn: { backgroundColor: theme.colors.success + '10', borderColor: theme.colors.success + '40' },
  addBtnText: { color: theme.colors.success, fontSize: 12 },
  deductBtn: { backgroundColor: theme.colors.danger + '10', borderColor: theme.colors.danger + '40' },
  deductBtnText: { color: theme.colors.danger, fontSize: 12 },
  ledgerBtn: { backgroundColor: theme.colors.primary + '10', borderColor: theme.colors.primary + '40' },
  ledgerBtnText: { color: theme.colors.primary, fontSize: 12 },

  // Shared Modal Elements
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: theme.spacing.xl },
  modalOverlaySlide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.l, padding: theme.spacing.xl, ...theme.shadows.card },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.m },
  modalTitle: { fontSize: 20, color: theme.colors.textDark },
  modalTargetText: { color: theme.colors.textMuted, marginBottom: theme.spacing.l },
  closeBtn: { padding: theme.spacing.xs, backgroundColor: theme.colors.background, borderRadius: theme.radius.round },

  // Fund Specific
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, borderRadius: theme.radius.m, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: theme.spacing.m, height: 64, marginBottom: theme.spacing.l },
  currencyPrefix: { fontSize: 20, color: theme.colors.textMuted, marginRight: theme.spacing.s },
  amountInput: { flex: 1, fontSize: 32, fontFamily: 'Inter_700Bold', color: theme.colors.textDark },
  submitBtn: { height: 56, borderRadius: theme.radius.m, justifyContent: 'center', alignItems: 'center' },
  submitBtnAdd: { backgroundColor: theme.colors.success },
  submitBtnDeduct: { backgroundColor: theme.colors.danger },
  submitText: { color: theme.colors.surface, fontSize: 16 },

  // Passbook Specific
  passbookContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl, padding: theme.spacing.xl, height: '80%' },
  txCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.m, borderBottomWidth: 1, borderBottomColor: theme.colors.background },
  txIconBox: { width: 40, height: 40, borderRadius: theme.radius.round, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.m },
  txDetails: { flex: 1 },
  txType: { fontSize: 14, color: theme.colors.textDark, marginBottom: 4 },
  txDate: { fontSize: 12, color: theme.colors.textMuted },
  txAmount: { fontSize: 16 }
});