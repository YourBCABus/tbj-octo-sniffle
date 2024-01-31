import React from 'react';
import notifee from '@notifee/react-native';

import { View, Text, Pressable } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { updateSettingStorage } from '../lib/storage/SettingStorage';

interface SetupProps {
    navigation: NativeStackNavigationProp<any>;
    route: { params: { page?: CurrPage } };
}

enum CurrPage {
    NOTIFS = 'NOTIFS',
    ICONS = 'ICONS',
}

export default function InitialSettings({
    navigation,
    route: {
        params: { page: pageNullable },
    },
}: SetupProps) {
    const page = pageNullable ?? CurrPage.NOTIFS;
    console.log({ page, pageNullable });
    switch (page) {
        case CurrPage.NOTIFS:
            return (
                <View className="flex-1 items-center justify-center bg-zinc-950 space-y-5 px-5">
                    <Text className="text-xl text-gray-200">Notifications</Text>

                    <Text className="italic text-md text-gray-200">
                        We use notifications to let you know when your teachers
                        are out and when they come back in.
                    </Text>
                    <Text className="italic font-bold text-md text-gray-200">
                        Can we send you notifications?
                    </Text>

                    <Pressable
                        onPress={async () => {
                            await notifee.requestPermission();
                            navigation.setParams({ page: CurrPage.ICONS });
                        }}
                        className="bg-purple-800 rounded-md p-2 mt-3 active:bg-purple-700 w-1/4">
                        <Text className="text-md text-gray-200 text-center">
                            Yes
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() =>
                            navigation.setParams({ page: CurrPage.ICONS })
                        }
                        className="bg-gray-800 rounded-md p-2 mt-3 active:bg-gray-700 w-1/4">
                        <Text className="text-md text-gray-200 text-center">
                            No
                        </Text>
                    </Pressable>

                    <Text className="text-gray-300 absolute bottom-10 text-center">
                        © Yenowa
                    </Text>
                </View>
            );
        case CurrPage.ICONS:
            // FIXME: IMPLEMENT this
            updateSettingStorage(() => {}, 'setup', true);

            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                });
            }, 1000);
            return <Text>TODO: Fix this pls</Text>;
    }
}
