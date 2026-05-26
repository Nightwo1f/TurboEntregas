import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import { BatchScreen } from "./src/screens/BatchScreen";
import { CameraScreen } from "./src/screens/CameraScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { MapRouteScreen } from "./src/screens/MapRouteScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ReviewAddressesScreen } from "./src/screens/ReviewAddressesScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { VipScreen } from "./src/screens/VipScreen";
import { useThemeStore } from "./src/store/themeStore";
import { darkTheme } from "./src/theme/dark";
import { lightTheme } from "./src/theme/light";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Camera: undefined;
  Batch: undefined;
  ReviewAddresses: undefined;
  MapRoute: undefined;
  Vip: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Entrar" }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Cadastro" }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "RouteSnap" }} />
          <Stack.Screen name="Camera" component={CameraScreen} options={{ title: "Fotos" }} />
          <Stack.Screen name="Batch" component={BatchScreen} options={{ title: "Lote" }} />
          <Stack.Screen
            name="ReviewAddresses"
            component={ReviewAddressesScreen}
            options={{ title: "Revisar endereços" }}
          />
          <Stack.Screen name="MapRoute" component={MapRouteScreen} options={{ title: "Rota" }} />
          <Stack.Screen name="Vip" component={VipScreen} options={{ title: "VIP" }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Ajustes" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
