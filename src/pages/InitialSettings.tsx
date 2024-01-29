import React from 'react';
import notifee from '@notifee/react-native';

import { View, Text, Pressable } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface SetupProps {
    navigation: NativeStackNavigationProp<any>;
    page?: CurrPage;
}

enum CurrPage {
    NOTIFS = 'NOTIFS',
    ICONS = 'ICONS',
}

export default async function SetupPages({
    navigation,
    page: pageNullable,
}: SetupProps) {
    const page = pageNullable ?? CurrPage.NOTIFS;
    switch (page) {
        case CurrPage.NOTIFS:
            return (
                <View className="flex-1 items-center justify-center bg-zinc-950 space-y-5">
                    <Text className="italic text-md text-gray-200">
                        We use notifications to let you know when your teachers
                        are out and when they come back in.
                    </Text>
                    <Text className="italic text-md text-gray-200">
                        Can we send you notifications?
                    </Text>

                    <Pressable
                        onPress={async () => {
                            await notifee.requestPermission();
                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'SetupPages',
                                        params: { page: CurrPage.ICONS },
                                    },
                                ],
                            });
                        }}
                        className="bg-purple-800 rounded-md p-2 mt-3 active:bg-purple-700 w-1/4">
                        <Text className="text-md text-gray-200 text-center">
                            Yes
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() =>
                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'SetupPages',
                                        params: { page: CurrPage.ICONS },
                                    },
                                ],
                            })
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
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'SetupPages',
                        params: { page: CurrPage.ICONS },
                    },
                ],
            });
        // const setting = (await initializeDefaults()).find(
        //     s => s.id === 'minimalist',
        // )!;
        // const settingValue = updateSettingStorage()
        // return (
        //     <View className="flex-1 items-center justify-center bg-zinc-950 space-y-5">
        //         <Text className="italic text-md text-gray-200">
        //             We support two mostly-similar looks for our app.
        //         </Text>
        //         <SettingEntry
        //             setting={setting}
        //             setValue={toggleSettingValue}
        //         />

        //         <Pressable
        //             onPress={async () => {
        //                 await notifee.requestPermission();
        //                 navigation.reset({
        //                     index: 0,
        //                     routes: [
        //                         {
        //                             name: 'SetupPages',
        //                             params: { page: CurrPage.ICONS },
        //                         },
        //                     ],
        //                 });
        //             }}
        //             className="bg-purple-800 rounded-md p-2 mt-3 active:bg-purple-700 w-1/4">
        //             <Text className="text-md text-gray-200 text-center">
        //                 Yes
        //             </Text>
        //         </Pressable>
        //         <Pressable
        //             onPress={() =>
        //                 navigation.reset({
        //                     index: 0,
        //                     routes: [
        //                         {
        //                             name: 'SetupPages',
        //                             params: { page: CurrPage.ICONS },
        //                         },
        //                     ],
        //                 })
        //             }
        //             className="bg-gray-800 rounded-md p-2 mt-3 active:bg-gray-700 w-1/4">
        //             <Text className="text-md text-gray-200 text-center">
        //                 No
        //             </Text>
        //         </Pressable>

        //         <Text className="text-gray-300 absolute bottom-10 text-center">
        //             © Yenowa
        //         </Text>
        //     </View>
        // );
    }
}
