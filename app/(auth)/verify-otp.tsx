import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/hooks/useAuthStore";

const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const router = useRouter();
  const inputs = useRef<Array<TextInput | null>>([]);
  const { email, otp, setOtp, verifyOtp, isLoading, error, resetError } =
    useAuthStore();

  const [otpArray, setOtpArray] = useState(Array(OTP_LENGTH).fill(""));

  const updateOtp = (index: number, value: string) => {
    const updated = [...otpArray];
    updated[index] = value;
    setOtpArray(updated);
    setOtp(updated.join(""));
  };

  const handleChange = (text: string, index: number) => {
    if (!/^\d$/.test(text) && text !== "") return;

    updateOtp(index, text);
    resetError();

    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && otpArray[index] === "") {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (otpArray.includes("")) return;

    try {
      await verifyOtp(email, otpArray.join(""));
      router.replace("/(root)/(main)");
    } catch (_) {}
  };

  const handleResend = async () => {
    try {
      await verifyOtp(email, otpArray.join(""));
      Alert.alert("OTP Sent", "A new OTP has been sent to your email.");
    } catch (err) {
      Alert.alert("Error", "Failed to resend OTP. Try again later.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white pt-12 px-6"
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>

      <View className="pt-8">
        <Text className="font-poppinsSemibold text-2xl">Verification Code</Text>
        <Text className="font-poppins text-muted-800 mt-1">
          We've sent an OTP to{" "}
          <Text className="font-poppinsSemibold">{email || "your email"}</Text>
        </Text>
      </View>

      <View className="flex-row justify-between mt-10">
        {otpArray.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={index === 0}
            className="w-12 h-14 border border-gray-300 rounded text-center text-xl font-poppins bg-white"
          />
        ))}
      </View>

      {error ? (
        <Text className="text-red-500 text-sm mt-4 font-poppins">{error}</Text>
      ) : null}

      <View className="flex-col justify-between mt-10">
        <Text className="font-poppins text-muted-800">
          Didn't receive the OTP?
        </Text>
        <TouchableOpacity onPress={handleResend}>
          <Text className="font-poppins text-blue-600 underline">
            Resend OTP
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={otpArray.includes("") || isLoading}
        className={`mt-8 py-4 rounded-xl bg-black ${
          otpArray.includes("") || isLoading ? "opacity-50" : "opacity-100"
        }`}
      >
        <Text className="text-white text-center font-poppinsSemibold text-base">
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default VerifyOtp;
