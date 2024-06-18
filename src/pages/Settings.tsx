import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import SettingEntry from '../components/SettingEntry/SettingEntry';
import { Setting } from '../lib/types/types';
import {
    initialSettingsLoad,
    updateSettingStorage,
} from '../lib/storage/SettingStorage';
import SupportFormLink from '../components/SupportFormLink';
import SignOutButton from '../components/SignOutButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface SettingsProps {
    navigation: NativeStackNavigationProp<any>;
}

export default function Settings({ navigation }: SettingsProps) {
    const [settings, setSettingValue] = useState<Setting[]>([]);
    const setSettingValueFilter = useCallback(
        (newSettings: Setting[]) =>
            setSettingValue(newSettings.filter(s => s.id !== 'setup')),
        [setSettingValue],
    );

    useEffect(() => {
        initialSettingsLoad().then(setSettingValueFilter);
    }, [setSettingValueFilter]);

    const toggleSettingValue = useCallback(
        (id: string) => updateSettingStorage(setSettingValueFilter, id),
        [setSettingValueFilter],
    );

    return (
        <View className="flex-1 items-center justify-center bg-zinc-950 space-y-5">
            {settings.map(setting => {
                return (
                    <SettingEntry
                        key={setting.id}
                        setting={setting}
                        setValue={toggleSettingValue}
                    />
                );
            })}
            <SupportFormLink />
            <SignOutButton navigation={navigation} />
            <Text className="text-gray-300 absolute bottom-10 text-center">
                © Yenowa
            </Text>
        </View>
    );
}
