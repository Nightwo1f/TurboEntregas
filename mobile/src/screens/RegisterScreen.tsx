import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import type { RootStackParamList } from "../../App";
import { register } from "../services/authService";
import { useAuthStore } from "../store/authStore";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const setSession = useAuthStore((state) => state.setSession);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    const session = await register(name, email, password);
    setSession(session.token, session.user);
    navigation.replace("Home");
  }

  return (
    <View style={styles.container}>
      <TextInput label="Nome" value={name} onChangeText={setName} />
      <TextInput label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <Button mode="contained" icon="account-plus-outline" onPress={handleRegister}>
        Cadastrar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
    padding: 24
  }
});
