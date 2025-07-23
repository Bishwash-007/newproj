import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCustomFonts } from "@/hooks/useCustomFonts";
import { useEffect } from "react";

import "../global.css";
import { View } from "react-native";

export default function RootLayout() {
  const [loaded, error] = useCustomFonts();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(root)" />
      </Stack>
    </View>
  );
}
