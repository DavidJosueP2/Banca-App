import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
  loading?: boolean;
  size?: "md" | "lg";
}

const variantStyles = {
  primary: {
    container: "bg-primary-600",
    text: "text-white",
    pressed: "bg-primary-700",
  },
  secondary: {
    container: "bg-surface-100",
    text: "text-surface-700",
    pressed: "bg-surface-200",
  },
  outline: {
    container: "bg-transparent border-2 border-primary-600",
    text: "text-primary-600",
    pressed: "bg-primary-50",
  },
  danger: {
    container: "bg-danger-500",
    text: "text-white",
    pressed: "bg-danger-600",
  },
};

export default function AppButton({
  title,
  variant = "primary",
  loading = false,
  size = "lg",
  disabled,
  ...props
}: AppButtonProps) {
  const styles = variantStyles[variant];
  const sizeClass = size === "lg" ? "py-4" : "py-3";
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`rounded-2xl items-center justify-center ${sizeClass} ${
        styles.container
      } ${isDisabled ? "opacity-50" : ""}`}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" || variant === "danger" ? "#fff" : "#475569"}
        />
      ) : (
        <Text
          className={`text-base font-onest-bold ${styles.text}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
