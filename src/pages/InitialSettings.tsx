import React, { useState } from 'react';
import notifee from '@notifee/react-native';

import { View, Text, Pressable } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { updateSettingStorage } from '../lib/storage/SettingStorage';
import { exampleTeachers } from '../lib/dummydata';
import DummyTeacherEntry from '../components/TeacherEntry/DummyTeacherEntry';
import SettingEntry from '../components/SettingEntry/SettingEntry';
import { Platform } from 'react-native';

interface SetupProps {
    navigation: NativeStackNavigationProp<any>;
    route: { params: { page?: CurrPage } };
}

enum CurrPage {
    NOTIFS = 'NOTIFS',
    ICONS = 'ICONS',
}

function DummyTeacherDisplay({ minimalist }: { minimalist: boolean }) {
    return (
        <View className="h-1/2 w-full">
            {exampleTeachers.slice(0, 5).map(teacher => (
                <DummyTeacherEntry
                    {...teacher}
                    minimalist={minimalist}
                    key={teacher.name}
                />
            ))}
        </View>
    );
}

export default function InitialSettings({
    navigation,
    route: {
        params: { page: pageNullable },
    },
}: SetupProps) {
    const [minimalistIcons, setMinimalistIcons] = useState(false);
    const rawPage = pageNullable ?? CurrPage.NOTIFS;
    const webAwarePage = Platform.OS === 'web' ? CurrPage.ICONS : rawPage;
    switch (webAwarePage) {
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
                        className="
                            bg-purple-800 active:bg-purple-700
                            p-2 mt-3 rounded-md
                            w-1/4 min-h-48dip
                            flex items-center justify-center">
                        <Text className="text-md text-gray-200 text-center">
                            Yes
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() =>
                            navigation.setParams({ page: CurrPage.ICONS })
                        }
                        className="
                            bg-gray-800 active:bg-gray-700
                            p-2 mt-3 rounded-md
                            w-1/4 min-h-48dip
                            flex items-center justify-center">
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
            // updateSettingStorage(() => {}, 'setup', true);
            return (
                <View className="flex-1 items-center justify-center bg-zinc-950 space-y-5 px-5">
                    <Text className="text-xl text-gray-200">Icons</Text>

                    <Text className="italic text-md text-gray-200 px-5">
                        Choose whether or not you want minimalist icons.
                    </Text>

                    <SettingEntry
                        setting={{
                            id: 'minimalist',
                            value: minimalistIcons,
                            description: 'Use minimalist icons',
                        }}
                        setValue={() => setMinimalistIcons(v => !v)}
                    />

                    <View className="mx-5 w-full border border-slate-500 opacity-80" />

                    <Text className="mt-10 text-lg text-gray-200">
                        Period 5
                    </Text>
                    <DummyTeacherDisplay minimalist={minimalistIcons} />

                    <View className="mx-5 w-full border border-slate-500 opacity-80" />
                    <Pressable
                        onPress={async () => {
                            await updateSettingStorage(
                                () => {},
                                'minimalist',
                                minimalistIcons,
                            );
                            await updateSettingStorage(() => {}, 'setup', true);
                            setTimeout(
                                () =>
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'TableJet' }],
                                    }),
                                1000,
                            );
                        }}
                        className="bg-purple-800 rounded-md p-2 mt-2 active:bg-purple-700 w-1/2">
                        <Text className="text-lg text-gray-200 text-center">
                            Finish setup
                        </Text>
                    </Pressable>
                </View>
            );
    }
}
