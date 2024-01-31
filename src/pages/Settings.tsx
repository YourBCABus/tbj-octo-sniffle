import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import SettingEntry from '../components/SettingEntry/SettingEntry';
import { Setting } from '../lib/types/types';
import {
    initialSettingsLoad,
    updateSettingStorage,
} from '../lib/storage/SettingStorage';

export default function Settings() {
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
            <Text className="text-gray-300 absolute bottom-10 text-center">
                © Yenowa
            </Text>
        </View>
    );
}
