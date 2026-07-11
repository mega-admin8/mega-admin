// src/AdminLoginScreen.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Phone, Lock, ShieldCheck } from "lucide-react-native";
import api from "./api"; // Ensure your api.js is copied over and pointing to the backend
import { theme } from "./theme";
import Typography from "./components/Typography"; // Ensure this is copied over too

export default function AdminLoginScreen({ onLoginSuccess }) {
  const [phone, setPhone] = useState("");
  const [mpin, setMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async () => {
    if (!phone || !mpin) {
      Alert.alert("Error", "Please enter your Admin Phone and M-PIN");
      return;
    }

    setIsLoading(true);

    try {
      // Hit the new dedicated admin route
      const response = await api.post("/admin/login", {
        phone_number: phone,
        mpin: mpin,
      });

      await AsyncStorage.setItem("adminToken", response.data.token);
      await AsyncStorage.setItem(
        "adminData",
        JSON.stringify(response.data.user),
      );

      setIsLoading(false);
      onLoginSuccess(response.data.user);
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error.response?.data?.error || "Network Error";
      Alert.alert("Access Denied", errorMsg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <View style={styles.logoPlaceholder}>
          <ShieldCheck color={theme.colors.surface} size={36} />
        </View>
        <Typography weight="700" style={styles.title}>
          Admin Portal
        </Typography>
        <Typography style={styles.subtitle}>
          Authorized personnel only.
        </Typography>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Typography weight="600" style={styles.label}>
            Admin Phone Number
          </Typography>
          <View style={styles.inputWrapper}>
            <Phone
              color={theme.colors.textMuted}
              size={20}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter 10-digit number"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Typography weight="600" style={styles.label}>
            Admin M-PIN
          </Typography>
          <View style={styles.inputWrapper}>
            <Lock
              color={theme.colors.textMuted}
              size={20}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={mpin}
              onChangeText={setMpin}
              placeholder="Enter 4-digit PIN"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!phone || !mpin) && styles.buttonDisabled,
          ]}
          onPress={handleAdminLogin}
          disabled={!phone || !mpin || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.surface} />
          ) : (
            <Typography weight="600" style={styles.buttonText}>
              Authenticate Securely
            </Typography>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  headerContainer: { marginBottom: theme.spacing.xxl, alignItems: "center" },
  logoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.m,
    ...theme.shadows.card,
  },
  title: {
    fontSize: 28,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    color: theme.colors.textDark,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.danger,
    textAlign: "center",
    paddingHorizontal: theme.spacing.l,
    fontWeight: "600",
  }, // Red subtitle for emphasis
  formContainer: { width: "100%" },
  inputGroup: { marginBottom: theme.spacing.m },
  label: {
    fontSize: 12,
    marginBottom: theme.spacing.s,
    color: theme.colors.textDark,
    marginLeft: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: theme.spacing.m,
    height: 52,
  },
  icon: { marginRight: theme.spacing.s },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textDark,
    fontFamily: "Inter_500Medium",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: theme.radius.m,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.l,
    ...theme.shadows.card,
  },
  buttonDisabled: { backgroundColor: theme.colors.border, shadowOpacity: 0 },
  buttonText: { color: theme.colors.surface, fontSize: 16 },
});
