import { Image, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

type PhotoCardProps = {
  uri: string;
  index: number;
  onRemove: () => void;
};

export function PhotoCard({ uri, index, onRemove }: PhotoCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri }} style={styles.image} />
      <Text variant="labelLarge">Foto {index + 1}</Text>
      <IconButton icon="delete-outline" accessibilityLabel="Remover foto" onPress={onRemove} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 8
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 6
  }
});
