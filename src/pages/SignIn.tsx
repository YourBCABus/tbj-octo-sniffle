import React from 'react';

import { IdTokenContext } from '../../App';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
GoogleSignin.configure();

import { View, Text } from 'react-native';
import LinearGradient from '../lib/webcompat/LinearGradient/index';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useFixSettings from '../lib/hooks/useValidateSettings';

import SignInButton from '../components/SignIn/Button';

interface SignInProps {
    navigation: NativeStackNavigationProp<any>;
}

// look into navigation type, might be incorrect
export default function SignIn({ navigation }: SignInProps) {
    useFixSettings();
    const [isInProgress, setIsInProgress] = React.useState(false);
    const [, setIdToken] = React.useContext(IdTokenContext);

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

                {/* <Pressable
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
                                setIdToken(userInfo.idToken);
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'TableJet' }],
                                });
                            }
                        }
                    }}
                    disabled={isInProgress}>
                    <View className="px-9 py-2 bg-black flex flex-row ">
                        <Text className="text-purple-200 text-lg">
                            Sign in With Google
                        </Text>
                    </View>
                </Pressable> */}

                <SignInButton
                    inProgress={isInProgress}
                    setInProgress={setIsInProgress}
                    onSuccess={userInfo => {
                        setIdToken(userInfo.idToken);
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'TableJet' }],
                        });
                    }}
                    onSuccessNull={() => {}}
                    onCancel={() => {}}
                    onError={() =>
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'TableJet - Error' }],
                        })
                    }
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
