import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";

import AppInput from "@/components/ui/AppInput";
import AppButton from "@/components/ui/AppButton";
import { registerUser } from "@/services/auth";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    fechaNacimiento: "",
    direccion: "",
    pin: "",
    confirmPin: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleRegister() {
    setError("");

    // Validar que los PINs coincidan
    if (form.pin !== form.confirmPin) {
      setError("Los PINs no coinciden");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        cedula: form.cedula,
        pin: form.pin,
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        email: form.email,
        fechaNacimiento: form.fechaNacimiento,
        direccion: form.direccion,
      });

      if (result.success) {
        Alert.alert(
          "¡Cuenta creada!",
          "Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.",
          [
            {
              text: "Iniciar sesión",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        setError(result.error || "Error al crear la cuenta");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  const isFormValid =
    form.cedula.length >= 6 &&
    form.nombre.trim() &&
    form.apellido.trim() &&
    form.telefono.trim() &&
    form.email.includes("@") &&
    form.fechaNacimiento.trim() &&
    form.direccion.trim() &&
    form.pin.length === 4 &&
    form.confirmPin.length === 4;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 pt-14 pb-4">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-surface-100 rounded-xl p-2 mr-3"
            >
              <Ionicons name="arrow-back" size={22} color="#334155" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-onest-bold text-surface-900">
                Crear cuenta
              </Text>
              <Text className="text-sm font-onest text-surface-400">
                Completa tus datos personales
              </Text>
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl px-4 py-3 mb-4 flex-row items-center">
              <Ionicons name="alert-circle" size={18} color="#EF4444" />
              <Text className="text-danger-500 text-sm font-onest ml-2 flex-1">
                {error}
              </Text>
            </View>
          ) : null}

          {/* Sección: Identificación */}
          <View className="mb-2">
            <Text className="text-xs font-onest-bold text-primary-600 uppercase tracking-wider mb-3">
              Identificación
            </Text>
            <AppInput
              label="Cédula de identidad"
              placeholder="Ej: 1234567890"
              icon="card-outline"
              value={form.cedula}
              onChangeText={(text) =>
                updateField("cedula", text.replace(/[^0-9]/g, ""))
              }
              keyboardType="numeric"
              maxLength={15}
            />
          </View>

          {/* Sección: Datos Personales */}
          <View className="mb-2">
            <Text className="text-xs font-onest-bold text-primary-600 uppercase tracking-wider mb-3">
              Datos personales
            </Text>
            <AppInput
              label="Nombre"
              placeholder="Tu nombre"
              icon="person-outline"
              value={form.nombre}
              onChangeText={(text) => updateField("nombre", text)}
              autoCapitalize="words"
            />
            <AppInput
              label="Apellido"
              placeholder="Tu apellido"
              icon="person-outline"
              value={form.apellido}
              onChangeText={(text) => updateField("apellido", text)}
              autoCapitalize="words"
            />
            <AppInput
              label="Fecha de nacimiento"
              placeholder="DD/MM/AAAA"
              icon="calendar-outline"
              value={form.fechaNacimiento}
              onChangeText={(text) => {
                // Auto-formato de fecha
                const clean = text.replace(/[^0-9]/g, "");
                let formatted = clean;
                if (clean.length > 2) formatted = clean.slice(0, 2) + "/" + clean.slice(2);
                if (clean.length > 4)
                  formatted =
                    clean.slice(0, 2) + "/" + clean.slice(2, 4) + "/" + clean.slice(4);
                updateField("fechaNacimiento", formatted.slice(0, 10));
              }}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Sección: Contacto */}
          <View className="mb-2">
            <Text className="text-xs font-onest-bold text-primary-600 uppercase tracking-wider mb-3">
              Contacto
            </Text>
            <AppInput
              label="Teléfono"
              placeholder="Ej: 0991234567"
              icon="call-outline"
              value={form.telefono}
              onChangeText={(text) =>
                updateField("telefono", text.replace(/[^0-9+]/g, ""))
              }
              keyboardType="phone-pad"
              maxLength={15}
            />
            <AppInput
              label="Email"
              placeholder="tu@email.com"
              icon="mail-outline"
              value={form.email}
              onChangeText={(text) => updateField("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AppInput
              label="Dirección"
              placeholder="Tu dirección de residencia"
              icon="location-outline"
              value={form.direccion}
              onChangeText={(text) => updateField("direccion", text)}
              autoCapitalize="sentences"
            />
          </View>

          {/* Sección: Seguridad */}
          <View className="mb-6">
            <Text className="text-xs font-onest-bold text-primary-600 uppercase tracking-wider mb-3">
              Seguridad
            </Text>
            <AppInput
              label="PIN (4 dígitos)"
              placeholder="Crea tu PIN de acceso"
              icon="lock-closed-outline"
              value={form.pin}
              onChangeText={(text) =>
                updateField("pin", text.replace(/[^0-9]/g, ""))
              }
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
            <AppInput
              label="Confirmar PIN"
              placeholder="Repite tu PIN"
              icon="lock-closed-outline"
              value={form.confirmPin}
              onChangeText={(text) =>
                updateField("confirmPin", text.replace(/[^0-9]/g, ""))
              }
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>

          <AppButton
            title="Crear cuenta"
            onPress={handleRegister}
            loading={loading}
            disabled={!isFormValid}
          />

          {/* Footer */}
          <View className="items-center mt-6">
            <Text className="text-sm font-onest text-surface-400">
              ¿Ya tienes cuenta?
            </Text>
            <TouchableOpacity onPress={() => router.back()} className="mt-1">
              <Text className="text-base font-onest-bold text-primary-600">
                Iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
