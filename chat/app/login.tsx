import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/auth/AuthContext";
import type { OAuthProvider } from "../src/auth/AuthContext";

export default function LoginScreen() {
  const isDark = useColorScheme() === "dark";
  const { signInWithEmail, signUpWithEmail, signInWithProvider } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<null | "email" | OAuthProvider>(null);
  const [error, setError] = useState<string | null>(null);

  const colors = {
    bg: isDark ? "#111827" : "#FFFFFF",
    text: isDark ? "#F9FAFB" : "#111827",
    subtle: isDark ? "#9CA3AF" : "#6B7280",
    border: isDark ? "#374151" : "#E5E7EB",
    inputBg: isDark ? "#1F2937" : "#F9FAFB",
    primary: "#2563EB",
  };

  const submitEmail = async () => {
    if (!email.trim() || !password) {
      setError("Введите email и пароль");
      return;
    }
    setError(null);
    setBusy("email");
    try {
      if (mode === "signin") {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось войти");
    } finally {
      setBusy(null);
    }
  };

  const submitProvider = async (provider: OAuthProvider) => {
    setError(null);
    setBusy(provider);
    try {
      await signInWithProvider(provider);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось войти");
    } finally {
      setBusy(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", padding: 24 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 8,
          }}
        >
          {mode === "signin" ? "С возвращением" : "Создать аккаунт"}
        </Text>
        <Text style={{ fontSize: 15, color: colors.subtle, marginBottom: 24 }}>
          Войдите, чтобы продолжить в чат
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.subtle}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          style={{
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color: colors.text,
            fontSize: 16,
            marginBottom: 12,
          }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Пароль"
          placeholderTextColor={colors.subtle}
          secureTextEntry
          autoCapitalize="none"
          style={{
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color: colors.text,
            fontSize: 16,
            marginBottom: 16,
          }}
        />

        {error && (
          <Text style={{ color: "#EF4444", fontSize: 13, marginBottom: 12 }}>
            {error}
          </Text>
        )}

        <Pressable
          onPress={submitEmail}
          disabled={busy !== null}
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: "center",
            opacity: pressed || busy ? 0.7 : 1,
          })}
        >
          {busy === "email" ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>
              {mode === "signin" ? "Войти" : "Зарегистрироваться"}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => {
            setError(null);
            setMode((m) => (m === "signin" ? "signup" : "signin"));
          }}
          style={{ paddingVertical: 12, alignItems: "center" }}
        >
          <Text style={{ color: colors.primary, fontSize: 14 }}>
            {mode === "signin"
              ? "Нет аккаунта? Зарегистрируйтесь"
              : "Уже есть аккаунт? Войдите"}
          </Text>
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 12,
          }}
        >
          <View
            style={{ flex: 1, height: 1, backgroundColor: colors.border }}
          />
          <Text
            style={{ color: colors.subtle, marginHorizontal: 12, fontSize: 13 }}
          >
            или
          </Text>
          <View
            style={{ flex: 1, height: 1, backgroundColor: colors.border }}
          />
        </View>

        <ProviderButton
          label="Продолжить с Google"
          loading={busy === "google"}
          disabled={busy !== null}
          colors={colors}
          onPress={() => submitProvider("google")}
        />
        <ProviderButton
          label="Продолжить с LinkedIn"
          loading={busy === "linkedin_oidc"}
          disabled={busy !== null}
          colors={colors}
          onPress={() => submitProvider("linkedin_oidc")}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ProviderButton({
  label,
  loading,
  disabled,
  colors,
  onPress,
}: {
  label: string;
  loading: boolean;
  disabled: boolean;
  colors: { text: string; border: string; inputBg: string };
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        backgroundColor: colors.inputBg,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
        opacity: pressed || disabled ? 0.7 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "500" }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
