import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { Rubik_700Bold, Rubik_400Regular } from "@expo-google-fonts/rubik";
import { useFonts } from "expo-font";
import {
  NotoSans_400Regular,
  NotoSans_300Light,
} from "@expo-google-fonts/noto-sans";
import { ToastProvider } from "react-native-toast-notifications";
import { defaultStore, StoresContext } from "./store/RootStore";
import { QueryClient, QueryClientProvider } from "react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function App() {
  const isLoadingComplete = useCachedResources();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 20,
        retry: false,
      },
    },
  });
  let [fontsLoaded] = useFonts({
    Rubik_700Bold,
    NotoSans_400Regular,
    Rubik_400Regular,
    NotoSans_300Light,
  });
  if (!fontsLoaded) {
    return null;
  }
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StoresContext.Provider value={defaultStore}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <ToastProvider>
                <Navigation />
              </ToastProvider>
            </SafeAreaProvider>
          </QueryClientProvider>
        </StoresContext.Provider>
      </GestureHandlerRootView>
    );
  }
}
