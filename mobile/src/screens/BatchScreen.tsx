import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import type { RootStackParamList } from "../../App";
import { PhotoCard } from "../components/PhotoCard";
import { getPhotoLimit } from "../services/photoService";
import { useAuthStore } from "../store/authStore";
import { useBatchStore } from "../store/batchStore";

type Props = NativeStackScreenProps<RootStackParamList, "Batch">;

export function BatchScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const photos = useBatchStore((state) => state.photos);
  const removePhoto = useBatchStore((state) => state.removePhoto);
  const limit = getPhotoLimit(user?.plan ?? "FREE");

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">
        Fotos do lote: {photos.length}/{limit}
      </Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PhotoCard uri={item.uri} index={index} onRemove={() => removePhoto(item.id)} />
        )}
      />
      <Button
        mode="contained"
        icon="check-circle-outline"
        disabled={photos.length === 0}
        onPress={() => navigation.navigate("ReviewAddresses")}
      >
        Finalizar
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
