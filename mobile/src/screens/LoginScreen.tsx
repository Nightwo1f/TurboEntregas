import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import type { RootStackParamList } from "../../App";
import { login } from "../services/authService";
import { useAuthStore } from "../store/authStore";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();

  async function handleLogin() {
    try {
      const session = await login(email, password);
      setSession(session.token, session.user);
      navigation.replace("Home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">RouteSnap</Text>
      <TextInput label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button mode="contained" icon="login" onPress={handleLogin}>
        Entrar
      </Button>
      <Button onPress={() => navigation.navigate("Register")}>Criar conta</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
    padding: 24
  },
  error: {
    color: "#b3261e"
  }
});
