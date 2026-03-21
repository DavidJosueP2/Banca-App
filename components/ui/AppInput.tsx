import React from "react";
import {
  TextInput,
  View,
  Text,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function AppInput({
  label,
  error,
  icon,
  ...props
}: AppInputProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-onest-bold text-surface-600 mb-1.5 ml-1">
        {label}
      </Text>
      <View
        className={`flex-row items-center bg-surface-50 border rounded-2xl px-4 py-0 ${
          error ? "border-danger-500" : "border-surface-200"
        }`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color="#94A3B8"
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          className="flex-1 text-base text-surface-900 font-onest py-4"
          placeholderTextColor="#94A3B8"
          {...props}
        />
      </View>
      {error ? (
        <Text className="text-xs text-danger-500 mt-1 ml-1">{error}</Text>
      ) : null}
    </View>
  );
}
