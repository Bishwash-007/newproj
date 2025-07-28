import { useState } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import OAuthButton from "@/components/ui/OAuth";
import { useAuthStore } from "@/hooks/useAuthStore";
import Divider from "@/components/ui/Divider";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { email, password, setEmail, setPassword, login } = useAuthStore();
  const router = useRouter();
  const keyboard = useAnimatedKeyboard();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value / 20 }],
  }));

  const validateForm = (): boolean => {
    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email.");
        valid = false;
      }
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }

    return valid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
      router.replace("/");
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  const handleOAuth = (provider: string) => {
    console.log(`Signing in with ${provider}`);
  };

  return (
    <Animated.View
      className="h-full px-6 bg-white dark:bg-black"
      style={[animatedStyles]}
    >
      <View className="flex-1 w-full px-6 justify-center items-center bg-white-50 dark:bg-black">
        <Text className="font-poppinsSemibold text-3xl text-muted-800 dark:text-muted-100 mb-8 text-center">
          Sign In
        </Text>

        <Animated.View className="w-full space-y-2 mb-6">
          {/* Email Field */}
          <InputField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            iconLeft={
              <Ionicons name="person-outline" size={20} color="#737373" />
            }
            className="w-full h-16 rounded-2xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700"
          />
          {emailError && (
            <Text className="text-red-400 text-xs font-poppinsLight ml-2">
              {emailError}
            </Text>
          )}

          {/* Password Field */}
          <InputField
            label="Password"
            placeholder="Your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            iconLeft={
              <Ionicons name="lock-closed-outline" size={20} color="#737373" />
            }
            iconRight={
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#737373"
                onPress={() => setShowPassword((prev) => !prev)}
              />
            }
            className="w-full h-16 rounded-2xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700"
          />
          {passwordError && (
            <Text className="text-red-400 text-xs font-poppinsLight ml-2">
              {passwordError}
            </Text>
          )}
        </Animated.View>

        {/* Sign In Button */}
        <Button
          title="Sign In"
          className="w-full bg-muted-800 dark:bg-muted-200"
          onPress={handleSignIn}
        />

        {/* Redirect to Sign Up */}
        <Link href="/sign-up" asChild>
          <Text className="mt-4 font-poppins text-sm text-muted-500 dark:text-muted-400">
            Don&apos;t have an account?
            <Text className="underline"> Sign up</Text>
          </Text>
        </Link>

        <Divider />

        {/* OAuth */}
        <View className="flex-row w-full justify-center gap-4">
          <OAuthButton
            iconName="google"
            onPress={() => handleOAuth("google")}
          />
          <OAuthButton
            iconName="github"
            onPress={() => handleOAuth("github")}
          />
          <OAuthButton
            iconName="facebook"
            onPress={() => handleOAuth("facebook")}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default SignIn;
