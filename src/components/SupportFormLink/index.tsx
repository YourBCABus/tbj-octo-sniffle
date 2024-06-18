import React from 'react';
import useSupportFormLink from '../../lib/hooks/useSupportFormLink';

import { Linking, Text, View, Pressable } from 'react-native';
import { useCallback } from 'react';

import Icon from 'react-native-vector-icons/Ionicons';

interface OpenURLButtonProps {
    url: string;
    children: React.ReactNode;
}

const OpenURLButton = ({ url, children }: OpenURLButtonProps) => {
    const handlePress = useCallback(async () => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL(url);
        }
    }, [url]);

    return (
        <Pressable onPress={handlePress} accessibilityRole="link" hitSlop={10}>
            {children}
        </Pressable>
    );
};

const SupportFormLink = () => {
    const supportFormUrl = useSupportFormLink();
    if (!supportFormUrl) {
        return null;
    }

    return (
        <View className="flex flex-col justify-center bg-slate-850 p-2 rounded-lg w-11/12 mt-8">
            <Text className="text-zinc-200 text-center text-lg">
                Have feedback? Want to report a bug?
            </Text>
            <OpenURLButton url={supportFormUrl}>
                <View className="flex-row items-center justify-center text-blue-500">
                    <Text className="text-center text-lg mr-2 text-blue-500">
                        Go to our Support Form!
                    </Text>
                    <Icon name="open-outline" size={20} color="#2564eb" />
                </View>
            </OpenURLButton>
        </View>
    );
};

export default SupportFormLink;
