// import React, { useState, useCallback } from 'react';
// import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { TrendingUp, Save } from 'lucide-react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import api from './api';
// import { theme } from './theme';
// import Typography from './components/Typography';
// import AdminHeader from './components/AdminHeader';

// // Configuration array mapping UI labels to your exact database columns
// const rateFields = [
//   { key: 'single_digit_rate', label: 'Single Digit' },
//   { key: 'jodi_digit_rate', label: 'Jodi Digit' },
//   { key: 'single_panna_rate', label: 'Single Panna' },
//   { key: 'double_panna_rate', label: 'Double Panna' },
//   { key: 'triple_panna_rate', label: 'Triple Panna' },
//   { key: 'half_sangam_rate', label: 'Half Sangam' },
//   { key: 'full_sangam_rate', label: 'Full Sangam' },
//   { key: 'family_jodi_rate', label: 'Family Jodi' },
//   { key: 'sp_motor_rate', label: 'SP Motor' },
//   { key: 'dp_motor_rate', label: 'DP Motor' },
// ];

// export default function AdminGameRatesScreen() {
//   const [rates, setRates] = useState({});
//   const [coreSettings, setCoreSettings] = useState({}); // To preserve UPI, QR, etc.
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const fetchSettings = async () => {
//     try {
//       const response = await api.get('/admin/settings');
//       const data = response.data;
      
//       // Save core settings so we don't overwrite them with nulls on save
//       setCoreSettings({
//         upi_id: data.upi_id,
//         whatsapp_number: data.whatsapp_number,
//         min_amount: data.min_amount,
//         existing_qr_url: data.qr_code_url
//       });

//       // Populate the local state with the fetched rates
//       const initialRates = {};
//       rateFields.forEach(field => {
//         initialRates[field.key] = data[field.key] ? data[field.key].toString() : '0';
//       });
//       setRates(initialRates);

//     } catch (error) {
//       Alert.alert("Error", "Failed to load game rates.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(useCallback(() => { fetchSettings(); }, []));

//   const handleRateChange = (key, value) => {
//     // Only allow numbers and decimals
//     const cleanValue = value.replace(/[^0-9.]/g, '');
//     setRates(prev => ({ ...prev, [key]: cleanValue }));
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       // We must send both the core settings and the updated rates
//       const payload = {
//         ...coreSettings,
//         ...rates
//       };

//       await api.put('/admin/settings', payload);
//       Alert.alert("Success", "Game payout rates updated successfully!");
//     } catch (error) {
//       Alert.alert("Error", "Failed to update rates.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <AdminHeader title="Game Payout Rates" />
      
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.scrollContent}>
          
//           <View style={styles.infoBox}>
//             <TrendingUp color={theme.colors.primary} size={24} style={{ marginRight: 12 }} />
//             <View style={{ flex: 1 }}>
//               <Typography weight="700" style={styles.infoTitle}>Winning Multipliers</Typography>
//               <Typography style={styles.infoText}>
//                 Set the return amount for a ₹1 bet. For example, setting Single Digit to 9.50 means a ₹10 bet wins ₹95.
//               </Typography>
//             </View>
//           </View>

//           {loading ? (
//             <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
//           ) : (
//             <View style={styles.card}>
//               {rateFields.map((field, index) => (
//                 <View key={field.key} style={[styles.inputRow, index === rateFields.length - 1 && { borderBottomWidth: 0 }]}>
//                   <Typography weight="600" style={styles.inputLabel}>{field.label}</Typography>
//                   <View style={styles.inputWrapper}>
//                     <Typography weight="700" style={styles.currencySymbol}>x</Typography>
//                     <TextInput
//                       style={styles.input}
//                       keyboardType="decimal-pad"
//                       value={rates[field.key]}
//                       onChangeText={(val) => handleRateChange(field.key, val)}
//                       placeholder="0.00"
//                       placeholderTextColor={theme.colors.textMuted}
//                     />
//                   </View>
//                 </View>
//               ))}
//             </View>
//           )}
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* FIXED BOTTOM SAVE BUTTON */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving || loading}>
//           {saving ? <ActivityIndicator color="#fff" /> : (
//             <>
//               <Save color="#fff" size={20} style={{ marginRight: 8 }} />
//               <Typography weight="700" style={styles.saveBtnText}>SAVE NEW RATES</Typography>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: theme.colors.background },
//   scrollContent: { padding: theme.spacing.m, paddingBottom: 100 },
  
//   infoBox: { flexDirection: 'row', backgroundColor: theme.colors.primaryLight, padding: 16, borderRadius: theme.radius.m, marginBottom: 20 },
//   infoTitle: { color: theme.colors.primary, fontSize: 16, marginBottom: 4 },
//   infoText: { color: theme.colors.primary, fontSize: 12, opacity: 0.8 },
  
//   card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.l, paddingHorizontal: 16, ...theme.shadows.card },
  
//   inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
//   inputLabel: { fontSize: 15, color: theme.colors.textDark, flex: 1 },
  
//   inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.s, paddingHorizontal: 12, height: 44, width: 120 },
//   currencySymbol: { color: theme.colors.textMuted, marginRight: 8, fontSize: 16 },
//   input: { flex: 1, fontSize: 16, fontFamily: 'Inter_700Bold', color: theme.colors.primary },

//   bottomBar: { padding: theme.spacing.m, backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.border },
//   saveBtn: { backgroundColor: theme.colors.primary, flexDirection: 'row', height: 56, borderRadius: theme.radius.l, justifyContent: 'center', alignItems: 'center' },
//   saveBtnText: { color: '#fff', fontSize: 16 }
// });



import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Save } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from './api';
import { theme } from './theme';
import Typography from './components/Typography';
import AdminHeader from './components/AdminHeader';

// Standard Market Rates
const standardRateFields = [
  { key: 'single_digit_rate', label: 'Single Digit' },
  { key: 'jodi_digit_rate', label: 'Jodi Digit' },
  { key: 'single_panna_rate', label: 'Single Panna' },
  { key: 'double_panna_rate', label: 'Double Panna' },
  { key: 'triple_panna_rate', label: 'Triple Panna' },
  { key: 'half_sangam_rate', label: 'Half Sangam' },
  { key: 'full_sangam_rate', label: 'Full Sangam' },
  { key: 'family_jodi_rate', label: 'Family Jodi' },
  { key: 'sp_motor_rate', label: 'SP Motor' },
  { key: 'dp_motor_rate', label: 'DP Motor' },
];

// Gali Desawar Rates
const galiDesawarRateFields = [
  { key: 'gd_jodi_rate', label: 'Jodi Digit' },
  { key: 'gd_haruf_andar_rate', label: 'Andar Haruf' },
  { key: 'gd_haruf_bahar_rate', label: 'Bahar Haruf' },
];

const allRateFields = [...standardRateFields, ...galiDesawarRateFields];

export default function AdminGameRatesScreen() {
  const [rates, setRates] = useState({});
  const [coreSettings, setCoreSettings] = useState({}); // To preserve UPI, QR, etc.
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings');
      const data = response.data;
      
      // Save core settings so we don't overwrite them with nulls on save
      setCoreSettings({
        upi_id: data.upi_id,
        whatsapp_number: data.whatsapp_number,
        min_amount: data.min_amount,
        existing_qr_url: data.qr_code_url
      });

      // Populate local state with fetched rates for both standard & Gali Desawar
      const initialRates = {};
      allRateFields.forEach(field => {
        initialRates[field.key] = data[field.key] !== undefined && data[field.key] !== null 
          ? data[field.key].toString() 
          : '0';
      });
      setRates(initialRates);

    } catch (error) {
      Alert.alert("Error", "Failed to load game rates.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchSettings(); }, []));

  const handleRateChange = (key, value) => {
    // Only allow numbers and decimals
    const cleanValue = value.replace(/[^0-9.]/g, '');
    setRates(prev => ({ ...prev, [key]: cleanValue }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Send core settings + all rates (standard + Gali Desawar)
      const payload = {
        ...coreSettings,
        ...rates
      };

      await api.put('/admin/settings', payload);
      Alert.alert("Success", "Game payout rates updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update rates.");
    } finally {
      setSaving(false);
    }
  };

  const renderRateRow = (field, index, listArray) => (
    <View key={field.key} style={[styles.inputRow, index === listArray.length - 1 && { borderBottomWidth: 0 }]}>
      <Typography weight="600" style={styles.inputLabel}>{field.label}</Typography>
      <View style={styles.inputWrapper}>
        <Typography weight="700" style={styles.currencySymbol}>x</Typography>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={rates[field.key]}
          onChangeText={(val) => handleRateChange(field.key, val)}
          placeholder="0.00"
          placeholderTextColor={theme.colors.textMuted}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AdminHeader title="Game Payout Rates" />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.infoBox}>
            <TrendingUp color={theme.colors.primary} size={24} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Typography weight="700" style={styles.infoTitle}>Winning Multipliers</Typography>
              <Typography style={styles.infoText}>
                Set return multipliers for ₹1 bets. For example, setting single digit to 9.50 gives ₹95 on a ₹10 bet.
              </Typography>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* STANDARD MARKETS */}
              <Typography weight="700" style={styles.sectionTitle}>Main Market Rates</Typography>
              <View style={styles.card}>
                {standardRateFields.map((field, index) => renderRateRow(field, index, standardRateFields))}
              </View>

              {/* GALI DESAWAR MARKETS */}
              <Typography weight="700" style={[styles.sectionTitle, { marginTop: 24 }]}>Gali Desawar Rates</Typography>
              <View style={styles.card}>
                {galiDesawarRateFields.map((field, index) => renderRateRow(field, index, galiDesawarRateFields))}
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* FIXED BOTTOM SAVE BUTTON */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving || loading}>
          {saving ? <ActivityIndicator color="#fff" /> : (
            <>
              <Save color="#fff" size={20} style={{ marginRight: 8 }} />
              <Typography weight="700" style={styles.saveBtnText}>SAVE NEW RATES</Typography>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: theme.spacing.m, paddingBottom: 100 },
  
  infoBox: { flexDirection: 'row', backgroundColor: theme.colors.primaryLight, padding: 16, borderRadius: theme.radius.m, marginBottom: 20 },
  infoTitle: { color: theme.colors.primary, fontSize: 16, marginBottom: 4 },
  infoText: { color: theme.colors.primary, fontSize: 12, opacity: 0.8 },
  
  sectionTitle: { fontSize: 16, color: theme.colors.primary, marginBottom: 10 },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.l, paddingHorizontal: 16, ...theme.shadows.card },
  
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  inputLabel: { fontSize: 15, color: theme.colors.textDark, flex: 1 },
  
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.s, paddingHorizontal: 12, height: 44, width: 120 },
  currencySymbol: { color: theme.colors.textMuted, marginRight: 8, fontSize: 16 },
  input: { flex: 1, fontSize: 16, fontFamily: 'Inter_700Bold', color: theme.colors.primary },

  bottomBar: { padding: theme.spacing.m, backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.border },
  saveBtn: { backgroundColor: theme.colors.primary, flexDirection: 'row', height: 56, borderRadius: theme.radius.l, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16 }
});