import React from 'react';

import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
GoogleSignin.configure();

import { View, Text } from 'react-native';
import LinearGradient from '../lib/webcompat/LinearGradient/index';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useFixSettings from '../lib/hooks/useValidateSettings';
import { signIn } from '../lib/google';

interface SignInProps {
    navigation: NativeStackNavigationProp<any>;
}

// look into navigation type, might be incorrect
export default function SignIn({ navigation }: SignInProps) {
    useFixSettings();
    const [isInProgress, setIsInProgress] = React.useState(false);

    return (
        <View className="flex-1 items-center justify-center h-full">
            <LinearGradient
                colors={['#8a0d9e', 'purple', 'black']}
                className="flex-1 items-center justify-center w-full h-screen flex-grow">
                <View className="flex-grow" />
                <View className="flex-grow" />

                <Text className="text-xl text-white">
                    Please sign in with your
                </Text>
                <Text className="text-3xl text-white font-bold">
                    @bergen.org
                </Text>
                <Text className="text-xl text-white">email</Text>

                <View className="flex-grow" />

                <GoogleSigninButton
                    size={GoogleSigninButton.Size.Standard}
                    color={GoogleSigninButton.Color.Light}
                    onPress={async () => {
                        setIsInProgress(true);
                        const userInfo = await signIn(
                            () =>
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'TableJet - Landing' }],
                                }),
                            () =>
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'TableJet - Error' }],
                                }),
                        );
                        if (userInfo) {
                            setIsInProgress(false);
                            if (userInfo) {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'TableJet' }],
                                });
                            }
                        }
                    }}
                    disabled={isInProgress}
                />

                <View className="flex-grow" />
                <View className="flex-grow" />
                <View className="flex-grow" />
                <View className="absolute bottom-10">
                    <Text className="text-gray-300">© Yenowa</Text>
                </View>
            </LinearGradient>
        </View>
    );
}
