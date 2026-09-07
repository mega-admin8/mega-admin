// import React, { useState, useCallback } from "react";
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
//   Linking,
//   Clipboard // Requires 'expo-clipboard' if using Expo, or standard React Native Clipboard
// } from "react-native";
// import { 
//   CheckCircle, 
//   XCircle, 
//   FileText, 
//   User, 
//   Phone, 
//   Calendar,
//   Copy
// } from "lucide-react-native";
// import { theme } from "./theme"; // Update path if needed
// import Typography from "./components/Typography"; // Update path if needed
// import { useFocusEffect } from '@react-navigation/native';
// import api from './api';

// export default function AdminFundRequestsScreen() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [processingId, setProcessingId] = useState(null); // Tracks which item is currently saving

//   const fetchPendingRequests = async () => {
//     try {
//       // Ensure your backend route is exactly this
//       const response = await api.get('funds/admin/pending'); 
//       setRequests(response.data.requests || []);
//     } catch (error) {
//       console.log("Failed to fetch pending requests:", error);
//       Alert.alert("Error", "Could not load fund requests.");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       setLoading(true);
//       fetchPendingRequests();
//     }, [])
//   );

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchPendingRequests();
//   };

//   const copyToClipboard = (text, type) => {
//     Clipboard.setString(text);
//     Alert.alert("Copied!", `${type} has been copied to your clipboard.`);
//   };

//   const contactUser = (phone) => {
//     Linking.openURL(`whatsapp://send?phone=+91${phone}&text=Hello, regarding your MegaPlay fund request...`)
//       .catch(() => Alert.alert("Error", "Could not open WhatsApp"));
//   };

//   const handleAction = (requestId, amount, action) => {
//     const isApprove = action === 'approve';
    
//     Alert.alert(
//       `Confirm ${isApprove ? 'Approval' : 'Rejection'}`,
//       isApprove 
//         ? `Are you sure you want to approve this request and credit ${amount} Pts to the user?`
//         : `Are you sure you want to REJECT this request?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Yes, Confirm", 
//           onPress: async () => {
//             setProcessingId(requestId);
//             try {
//               // Action will be either 'approve' or 'reject' calling your backend routes
//               await api.post(`/admin/${action}`, { request_id: requestId });
              
//               Alert.alert("Success", `Request ${action}d successfully.`);
//               // Remove the item from the list instantly without full reload
//               setRequests(prev => prev.filter(req => req.id !== requestId));
//             } catch (error) {
//               console.log(`Failed to ${action} request:`, error);
//               Alert.alert("Error", error.response?.data?.error || `Something went wrong while trying to ${action}.`);
//             } finally {
//               setProcessingId(null);
//             }
//           } 
//         },
//       ]
//     );
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const renderRequestCard = ({ item }) => {
//     const isProcessing = processingId === item.id;

//     return (
//       <View style={styles.card}>
//         {/* --- AMOUNT & STATUS HEADER --- */}
//         <View style={styles.cardHeader}>
//           <View>
//             <Typography style={styles.label}>Requested Amount</Typography>
//             <Typography weight="700" style={styles.amount}>
//               ₹{item.amount}
//             </Typography>
//           </View>
//           <View style={styles.tag}>
//             <Typography weight="700" style={styles.tagText}>PENDING</Typography>
//           </View>
//         </View>

//         <View style={styles.divider} />

//         {/* --- USER DETAILS --- */}
//         <View style={styles.detailRow}>
//           <User color={theme.colors.textMuted} size={18} />
//           <Typography style={styles.detailText}>{item.full_name}</Typography>
//         </View>

//         <TouchableOpacity 
//           style={styles.detailRow} 
//           onPress={() => contactUser(item.phone_number)}
//           activeOpacity={0.7}
//         >
//           <Phone color={theme.colors.primary} size={18} />
//           <Typography weight="600" style={[styles.detailText, { color: theme.colors.primary }]}>
//             +91 {item.phone_number}
//           </Typography>
//           <Typography style={styles.actionHint}>(Tap to WhatsApp)</Typography>
//         </TouchableOpacity>

//         <View style={styles.detailRow}>
//           <Calendar color={theme.colors.textMuted} size={18} />
//           <Typography style={styles.detailText}>{formatDate(item.created_at)}</Typography>
//         </View>

//         {/* --- UTR BOX --- */}
//         <TouchableOpacity 
//           style={styles.utrContainer}
//           activeOpacity={0.7}
//           onPress={() => copyToClipboard(item.utr_number, "UTR Number")}
//         >
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <FileText color={theme.colors.textDark} size={18} />
//             <View style={{ marginLeft: theme.spacing.s }}>
//               <Typography style={styles.label}>UTR / Reference No.</Typography>
//               <Typography weight="700" style={styles.utrText}>{item.utr_number}</Typography>
//             </View>
//           </View>
//           <Copy color={theme.colors.textMuted} size={20} />
//         </TouchableOpacity>

//         {/* --- ACTION BUTTONS --- */}
//         <View style={styles.actionRow}>
//           <TouchableOpacity 
//             style={[styles.btn, styles.rejectBtn, isProcessing && styles.btnDisabled]} 
//             onPress={() => handleAction(item.id, item.amount, 'reject')}
//             disabled={isProcessing || processingId !== null}
//           >
//             <XCircle color="#fff" size={20} />
//             <Typography weight="600" style={styles.btnText}>Reject</Typography>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.btn, styles.approveBtn, isProcessing && styles.btnDisabled]} 
//             onPress={() => handleAction(item.id, item.amount, 'approve')}
//             disabled={isProcessing || processingId !== null}
//           >
//             {isProcessing ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <>
//                 <CheckCircle color="#fff" size={20} />
//                 <Typography weight="600" style={styles.btnText}>Approve</Typography>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Typography weight="700" style={styles.title}>
//         Pending Fund Requests ({requests.length})
//       </Typography>

//       {loading ? (
//         <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
//       ) : (
//         <FlatList
//           data={requests}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderRequestCard}
//           contentContainerStyle={{ paddingBottom: 40 }}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={[theme.colors.primary]}
//             />
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <CheckCircle color={theme.colors.successLight} size={64} />
//               <Typography weight="600" style={styles.emptyText}>All Caught Up!</Typography>
//               <Typography style={styles.emptySub}>There are no pending fund requests.</Typography>
//             </View>
//           }
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     padding: theme.spacing.m,
//   },
//   title: {
//     fontSize: 20,
//     color: theme.colors.textDark,
//     marginBottom: theme.spacing.m,
//   },
//   card: {
//     backgroundColor: theme.colors.surface,
//     borderRadius: theme.radius.l,
//     padding: theme.spacing.m,
//     marginBottom: theme.spacing.l,
//     ...theme.shadows.card,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   label: {
//     fontSize: 12,
//     color: theme.colors.textMuted,
//     marginBottom: 2,
//   },
//   amount: {
//     fontSize: 28,
//     color: theme.colors.success || '#28a745',
//   },
//   tag: {
//     backgroundColor: '#fff3cd',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: theme.radius.round,
//   },
//   tagText: {
//     fontSize: 12,
//     color: '#856404',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: theme.colors.border,
//     marginVertical: theme.spacing.m,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: theme.spacing.s,
//   },
//   detailText: {
//     marginLeft: theme.spacing.s,
//     fontSize: 15,
//     color: theme.colors.textDark,
//   },
//   actionHint: {
//     marginLeft: 6,
//     fontSize: 12,
//     color: theme.colors.textMuted,
//   },
//   utrContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#f8f9fa',
//     padding: theme.spacing.m,
//     borderRadius: theme.radius.m,
//     marginTop: theme.spacing.s,
//     marginBottom: theme.spacing.l,
//     borderWidth: 1,
//     borderColor: '#e9ecef',
//     borderStyle: 'dashed',
//   },
//   utrText: {
//     fontSize: 16,
//     color: theme.colors.textDark,
//     letterSpacing: 0.5,
//   },
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: theme.spacing.s,
//   },
//   btn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: theme.radius.m,
//   },
//   rejectBtn: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#d9534f',
//   },
//   approveBtn: {
//     backgroundColor: theme.colors.success || '#28a745',
//   },
//   btnDisabled: {
//     opacity: 0.5,
//   },
//   btnText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontSize: 16,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 80,
//   },
//   emptyText: {
//     fontSize: 20,
//     color: theme.colors.textDark,
//     marginTop: theme.spacing.m,
//   },
//   emptySub: {
//     fontSize: 14,
//     color: theme.colors.textMuted,
//     marginTop: 4,
//   }
// });



import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Clipboard
} from "react-native";
import { 
  CheckCircle, 
  XCircle, 
  FileText, 
  User, 
  Phone, 
  Calendar,
  Copy
} from "lucide-react-native";
import { theme } from "./theme";
import Typography from "./components/Typography";
import { useFocusEffect } from '@react-navigation/native';
import api from './api';

export default function AdminFundRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null); 

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get('funds/admin/pending'); 
      setRequests(response.data.requests || []);
    } catch (error) {
      console.log("Failed to fetch pending requests:", error);
      Alert.alert("Error", "Could not load fund requests.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPendingRequests();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingRequests();
  };

  const copyToClipboard = (text, type) => {
    Clipboard.setString(text);
    Alert.alert("Copied!", `${type} has been copied to your clipboard.`);
  };

  const contactUser = (phone) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    Linking.openURL(`whatsapp://send?phone=+91${cleanPhone}&text=Hello, regarding your MegaPlay fund request...`)
      .catch(() => Alert.alert("Error", "Could not open WhatsApp"));
  };

  const handleAction = (requestId, amount, action) => {
    const isApprove = action === 'approve';
    
    Alert.alert(
      `Confirm ${isApprove ? 'Approval' : 'Rejection'}`,
      isApprove 
        ? `Are you sure you want to approve this request and credit ₹${amount} to the user?`
        : `Are you sure you want to REJECT this request?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Confirm", 
          onPress: async () => {
            setProcessingId(requestId);
            try {
              await api.post(`funds/admin/${action}`, { request_id: requestId });
              Alert.alert("Success", `Request ${action}d successfully.`);
              setRequests(prev => prev.filter(req => req.id !== requestId));
            } catch (error) {
              console.log(`Failed to ${action} request:`, error);
              Alert.alert("Error", error.response?.data?.error || `Something went wrong while trying to ${action}.`);
            } finally {
              setProcessingId(null);
            }
          } 
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // --- UPDATED COMPACT CARD UI ---
  const renderRequestCard = ({ item }) => {
    const isProcessing = processingId === item.id;

    return (
      <View style={styles.card}>
        {/* HEADER: User name and Date side-by-side */}
        <View style={styles.cardHeader}>
          <View style={styles.userBadge}>
            <User size={14} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
            <Typography weight="700" style={styles.userName} numberOfLines={1}>
              {/* Fallback to prevent ghost text */}
              {item.full_name || "Unknown User"} 
            </Typography>
          </View>
          <View style={styles.dateBadge}>
            <Calendar size={12} color={theme.colors.textMuted} style={{ marginRight: 4 }} />
            <Typography style={styles.dateText}>{formatDate(item.created_at)}</Typography>
          </View>
        </View>

        {/* MID SECTION: Amount & UTR Box (Side by side instead of stacked) */}
        <View style={styles.metaRow}>
          <View>
            <Typography style={styles.label}>Requested Amount</Typography>
            <Typography weight="700" style={styles.amountText}>₹{item.amount}</Typography>
          </View>

          <TouchableOpacity 
            style={styles.utrContainer} 
            onPress={() => copyToClipboard(item.utr_number, "UTR Number")}
            activeOpacity={0.7}
          >
            <View style={styles.utrTextWrapper}>
              <Typography style={styles.utrLabel}>UTR / REF</Typography>
              <Typography weight="600" style={styles.utrValue} numberOfLines={1}>
                {item.utr_number}
              </Typography>
            </View>
            <Copy size={14} color={theme.colors.textMuted} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {/* FOOTER: Phone / WhatsApp and Buttons in one row */}
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.phoneAction} onPress={() => contactUser(item.phone_number)}>
            <Phone size={14} color="#25D366" style={{ marginRight: 6 }} />
            <Typography style={styles.phoneText} numberOfLines={1}>
              +91 {item.phone_number} <Typography style={styles.waHint}>(WhatsApp)</Typography>
            </Typography>
          </TouchableOpacity>

          <View style={styles.actionButtonGroup}>
            <TouchableOpacity 
              style={[styles.btn, styles.btnReject, isProcessing && styles.btnDisabled]} 
              onPress={() => handleAction(item.id, item.amount, 'reject')}
              disabled={isProcessing || processingId !== null}
            >
              <XCircle size={14} color="#EF4444" style={{ marginRight: 4 }} />
              <Typography weight="600" style={styles.btnTextReject}>Reject</Typography>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btn, styles.btnApprove, isProcessing && styles.btnDisabled]} 
              onPress={() => handleAction(item.id, item.amount, 'approve')}
              disabled={isProcessing || processingId !== null}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <CheckCircle size={14} color="#fff" style={{ marginRight: 4 }} />
                  <Typography weight="600" style={styles.btnTextApprove}>Approve</Typography>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Typography weight="700" style={styles.title}>
        Pending Fund Requests ({requests.length})
      </Typography>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRequestCard}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CheckCircle color={theme.colors.successLight || '#d4edda'} size={64} />
              <Typography weight="600" style={styles.emptyText}>All Caught Up!</Typography>
              <Typography style={styles.emptySub}>There are no pending fund requests.</Typography>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  title: {
    fontSize: 20,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.l,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    paddingBottom: 8,
    marginBottom: 10,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    color: theme.colors.textDark,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountText: {
    fontSize: 20,
    color: theme.colors.success || '#28a745',
    marginTop: 2,
  },
  utrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    maxWidth: '55%',
  },
  utrTextWrapper: {
    flexShrink: 1,
  },
  utrLabel: {
    fontSize: 9,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  utrValue: {
    fontSize: 13,
    color: theme.colors.textDark,
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  phoneAction: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.45,
  },
  phoneText: {
    fontSize: 12,
    color: theme.colors.textDark,
  },
  waHint: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 0.55,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    minWidth: 75,
  },
  btnReject: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  btnApprove: {
    backgroundColor: theme.colors.success || '#28a745',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnTextReject: {
    fontSize: 12,
    color: '#EF4444', 
  },
  btnTextApprove: {
    fontSize: 12,
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 20,
    color: theme.colors.textDark,
    marginTop: theme.spacing.m,
  },
  emptySub: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 4,
  }
});