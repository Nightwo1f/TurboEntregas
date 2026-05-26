import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

type AddressCardProps = {
  address: string;
  onChangeAddress: (value: string) => void;
  onRemove: () => void;
};

export function AddressCard({ address, onChangeAddress, onRemove }: AddressCardProps) {
  return (
    <View style={styles.card}>
      <TextInput label="Endereço" value={address} onChangeText={onChangeAddress} mode="outlined" />
      <Button icon="delete-outline" onPress={onRemove}>
        Remover
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 12,
    borderRadius: 8
  }
});
