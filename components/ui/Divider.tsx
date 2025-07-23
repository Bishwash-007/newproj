import { Text, View } from "react-native";

const Divider: React.FC = () => {
  return (
    <View className="w-full flex-row items-center justify-center gap-3 my-6">
      <View className="flex-1 h-[1px] bg-muted-300 dark:bg-muted-700" />
      <Text className="text-sm text-muted-500 dark:text-muted-400 font-poppinsLight">
        or
      </Text>
      <View className="flex-1 h-[1px] bg-muted-300 dark:bg-muted-700" />
    </View>
  );
};

export default Divider;
