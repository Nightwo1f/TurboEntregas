import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import type { RootStackParamList } from "../../App";
import { getPhotoLimit } from "../services/photoService";
import { useAuthStore } from "../store/authStore";
import { useBatchStore } from "../store/batchStore";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const photos = useBatchStore((state) => state.photos);
  const limit = getPhotoLimit(user?.plan ?? "FREE");

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Text variant="titleLarge">Lote atual</Text>
          <Text variant="displaySmall">
            {photos.length}/{limit}
          </Text>
          <Text>{user?.plan === "VIP" ? "Plano VIP ativo" : "Plano FREE"}</Text>
        </Card.Content>
      </Card>
      <Button mode="contained" icon="camera-outline" onPress={() => navigation.navigate("Camera")}>
        Adicionar fotos
      </Button>
      <Button icon="image-multiple-outline" onPress={() => navigation.navigate("Batch")}>
        Revisar lote
      </Button>
      <Button icon="crown-outline" onPress={() => navigation.navigate("Vip")}>
        Planos
      </Button>
      <Button icon="cog-outline" onPress={() => navigation.navigate("Settings")}>
        Ajustes
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
