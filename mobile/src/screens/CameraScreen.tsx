import * as ImagePicker from "expo-image-picker";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { getPhotoLimit } from "../services/photoService";
import { useAuthStore } from "../store/authStore";
import { useBatchStore } from "../store/batchStore";

export function CameraScreen() {
  const user = useAuthStore((state) => state.user);
  const addPhoto = useBatchStore((state) => state.addPhoto);
  const photos = useBatchStore((state) => state.photos);
  const limit = getPhotoLimit(user?.plan ?? "FREE");

  async function pickImage(source: "camera" | "library") {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });

    if (!result.canceled) {
      addPhoto({ id: `${Date.now()}-${result.assets[0].uri}`, uri: result.assets[0].uri }, limit);
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">
        {photos.length}/{limit} fotos
      </Text>
      <Button mode="contained" icon="camera-outline" onPress={() => pickImage("camera")}>
        Tirar foto
      </Button>
      <Button icon="image-outline" onPress={() => pickImage("library")}>
        Escolher da galeria
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
