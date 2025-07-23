import { useState } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import OAuthButton from "@/components/ui/OAuth";
import { useAuthStore } from "@/hooks/useAuthStore";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const {
    email,
    fullName,
    password,
    phoneNumber,
    setEmail,
    setFullName,
    setPassword,
    setPhoneNumber,
    register,
  } = useAuthStore();

  const router = useRouter();
  const keyboard = useAnimatedKeyboard();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value / 5 }],
  }));

  const validateForm = (): boolean => {
    let valid = true;

    setEmailError("");
    setFullNameError("");
    setPasswordError("");
    setPhoneNumberError("");

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    }

    if (!fullName) {
      setFullNameError("Full name is required.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required.");
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError("Enter a valid email address.");
      valid = false;
    }

    if (password && password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }

    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      setPhoneNumberError("Enter a valid 10-digit phone number.");
      valid = false;
    }

    return valid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await register(fullName, email, password, phoneNumber);

      router.push("/verify-otp");
    } catch (err) {
      console.error("Sign up failed:", err);
    }
  };

  const handleOAuth = (provider: string) => {
    console.log(`Signing in with ${provider}`);
  };

  return (
    <Animated.View
      className={"flex-1 h-full px-6 bg-white"}
      style={[animatedStyles]}
    >
      <View className="flex-1 justify-center items-center py-8 px-6">
        <Text className="font-poppinsSemibold text-3xl text-muted-800 dark:text-muted-100 mb-8 text-center">
          NightCall
        </Text>

        <View className="w-full space-y-5 mb-6">
          <InputField
            label="fullName"
            placeholder="yourname"
            value={fullName}
            onChangeText={setFullName}
            iconLeft={
              <Ionicons name="person-outline" size={20} color="#737373" />
            }
            className="w-full h-16 rounded-2xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700"
          />
          {fullNameError !== "" && (
            <Text className="text-red-500 text-xs mt-1">{fullNameError}</Text>
          )}

          <InputField
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            iconLeft={
              <Ionicons name="mail-outline" size={20} color="#737373" />
            }
            className="w-full h-16 rounded-2xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700"
          />
          {emailError !== "" && (
            <Text className="text-red-500 text-xs mt-1">{emailError}</Text>
          )}

          <InputField
            label="Phone Number"
            placeholder="98XXXXXXXX"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            iconLeft={
              <Ionicons name="call-outline" size={20} color="#737373" />
            }
            className="w-full h-16 rounded-2xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700"
          />
          {phoneNumberError !== "" && (
            <Text className="text-red-500 text-xs mt-1">
              {phoneNumberError}
            </Text>
          )}

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
              <TouchableWithoutFeedback
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <View>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#737373"
                  />
                </View>
              </TouchableWithoutFeedback>
            }
            className="w-full h-16 rounded-2xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700"
          />
          {passwordError !== "" && (
            <Text className="text-red-500 text-xs mt-1">{passwordError}</Text>
          )}
        </View>

        <Button
          title="Sign Up"
          onPress={handleSignUp}
          className="w-full bg-muted-800 dark:bg-muted-200"
        />

        <Link href="/sign-in" asChild>
          <Text className="mt-4 font-poppins text-sm text-muted-500 dark:text-muted-400 text-center">
            Already have an account? <Text className="underline">Sign In</Text>
          </Text>
        </Link>

        {/* Separator */}
        <View className="w-full flex-row items-center justify-center gap-3 my-6">
          <View className="flex-1 h-[1px] bg-muted-300 dark:bg-muted-700" />
          <Text className="text-sm text-muted-500 dark:text-muted-400 font-poppinsLight">
            or
          </Text>
          <View className="flex-1 h-[1px] bg-muted-300 dark:bg-muted-700" />
        </View>

        {/* OAuth Buttons */}
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

export default SignUp;
