import * as LocalAuthentication from "expo-local-authentication";

export interface BiometricResult {
  success: boolean;
  error?: string;
}

/**
 * Verifica si el dispositivo soporta autenticación biométrica
 * y si el usuario tiene biometría configurada.
 */
export async function isBiometricAvailable(): Promise<boolean> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return isEnrolled;
  } catch {
    return false;
  }
}

/**
 * Solicita autenticación biométrica al usuario (huella digital / Face ID).
 */
export async function authenticateWithBiometrics(): Promise<BiometricResult> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autentícate para acceder",
      cancelLabel: "Cancelar",
      fallbackLabel: "Usar PIN",
      disableDeviceFallback: true,
    });

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      error: "Autenticación biométrica cancelada",
    };
  } catch {
    return {
      success: false,
      error: "Error al autenticar con biometría",
    };
  }
}
