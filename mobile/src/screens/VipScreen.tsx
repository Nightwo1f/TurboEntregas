import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useAuthStore } from "../store/authStore";

export function VipScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Text variant="titleLarge">Plano atual</Text>
          <Text variant="displaySmall">{user?.plan ?? "FREE"}</Text>
          <Text>FREE permite 10 fotos por lote. VIP permite 50 fotos e histórico de rotas.</Text>
        </Card.Content>
      </Card>
      <Button mode="contained" icon="crown-outline">
        Ativar VIP
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20
  }
});
