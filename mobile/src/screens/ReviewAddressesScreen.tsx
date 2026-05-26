import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import type { RootStackParamList } from "../../App";
import { AddressCard } from "../components/AddressCard";
import { useBatchStore } from "../store/batchStore";

type Props = NativeStackScreenProps<RootStackParamList, "ReviewAddresses">;

export function ReviewAddressesScreen({ navigation }: Props) {
  const photos = useBatchStore((state) => state.photos);
  const [addresses, setAddresses] = useState(
    photos.map((photo, index) => ({
      id: photo.id,
      address: `Endereço extraído da foto ${index + 1}`
    }))
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Revisão de endereços</Text>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AddressCard
            address={item.address}
            onChangeAddress={(address) =>
              setAddresses((current) =>
                current.map((addressItem) =>
                  addressItem.id === item.id ? { ...addressItem, address } : addressItem
                )
              )
            }
            onRemove={() =>
              setAddresses((current) => current.filter((addressItem) => addressItem.id !== item.id))
            }
          />
        )}
      />
      <Button mode="contained" icon="map-marker-path" onPress={() => navigation.navigate("MapRoute")}>
        Gerar rota
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
