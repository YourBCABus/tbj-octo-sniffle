import React, { FC, useContext } from 'react';
import { signIn } from '../../lib/google';
import { Platform, Pressable, Text, View } from 'react-native';
import GoogleLogo from './google-logo.svg';
import { ButtonProps } from './Button.d';
import { CanBypassFrontendDomainRestrictionsContext } from '../../../App';

const Button: FC<ButtonProps> = ({
    inProgress,
    setInProgress,
    onSuccess,
    onSuccessNull,
    onCancel,
    onError,
}) => {
    const [canBypass] = useContext(CanBypassFrontendDomainRestrictionsContext);
    return (
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
                    canBypass,
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
                    {Platform.OS === 'web' ? (
                        <svg width="24" height="24">
                            <image href={GoogleLogo} width="24" height="24" />
                        </svg>
                    ) : (
                        <GoogleLogo />
                    )}
                </View>
                <View className="inline-block">
                    <Text className="text-purple-300 text-lg font-semibold pl-3">
                        Sign in With Google
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default Button;
