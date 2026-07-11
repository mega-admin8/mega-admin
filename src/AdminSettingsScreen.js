import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  Save,
  Smartphone,
  QrCode,
  IndianRupee,
  Link,
} from "lucide-react-native";
import api from "./api";
import { theme } from "./theme";
import Typography from "./components/Typography";

export default function AdminSettingsScreen() {
  const [settings, setSettings] = useState({
    upi_id: "",
    whatsapp_number: "",
    qr_code_url: "",
    min_amount: "200",
  });

  const [newImageUri, setNewImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/admin/settings");
      setSettings({
        upi_id: response.data.upi_id,
        whatsapp_number: response.data.whatsapp_number,
        qr_code_url: response.data.qr_code_url || "",
        min_amount: response.data.min_amount.toString(),
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  // Function to open the phone gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for QR codes
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    // Because we are sending a FILE, we must use FormData, not JSON
    const formData = new FormData();
    formData.append("upi_id", settings.upi_id);
    formData.append("whatsapp_number", settings.whatsapp_number);
    formData.append("min_amount", settings.min_amount);
    formData.append("existing_qr_url", settings.qr_code_url); // Pass the old URL just in case

    // If a new image was picked, append it as a file
    if (newImageUri) {
      const filename = newImageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("qr_image", {
        uri: newImageUri,
        name: filename,
        type: type,
      });
    }

    try {
      // await api.put('/admin/settings', {
      //   ...settings,
      //   min_amount: parseInt(settings.min_amount)
      // });

      // Note: We use 'Content-Type': 'multipart/form-data' for files
      const response = await api.put("/admin/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update local state with the new live URL returned from the backend
      setSettings({ ...settings, qr_code_url: response.data.new_qr_url });
      setNewImageUri(null); // Clear the temp upload state

      Alert.alert("Success", "App settings updated globally!");
    } catch (error) {
      Alert.alert("Error", "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={{ marginTop: 50 }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Typography weight="700" style={styles.headerTitle}>
          Global Settings
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputGroup}>
          <Typography weight="600" style={styles.label}>
            Support WhatsApp Number
          </Typography>
          <View style={styles.inputWrapper}>
            <Smartphone color={theme.colors.textMuted} size={20} />
            <TextInput
              style={styles.input}
              value={settings.whatsapp_number}
              onChangeText={(txt) =>
                setSettings({ ...settings, whatsapp_number: txt })
              }
              placeholder="+919876543210"
              placeholderTextColor={theme.colors.border}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Typography weight="600" style={styles.label}>
            Deposit UPI ID
          </Typography>
          <View style={styles.inputWrapper}>
            <Link color={theme.colors.textMuted} size={20} />
            <TextInput
              style={styles.input}
              value={settings.upi_id}
              onChangeText={(txt) => setSettings({ ...settings, upi_id: txt })}
              placeholder="admin@okicici"
              placeholderTextColor={theme.colors.border}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Typography weight="600" style={styles.label}>
            Minimum Deposit Amount
          </Typography>
          <View style={styles.inputWrapper}>
            <IndianRupee color={theme.colors.textMuted} size={20} />
            <TextInput
              style={styles.input}
              value={settings.min_amount}
              onChangeText={(txt) =>
                setSettings({ ...settings, min_amount: txt })
              }
              keyboardType="number-pad"
              placeholder="200"
              placeholderTextColor={theme.colors.border}
            />
          </View>
        </View>

        {/* <View style={styles.inputGroup}>
          <Typography weight="600" style={styles.label}>QR Code Image URL</Typography>
          <Typography style={styles.helperText}>Provide a direct link to your QR code image</Typography>
          <View style={styles.inputWrapper}>
            <QrCode color={theme.colors.textMuted} size={20} />
            <TextInput 
              style={styles.input} 
              value={settings.qr_code_url}
              onChangeText={(txt) => setSettings({...settings, qr_code_url: txt})}
              placeholder="https://imgur.com/your-qr.png"
              placeholderTextColor={theme.colors.border}
            />
          </View>
        </View> */}

        <View style={styles.inputGroup}>
          <Typography weight="600" style={styles.label}>
            QR Code Upload
          </Typography>

          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {newImageUri || settings.qr_code_url ? (
              <Image
                source={{ uri: newImageUri || settings.qr_code_url }}
                style={styles.qrPreview}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <UploadCloud color={theme.colors.primary} size={32} />
                <Typography
                  style={{ marginTop: 8, color: theme.colors.textMuted }}
                >
                  Tap to upload QR Code
                </Typography>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Save color="#fff" size={20} style={{ marginRight: 8 }} />
              <Typography weight="700" style={styles.saveBtnText}>
                SAVE SETTINGS
              </Typography>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  content: { padding: theme.spacing.m, paddingBottom: 40 },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: theme.colors.textDark, marginBottom: 8 },
  helperText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 8,
    marginTop: -4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: theme.colors.textDark,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },

  saveBtn: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    height: 50,
    borderRadius: theme.radius.m,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnText: { color: "#fff", fontSize: 16, letterSpacing: 1 },

  // New Styles for Upload Box
  uploadBox: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    borderStyle: "dashed",
    borderRadius: theme.radius.l,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadPlaceholder: { alignItems: "center" },
  qrPreview: { width: "100%", height: "100%" },
});
