import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { ThemeToggle } from "../components/ThemeToggle";

export function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text variant="titleMedium">Tema escuro</Text>
        <ThemeToggle />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
