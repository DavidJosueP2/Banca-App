import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LogoProps {
  size?: "sm" | "lg";
}

export default function Logo({ size = "lg" }: LogoProps) {
  const iconSize = size === "lg" ? 48 : 32;
  const titleClass =
    size === "lg" ? "text-3xl" : "text-xl";
  const subtitleClass =
    size === "lg" ? "text-sm" : "text-xs";

  return (
    <View className="items-center">
      <View className="bg-primary-600 rounded-2xl p-3 mb-3 shadow-lg">
        <Ionicons name="wallet-outline" size={iconSize} color="#fff" />
      </View>
      <Text
        className={`font-onest-bold text-surface-900 ${titleClass}`}
      >
        BancaApp
      </Text>
      <Text
        className={`font-onest text-surface-400 ${subtitleClass} mt-0.5`}
      >
        Tu banco digital
      </Text>
    </View>
  );
}
