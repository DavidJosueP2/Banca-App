import { createUser, getUserByCedula, type NewUser, type User } from "./database";

/**
 * Hashea el PIN usando un enfoque simple de btoa (base64).
 * Suficiente para una app local sin backend — no hay superficie de ataque de red.
 * Para producción se usaría bcrypt o PBKDF2.
 */
function hashPin(pin: string): string {
  // Simple hash: reverse + base64-like encoding for local security
  const salted = `bancaapp_${pin}_secure`;
  let hash = 0;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export interface RegisterData {
  cedula: string;
  pin: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  direccion: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: Omit<User, "pin_hash">;
}

export async function registerUser(data: RegisterData): Promise<AuthResult> {
  // Validaciones básicas
  if (!data.cedula || data.cedula.length < 6) {
    return { success: false, error: "La cédula debe tener al menos 6 dígitos" };
  }

  if (!data.pin || data.pin.length !== 4) {
    return { success: false, error: "El PIN debe ser de 4 dígitos" };
  }

  if (!data.nombre.trim()) {
    return { success: false, error: "El nombre es obligatorio" };
  }

  if (!data.apellido.trim()) {
    return { success: false, error: "El apellido es obligatorio" };
  }

  if (!data.telefono.trim()) {
    return { success: false, error: "El teléfono es obligatorio" };
  }

  if (!data.email.trim() || !data.email.includes("@")) {
    return { success: false, error: "Ingrese un email válido" };
  }

  if (!data.fechaNacimiento.trim()) {
    return { success: false, error: "La fecha de nacimiento es obligatoria" };
  }

  if (!data.direccion.trim()) {
    return { success: false, error: "La dirección es obligatoria" };
  }

  // Verificar si la cédula ya está registrada
  const existingUser = await getUserByCedula(data.cedula);
  if (existingUser) {
    return { success: false, error: "Esta cédula ya está registrada" };
  }

  const newUser: NewUser = {
    cedula: data.cedula,
    pin_hash: hashPin(data.pin),
    nombre: data.nombre.trim(),
    apellido: data.apellido.trim(),
    telefono: data.telefono.trim(),
    email: data.email.trim().toLowerCase(),
    fecha_nacimiento: data.fechaNacimiento.trim(),
    direccion: data.direccion.trim(),
  };

  try {
    await createUser(newUser);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al registrar el usuario",
    };
  }
}

export async function loginUser(
  cedula: string,
  pin: string
): Promise<AuthResult> {
  if (!cedula || !pin) {
    return { success: false, error: "Ingrese su cédula y PIN" };
  }

  const user = await getUserByCedula(cedula);

  if (!user) {
    return { success: false, error: "Cédula o PIN incorrectos" };
  }

  const pinHash = hashPin(pin);

  if (user.pin_hash !== pinHash) {
    return { success: false, error: "Cédula o PIN incorrectos" };
  }

  // Retornar usuario sin el hash del PIN
  const { pin_hash, ...safeUser } = user;
  return { success: true, user: safeUser };
}

/**
 * Buscar usuario por cédula para login biométrico
 */
export async function getUserForBiometricLogin(
  cedula: string
): Promise<AuthResult> {
  const user = await getUserByCedula(cedula);

  if (!user) {
    return { success: false, error: "Usuario no encontrado" };
  }

  const { pin_hash, ...safeUser } = user;
  return { success: true, user: safeUser };
}
