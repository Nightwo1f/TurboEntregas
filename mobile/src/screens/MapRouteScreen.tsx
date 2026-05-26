import { Linking, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { RouteStopCard } from "../components/RouteStopCard";

const exampleStops = [
  "Rua Exemplo, 100",
  "Avenida Central, 250",
  "Praça das Entregas, 12"
];

export function MapRouteScreen() {
  function openGoogleMaps() {
    Linking.openURL("https://www.google.com/maps/dir/?api=1");
  }

  function openWaze() {
    Linking.openURL("https://waze.com/ul");
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text variant="titleMedium">Mapa com alfinetes e rota otimizada</Text>
      </View>
      {exampleStops.map((stop, index) => (
        <RouteStopCard key={stop} order={index + 1} address={stop} />
      ))}
      <Button mode="contained" icon="google-maps" onPress={openGoogleMaps}>
        Abrir no Google Maps
      </Button>
      <Button icon="navigation-variant-outline" onPress={openWaze}>
        Abrir no Waze
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 20
  },
  mapPlaceholder: {
    minHeight: 220,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#dfe7df"
  }
});
