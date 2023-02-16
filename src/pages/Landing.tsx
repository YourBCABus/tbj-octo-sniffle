import { View, Text, Pressable } from "react-native";
import LinearGradient from 'react-native-linear-gradient'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// look into navigation type, might be incorrect
export default function Landing({navigation} : {navigation: NativeStackNavigationProp<any>}) {
    return (
        <View className="flex-1 items-center justify-center">
            <LinearGradient
                colors={['#8a0d9e', 'purple', 'black']}
                className="flex-1 items-center justify-center w-full"
            >
                <Text className="text-2xl text-white font-bold">YourBCATeacher</Text>
                <Text className="italic text-xs text-gray-200">Absences Simplified</Text>

                <Pressable
                    onPress={() =>
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Main' }],
                        })
                    }
                    className="bg-gray-800 rounded-md p-2 mt-3 active:bg-gray-700"
                >
                
                <Text className="text-md text-gray-200">Get Started</Text>
                </Pressable>
                <View className="absolute bottom-10">
                    <Text className="text-gray-300">© Yenowa</Text>
                </View>
            </LinearGradient>
        </View>
    )
}