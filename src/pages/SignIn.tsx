import React, { useContext, useEffect, useState } from 'react';

import {
    CanBypassFrontendDomainRestrictionsContext,
    IdTokenContext,
} from '../../App';

import { View, Text } from 'react-native';
import LinearGradient from '../lib/webcompat/LinearGradient/index';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useFixSettings from '../lib/hooks/useValidateSettings';

// @ts-expect-error
import _SignInButton from '../components/SignIn/Button';
const SignInButton: typeof import('../components/SignIn/Button.d')['default'] =
    _SignInButton;

import { configure } from '../lib/google';
import { setUserData } from '../lib/storage/auth';
import { alert } from '../lib/webcompat/alerts';
configure();

interface SignInProps {
    navigation: NativeStackNavigationProp<any>;
}

// look into navigation type, might be incorrect
const SignInUnmemoized = ({ navigation }: SignInProps) => {
    useFixSettings();
    const [isInProgress, setIsInProgress] = React.useState(false);
    const [, setIdToken] = React.useContext(IdTokenContext);

    const [canBypass, setCanBypass] = useContext(
        CanBypassFrontendDomainRestrictionsContext,
    );
    const [atTouchedCount, setAtTouchedCount] = useState(0);
    useEffect(() => {
        if (atTouchedCount === 5 && !canBypass) {
            alert('Sign in is unlocked from only @bergen.org');
            setCanBypass(true);
        }
    }, [atTouchedCount, canBypass, setCanBypass]);

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
                    <Text
                        onPress={() => setAtTouchedCount(c => c + 1)}
                        suppressHighlighting={true}>
                        @
                    </Text>
                    bergen.org
                </Text>
                <Text className="text-xl text-white">email</Text>

                <View className="flex-grow" />

                <SignInButton
                    inProgress={isInProgress}
                    setInProgress={setIsInProgress}
                    onSuccess={userInfo => {
                        setIdToken(userInfo.idToken);
                        setUserData(userInfo);
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'TableJet' }],
                        });
                    }}
                    onSuccessNull={() => {}}
                    onCancel={() => {}}
                    onError={() => {}}
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
};
const SignIn = React.memo(SignInUnmemoized);
export default SignIn;
