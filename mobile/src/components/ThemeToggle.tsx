import { Switch } from "react-native-paper";
import { useThemeStore } from "../store/themeStore";

export function ThemeToggle() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return <Switch value={colorScheme === "dark"} onValueChange={toggleTheme} />;
}
