import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type RouteStopCardProps = {
  order: number;
  address: string;
};

export function RouteStopCard({ order, address }: RouteStopCardProps) {
  return (
    <View style={styles.card}>
      <Text variant="titleMedium">{order}</Text>
      <Text variant="bodyMedium" style={styles.address}>
        {address}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    padding: 12,
    borderRadius: 8
  },
  address: {
    flex: 1
  }
});
