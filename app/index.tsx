import { Redirect } from "expo-router";
import { Text, View, ActivityIndicator } from "react-native";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";

export default function Index() {
  const { isAuthenticated, isLoading, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return !isAuthenticated ? (
    <Redirect href="/(auth)/sign-in" />
  ) : (
    <Redirect href="/(root)/(main)" />
  );
}
