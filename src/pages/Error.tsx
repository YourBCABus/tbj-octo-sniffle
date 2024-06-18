import React from 'react';

import { View, Text } from 'react-native';
import LinearGradient from '../lib/webcompat/LinearGradient/index';

// look into navigation type, might be incorrect
export default function Error() {
    return (
        <View className="flex-1 items-center justify-center h-full">
            <LinearGradient
                colors={['#8a0d9e', 'purple', 'black']}
                className="flex-1 items-center justify-center w-full h-screen flex-grow">
                <Text className="text-3xl text-white font-bold">{':('}</Text>

                <View className="absolute bottom-10">
                    <Text className="text-gray-300">© Yenowa</Text>
                </View>
            </LinearGradient>
        </View>
    );
}
