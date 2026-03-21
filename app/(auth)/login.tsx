import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import AppInput from "@/components/ui/AppInput";
import AppButton from "@/components/ui/AppButton";
import Logo from "@/components/ui/Logo";
import { loginUser, getUserForBiometricLogin } from "@/services/auth";
import {
  isBiometricAvailable,
  authenticateWithBiometrics,
} from "@/services/biometrics";
import { getDatabase } from "@/services/database";

const LAST_CEDULA_KEY = "bancaapp_last_cedula";

export default function LoginScreen() {
  const [cedula, setCedula] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [lastCedula, setLastCedula] = useState<string | null>(null);

  useEffect(() => {
    initializeScreen();
  }, []);

  async function initializeScreen() {
    // Inicializar la base de datos al cargar la pantalla
    await getDatabase();

    // Verificar si hay biometría disponible
    const available = await isBiometricAvailable();
    setBiometricAvailable(available);

    // Cargar la última cédula usada (para biometría)
    const saved = await AsyncStorage.getItem(LAST_CEDULA_KEY);
    if (saved) {
      setLastCedula(saved);
    }
  }

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const result = await loginUser(cedula, pin);

      if (result.success && result.user) {
        // Guardar la cédula para futuros logins biométricos
        await AsyncStorage.setItem(LAST_CEDULA_KEY, cedula);
        router.replace("/(app)/home" as any);
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function handleBiometricLogin() {
    if (!lastCedula) {
      Alert.alert(
        "Sin datos previos",
        "Primero debes iniciar sesión con tu cédula y PIN para habilitar el acceso biométrico."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Primero autenticar con biometría
      const bioResult = await authenticateWithBiometrics();
      if (!bioResult.success) {
        setError(bioResult.error || "Autenticación fallida");
        setLoading(false);
        return;
      }

      // Luego verificar que el usuario existe
      const userResult = await getUserForBiometricLogin(lastCedula);
      if (userResult.success && userResult.user) {
        router.replace("/(app)/home" as any);
      } else {
        setError("No se encontró el usuario asociado");
      }
    } catch (err) {
      setError("Error en la autenticación biométrica");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-16 pb-8 justify-between">
          {/* Header */}
          <View className="items-center mt-8 mb-10">
            <Logo size="lg" />
          </View>

          {/* Form */}
          <View className="flex-1">
            <Text className="text-2xl font-onest-bold text-surface-900 mb-1">
              Iniciar sesión
            </Text>
            <Text className="text-sm font-onest text-surface-400 mb-8">
              Ingresa tus credenciales para acceder
            </Text>

            {error ? (
              <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl px-4 py-3 mb-4 flex-row items-center">
                <Ionicons name="alert-circle" size={18} color="#EF4444" />
                <Text className="text-danger-500 text-sm font-onest ml-2 flex-1">
                  {error}
                </Text>
              </View>
            ) : null}

            <AppInput
              label="Cédula"
              placeholder="Ingresa tu número de cédula"
              icon="card-outline"
              value={cedula}
              onChangeText={(text) => {
                setCedula(text.replace(/[^0-9]/g, ""));
                setError("");
              }}
              keyboardType="numeric"
              maxLength={15}
            />

            <AppInput
              label="PIN"
              placeholder="Ingresa tu PIN de 4 dígitos"
              icon="lock-closed-outline"
              value={pin}
              onChangeText={(text) => {
                setPin(text.replace(/[^0-9]/g, ""));
                setError("");
              }}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />

            <View className="mt-2">
              <AppButton
                title="Iniciar sesión"
                onPress={handleLogin}
                loading={loading}
                disabled={!cedula || pin.length !== 4}
              />
            </View>

            {/* Biometric Login */}
            {biometricAvailable && lastCedula ? (
              <View className="items-center mt-6">
                <Text className="text-xs font-onest text-surface-400 mb-3">
                  O accede rápidamente con
                </Text>
                <TouchableOpacity
                  onPress={handleBiometricLogin}
                  disabled={loading}
                  className="bg-primary-50 rounded-full p-4 active:bg-primary-100"
                >
                  <Ionicons name="finger-print" size={36} color="#1A56F5" />
                </TouchableOpacity>
                <Text className="text-xs font-onest text-surface-400 mt-2">
                  Huella digital
                </Text>
              </View>
            ) : null}
          </View>

          {/* Footer */}
          <View className="items-center mt-8 pt-6 border-t border-surface-100">
            <Text className="text-sm font-onest text-surface-400">
              ¿No tienes cuenta?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register" as any)}
              className="mt-1"
            >
              <Text className="text-base font-onest-bold text-primary-600">
                Crear cuenta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
