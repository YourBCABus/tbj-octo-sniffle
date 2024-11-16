import React, { FC } from 'react';
import { signIn } from '../../lib/google';
import { User } from '@react-native-google-signin/google-signin';
import { Pressable, Text, View } from 'react-native';
import GoogleLogo from './google-logo.svg';

interface ButtonProps {
    inProgress: boolean;
    setInProgress: (v: boolean) => void;

    onSuccess: (user: User) => void;
    onSuccessNull: () => void;

    onCancel: () => void;
    onError: () => void;
}

const Button: FC<ButtonProps> = ({
    inProgress,
    setInProgress,
    onSuccess,
    onSuccessNull,
    onCancel,
    onError,
}) => (
    <Pressable
        onPress={async () => {
            if (inProgress) {
                return;
            }
            setInProgress(true);
            const userInfo = await signIn(
                () => {
                    setInProgress(false);
                    onCancel();
                },
                () => {
                    setInProgress(false);
                    onError();
                },
            );
            setInProgress(false);
            if (userInfo) {
                onSuccess(userInfo);
            } else {
                onSuccessNull();
            }
        }}
        disabled={inProgress}>
        <View className="px-4 py-2.5 bg-black inline-flex flex-row justify-center items-center rounded-md">
            <View className="inline-block">
                <GoogleLogo />
            </View>
            <View className="inline-block">
                <Text className="text-purple-300 text-lg font-semibold pl-3">
                    Sign in With Google
                </Text>
            </View>
        </View>
    </Pressable>
);

export default Button;
