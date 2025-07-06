import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import {AuthProvider} from "../app/context/authcontext"

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </AuthProvider>
  );
}
