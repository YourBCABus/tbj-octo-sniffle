import React from 'react';

import { Text, Pressable } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signOut } from '../../lib/google';

interface SignOutButtonProps {
    navigation: NativeStackNavigationProp<any>;
}

const SignOutButton = ({ navigation }: SignOutButtonProps) => {
    return (
        <Pressable
            onPress={async () => {
                await signOut();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'TableJet - Sign In' }],
                });
            }}
            className="
                bg-gray-800 active:bg-gray-700
                rounded-md p-2 mt-3
                w-11/12 min-h-48dip
                flex items-center justify-center">
            <Text className="text-md text-gray-200 text-center">
                Sign out from TableJet
            </Text>
        </Pressable>
    );
};

export default SignOutButton;
