import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "@/components/ui/AppButton";
import { getUserByCedula, type User } from "@/services/database";

const LAST_CEDULA_KEY = "bancaapp_last_cedula";

export default function HomeScreen() {
  const [user, setUser] = useState<Omit<User, "pin_hash"> | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const cedula = await AsyncStorage.getItem(LAST_CEDULA_KEY);
      if (cedula) {
        const userData = await getUserByCedula(cedula);
        if (userData) {
          const { pin_hash, ...safeUser } = userData;
          setUser(safeUser);
        }
      }
    } catch (err) {
      console.error("Error loading user:", err);
    }
  }

  function handleLogout() {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => {
          router.replace("/(auth)/login" as any);
        },
      },
    ]);
  }

  return (
    <View className="flex-1 bg-surface-50 pt-14 px-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-8">
        <View className="flex-1">
          <Text className="text-sm font-onest text-surface-400">
            ¡Bienvenido!
          </Text>
          <Text className="text-2xl font-onest-bold text-surface-900">
            {user ? `${user.nombre} ${user.apellido}` : "Cargando..."}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-surface-100 rounded-full p-3"
        >
          <Ionicons name="log-out-outline" size={22} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View className="bg-primary-600 rounded-3xl p-6 mb-6 shadow-lg">
        <Text className="text-sm font-onest text-primary-200 mb-1">
          Saldo disponible
        </Text>
        <Text className="text-4xl font-onest-bold text-white mb-4">
          $0.00
        </Text>
        <View className="flex-row items-center">
          <View className="bg-white/20 rounded-full px-3 py-1">
            <Text className="text-xs font-onest text-white">
              Cuenta •••• {user?.cedula?.slice(-4) || "----"}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <Text className="text-sm font-onest-bold text-surface-600 uppercase tracking-wider mb-3">
        Acciones rápidas
      </Text>
      <View className="flex-row gap-3 mb-6">
        <QuickAction
          icon="arrow-up-circle-outline"
          label="Enviar"
          color="#1A56F5"
        />
        <QuickAction
          icon="arrow-down-circle-outline"
          label="Recibir"
          color="#22C55E"
        />
        <QuickAction
          icon="swap-horizontal-outline"
          label="Transferir"
          color="#8B5CF6"
        />
        <QuickAction
          icon="receipt-outline"
          label="Historial"
          color="#F59E0B"
        />
      </View>

      {/* User Info */}
      {user && (
        <View className="bg-white rounded-2xl p-5 border border-surface-100">
          <Text className="text-sm font-onest-bold text-surface-600 uppercase tracking-wider mb-4">
            Mi perfil
          </Text>
          <InfoRow icon="card-outline" label="Cédula" value={user.cedula} />
          <InfoRow icon="mail-outline" label="Email" value={user.email} />
          <InfoRow
            icon="call-outline"
            label="Teléfono"
            value={user.telefono}
          />
          <InfoRow
            icon="location-outline"
            label="Dirección"
            value={user.direccion}
          />
        </View>
      )}

      {/* Logout button at bottom */}
      <View className="mt-auto pb-8 pt-4">
        <AppButton
          title="Cerrar sesión"
          variant="outline"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
}) {
  return (
    <TouchableOpacity className="flex-1 items-center bg-white rounded-2xl p-4 border border-surface-100">
      <View
        className="rounded-full p-2 mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text className="text-xs font-onest text-surface-600">{label}</Text>
    </TouchableOpacity>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center py-2.5 border-b border-surface-50">
      <Ionicons name={icon} size={18} color="#94A3B8" />
      <Text className="text-xs font-onest text-surface-400 ml-2.5 w-20">
        {label}
      </Text>
      <Text className="text-sm font-onest text-surface-800 flex-1">
        {value}
      </Text>
    </View>
  );
}
