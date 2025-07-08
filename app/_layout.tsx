import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { AuthProvider } from "../app/context/authcontext"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

export default function RootLayout() {

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </AuthProvider>
    </QueryClientProvider>
  );
}
