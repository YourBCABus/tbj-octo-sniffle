import React, { useEffect } from 'react';

import { View, Text, Pressable } from 'react-native';
import LinearGradient from '../lib/webcompat/LinearGradient/index';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    SettingError,
    handleSettingsError,
    initialSettingsLoad,
} from '../lib/storage/SettingStorage';
import useFixSettings from '../lib/hooks/useValidateSettings';

interface LandingProps {
    navigation: NativeStackNavigationProp<any>;
}

// look into navigation type, might be incorrect
export default function Landing({ navigation }: LandingProps) {
    useFixSettings();
    useEffect(() => {
        (async () => {
            try {
                const settings = await initialSettingsLoad();
                const setupState = settings.find(s => s.id === 'setup')?.value;
                if (setupState) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'TableJet' }],
                    });
                }
            } catch (e) {
                if (e instanceof SettingError) {
                    await handleSettingsError(e);
                }
                console.error(e);
            }
        })();
    }, [navigation]);

    return (
        <View className="flex-1 items-center justify-center h-full">
            <LinearGradient
                colors={['#8a0d9e', 'purple', 'black']}
                className="flex-1 items-center justify-center w-full h-screen flex-grow">
                <Text className="text-3xl text-white font-bold">TableJet</Text>
                <Text className="italic text-md text-gray-200">
                    Absences Simplified
                </Text>

                <Pressable
                    onPress={() =>
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'TableJet - Initial Settings' }],
                        })
                    }
                    className="
                        bg-gray-800 active:bg-gray-700
                        rounded-md p-2 mt-3 
                        w-1/4 min-h-48dip
                        flex items-center justify-center">
                    <Text className="text-md text-gray-200 text-center">
                        Get Started
                    </Text>
                </Pressable>
                <View className="absolute bottom-10">
                    <Text className="text-gray-300">© Yenowa</Text>
                </View>
            </LinearGradient>
        </View>
    );
}
