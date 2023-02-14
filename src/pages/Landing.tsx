import { View, Text, Pressable } from "react-native";
import LinearGradient from 'react-native-linear-gradient'

export default function Landing() {
    return (
        <View className="flex-1 items-center justify-center">
            <LinearGradient
                colors={['#8a0d9e', 'purple', 'black']}
                className="flex-1 items-center justify-center w-full"
            >
                <Text className="text-2xl m-1 text-white font-bold">YourBCATeacher</Text>
                <Text className="text-md text-gray-200">Login Here</Text>

                <View className="absolute bottom-10">
                    <Text className="text-gray-300">© Yenowa</Text>
                </View>
            </LinearGradient>
        </View>
    )
}