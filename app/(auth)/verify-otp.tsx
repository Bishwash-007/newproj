import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/hooks/useAuthStore";

const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const router = useRouter();
  const inputs = useRef<Array<TextInput | null>>([]);

  const { email, setOtp } = useAuthStore();

  const [otpArray, setOtpArray] = useState(Array(OTP_LENGTH).fill(""));

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otpArray];
      newOtp[index] = text;
      setOtpArray(newOtp);
      setOtp(newOtp.join(""));

      if (index < OTP_LENGTH - 1) {
        inputs.current[index + 1]?.focus();
      }
    } else if (text === "") {
      const newOtp = [...otpArray];
      newOtp[index] = "";
      setOtpArray(newOtp);
      setOtp(newOtp.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (
      e.nativeEvent.key === "Backspace" &&
      otpArray[index] === "" &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const finalOtp = otpArray.join("");
    setOtp(finalOtp);

    //api call here
    console.log("Final OTP:", finalOtp);
    router.replace("/(root)/(main)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="pt-12 px-6 bg-white flex-1"
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>

      <View className="flex flex-col items-start pt-8">
        <Text className="font-poppinsSemibold text-2xl">Verification Code</Text>
        <Text className="font-poppins text-muted-800">
          We have sent an OTP to{" "}
          <Text className="font-poppinsSemibold">{email || "your email"}</Text>
        </Text>
      </View>

      <View className="flex-row justify-between mt-10">
        {otpArray.map((digit, index) => (
          <TextInput
            key={index}
            className="w-12 h-14 border border-gray-300 rounded text-center text-xl font-poppins bg-white"
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            autoFocus={index === 0}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={otpArray.includes("")}
        className={`mt-8 bg-black py-4 rounded-xl ${
          otpArray.includes("") ? "opacity-50" : "opacity-100"
        }`}
      >
        <Text className="text-center text-white font-poppinsSemibold text-base">
          Verify OTP
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default VerifyOtp;
